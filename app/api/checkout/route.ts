import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createUserSubscription } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Veuillez vous connecter pour finaliser la commande.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      type = 'live', // 'live' | 'subscription'
      serviceId,
      serviceTitle,
      planId,
      planName,
      amount,
      paymentMethod = 'virement',
      paypalOrderId,
      durationMonths = 1,
    } = body;

    const userId = Number((session.user as any).id);
    if (!userId) {
      return NextResponse.json(
        { error: 'Utilisateur introuvable.' },
        { status: 400 }
      );
    }

    // Build human-readable notes for order tracking
    let orderNotes = '';
    if (type === 'live') {
      orderNotes = `Séance Live: ${serviceTitle || `#${serviceId}`} (Prix: ${amount || 200} MAD)`;
    } else {
      orderNotes = `Abonnement: ${planName || `Plan #${planId}`} (Prix: ${amount} MAD)`;
    }

    if (paypalOrderId) {
      orderNotes += ` | PayPal Order: ${paypalOrderId}`;
    }

    const initialStatus = paymentMethod === 'paypal' ? 'paid' : 'pending';

    const subscription = await createUserSubscription({
      user_id: userId,
      plan_id: planId ? Number(planId) : null,
      payment_method: paymentMethod,
      notes: orderNotes,
      durationMonths: Number(durationMonths) || 1,
      status: initialStatus,
    });

    return NextResponse.json({
      success: true,
      orderId: subscription.id,
      status: subscription.status,
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de la commande.' },
      { status: 500 }
    );
  }
}
