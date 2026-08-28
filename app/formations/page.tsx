import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { getFormations } from '@/lib/db';
import Link from 'next/link';
import Image from 'next/image';

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  title: 'Formations Complètes de Mathématiques | Maths-Exams',
  description:
    'Programmes structurés de mathématiques pour le lycée marocain : Tronc Commun, 1ère BAC et 2ème BAC. Cours vidéo, polycopiés PDF et banques d\'exercices corrigés.',
  path: '/formations',
});

export default async function FormationsPage() {
  const formations = await getFormations();

  return (
    <div className="py-8">
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4">
          📚 Programmes Pédagogiques Structurés
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
          Formations Complètes par Filière
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
          Chaque formation couvre 100% des chapitres officiels du programme marocain avec des cours détaillés, des vidéos explicatives et des séries d'exercices corrigés téléchargeables en PDF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {formations.map((formation) => (
          <div
            key={formation.id}
            className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative w-full h-52 bg-slate-900 overflow-hidden">
                {formation.thumbnail ? (
                  <Image
                    src={formation.thumbnail}
                    alt={formation.title}
                    fill
                    className="object-cover opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-500"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-700 to-indigo-900 flex items-center justify-center text-white text-4xl font-bold">
                    ∑ Maths
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md">
                    {formation.niveau_label}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-slate-950/80 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-xs font-semibold flex items-center gap-2">
                  <span>⏱️ {formation.total_hours}h de cours</span>
                  <span>•</span>
                  <span>📖 {formation.total_chapters} chapitres</span>
                </div>
              </div>

              <div className="p-6 sm:p-8">
                <h2 className="text-xl font-black text-slate-900 leading-tight mb-3">
                  {formation.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {formation.description}
                </p>

                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-6 text-xs text-slate-700">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                    P
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Enseignant référent</div>
                    <div className="font-bold text-slate-900">{formation.instructor_name}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-6 sm:pb-8 pt-0 flex gap-3">
              <Link
                href={`/formations/${formation.slug}`}
                className="flex-1 text-center py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/20 transition-all"
              >
                Voir le Programme & Supports
              </Link>
              <Link
                href="/tarifs"
                className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Tarifs
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
