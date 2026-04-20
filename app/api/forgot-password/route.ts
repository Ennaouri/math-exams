import { NextResponse } from "next/server";
import { Resend } from "resend";
import { pool } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email requis" }, { status: 400 });
    }

    const result = await pool.query("SELECT id, email FROM users WHERE email = $1", [email]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Email non trouvé" }, { status: 404 });
    }

    const resetToken = crypto.randomUUID();
    const expires = new Date(Date.now() + 3600000);

    await pool.query(
      "UPDATE users SET reset_token = $1, reset_expires = $2 WHERE email = $3",
      [resetToken, expires, email]
    );

    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      from: "Maths-Exams <onboarding@resend.dev>",
      to: [email],
      subject: "Réinitialisation de votre mot de passe - Maths-Exams",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Réinitialiser votre mot de passe</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 16px;">Bonjour,</p>
            <p style="color: #374151; font-size: 16px;">Vous avez demandé la réinitialisation de votre mot de passe. Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://maths-exams.com/reset-password?token=${resetToken}" style="background: #2563eb; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Réinitialiser mon mot de passe
              </a>
            </div>
            <p style="color: #6b7280; font-size: 14px;">Ce lien expire dans 1 heure.</p>
            <p style="color: #6b7280; font-size: 14px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">L'équipe Maths-Exams</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ message: "Email de réinitialisation envoyé" });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}