import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { getLiveSessions, getUpcomingLiveSessions } from '@/lib/db';
import LivesClient from './LivesClient';
import LiveCountdownBanner from '@/app/components/LiveCountdownBanner';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Séances en Direct (Lives) & Replays | Maths-Exams',
  description:
    'Participez aux séances de cours en direct de mathématiques, posez vos questions en direct aux professeurs et téléchargez les séries de devoirs et annales corrigées.',
  path: '/lives',
});

export default async function LivesPage() {
  const [lives, upcomingLives] = await Promise.all([
    getLiveSessions(30),
    getUpcomingLiveSessions(3),
  ]);

  return (
    <div className="py-8">
      {/* Live NOW banner (only shows if a session is currently live) */}
      {upcomingLives.some((l) => l.status === 'live') && (
        <LiveCountdownBanner lives={upcomingLives} />
      )}

      {/* Header banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 rounded-3xl p-8 sm:p-12 text-white mb-10 relative overflow-hidden shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-500/20 border border-red-500/40 text-red-300 rounded-full text-xs font-bold uppercase tracking-wider mb-4 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-red-400"></span>
            Séances Interactives en Direct
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4">
            Cours en Direct & Replays de Mathématiques
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Assistez aux séances hebdomadaires en visioconférence HD avec nos enseignants spécialisés. Posez vos questions en direct, travaillez les exercices types et révisez les replays à votre rythme.
          </p>
        </div>
      </div>

      <LivesClient initialLives={lives} />
    </div>
  );
}
