import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getParentStudents, linkParentToStudent } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const parentId = Number((session.user as any).id);
    let students = await getParentStudents(parentId);

    const { getUserProgressStats } = await import('@/lib/db');
    students = await Promise.all(
      students.map(async (st: any) => {
        const stats = await getUserProgressStats(st.student_id);
        return { ...st, progressStats: stats };
      })
    );

    return NextResponse.json(students);
  } catch (error) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 });
    }

    const { studentEmail } = await request.json();
    if (!studentEmail) {
      return NextResponse.json({ error: "L'adresse email de l'étudiant est requise." }, { status: 400 });
    }

    const parentId = Number((session.user as any).id);
    const result = await linkParentToStudent(parentId, studentEmail.trim());

    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: result.message });
  } catch (error) {
    return NextResponse.json({ error: 'Erreur lors du rattachement' }, { status: 500 });
  }
}
