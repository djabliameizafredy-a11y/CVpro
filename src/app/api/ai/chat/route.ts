import { NextRequest, NextResponse } from 'next/server';
import ZAI from 'z-ai-web-dev-sdk';

export const runtime = 'nodejs';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatBody {
  messages: ChatMessage[];
  cv: Record<string, unknown>;
  lang: 'fr' | 'en';
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatBody;
    const { messages, cv, lang } = body;

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Missing messages' }, { status: 400 });
    }

    const isFr = lang === 'fr';
    const personal = (cv.personal as Record<string, string>) || {};
    const skills = (cv.skills as Array<{ category: string; tags: string }>) || [];
    const projects = (cv.projects as Array<Record<string, unknown>>) || [];
    const education = (cv.education as Array<Record<string, unknown>>) || [];

    const cvSummary = JSON.stringify(
      {
        personal: {
          firstName: personal.firstName,
          lastName: personal.lastName,
          jobTitle: personal.jobTitle,
          subTitle: personal.subTitle,
          summary: personal.summary,
          qualities: personal.qualities,
          availability: personal.availability
        },
        skills: skills.map((s) => ({ category: s.category, tags: s.tags })),
        projects: projects.map((p) => ({
          title: p.title,
          company: p.companyOrClient,
          period: [p.startDate, p.endDate].filter(Boolean).join(' - '),
          tag: p.tag,
          desc: p.desc
        })),
        education: education.map((e) => ({ degree: e.degree, school: e.school, period: e.period }))
      },
      null,
      1
    );

    const systemPrompt = isFr
      ? `Tu es "Copilote CV", un expert RH et rédacteur de CV professionnel francophone. Tu aides l'utilisateur à améliorer son CV, rédiger du contenu, préparer des candidatures et optimiser son score ATS.

Voici le contenu actuel du CV de l'utilisateur (JSON):
${cvSummary}

Règles:
- Tes réponses sont concises, structurées et actionnables (listes à puces quand pertinent).
- Tu t'appuies TOUJOURS sur les informations réelles du CV fourni ci-dessus.
- Si l'utilisateur demande du contenu à copier dans son CV, fournis-le directement prêt à copier.
- Réponds en français.`
      : `You are "CV Copilot", an HR expert and professional English CV writer. You help the user improve their resume, write content, prepare applications and optimize their ATS score.

Here is the current content of the user's CV (JSON):
${cvSummary}

Rules:
- Your answers are concise, structured and actionable (bullet points when relevant).
- You ALWAYS rely on the actual CV information provided above.
- If the user asks for content to paste into the CV, provide it ready to copy.
- Reply in English.`;

    const zai = await ZAI.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'assistant', content: systemPrompt },
        ...messages.slice(-12).map((m) => ({
          role: m.role,
          content: m.content
        }))
      ],
      thinking: { type: 'disabled' }
    });

    const reply = (completion.choices[0]?.message?.content || '').trim();

    if (!reply) {
      return NextResponse.json({ error: 'Empty AI response' }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error('AI chat error:', err);
    return NextResponse.json({ error: 'AI chat failed' }, { status: 500 });
  }
}
