'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { LiveSession } from '@/lib/types';

interface LiveCountdownBannerProps {
  lives: LiveSession[];
}

function getTimeLeft(scheduledAt: Date): string {
  const now = Date.now();
  const diff = new Date(scheduledAt).getTime() - now;
  if (diff <= 0) return 'maintenant';

  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);

  if (h >= 24) {
    const d = Math.floor(h / 24);
    return `dans ${d} jour${d > 1 ? 's' : ''}`;
  }
  if (h > 0) return `dans ${h}h${m > 0 ? m + 'min' : ''}`;
  return `dans ${m} min`;
}

export default function LiveCountdownBanner({ lives }: LiveCountdownBannerProps) {
  const [tick, setTick] = useState(0);

  // Refresh countdown every minute
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(id);
  }, []);

  // Pick the next upcoming live (closest future date)
  const nextLive = lives
    .filter((l) => l.status !== 'completed' && new Date(l.scheduled_at).getTime() > Date.now())
    .sort((a, b) => new Date(a.scheduled_at).getTime() - new Date(b.scheduled_at).getTime())[0];

  // Live en cours
  const liveNow = lives.find((l) => l.status === 'live');

  if (!liveNow && !nextLive) return null;

  const isNow = Boolean(liveNow);
  const current = liveNow || nextLive!;
  const timeLeft = isNow ? 'EN DIRECT' : getTimeLeft(current.scheduled_at);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl mb-6 shadow-lg ${
        isNow
          ? 'bg-gradient-to-r from-red-600 to-rose-600'
          : 'bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900'
      }`}
    >
      {/* Decorative pulse ring for live */}
      {isNow && (
        <span className="absolute left-5 top-1/2 -translate-y-1/2 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-50" />
          <span className="relative inline-flex rounded-full h-4 w-4 bg-white" />
        </span>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 pl-10 sm:pl-6">
        <div className="flex items-center gap-3 min-w-0">
          {/* Badge temps */}
          <span
            className={`shrink-0 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
              isNow
                ? 'bg-white text-red-600 animate-pulse'
                : 'bg-red-500/20 border border-red-400/40 text-red-300'
            }`}
          >
            {isNow ? '● EN DIRECT' : `🔴 ${timeLeft}`}
          </span>

          <div className="min-w-0">
            <p className="text-white font-bold text-sm truncate">{current.title}</p>
            <p className="text-slate-300 text-xs truncate">{current.niveau_label}</p>
          </div>
        </div>

        <Link
          href={isNow && current.meeting_url ? current.meeting_url : '/lives'}
          target={isNow && current.meeting_url ? '_blank' : undefined}
          rel={isNow && current.meeting_url ? 'noopener noreferrer' : undefined}
          className={`shrink-0 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
            isNow
              ? 'bg-white text-red-600 hover:bg-red-50 shadow-lg shadow-red-900/30'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/40'
          }`}
        >
          {isNow ? '🚀 Rejoindre maintenant' : '📅 Voir le planning'}
        </Link>
      </div>
    </div>
  );
}
