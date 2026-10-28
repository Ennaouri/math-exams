'use client';

import React from 'react';
import { UserSubscription, Category, UserProgressStats } from '@/lib/types';
import { SERVICES } from '@/lib/live-services';
import Link from 'next/link';
import ProgressSection from './ProgressSection';
import AITutor from './AITutor';

interface StudentDashboardProps {
  user: any;
  subscription: UserSubscription | null;
  categories: Category[];
  progressStats: UserProgressStats;
}

export default function StudentDashboard({
  user,
  subscription,
  categories,
  progressStats,
}: StudentDashboardProps) {
  return (
    <div className="space-y-10">
      {/* ─── 1. Primary Action Paths (Cours vs Réservation) ─────────────── */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-black text-slate-900">
            Que souhaitez-vous faire aujourd'hui ?
          </h2>
          <p className="text-xs text-slate-500">
            Consultez les cours et exercices en accès libre ou réservez une séance de soutien personnalisée.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Consulter les Cours */}
          <a
            href="#cours-et-exercices"
            className="group relative bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all border border-blue-500 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl mb-4 shadow-sm">
                📚
              </div>
              <span className="px-3 py-1 bg-white/20 rounded-full text-[11px] font-black uppercase tracking-wider inline-block mb-3">
                Accès Immédiat & Gratuit
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-2 group-hover:translate-x-0.5 transition-transform">
                Consulter les Cours & Exercices
              </h3>
              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed mb-6">
                Accédez à tous les résumés de cours, devoirs surveillés, exercices corrigés et annales d'examens nationaux classés par niveau scolaire.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-white text-blue-700 px-5 py-3 rounded-xl shadow-md w-fit group-hover:bg-blue-50 transition-colors">
              <span>Voir les cours par niveau</span>
              <span className="text-base leading-none">↓</span>
            </div>
          </a>

          {/* Card 2: Réservation d'une Séance */}
          <Link
            href="/lives"
            className="group relative bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all border border-slate-700 flex flex-col justify-between overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl mb-4 shadow-sm">
                📅
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[11px] font-black uppercase tracking-wider inline-block mb-3 border border-emerald-500/30">
                En ligne & Présentiel (Rabat • Témara • Salé)
              </span>
              <h3 className="text-xl sm:text-2xl font-black mb-2 group-hover:translate-x-0.5 transition-transform">
                Réserver une Séance de Soutien
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
                Séance de 2 heures avec M. Mohammed Ennaouri. Choisissez votre format : en ligne (à distance) ou en présentiel à Rabat, Témara et Salé.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-[#0084c7] hover:bg-[#006ba1] text-white px-5 py-3 rounded-xl shadow-md w-fit transition-colors">
              <span>Réserver une séance (200 DH)</span>
              <span className="text-base leading-none">→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* ─── 2. Les Cours & Niveaux Scolaires (Grille Complète) ──────────── */}
      <div id="cours-et-exercices" className="pt-2 scroll-mt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span>
              <span>Cours & Exercices par Niveau Scolaire</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Sélectionnez votre filière pour accéder aux chapitres, cours détaillés et séries d'exercices.
            </p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Voir toute la bibliothèque</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((category) => {
            const isUserLevel = user?.niveau && category.slug.toLowerCase().includes(user.niveau.toLowerCase());

            return (
              <Link
                key={category.id}
                href={`/category/${category.slug}`}
                className={`group bg-white rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between ${
                  isUserLevel
                    ? 'border-blue-500 ring-2 ring-blue-500/20'
                    : 'border-slate-200/80 hover:border-blue-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 font-bold text-xs flex items-center justify-center">
                      #{category.id}
                    </span>
                    {isUserLevel && (
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-black rounded-full uppercase">
                        ⭐ Votre Filière
                      </span>
                    )}
                  </div>

                  <h3 className="font-black text-slate-900 text-base leading-snug group-hover:text-blue-600 transition-colors mb-2">
                    {category.name}
                  </h3>

                  {category.description && (
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                      {category.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:translate-x-0.5 transition-transform">
                  <span>Accéder aux chapitres</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ─── 3. Séances de Soutien Disponibles par Niveau ─────────────────── */}
      <div className="pt-2">
        <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📅</span>
              <span>Réserver une Séance de Soutien (En ligne ou Présentiel)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Séances de 2 heures personnalisées animées par M. Mohammed Ennaouri. Présentiel à Rabat, Témara et Salé.
            </p>
          </div>
          <Link
            href="/lives"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
          >
            <span>Voir tous les niveaux</span>
            <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SERVICES.slice(0, 3).map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                    {service.niveau}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    200 DH / 2h
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-sm leading-snug">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {service.description}
                </p>

                <div className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <p>💻 En ligne : Visioconférence</p>
                  <p>🏫 Présentiel : Rabat, Témara, Salé</p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-500">
                  Prof. {service.teacher}
                </span>

                <Link
                  href={`/lives/${service.id}`}
                  className="px-4 py-2 bg-[#0084c7] hover:bg-[#006ba1] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm"
                >
                  <span>Réserver</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── 4. Support & Prise de Rendez-vous WhatsApp ──────────────────── */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 sm:p-8 border border-emerald-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💬</span>
            <h3 className="text-base font-black text-emerald-950">
              Besoin d'un horaire particulier ou d'un renseignement ?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-emerald-800">
            Contactez directement l'enseignant Mohammed Ennaouri sur WhatsApp pour convenir d'une séance ou poser vos questions.
          </p>
        </div>

        <a
          href="https://wa.me/212710500405?text=Bonjour%20M.%20Ennaouri%2C%20je%20souhaite%20me%20renseigner%20sur%20les%20s%C3%A9ances%20de%20soutien..."
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md shadow-emerald-600/20 transition-all inline-flex items-center gap-2"
        >
          <span>Écrire sur WhatsApp</span>
          <span>→</span>
        </a>
      </div>

      {/* ─── 5. Progression & AI Tutor ───────────────────────────────────── */}
      <ProgressSection stats={progressStats} />

      <AITutor progressStats={progressStats} niveau={user?.niveau} />
    </div>
  );
}
