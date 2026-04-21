import { NextResponse } from 'next/server';
import { createUser, getUserByEmail, updateUser } from '@/lib/db';
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
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const userMeta = JSON.stringify({ 
      role, 
      niveau, 
      verifyToken, 
      verifyExpires: verifyExpires.toISOString(),
      emailVerified: false
    });
    const user = await createUser(email, password, name, 'user', userMeta);

    const resendApiKey = process.env.RESEND_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    
    if (resendApiKey) {
      try {
        const resend = new Resend(resendApiKey);
        await resend.emails.send({
          from: "Maths-Exams <onboarding@resend.dev>",
          to: [email],
          subject: "Vérifiez votre email - Maths-Exams",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
              <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; border-radius: 10px 10px 0 0;">
                <h1 style="color: white; margin: 0;">Vérifiez votre email</h1>
              </div>
              <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
                <p style="color: #374151; font-size: 16px;">Bonjour ${name},</p>
                <p style="color: #374151; font-size: 16px;">Merci de créer un compte sur Maths-Exams. Cliquez sur le bouton ci-dessous pour vérifier votre adresse email :</p>
                <div style="text-align: center; margin: 30px 0;">
                  <a href="${baseUrl}/verify-email?token=${verifyToken}&email=${encodeURIComponent(email)}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Vérifier mon email</a>
                </div>
                <p style="color: #6b7280; font-size: 14px;">Ce lien expire dans 24 heures.</p>
                <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas créé de compte, ignorez cet email.</p>
                <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">L'équipe Maths-Exams</p>
              </div>
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
      }
    }
    
    return NextResponse.json({
      message: 'Registration successful. Please check your email to verify your account.',
      requiresVerification: true,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}