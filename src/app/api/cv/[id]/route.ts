import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const runtime = 'nodejs';

// GET /api/cv/[id] — load a specific saved CV
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const doc = await db.cvDocument.findUnique({ where: { id } });

    if (!doc) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    let cv: unknown = null;
    try {
      cv = JSON.parse(doc.data);
    } catch {
      return NextResponse.json({ error: 'Corrupted CV data' }, { status: 500 });
    }

    return NextResponse.json({ id: doc.id, name: doc.name, cv });
  } catch (err) {
    console.error('CV load error:', err);
    return NextResponse.json({ error: 'Failed to load CV' }, { status: 500 });
  }
}

// DELETE /api/cv/[id] — delete a saved CV
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const existing = await db.cvDocument.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: 'CV not found' }, { status: 404 });
    }

    await db.cvDocument.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('CV delete error:', err);
    return NextResponse.json({ error: 'Failed to delete CV' }, { status: 500 });
  }
}
