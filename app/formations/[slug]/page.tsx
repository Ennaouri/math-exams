import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/seo';
import { getFormationBySlug, getFormationResources, getFormations } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import WatermarkedDownloadButton from '@/app/components/WatermarkedDownloadButton';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) return buildPageMetadata({ title: "Formation Introuvable", path: `/formations/${slug}` });

  return buildPageMetadata({
    title: `${formation.title} | Maths-Exams`,
    description: formation.description,
    path: `/formations/${slug}`,
    image: formation.thumbnail,
  });
}

export default async function FormationDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const formation = await getFormationBySlug(slug);
  if (!formation) notFound();

  const resources = await getFormationResources(formation.id);
  const session = await auth();

  return (
    <div className="py-8">
      {/* Breadcrumbs */}
      <nav className="mb-6 text-xs text-slate-500 font-medium">
        <ol className="flex items-center gap-2">
          <li><Link href="/" className="hover:text-blue-600">Accueil</Link></li>
          <li>/</li>
          <li><Link href="/formations" className="hover:text-blue-600">Formations</Link></li>
          <li>/</li>
          <li className="text-slate-800 font-bold">{formation.title}</li>
        </ol>
      </nav>

      {/* Main hero */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm mb-10">
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="px-3 py-1 bg-blue-50 text-blue-700 font-bold text-xs uppercase tracking-wider rounded-lg">
            {formation.niveau_label}
          </span>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-bold text-xs uppercase tracking-wider rounded-lg">
            Programme Officiel
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 leading-tight mb-4">
          {formation.title}
        </h1>

        <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8 max-w-3xl">
          {formation.description}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl text-slate-800 text-xs">
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Volume Horaire</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{formation.total_hours} Heures</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Chapitres</div>
            <div className="text-base font-black text-slate-900 mt-0.5">{formation.total_chapters} Modules</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Supports Inclus</div>
            <div className="text-base font-black text-slate-900 mt-0.5">PDF + Séries + Vidéos</div>
          </div>
          <div>
            <div className="text-slate-400 font-bold uppercase text-[10px]">Enseignant</div>
            <div className="text-base font-black text-slate-900 mt-0.5 truncate">{formation.instructor_name}</div>
          </div>
        </div>
      </div>

      {/* Downloadable Resources List */}
      <section className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-black text-slate-900">
              Supports Pédagogiques & Fiches de Cours Téléchargeables
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Polycopiés, séries d'exercices d'application et devoirs avec solutions détaillées.
            </p>
          </div>

          <Link
            href="/tarifs"
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-blue-600/20 shrink-0"
          >
            S'abonner pour tout débloquer
          </Link>
        </div>

        <div className="space-y-3">
          {resources.map((res) => (
            <div
              key={res.id}
              className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-100 text-red-600 font-bold text-xs flex items-center justify-center shrink-0">
                  PDF
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{res.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      res.file_type === 'cours' ? 'bg-blue-100 text-blue-800' :
                      res.file_type === 'correction' ? 'bg-emerald-100 text-emerald-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {res.file_type}
                    </span>
                    <span className="text-[11px] text-slate-400">Document certifié</span>
                  </div>
                </div>
              </div>

              {session ? (
                <WatermarkedDownloadButton
                  pdfUrl={res.file_url}
                  fileName={res.title}
                  label="Télécharger 📥"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                />
              ) : (
                <Link
                  href="/tarifs"
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 shrink-0"
                >
                  <span>Verrouillé</span>
                  <span>🔒</span>
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
