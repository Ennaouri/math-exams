import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import Image from 'next/image';
import { SERVICES } from '@/lib/live-services';
import { createTranslator } from 'next-intl';
import { Link } from '@/i18n/routing';

export const metadata: Metadata = buildPageMetadata({
  title: 'Réserver une Séance de Soutien en Mathématiques | Maths-Exams',
  description:
    'Réservez votre séance de soutien de 2 heures en mathématiques avec Mohammed Ennaouri. En ligne partout au Maroc ou en présentiel à Rabat, Témara et Salé.',
  path: '/lives',
});

export default async function LivesPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  const isEn = locale === 'en';

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-b border-slate-200/80 pt-16 pb-12 px-4 mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black uppercase tracking-wider mb-4 border border-blue-100">
          <span>📍</span>
          <span>{isEn ? 'Online or In-Person (Rabat • Témara • Salé)' : 'En ligne ou En Présentiel (Rabat • Témara • Salé)'}</span>
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
          {isEn ? 'Book a Math Tutoring Session' : 'Réserver une Séance de Soutien en Mathématiques'}
        </h1>
        <p className="text-sm md:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isEn
            ? 'Individual or small-group 2-hour tutoring sessions with Mr. Mohammed Ennaouri. Choose remote video sessions or in-person sessions in Rabat, Témara, and Salé.'
            : 'Séances intensives de 2 heures avec le professeur Mohammed Ennaouri. Remise à niveau, résolution d\'exercices types et préparation aux contrôles et examens.'}
        </p>

        {/* Modality feature pills */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <span>💻</span>
            <span>{isEn ? 'Remote Online (Google Meet / Zoom)' : 'À distance en ligne (Meet / Zoom)'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <span>🏫</span>
            <span>{isEn ? 'In-Person (Rabat, Témara, Salé)' : 'En présentiel (Rabat, Témara, Salé)'}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-xs">
            <span>⏱️</span>
            <span>{isEn ? '2 Hours per session' : '2 heures complètes'}</span>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
            {isEn ? `${SERVICES.length} Levels Available` : `${SERVICES.length} Niveaux Disponibles`}
          </p>
          <span className="text-xs font-medium text-slate-500">
            {isEn ? 'Tarif : 200 DH / session' : 'Tarif : 200 DH / séance'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between h-full group"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                  <Image 
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-md uppercase tracking-wider">
                    {isEn ? '2h Session' : 'Séance 2h'}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2.5 py-1 rounded-md">
                    Prof. {service.teacher}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  {/* Niveau Badge */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      {service.niveau}
                    </span>
                  </div>

                  <h3 className="text-base font-black text-slate-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed mb-4 line-clamp-3">
                    {service.description}
                  </p>

                  {/* Formats info */}
                  <div className="space-y-1.5 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{isEn ? 'Online: Google Meet / Zoom' : 'En ligne : Visioconférence partagée'}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{isEn ? 'In-person: Rabat • Témara • Salé' : 'Présentiel : Rabat • Témara • Salé'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & CTA */}
              <div className="p-6 pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 mb-4">
                  <div className="text-xs text-slate-400 font-medium">
                    {isEn ? 'Price' : 'Tarif séance'}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-slate-900">{service.price}</span>
                    <span className="text-xs font-bold text-slate-500 ml-1">DH</span>
                  </div>
                </div>

                <Link
                  href={`/lives/${service.id}`}
                  className="w-full bg-[#0084c7] hover:bg-[#006ba1] text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 transition-all uppercase tracking-wider"
                >
                  <span>{isEn ? 'Book This Session' : 'Réserver cette séance'}</span>
                  <span className="text-base leading-none">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
