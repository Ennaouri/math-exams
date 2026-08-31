import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { trackPostView, getUserProgressStats } from '@/lib/db';

// POST /api/progress — enregistrer la consultation d'un post
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = Number((session.user as any).id);
  if (!userId) {
    return NextResponse.json({ error: 'ID utilisateur introuvable' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { postId, postSlug, postName, categoryName, categorySlug } = body;

    if (!postId || !postSlug) {
      return NextResponse.json({ error: 'postId et postSlug requis' }, { status: 400 });
    }

    await trackPostView(userId, Number(postId), postSlug, postName, categoryName, categorySlug);
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// GET /api/progress — récupérer les stats de progression
export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
  }

  const userId = Number((session.user as any).id);
  if (!userId) {
    return NextResponse.json({ error: 'ID utilisateur introuvable' }, { status: 400 });
  }

  try {
    const stats = await getUserProgressStats(userId);
    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
