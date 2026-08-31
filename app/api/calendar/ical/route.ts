import { NextRequest, NextResponse } from 'next/server';
import { getExamEvents } from '@/lib/db';

// GET /api/calendar/ical?niveau=&type= — returns .ics file for calendar apps
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const niveau = searchParams.get('niveau') || undefined;
  const type   = searchParams.get('type')   || undefined;

  const events = await getExamEvents({ niveau, type });

  const formatDate = (d: Date | string): string => {
    const dt = new Date(d);
    return dt.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };

  const escape = (s: string) => (s || '').replace(/[,;\\]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Maths-Exams//Calendrier Examens Maroc//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Calendrier Examens Maths-Exams',
    'X-WR-TIMEZONE:Africa/Casablanca',
  ];

  for (const ev of events) {
    const dtStart = formatDate(ev.event_date);
    const dtEnd   = ev.end_date ? formatDate(ev.end_date) : dtStart;
    lines.push(
      'BEGIN:VEVENT',
      `UID:exam-event-${ev.id}@maths-exams.com`,
      `DTSTAMP:${formatDate(new Date())}`,
      `DTSTART;VALUE=DATE:${dtStart.slice(0, 8)}`,
      `DTEND;VALUE=DATE:${dtEnd.slice(0, 8)}`,
      `SUMMARY:${escape(ev.title)}`,
      ev.description ? `DESCRIPTION:${escape(ev.description)}` : '',
      ev.niveau_label ? `CATEGORIES:${escape(ev.niveau_label)}` : '',
      ev.location ? `LOCATION:${escape(ev.location)}` : '',
      ev.source_url ? `URL:${ev.source_url}` : '',
      'END:VEVENT',
    );
  }
  lines.push('END:VCALENDAR');

  const icsContent = lines.filter(Boolean).join('\r\n');

  return new NextResponse(icsContent, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="maths-exams-calendrier.ics"',
      'Cache-Control': 'no-store',
    },
  });
}
