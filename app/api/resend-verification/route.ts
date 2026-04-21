import { NextResponse } from 'next/server';
import { getUserByEmail, updateUser } from '@/lib/db';
import { Resend } from 'resend';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.metadata) {
      const meta = JSON.parse(user.metadata);
      if (meta.emailVerified === true) {
        return NextResponse.json({ message: 'Email already verified' });
      }
      meta.verifyToken = crypto.randomUUID();
      meta.verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
      await updateUser(user.id, { metadata: JSON.stringify(meta) });

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
                  <p style="color: #374151; font-size: 16px;">Bonjour ${user.name},</p>
                  <p style="color: #374151; font-size: 16px;">Cliquez sur le bouton ci-dessous pour vérifier votre adresse email :</p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="${baseUrl}/verify-email?token=${meta.verifyToken}&email=${encodeURIComponent(email)}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Vérifier mon email</a>
                  </div>
                  <p style="color: #6b7280; font-size: 14px;">Ce lien expire dans 24 heures.</p>
                  <p style="color: #6b7280; font-size: 14px;">L'équipe Maths-Exams</p>
                </div>
              </div>
            `,
          });
        } catch (emailError) {
          console.error('Email error:', emailError);
        }
      }
    }

    return NextResponse.json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json({ error: 'Failed to resend verification' }, { status: 500 });
  }
}