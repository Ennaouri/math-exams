import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, niveau } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const verifyToken = crypto.randomUUID();
    const verifyExpires = new Date(Date.now() + 86400000);

    const userMeta = JSON.stringify({ role, niveau, verifyToken, verifyExpires: verifyExpires.toISOString() });
    const user = await createUser(email, password, name, 'user', userMeta);

    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Maths-Exams <onboarding@resend.dev>",
      to: [email],
      subject: "Bienvenue sur Maths-Exams !",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Bienvenue sur Maths-Exams !</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 16px;">Bonjour ${name},</p>
            <p style="color: #374151; font-size: 16px;">Merci de créer un compte sur Maths-Exams. Votre compte est maintenant actif !</p>
            <p style="color: #6b7280; font-size: 14px;">L'équipe Maths-Exams</p>
          </div>
        </div>
      `,
    });
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}