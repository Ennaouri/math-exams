import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  getSubscriptionPlans,
  getUserSubscription,
  getAllUserSubscriptions,
  createUserSubscription,
  updateSubscriptionStatus,
} from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode');
    const session = await auth();

    if (mode === 'all' && (session?.user as any)?.role === 'admin') {
      const allSubscriptions = await getAllUserSubscriptions();
      return NextResponse.json(allSubscriptions);
    }

    if (mode === 'user') {
      if (!session?.user) {
        return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
      }
      const userId = Number((session.user as any).id);
      const sub = await getUserSubscription(userId);
      return NextResponse.json(sub || { status: 'none' });
    }

    const plans = await getSubscriptionPlans();
    return NextResponse.json(plans);
  } catch (error) {
    console.error('Subscription API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Veuillez vous connecter pour vous abonner.' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, paymentMethod = 'virement', notes, durationMonths = 1, studentId } = body;

    if (!planId) {
      return NextResponse.json({ error: 'Identifiant du plan manquant.' }, { status: 400 });
    }

    // If parent subscribing for a student, use studentId, otherwise user's own id
    const userId = (session.user as any)?.role === 'parent' && studentId
      ? Number(studentId)
      : Number((session.user as any).id);

    const subscription = await createUserSubscription({
      user_id: userId,
      plan_id: Number(planId),
      payment_method: paymentMethod,
      notes: notes ? `${notes} (Inscrit par: ${session.user.name})` : undefined,
      durationMonths: Number(durationMonths),
    });

    return NextResponse.json({ success: true, subscription });
  } catch (error) {
    console.error('Subscription creation error:', error);
    return NextResponse.json({ error: 'Erreur lors de la souscription' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    if ((session?.user as any)?.role !== 'admin') {
      return NextResponse.json({ error: 'Accès non autorisé' }, { status: 403 });
    }

    const { id, status } = await request.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'Données incomplètes' }, { status: 400 });
    }

    const success = await updateSubscriptionStatus(Number(id), status);
    return NextResponse.json({ success });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur de mise à jour' }, { status: 500 });
  }
}
