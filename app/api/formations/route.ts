import { NextResponse } from 'next/server';
import { getFormations, getFormationBySlug, getFormationResources } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const formationId = searchParams.get('formationId');

    if (formationId) {
      const resources = await getFormationResources(Number(formationId));
      return NextResponse.json(resources);
    }

    if (slug) {
      const formation = await getFormationBySlug(slug);
      if (!formation) {
        return NextResponse.json({ error: 'Formation introuvable' }, { status: 404 });
      }
      const resources = await getFormationResources(formation.id);
      return NextResponse.json({ formation, resources });
    }

    const formations = await getFormations();
    return NextResponse.json(formations);
  } catch (error) {
    console.error('Formations API error:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
