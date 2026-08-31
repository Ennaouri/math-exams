import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { getExamEvents, getUpcomingExamEvents } from '@/lib/db';
import CalendarClient from './CalendarClient';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Calendrier des Examens & Concours 2025-2026 | Maths-Exams',
  description:
    'Calendrier officiel des examens nationaux, régionaux et concours post-bac au Maroc : BAC, ENSA, CNC, ENCG. Dates, résultats et ressources de préparation.',
  path: '/calendrier',
});

export default async function CalendrierPage() {
  const [allEvents, upcoming] = await Promise.all([
    getExamEvents(),
    getUpcomingExamEvents(6),
  ]);

  return <CalendarClient allEvents={allEvents} upcomingEvents={upcoming} />;
}
