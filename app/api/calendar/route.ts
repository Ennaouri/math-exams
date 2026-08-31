import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getExamEvents, createExamEvent, updateExamEvent, deleteExamEvent } from '@/lib/db';

// GET /api/calendar?niveau=&type=&year=&month=
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niveau = searchParams.get('niveau') || undefined;
  const type   = searchParams.get('type')   || undefined;
  const year   = searchParams.get('year')   ? Number(searchParams.get('year'))  : undefined;
  const month  = searchParams.get('month')  ? Number(searchParams.get('month')) : undefined;

  const events = await getExamEvents({ niveau, type, year, month });
  return NextResponse.json(events);
}

// POST /api/calendar — admin only
export async function POST(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  const body = await req.json();
  if (!body.title || !body.event_date || !body.type) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
  }
  const event = await createExamEvent(body);
  return NextResponse.json(event, { status: 201 });
}

// PUT /api/calendar?id=X — admin only
export async function PUT(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  const body = await req.json();
  const event = await updateExamEvent(id, body);
  return NextResponse.json(event);
}

// DELETE /api/calendar?id=X — admin only
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if ((session?.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }
  const id = Number(new URL(req.url).searchParams.get('id'));
  if (!id) return NextResponse.json({ error: 'id requis' }, { status: 400 });
  await deleteExamEvent(id);
  return NextResponse.json({ success: true });
}
