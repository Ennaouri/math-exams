import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, linkParentToStudent } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, name, role = 'etudiant', niveau, phone, studentEmail } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Le nom, l\'adresse email et le mot de passe sont obligatoires.' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Un compte avec cette adresse email existe déjà.' },
        { status: 400 }
      );
    }

    const validRole = ['etudiant', 'parent', 'enseignant', 'admin'].includes(role) ? role : 'etudiant';
    const userMeta = JSON.stringify({
      role: validRole,
      niveau: niveau || null,
      phone: phone || null,
      emailVerified: true,
    });

    const user = await createUser(email, password, name, validRole, userMeta, niveau, phone);

    // If registered as parent with student email, link them
    if (validRole === 'parent' && studentEmail && studentEmail.trim()) {
      await linkParentToStudent(user.id, studentEmail.trim());
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      niveau: user.niveau,
      phone: user.phone,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du compte' },
      { status: 500 }
    );
  }
}