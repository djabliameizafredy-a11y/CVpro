import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';

interface GenerateBody {
  target:
    | { kind: 'summary' }
    | { kind: 'qualities' }
    | { kind: 'skills' }
    | { kind: 'project'; projectId: string }
    | { kind: 'bullets'; projectId: string };
  cv: Record<string, unknown>;
  lang: 'fr' | 'en';
}

function buildContext(cv: Record<string, unknown>): string {
  const personal = (cv.personal as Record<string, string>) || {};
  const skills = (cv.skills as Array<{ category: string; tags: string }>) || [];
  const projects = (cv.projects as Array<Record<string, unknown>>) || [];
  const education = (cv.education as Array<Record<string, unknown>>) || [];

  return JSON.stringify(
    {
      personal: {
        firstName: personal.firstName,
        lastName: personal.lastName,
        jobTitle: personal.jobTitle,
        subTitle: personal.subTitle,
        summary: personal.summary,
        qualities: personal.qualities,
        yearsExperience: projects.length
      },
      skills: skills.map((s) => ({ category: s.category, tags: s.tags })),
      projects: projects.map((p) => ({
        title: p.title,
        company: p.companyOrClient,
        subtitle: p.subtitle,
        period: [p.startDate, p.endDate].filter(Boolean).join(' - '),
        tag: p.tag,
        desc: p.desc
      })),
      education: education.map((e) => ({ degree: e.degree, school: e.school, period: e.period }))
    },
    null,
    1
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GenerateBody;
    const { target, cv, lang } = body;

    if (!target || !cv || !cv.personal) {
      return NextResponse.json({ error: 'Missing target or cv data' }, { status: 400 });
    }

    const isFr = lang === 'fr';
    const context = buildContext(cv);

    let instruction = '';
    let responseType = 'plain text';

    switch (target.kind) {
      case 'summary':
        instruction = isFr
          ? 'Rédige un profil professionnel (résumé) percutant de 3 à 4 phrases pour ce CV. Utilise la première personne implicite (sans "je"), mets en avant les compétences clés, les années d\'expérience et la valeur apportée. Optimisé ATS avec des mots-clés du domaine. Réponds UNIQUEMENT par le texte du résumé, sans guillemets ni préambule.'
          : 'Write a compelling 3-4 sentence professional summary for this CV. No first-person pronouns, highlight key skills, years of experience and value delivered. ATS-optimized with domain keywords. Respond ONLY with the summary text, no quotes or preamble.';
        break;
      case 'qualities':
        instruction = isFr
          ? 'Propose une liste de 5 à 6 qualités professionnelles (soft skills) pertinentes pour ce profil, séparées par des virgules. Réponds UNIQUEMENT par la liste, sans préambule.'
          : 'Suggest 5-6 relevant professional soft skills for this profile, separated by commas. Respond ONLY with the comma-separated list.';
        break;
      case 'skills':
        instruction = isFr
          ? 'En te basant sur ce profil, suggère 8 à 12 mots-clés de compétences techniques très recherchés sur le marché pour ce type de poste (outils, technologies, méthodologies) qui ne sont PAS déjà présents dans les compétences listées. Sépare-les par des virgules. Réponds UNIQUEMENT par la liste.'
          : 'Based on this profile, suggest 8-12 in-demand technical skill keywords for this type of role (tools, technologies, methodologies) NOT already listed in the current skills. Separate with commas. Respond ONLY with the list.';
        break;
      case 'project':
      case 'bullets': {
        const projects = (cv.projects as Array<Record<string, unknown>>) || [];
        const project = projects.find((p) => p.id === target.projectId);
        if (!project) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
        if (target.kind === 'project') {
          instruction = isFr
            ? `Réécris la description de cette expérience professionnelle de façon percutante : commence par un verbe d'action fort, inclus des technologies clés et un résultat mesurable si possible (2 phrases max). Contexte du projet : ${JSON.stringify(project)}. Réponds UNIQUEMENT par le texte de la description, sans guillemets ni préambule.`
            : `Rewrite the description of this work experience to be impactful: start with a strong action verb, include key technologies and a measurable result if possible (max 2 sentences). Project context: ${JSON.stringify(project)}. Respond ONLY with the description text, no quotes or preamble.`;
        } else {
          instruction = isFr
            ? `Pour cette expérience professionnelle, génère 3 puces de réussites au format "verbe d'action + tâche + résultat chiffré/mesurable". Contexte : ${JSON.stringify(project)}. Réponds UNIQUEMENT par les 3 puces, une par ligne, sans tiret ni numérotation ni préambule.`
            : `For this work experience, generate 3 achievement bullets in the format "action verb + task + quantified result". Context: ${JSON.stringify(project)}. Respond ONLY with the 3 bullets, one per line, no dashes, numbering or preamble.`;
          responseType = 'lines';
        }
        break;
      }
      default:
        return NextResponse.json({ error: 'Unknown target' }, { status: 400 });
    }

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: isFr
            ? 'Tu es un expert RH et rédacteur de CV professionnel. Tu connais parfaitement les systèmes ATS et les standards de recrutement. Tu écris de manière concise, concrète et orientée résultats.'
            : 'You are an HR expert and professional CV writer. You know ATS systems and recruitment standards perfectly. You write concisely, concretely and results-oriented.'
        },
        {
          role: 'user',
          content: `Voici le contenu actuel du CV (JSON):\n${context}\n\nTâche: ${instruction}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    let result: string = (completion.choices[0]?.message?.content || '').trim();

    if (!result) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    // Clean up common wrappers
    result = result.replace(/^["']|["']$/g, '').trim();

    if (responseType === 'lines') {
      const lines = result
        .split('\n')
        .map((l) => l.replace(/^[-•*\d.\s]+/, '').trim())
        .filter((l) => l.length > 0)
        .slice(0, 5);
      return NextResponse.json({ result: lines });
    }

    // For qualities/skills, keep a single line
    if (target.kind === 'qualities' || target.kind === 'skills') {
      result = result.split('\n').filter((l) => l.trim()).join(', ');
    }

    return NextResponse.json({ result });
  } catch (err) {
    console.error('AI generate error:', err);
    return NextResponse.json({ error: 'AI generation failed' }, { status: 500 });
  }
}
