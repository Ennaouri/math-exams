import { NextResponse } from "next/server";
import { Resend } from "resend";

interface ContactFormData {
  firstname: string;
  lastname: string;
  email: string;
  subject: string;
  message: string;
}

export async function POST(request: Request) {
  try {
    const data: ContactFormData = await request.json();

    const { firstname, lastname, email, subject, message } = data;

    if (!firstname || !lastname || !email || !subject || !message) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    const emailContent = `
Nouveau message de contact - Maths-Exams

Nom: ${firstname} ${lastname}
Email: ${email}
Sujet: ${subject}

Message:
${message}
    `.trim();

    await resend.emails.send({
      from: "Maths-Exams Contact <onboarding@resend.dev>",
      to: ["ennaouri.mohammed@gmail.com"],
      subject: `[Contact] ${subject} - ${firstname} ${lastname}`,
      text: emailContent,
      replyTo: email,
    });

    await resend.emails.send({
      from: "Maths-Exams Contact <onboarding@resend.dev>",
      to: [email],
      subject: "Nous avons reçu votre message - Maths-Exams",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0;">Merci pour votre message !</h1>
          </div>
          <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
            <p style="color: #374151; font-size: 16px;">Bonjour ${firstname},</p>
            <p style="color: #374151; font-size: 16px;">Nous avons bien reçu votre message. Notre équipe va le traiter dans les plus brefs délais.</p>
            <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Sujet:</p>
              <p style="margin: 0; color: #111827; font-size: 16px; font-weight: bold;">${subject}</p>
              <p style="margin: 20px 0 0 0; color: #6b7280; font-size: 14px;">Message:</p>
              <p style="margin: 5px 0 0 0; color: #374151; font-size: 16px;">${message}</p>
            </div>
            <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">Nous vous répondrons dans un délai de 24 à 48 heures.</p>
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">L'équipe Maths-Exams</p>
          </div>
        </div>
      `,
    });

    console.log("Contact form submission:", {
      firstname,
      lastname,
      email,
      subject,
      message,
      recipient: "ennaouri.mohammed@gmail.com",
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { message: "Message envoyé avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Erreur lors de l'envoi du message" },
      { status: 500 }
    );
  }
}