import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  subscribeLiveNotification,
  unsubscribeLiveNotification,
  getUserLiveSubscriptions,
} from '@/lib/db';

// GET /api/live-notifications — liste des live_ids auxquels l'user est inscrit
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }
  const userId = Number((session.user as any).id);
  const subscriptions = await getUserLiveSubscriptions(userId);
  return NextResponse.json({ subscriptions });
}

// POST /api/live-notifications — s'inscrire à un rappel
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = Number((session.user as any).id);
  const email = session.user.email!;
  const userName = session.user.name || '';

  const { liveId } = await req.json();
  if (!liveId) {
    return NextResponse.json({ error: 'liveId requis' }, { status: 400 });
  }

  const result = await subscribeLiveNotification(Number(liveId), userId, email, userName);
  return NextResponse.json(result);
}

// DELETE /api/live-notifications — se désinscrire
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = Number((session.user as any).id);
  const { liveId } = await req.json();

  const ok = await unsubscribeLiveNotification(Number(liveId), userId);
  return NextResponse.json({ success: ok });
}
