import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';

interface AtsBody {
  cv: Record<string, unknown>;
  jobDescription: string;
  lang: 'fr' | 'en';
}

interface AtsAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  keywords: string[];
  summary: string;
}

function extractJson(text: string): AtsAnalysis | null {
  // Try direct parse, then code fences, then first {...} block
  const attempts: string[] = [];
  const trimmed = text.trim();
  attempts.push(trimmed);
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) attempts.push(fenceMatch[1].trim());
  const braceMatch = trimmed.match(/\{[\s\S]*\}/);
  if (braceMatch) attempts.push(braceMatch[0]);

  for (const attempt of attempts) {
    try {
      const parsed = JSON.parse(attempt) as AtsAnalysis;
      if (typeof parsed.score === 'number' && Array.isArray(parsed.strengths) && Array.isArray(parsed.weaknesses)) {
        return {
          score: Math.max(0, Math.min(100, Math.round(parsed.score))),
          strengths: parsed.strengths.slice(0, 6).map(String),
          weaknesses: parsed.weaknesses.slice(0, 6).map(String),
          keywords: (parsed.keywords || []).slice(0, 12).map(String),
          summary: String(parsed.summary || '')
        };
      }
    } catch {
      // try next
    }
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AtsBody;
    const { cv, jobDescription, lang } = body;

    if (!jobDescription || jobDescription.trim().length < 30) {
      return NextResponse.json({ error: 'Job description too short' }, { status: 400 });
    }
    if (!cv || !cv.personal) {
      return NextResponse.json({ error: 'Missing CV data' }, { status: 400 });
    }

    const isFr = lang === 'fr';
    const personal = (cv.personal as Record<string, string>) || {};
    const skills = (cv.skills as Array<{ category: string; tags: string }>) || [];
    const projects = (cv.projects as Array<Record<string, unknown>>) || [];
    const education = (cv.education as Array<Record<string, unknown>>) || [];
    const languages = (cv.languages as Array<Record<string, unknown>>) || [];

    const cvContent = JSON.stringify(
      {
        personal: {
          jobTitle: personal.jobTitle,
          summary: personal.summary,
          qualities: personal.qualities,
          email: personal.email,
          phone: personal.phone
        },
        skills: skills.flatMap((s) => s.tags.split(',').map((t) => t.trim())),
        projects: projects.map((p) => ({ title: p.title, desc: p.desc, tag: p.tag })),
        education: education.map((e) => ({ degree: e.degree, school: e.school })),
        languages: languages.map((l) => ({ name: l.name, level: l.level }))
      },
      null,
      1
    );

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: isFr
            ? "Tu es un système ATS (Applicant Tracking System) expert combiné à un recruteur senior. Tu analyses la compatibilité entre un CV et une offre d'emploi. Tu réponds UNIQUEMENT en JSON valide."
            : 'You are an expert ATS (Applicant Tracking System) combined with a senior recruiter. You analyze the compatibility between a resume and a job offer. You respond ONLY in valid JSON.'
        },
        {
          role: 'user',
          content: `Analyse la compatibilité entre ce CV et cette offre d'emploi.

=== CV (JSON) ===
${cvContent}

=== OFFRE D'EMPLOI ===
${jobDescription.trim().slice(0, 4000)}

Réponds UNIQUEMENT avec un objet JSON valide au format exact suivant (pas de markdown, pas de texte autour):
{
  "score": <nombre entre 0 et 100 représentant le taux de correspondance global CV/offre>,
  "summary": "<phrase de synthèse sur la compatibilité globale et la valeur du candidat pour ce poste>",
  "strengths": ["<point fort 1>", "<point fort 2>", "<point fort 3>"],
  "weaknesses": ["<faiblesse/écart 1>", "<faiblesse/écart 2>", "<faiblesse/écart 3>"],
  "keywords": ["<mot-clé ou compétence présent dans l'offre mais manquant dans le CV>", "..."]
}

${isFr ? 'Écris les textes en français. Sois précis et concret, cite des éléments réels du CV et de l\'offre.' : 'Write texts in English. Be precise and concrete, cite real elements from the CV and the offer.'}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    const raw = (completion.choices[0]?.message?.content || '').trim();
    const result = extractJson(raw);

    if (!result) {
      // Fallback: build minimal result from raw text
      return NextResponse.json({
        result: {
          score: 50,
          strengths: [],
          weaknesses: [],
          keywords: [],
          summary: raw.slice(0, 400) || (isFr ? 'Analyse indisponible.' : 'Analysis unavailable.')
        }
      });
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error('AI ATS error:', err);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
