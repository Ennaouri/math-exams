import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import Image from 'next/image';

export const metadata: Metadata = buildPageMetadata({
  title: 'Séances Live | Maths-Exams',
  description:
    'Participez aux séances de cours en direct de mathématiques, posez vos questions en direct au professeur et préparez-vous efficacement.',
  path: '/lives',
});

import { SERVICES } from '@/lib/live-services';

export default function LivesPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      
      {/* Simple Header */}
      <div className="bg-white border-b border-slate-100 pt-16 pb-12 px-4 mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-black text-[#1f2937] tracking-tight mb-3">
          Séances Live
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
          Participez à nos cours interactifs en direct. Choisissez votre niveau et réservez votre place pour une séance de 2 heures avec notre professeur spécialisé.
        </p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4">
        <p className="text-xs text-slate-500 mb-6 font-medium">Affichage de {SERVICES.length} sur {SERVICES.length} séances live</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:shadow-lg transition-all flex flex-col h-full">
              
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] w-full bg-slate-100">
                <Image 
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm">
                  LIVE
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-grow">
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-yellow-50 text-yellow-700 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-yellow-200/50">
                    MATIÈRE EN DIRECT
                  </span>
                  <span className="bg-slate-50 text-slate-500 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-slate-200">
                    {service.category}
                  </span>
                </div>
                
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 block">
                  {service.niveau}
                </span>

                <h3 className="text-base font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                  {service.title}
                </h3>

                <p className="text-xs text-slate-500 leading-relaxed mb-6 line-clamp-3">
                  {service.description}
                </p>

                {/* Stats */}
                <div className="flex items-center gap-4 text-slate-500 text-xs font-medium mb-auto">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <span>{service.students}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>1 séance (2h)</span>
                  </div>
                </div>

                {/* Footer (Price & Button) */}
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-[10px] text-slate-400 font-medium pb-0.5">Pour</span>
                    <span className="text-lg font-black text-slate-900 leading-none">{service.price}</span>
                    <span className="text-[10px] text-slate-400 font-medium pb-0.5">{service.priceSuffix}</span>
                  </div>
                  
                  <a href={`/lives/${service.id}`} className="w-full bg-[#0084c7] hover:bg-[#006ba1] text-white text-xs font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                    VOIR LA MATIÈRE
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
