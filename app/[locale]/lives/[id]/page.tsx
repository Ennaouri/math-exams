import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES } from '@/lib/live-services';
import Image from 'next/image';
import { auth } from '@/lib/auth';
import { Link } from '@/i18n/routing';

export async function generateMetadata({ params }: { params: Promise<{ locale: string; id: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const service = SERVICES.find(s => s.id === parseInt(resolvedParams.id));
  if (!service) return { title: 'Séance Introuvable | Maths-Exams' };
  return {
    title: `Réserver : ${service.title} | Maths-Exams`,
    description: service.description,
  };
}

export default async function LiveServiceDetailsPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const resolvedParams = await params;
  const { locale, id } = resolvedParams;
  const isEn = locale === 'en';

  const service = SERVICES.find(s => s.id === parseInt(id));
  const session = await auth();
  if (!service) {
    notFound();
  }

  const checkoutUrl = session ? `/checkout/${service.id}` : `/login?callbackUrl=/checkout/${service.id}`;

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      
      {/* Dark Header Banner */}
      <div className="bg-[#1f2937] text-white pt-8 pb-16 px-4 md:px-8">
        <div className="max-w-screen-xl mx-auto">
          
          {/* Breadcrumb */}
          <div className="text-xs text-slate-400 font-medium mb-6 flex items-center gap-2">
            <Link href="/" className="hover:text-white transition-colors">
              {isEn ? 'Home' : 'Accueil'}
            </Link>
            <span className="text-slate-500">&gt;</span>
            <Link href="/lives" className="hover:text-white transition-colors">
              {isEn ? 'Tutoring Sessions' : 'Séances de Soutien'}
            </Link>
            <span className="text-slate-500">&gt;</span>
            <span className="text-slate-200">{service.niveau}</span>
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
                <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-sm uppercase">
                  {isEn ? '2h Session' : 'Séance 2h'}
                </div>
              </div>
              
              {/* Modality feature card */}
              <div className="bg-[#374151] rounded-2xl p-4 mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-400 font-bold">
                  <span>📍</span>
                  <span>{isEn ? 'Available in 2 formats:' : 'Disponible en 2 modalités :'}</span>
                </div>
                <div className="text-slate-300 space-y-1">
                  <p>• <strong>En ligne :</strong> Partout au Maroc via Google Meet / Zoom.</p>
                  <p>• <strong>En présentiel :</strong> Disponible à <strong>Rabat</strong>, <strong>Témara</strong> et <strong>Salé</strong>.</p>
                </div>
              </div>
            </div>

            {/* Right: Title & Badges */}
            <div className="w-full lg:w-3/5">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="bg-blue-500/20 text-blue-300 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-blue-500/30">
                  {service.niveau}
                </span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border border-emerald-500/30">
                  En ligne & Présentiel
                </span>
              </div>
              
              <h1 className="text-2xl md:text-4xl font-black text-white leading-tight mb-4 tracking-tight">
                {service.title}
              </h1>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {service.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-slate-300 text-xs font-medium">
                <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/50">
                  <span>👨‍🏫</span>
                  <span>Professeur : {service.teacher}</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/50">
                  <span>⏱️</span>
                  <span>Durée : 2 heures</span>
                </div>
                <div className="flex items-center gap-2 bg-slate-800/60 px-3.5 py-2 rounded-xl border border-slate-700/50">
                  <span>💰</span>
                  <span className="text-emerald-400 font-bold">200 DH / séance</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Content & Reservation Card */}
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 -mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Details */}
          <div className="w-full lg:w-2/3 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <div>
                <h2 className="text-lg font-black text-slate-900 mb-2">
                  {isEn ? 'What is included in this session?' : 'Que comprend cette séance de soutien ?'}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Cette séance est entièrement adaptée au niveau et aux difficultés de l'élève. Elle permet d'approfondir les notions clés, de combler les lacunes et de s'entraîner sur des exercices types d'examen.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Remise à niveau personnalisée</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Diagnostic immédiat des incompréhensions et explication claire des définitions et théorèmes.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Exercices types & Méthodologie</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Entraînement guidé sur les exercices récurrents des devoirs surveillés et de l'examen national.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Format au choix</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    En ligne via visioconférence interactive ou en présentiel à Rabat, Témara ou Salé.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1">
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <span className="text-blue-600">✓</span>
                    <span>Suivi sur WhatsApp</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Coordination directe avec le professeur pour fixer le jour et l'heure qui vous conviennent.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Box */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-xl shadow-blue-900/5 sticky top-24 space-y-6">
              <div>
                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-black uppercase rounded-full tracking-wider">
                  Tarif Séance Individuelle
                </span>
                <div className="flex items-baseline gap-1 mt-3">
                  <span className="text-3xl font-black text-slate-900">{service.price}</span>
                  <span className="text-sm font-bold text-slate-700">DH</span>
                  <span className="text-xs text-slate-400 ml-1">/ 2 heures</span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Paiement sécurisé par virement CIH ou PayPal
                </p>
              </div>

              <div className="space-y-2 text-xs text-slate-700 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Séance de 2 heures avec M. Ennaouri</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>En ligne ou Présentiel (Rabat/Témara/Salé)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>Choix du créneau horaire</span>
                </div>
              </div>

              <Link
                href={checkoutUrl}
                className="w-full py-4 bg-[#0084c7] hover:bg-[#006ba1] text-white rounded-2xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all"
              >
                <span>{isEn ? 'Book & Pick Modality' : 'Réserver & Choisir le format'}</span>
                <span className="text-base leading-none">→</span>
              </Link>

              <div className="text-center text-[11px] text-slate-400">
                Besoin d'un renseignement d'abord ?{' '}
                <a
                  href="https://wa.me/212710500405"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 font-bold hover:underline"
                >
                  Contactez-nous sur WhatsApp
                </a>
              </div>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
