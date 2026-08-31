import { NextRequest, NextResponse } from 'next/server';
import { getPendingLiveNotifications, markNotificationSent } from '@/lib/db';
import { Resend } from 'resend';

// Ce endpoint est appelé par un cron job (ex: Vercel Cron) ou manuellement par l'admin
// GET /api/live-notifications/send?secret=XXX
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');

  // Protection basique par secret
  if (secret !== process.env.CRON_SECRET && secret !== 'dev-test') {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 });
  }

  const pending = await getPendingLiveNotifications(24);

  if (pending.length === 0) {
    return NextResponse.json({ sent: 0, message: 'Aucune notification à envoyer' });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);
  let sent = 0;
  const errors: string[] = [];

  for (const notif of pending) {
    const liveDate = new Date(notif.scheduled_at);
    const formattedDate = liveDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    const formattedTime = liveDate.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const hoursLeft = Math.round((liveDate.getTime() - Date.now()) / 3_600_000);

    try {
      await resend.emails.send({
        from: 'Maths-Exams <notifications@maths-exams.com>',
        to: [notif.email],
        subject: `🔴 Rappel Live : ${notif.live_title} — dans ${hoursLeft}h`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a5f, #2563eb); padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
              <div style="display: inline-block; background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.3); color: #fca5a5; padding: 6px 16px; border-radius: 999px; font-size: 12px; font-weight: bold; letter-spacing: 1px; margin-bottom: 16px;">
                🔴 LIVE DANS ${hoursLeft} HEURE${hoursLeft > 1 ? 'S' : ''}
              </div>
              <h1 style="color: white; margin: 0; font-size: 22px; line-height: 1.4;">
                ${notif.live_title}
              </h1>
            </div>

            <div style="background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 12px 12px;">
              <p style="color: #374151; font-size: 15px;">Bonjour ${notif.user_name || 'Étudiant(e)'},</p>
              <p style="color: #374151; font-size: 15px;">
                Votre séance en direct commence bientôt. Préparez votre cahier et vos questions !
              </p>

              <div style="background: white; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; margin: 24px 0;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
                  <span style="font-size: 18px;">📅</span>
                  <div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Date & heure</p>
                    <p style="margin: 0; font-weight: bold; color: #111827; text-transform: capitalize;">
                      ${formattedDate} à ${formattedTime}
                    </p>
                  </div>
                </div>
                <div style="display: flex; align-items: center; gap: 10px;">
                  <span style="font-size: 18px;">🎓</span>
                  <div>
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">Niveau</p>
                    <p style="margin: 0; font-weight: bold; color: #111827;">${notif.niveau_label}</p>
                  </div>
                </div>
              </div>

              ${notif.meeting_url ? `
              <div style="text-align: center; margin: 30px 0;">
                <a href="${notif.meeting_url}"
                   style="display: inline-block; background: #2563eb; color: white; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-weight: bold; font-size: 15px; letter-spacing: 0.5px;">
                  🚀 Rejoindre la séance →
                </a>
              </div>
              ` : ''}

              <p style="color: #9ca3af; font-size: 12px; text-align: center; margin-top: 24px;">
                Vous recevez cet email car vous avez activé les rappels sur
                <a href="https://maths-exams.com/lives" style="color: #2563eb;">maths-exams.com</a>.
              </p>
            </div>
          </div>
        `,
      });

      await markNotificationSent(notif.notif_id);
      sent++;
    } catch (err: any) {
      errors.push(`${notif.email}: ${err.message}`);
    }
  }

  return NextResponse.json({ sent, total: pending.length, errors });
}
