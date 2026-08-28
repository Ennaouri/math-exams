'use client';

import React, { useState } from 'react';
import { LiveSession } from '@/lib/types';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function LivesClient({ initialLives }: { initialLives: LiveSession[] }) {
  const { data: session } = useSession();
  const [selectedNiveau, setSelectedNiveau] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'upcoming' | 'replays'>('upcoming');

  const filteredLives = initialLives.filter((live) => {
    const matchNiveau = selectedNiveau === 'all' || live.niveau.includes(selectedNiveau);
    const matchTab = activeTab === 'upcoming' ? live.status !== 'completed' : live.status === 'completed';
    return matchNiveau && matchTab;
  });

  return (
    <div>
      {/* Filters & Tabs */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveTab('upcoming')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === 'upcoming'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔴 À Venir & En Direct
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('replays')}
            className={`px-4 py-2 text-xs font-bold uppercase rounded-lg transition-all ${
              activeTab === 'replays'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            📼 Replays Archivés
          </button>
        </div>

        {/* Level filter */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold uppercase text-slate-400 shrink-0">Niveau :</span>
          <select
            value={selectedNiveau}
            onChange={(e) => setSelectedNiveau(e.target.value)}
            className="w-full sm:w-auto text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="all">Tous les niveaux</option>
            <option value="tronc-commun">Tronc Commun Sciences</option>
            <option value="1bac">1ère Année BAC</option>
            <option value="2bac">2ème Année BAC</option>
            <option value="concours">Concours Post-BAC</option>
          </select>
        </div>
      </div>

      {/* Grid of Lives */}
      {filteredLives.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100 p-8 shadow-sm">
          <div className="text-4xl mb-3">📅</div>
          <h3 className="text-lg font-bold text-slate-800">Aucune séance trouvée</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            Il n'y a pas de séance programmée pour ce niveau actuellement. Les nouvelles dates de cours en direct sont ajoutées chaque semaine.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLives.map((live) => {
            const dateObj = new Date(live.scheduled_at);
            const formattedDate = dateObj.toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            });
            const formattedTime = dateObj.toLocaleTimeString('fr-FR', {
              hour: '2-digit',
              minute: '2-digit',
            });

            const isLiveNow = live.status === 'live';

            return (
              <div
                key={live.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                      {live.niveau_label}
                    </span>
                    {isLiveNow ? (
                      <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-black uppercase animate-pulse">
                        <span className="w-2 h-2 rounded-full bg-red-600"></span>
                        En Direct
                      </span>
                    ) : live.status === 'completed' ? (
                      <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                        Replay disponible
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold">
                        À venir
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug mb-2">
                    {live.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4">
                    {live.description}
                  </p>

                  <div className="bg-slate-50 rounded-xl p-3 mb-4 space-y-1.5 text-xs text-slate-700">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📅</span>
                      <span className="font-semibold capitalize">{formattedDate} à {formattedTime}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">⏱️</span>
                      <span>Durée : <strong>{live.duration_minutes} minutes</strong></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">👨‍🏫</span>
                      <span>Animé par : <strong>{live.instructor_name}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="text-xs text-slate-500">
                    {live.resources_count ? `📎 ${live.resources_count} fiches PDF incluses` : 'Support de cours inclus'}
                  </div>

                  {live.status === 'completed' && live.replay_url ? (
                    <a
                      href={live.replay_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                    >
                      <span>Visionner le Replay</span>
                      <span>▶</span>
                    </a>
                  ) : session ? (
                    <a
                      href={live.meeting_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
                    >
                      <span>Rejoindre la séance</span>
                      <span>→</span>
                    </a>
                  ) : (
                    <Link
                      href="/tarifs"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm shadow-blue-600/30"
                    >
                      <span>Débloquer avec un Pack</span>
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
  );
}
