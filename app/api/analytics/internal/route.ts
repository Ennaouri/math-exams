import { NextResponse } from 'next/server';
import { getAdminInternalStats } from '@/lib/admin-stats';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user as any;
    
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 403 });
    }

    const stats = await getAdminInternalStats();
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
