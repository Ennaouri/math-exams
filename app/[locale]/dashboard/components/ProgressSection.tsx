import React from 'react';
import Link from 'next/link';
import type { UserProgressStats } from '@/lib/types';

interface ProgressSectionProps {
  stats: UserProgressStats;
}

function StreakBadge({ days }: { days: number }) {
  if (days === 0) return null;
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200">
      🔥 {days} jour{days > 1 ? 's' : ''} de suite
    </span>
  );
}

function ProgressBar({ percent, color = 'blue' }: { percent: number; color?: string }) {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-400',
    indigo: 'bg-indigo-500',
    teal: 'bg-teal-500',
  };
  const bar = colors[color] || colors.blue;
  return (
    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
      <div
        className={`h-2 rounded-full transition-all duration-700 ${bar}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  );
}

const CATEGORY_COLORS = ['blue', 'purple', 'green', 'orange', 'indigo', 'teal'];

export default function ProgressSection({ stats }: ProgressSectionProps) {
  const { total_viewed, recent, by_category, streak_days } = stats;

  const totalPosts = by_category.reduce((acc, c) => acc + c.total, 0);
  const globalPercent = totalPosts > 0 ? Math.round((total_viewed / totalPosts) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
          <span>📈</span>
          <span>Ma Progression</span>
        </h2>
        <StreakBadge days={streak_days} />
      </div>

      {/* ── Global progress card ── */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
          <div>
            <p className="text-sm font-semibold text-slate-700">Progression globale</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {total_viewed} ressource{total_viewed !== 1 ? 's' : ''} consultée{total_viewed !== 1 ? 's' : ''} sur {totalPosts}
            </p>
          </div>
          <span className="text-3xl font-black text-blue-600">{globalPercent}%</span>
        </div>
        <ProgressBar percent={globalPercent} color="blue" />

        {total_viewed === 0 && (
          <p className="text-xs text-slate-400 mt-3 italic">
            Commencez par consulter un cours ou un exercice pour voir votre progression ici.
          </p>
        )}
      </div>

      {/* ── Per-category progress ── */}
      {by_category.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Par niveau</h3>
          <div className="space-y-4">
            {by_category.map((cat, i) => (
              <div key={cat.category_slug}>
                <div className="flex justify-between items-center mb-1.5">
                  <Link
                    href={`/category/${cat.category_slug}`}
                    className="text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors truncate max-w-[70%]"
                  >
                    {cat.category_name}
                  </Link>
                  <span className="text-xs text-slate-400 shrink-0">
                    {cat.viewed} / {cat.total}
                  </span>
                </div>
                <ProgressBar
                  percent={cat.percent}
                  color={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Recent activity ── */}
      {recent.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6">
          <h3 className="text-sm font-bold text-slate-700 mb-4">Consultés récemment</h3>
          <ul className="space-y-2">
            {recent.map((item) => {
              const date = new Date(item.viewed_at).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'short',
              });
              return (
                <li key={item.id} className="flex items-center justify-between gap-3">
                  <Link
                    href={`/postdetails/${item.post_slug}`}
                    className="text-xs text-slate-700 hover:text-blue-600 font-medium truncate transition-colors"
                  >
                    📄 {item.post_name || item.post_slug}
                  </Link>
                  <span className="text-[11px] text-slate-400 shrink-0">{date}</span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Empty state ── */}
      {total_viewed === 0 && recent.length === 0 && (
        <div className="bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6 text-center">
          <p className="text-2xl mb-2">🎯</p>
          <p className="text-sm font-semibold text-slate-600">Aucune progression enregistrée</p>
          <p className="text-xs text-slate-400 mt-1">
            Consultez un cours ou un exercice pour démarrer votre suivi.
          </p>
          <Link
            href="/#niveaux"
            className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
          >
            Voir les niveaux →
          </Link>
        </div>
      )}
    </div>
  );
}
