'use client';

import React from 'react';
import { UserSubscription, LiveSession, Formation, UserProgressStats } from '@/lib/types';
import Link from 'next/link';
import ProgressSection from './ProgressSection';
import AITutor from './AITutor';

interface StudentDashboardProps {
  user: any;
  subscription: UserSubscription | null;
  upcomingLives: LiveSession[];
  formations: Formation[];
  progressStats: UserProgressStats;
}

export default function StudentDashboard({
  user,
  subscription,
  upcomingLives,
  formations,
  progressStats,
}: StudentDashboardProps) {
  const isSubscribed = subscription && subscription.status === 'active';

  return (
    <div className="space-y-8">
      {/* Subscription status card */}
      <div className={`rounded-3xl p-6 sm:p-8 border ${
        isSubscribed
          ? 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white border-blue-800 shadow-xl'
          : 'bg-white text-slate-800 border-amber-200 shadow-sm ring-2 ring-amber-400/20'
      }`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                isSubscribed ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-800'
              }`}>
                {isSubscribed ? '● Abonnement Actif' : '⚠️ Formule Gratuite'}
              </span>
              {subscription && (
                <span className="text-xs opacity-75">
                  Expire le {new Date(subscription.expires_at).toLocaleDateString('fr-FR')}
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              {isSubscribed ? subscription.plan_name || 'Pack Excellence' : 'Accès Limité aux Cours & Lives'}
            </h2>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isSubscribed ? 'text-blue-200' : 'text-slate-500'}`}>
              {isSubscribed
                ? 'Vous avez accès à l\'ensemble des séances en direct (Lives), aux replays illimités et à tous les téléchargements de fiches et corrigés.'
                : 'Souscrivez à un pack pour débloquer les séances Live interactives, les fiches PDF et les simulations d\'examens.'}
            </p>
          </div>

          {!isSubscribed && (
            <Link
              href="/tarifs"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all shrink-0"
            >
              Activer mon Pack Live
            </Link>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <ProgressSection stats={progressStats} />

      {/* AI Tutor Section */}
      <AITutor progressStats={progressStats} niveau={user?.niveau} />

      {/* Grid: Upcoming Lives & Quick Formations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live schedule */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>🔴</span>
              <span>Prochaines Séances en Direct</span>
            </h2>
            <Link href="/lives" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Voir tout le planning →
            </Link>
          </div>

          {upcomingLives.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-100 text-slate-500 text-xs">
              Aucune séance programmée pour le moment.
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingLives.map((live) => {
                const dateObj = new Date(live.scheduled_at);
                const formattedDate = dateObj.toLocaleDateString('fr-FR', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });
                const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div
                    key={live.id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-bold uppercase">
                          {live.niveau_label}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold">
                          📅 {formattedDate} à {formattedTime} ({live.duration_minutes} min)
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm">{live.title}</h3>
                      <p className="text-xs text-slate-500 line-clamp-1">{live.description}</p>
                    </div>

                    <div className="shrink-0 w-full sm:w-auto">
                      {isSubscribed ? (
                        <a
                          href={live.meeting_url || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-sm shadow-blue-600/30"
                        >
                          <span>Rejoindre le Live</span>
                          <span>→</span>
                        </a>
                      ) : (
                        <Link
                          href="/tarifs"
                          className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                        >
                          <span>Débloquer</span>
                          <span>🔒</span>
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Col: Formations & Resources */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📚</span>
              <span>Mes Formations</span>
            </h2>
            <Link href="/formations" className="text-xs font-bold text-blue-600 hover:text-blue-700">
              Explorer →
            </Link>
          </div>

          <div className="space-y-3">
            {formations.slice(0, 3).map((form) => (
              <Link
                key={form.id}
                href={`/formations/${form.slug}`}
                className="block bg-white rounded-2xl p-4 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-blue-300 transition-all"
              >
                <span className="text-[10px] font-bold uppercase text-blue-600">{form.niveau_label}</span>
                <h3 className="font-bold text-slate-900 text-xs mt-0.5 leading-snug line-clamp-2">{form.title}</h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2">
                  <span>⏱️ {form.total_hours}h</span>
                  <span>•</span>
                  <span>📖 {form.total_chapters} chapitres</span>
                </div>
              </Link>
            ))}
          </div>

          {/* WhatsApp Student Support */}
          <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-200">
            <div className="flex items-center gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <h3 className="font-bold text-emerald-950 text-xs">Groupe WhatsApp d'entraide</h3>
                <p className="text-[11px] text-emerald-800 mt-0.5">Posez vos questions directement aux enseignants.</p>
              </div>
            </div>
            <a
              href="https://wa.me/212710500405"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 block text-center py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
            >
              Rejoindre le Groupe VIP
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
