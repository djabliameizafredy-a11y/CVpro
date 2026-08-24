import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';

interface CoverLetterBody {
  cv: Record<string, unknown>;
  lang: 'fr' | 'en';
  tone: 'professional' | 'enthusiastic' | 'concise' | 'bold';
  companyName?: string;
  jobDescription?: string;
}

const TONE_PROMPTS: Record<string, { fr: string; en: string }> = {
  professional: {
    fr: 'Ton formel, classique et professionnel.',
    en: 'Formal, classic and professional tone.'
  },
  enthusiastic: {
    fr: 'Ton chaleureux, enthousiaste et motivé, tout en restant professionnel.',
    en: 'Warm, enthusiastic and motivated tone while remaining professional.'
  },
  concise: {
    fr: 'Ton concis et percutant : phrases courtes, maximum 200 mots au total.',
    en: 'Concise and punchy tone: short sentences, maximum 200 words total.'
  },
  bold: {
    fr: 'Ton direct, confiant et audacieux qui ose se démarquer, sans arrogance.',
    en: 'Direct, confident and bold tone that dares to stand out, without arrogance.'
  }
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CoverLetterBody;
    const { cv, lang, tone, companyName, jobDescription } = body;

    if (!cv || !cv.personal) {
      return NextResponse.json({ error: 'Missing CV data' }, { status: 400 });
    }

    const isFr = lang === 'fr';
    const personal = (cv.personal as Record<string, string>) || {};
    const skills = (cv.skills as Array<{ category: string; tags: string }>) || [];
    const projects = (cv.projects as Array<Record<string, unknown>>) || [];
    const education = (cv.education as Array<Record<string, unknown>>) || [];

    const cvContent = JSON.stringify(
      {
        candidate: {
          firstName: personal.firstName,
          lastName: personal.lastName,
          jobTitle: personal.jobTitle,
          summary: personal.summary,
          email: personal.email,
          phone: personal.phone,
          address: personal.address
        },
        skills: skills.map((s) => ({ category: s.category, tags: s.tags })),
        experiences: projects.map((p) => ({
          title: p.title,
          company: p.companyOrClient,
          period: [p.startDate, p.endDate].filter(Boolean).join(' - '),
          desc: p.desc,
          bullets: p.bullets
        })),
        education: education.map((e) => ({ degree: e.degree, school: e.school, period: e.period }))
      },
      null,
      1
    );

    const toneInstruction = TONE_PROMPTS[tone]?.[isFr ? 'fr' : 'en'] || TONE_PROMPTS.professional.fr;

    const companyContext = companyName
      ? isFr
        ? `L'entreprise visée est : ${companyName}.`
        : `The target company is: ${companyName}.`
      : '';

    const jobContext = jobDescription && jobDescription.trim().length > 20
      ? isFr
        ? `Voici l'offre d'emploi visée :\n${jobDescription.trim().slice(0, 3000)}`
        : `Here is the target job offer:\n${jobDescription.trim().slice(0, 3000)}`
      : isFr
        ? "Aucune offre précise n'est fournie : reste sur un positionnement général basé sur le titre de poste du CV."
        : 'No specific offer provided: keep a general positioning based on the CV job title.';

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'assistant',
          content: isFr
            ? "Tu es un expert en recrutement et rédacteur de lettres de motivation professionnelles francophones. Tes lettres sont percutantes, sincères et orientées résultats."
            : 'You are a recruitment expert and professional English cover letter writer. Your letters are compelling, sincere and results-oriented.'
        },
        {
          role: 'user',
          content: `Rédige une lettre de motivation complète basée sur ce CV.

=== CV DU CANDIDAT (JSON) ===
${cvContent}

${companyContext}

${jobContext}

Consignes:
- ${toneInstruction}
- ${isFr ? 'Structure : salutation formelle, accroche forte, paragraphe valeur/motivation (appuyé sur les expériences réelles du CV), paragraphe adéquation au poste, formule de politesse et signature.' : 'Structure: formal salutation, strong hook, value/motivation paragraph (based on real CV experiences), job-fit paragraph, closing formula and signature.'}
- ${isFr ? 'Utilise les réalisations réelles du CV pour illustrer (sans inventer de chiffres qui ne sont pas dans le CV).' : 'Use real CV achievements to illustrate (do not invent figures not present in the CV).'}
- ${isFr ? 'Longueur : entre 250 et 350 mots.' : 'Length: between 250 and 350 words.'}
- ${isFr ? 'N\'inclus PAS d\'en-tête d\'adresses postales, commence directement par la salutation.' : 'Do NOT include postal address headers, start directly with the salutation.'}
- ${isFr ? 'Réponds UNIQUEMENT avec le texte de la lettre, sans préambule ni explication.' : 'Respond ONLY with the letter text, no preamble or explanation.'}`
        }
      ],
      thinking: { type: 'disabled' }
    });

    const letter = (completion.choices[0]?.message?.content || '').trim();

    if (!letter) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    return NextResponse.json({ letter });
  } catch (err) {
    console.error('AI cover letter error:', err);
    return NextResponse.json({ error: 'Cover letter generation failed' }, { status: 500 });
  }
}
