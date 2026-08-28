import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getLiveSessions, createLiveSession } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number(searchParams.get('limit')) || 20;
    const sessions = await getLiveSessions(limit);
    return NextResponse.json(sessions);
  } catch (error) {
    console.error('Lives API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès réservé aux administrateurs' }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      niveau,
      niveau_label,
      instructor_name,
      scheduled_at,
      duration_minutes,
      meeting_url,
      replay_url,
      formation_id,
    } = body;

    if (!title || !niveau || !scheduled_at) {
      return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 });
    }

    const live = await createLiveSession({
      title,
      description: description || '',
      niveau,
      niveau_label: niveau_label || niveau,
      instructor_name: instructor_name || 'Professeur Maths-Exams',
      scheduled_at: new Date(scheduled_at),
      duration_minutes: Number(duration_minutes) || 90,
      meeting_url,
      replay_url,
      formation_id: formation_id ? Number(formation_id) : undefined,
    });

    return NextResponse.json({ success: true, live });
  } catch (error) {
    console.error('Live creation error:', error);
    return NextResponse.json({ error: 'Erreur lors de la création de la séance' }, { status: 500 });
  }
}
