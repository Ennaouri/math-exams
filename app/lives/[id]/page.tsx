import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES } from '@/lib/live-services';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = SERVICES.find(s => s.id === parseInt(resolvedParams.id));
  if (!service) return { title: 'Non trouvé | Maths-Exams' };
  return {
    title: `${service.title} | Maths-Exams`,
    description: service.description,
  };
}

export default async function LiveServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const service = SERVICES.find(s => s.id === parseInt(resolvedParams.id));
  const session = await auth();
  if (!service) {
    notFound();
  }

  const checkoutUrl = session ? `/checkout/${service.id}` : `/login?callbackUrl=/checkout/${service.id}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Dark Header Banner */}
      <div className="bg-[#1f2937] text-white pt-8 pb-20 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 font-medium mb-8 flex items-center gap-2">
            <span>Accueil</span>
            <span className="text-slate-500">&gt;</span>
            <span>Live</span>
            <span className="text-slate-500">&gt;</span>
            <span className="text-slate-200">{service.category}</span>
          </div>

          <div className="flex flex-col lg:flex-row gap-10 items-start">
            
            {/* Left: Thumbnail */}
            <div className="w-full lg:w-2/5 shrink-0">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-700/50">
                <Image 
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded shadow-sm">
                  LIVE
                </div>
              </div>
              
              {/* Thumbnail Caption */}
              <div className="bg-[#374151] rounded-xl p-4 mt-4 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm mb-1">Une vraie classe, en direct</h4>
                  <p className="text-xs text-slate-300">Posez vos questions et progressez avec votre enseignant</p>
                </div>
              </div>
            </div>

            {/* Right: Title & Badges */}
            <div className="w-full lg:w-3/5">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-yellow-500/20 text-yellow-400 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-yellow-500/30 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>
                  LIVE
                </span>
                <span className="text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-slate-600 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z" /></svg>
                  {service.niveau}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                {service.title}
              </h1>

              <div className="flex items-center gap-6 text-slate-300 text-sm font-medium">
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <span>{service.students} apprenants</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
                  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{service.sessions} sessions (2h)</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 -mt-8 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* About Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                À PROPOS
              </div>
              <h2 className="text-xl font-black text-slate-900 mb-4">Présentation détaillée</h2>
              <p className="text-slate-600 leading-relaxed text-sm">
                {service.description}
                <br /><br />
                Rejoignez nos séances interactives pour poser vos questions en temps réel. Chaque séance est enregistrée, vous permettant d'y accéder en rediffusion à tout moment pour réviser à votre propre rythme.
              </p>
            </div>

            {/* Planning Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    PLANNING
                  </div>
                  <h2 className="text-xl font-black text-slate-900">Agenda des sessions</h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold">
                  <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> 1 à venir</span>
                  <span className="bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full border border-slate-200">2 au total</span>
                </div>
              </div>

              {/* Info alert */}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex items-start gap-3 mb-8">
                <svg className="w-5 h-5 text-orange-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-xs text-orange-800 leading-relaxed">
                  Ce planning est fourni à titre indicatif. Les sessions ne se rejoignent pas depuis cette page : une fois inscrit, elles s'ouvrent dans votre espace élève, avec les rediffusions.
                </p>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 pb-2">CE MOIS-CI</h3>
                
                {/* Session 1 (Completed) */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-14 bg-slate-50 border border-slate-200 rounded-lg flex flex-col items-center justify-center">
                      <span className="text-lg font-black text-slate-400">2</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase">OCT.</span>
                    </div>
                  </div>
                  <div className="pt-1 flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 mb-1">
                          <span>Mercredi</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                          <span>19:00 - 21:00</span>
                          <span className="text-slate-400 font-normal">(2h00)</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-600">{service.title}</p>
                      </div>
                      <span className="bg-slate-100 text-slate-500 text-[10px] font-bold uppercase px-2.5 py-1 rounded">Terminée</span>
                    </div>
                  </div>
                </div>

                {/* Session 2 (Upcoming) */}
                <div className="flex gap-4">
                  <div className="flex flex-col items-center shrink-0">
                    <div className="w-12 h-14 bg-blue-50 border border-blue-200 rounded-lg flex flex-col items-center justify-center text-blue-600 shadow-sm">
                      <span className="text-lg font-black">9</span>
                      <span className="text-[9px] font-bold uppercase">OCT.</span>
                    </div>
                  </div>
                  <div className="pt-1 flex-grow">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-1">
                          <span>Mercredi</span>
                          <span className="w-1 h-1 rounded-full bg-blue-300"></span>
                          <span>19:00 - 21:00</span>
                          <span className="text-blue-400 font-normal">(2h00)</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-800">{service.title}</p>
                      </div>
                      <span className="bg-blue-100 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm">Planifiée</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Pricing Card */}
            <div className="bg-white rounded-2xl border border-blue-100 shadow-lg shadow-blue-900/5 p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#0084c7] to-blue-400"></div>
              
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">ACCÈS</div>
              <div className="flex items-end gap-1 mb-6">
                <span className="text-4xl font-black text-slate-900 leading-none">{service.price}</span>
                <span className="text-sm font-bold text-slate-500 mb-1">MAD</span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">OFFRE DISPONIBLE</div>
                
                <div className="border-2 border-blue-500 bg-blue-50 rounded-xl p-3 cursor-pointer relative">
                  <div className="absolute -top-2.5 -right-2.5">
                    <svg className="w-6 h-6 text-blue-500 bg-white rounded-full" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="text-[10px] font-bold text-blue-800 uppercase mb-0.5">1 MOIS</div>
                  <div className="text-sm font-black text-slate-900">{service.price} MAD</div>
                </div>
              </div>

              <Link href={checkoutUrl} className="w-full bg-[#0084c7] hover:bg-[#006ba1] text-white text-sm font-bold py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 mb-6">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                S'INSCRIRE POUR ACCÉDER
              </Link>

              <ul className="space-y-3 text-xs text-slate-600 font-medium mb-6">
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span>2 sessions en direct avec un enseignant</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span>Questions et échanges en temps réel</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                  <span>Rediffusion des sessions</span>
                </li>
              </ul>

              <div className="bg-slate-50 rounded-xl p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800 mb-0.5">Tout est réuni dans votre espace</p>
                  <p className="text-[10px] text-slate-500 leading-relaxed">Accédez au direct, au planning et aux rediffusions depuis votre tableau de bord.</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex flex-col items-center">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7z" /></svg>
                  PAIEMENT 100% SÉCURISÉ
                </div>
                {/* Simplified payment icons row */}
                <div className="flex items-center gap-1 opacity-60">
                  <div className="w-8 h-5 bg-slate-200 rounded text-[8px] font-bold flex items-center justify-center text-slate-500">VISA</div>
                  <div className="w-8 h-5 bg-slate-200 rounded text-[8px] font-bold flex items-center justify-center text-slate-500">MC</div>
                  <div className="w-8 h-5 bg-slate-200 rounded text-[8px] font-bold flex items-center justify-center text-slate-500">CMI</div>
                </div>
              </div>
            </div>

            {/* Teacher Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                Enseignant
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center text-white font-black text-xl shrink-0 shadow-sm">
                  {service.teacher.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">{service.teacher}</p>
                  <p className="text-xs text-slate-500">Professeur certifié</p>
                </div>
              </div>
            </div>

            {/* Level Info */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
              <p className="text-xs text-slate-500 mb-2">Niveau scolaire</p>
              <span className="bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200">
                {service.category}
              </span>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
