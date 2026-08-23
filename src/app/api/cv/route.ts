import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/cv — list all saved CVs (metadata only)
export async function GET() {
  try {
    const docs = await db.cvDocument.findMany({
      orderBy: { updatedAt: 'desc' },
      select: { id: true, name: true, lang: true, createdAt: true, updatedAt: true }
    });
    return NextResponse.json({ cvs: docs });
  } catch (err) {
    console.error('CV list error:', err);
    return NextResponse.json({ error: 'Failed to list CVs' }, { status: 500 });
  }
}

// POST /api/cv — save a CV (creates a new version)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, lang, data } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Missing name' }, { status: 400 });
    }
    if (!data || typeof data !== 'object' || !data.personal) {
      return NextResponse.json({ error: 'Invalid CV data' }, { status: 400 });
    }

    // If a CV with the same name exists, update it; otherwise create
    const existing = await db.cvDocument.findFirst({
      where: { name: name.trim() }
    });

    const doc = existing
      ? await db.cvDocument.update({
          where: { id: existing.id },
          data: { lang: lang || 'fr', data: JSON.stringify(data) }
        })
      : await db.cvDocument.create({
          data: { name: name.trim(), lang: lang || 'fr', data: JSON.stringify(data) }
        });

    return NextResponse.json({ id: doc.id, name: doc.name });
  } catch (err) {
    console.error('CV save error:', err);
    return NextResponse.json({ error: 'Failed to save CV' }, { status: 500 });
  }
}
