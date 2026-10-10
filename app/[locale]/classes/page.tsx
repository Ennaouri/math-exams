import Image from "next/image";
import Link from "next/link";
import { getFormations } from "@/lib/db";
import { SITE_NAME } from "@/lib/seo";

export const revalidate = 3600;

export const metadata = {
  title: `Classes e-learning | Math-Exams`,
  description: "Explorez nos classes conçues par des enseignants expérimentés",
};

export default async function ClassesPage() {
  let formations: any[] = [];
  try {
    formations = await getFormations();
  } catch (e) {
    console.error(e);
  }

  // Fallback data if DB is empty or fails
  if (!formations || formations.length === 0) {
    formations = [
      {
        id: 1,
        title: "2ème année baccalauréat - Sciences Physiques",
        description: "L'année de la consécration. Cours approfondis, annales traitées et exercices niveau Bac pour...",
        niveau: "bac2",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        total_chapters: 5,
        total_hours: 45,
        slug: "bac-2-sciences-physiques"
      },
      {
        id: 2,
        title: "2ème année baccalauréat - Sciences Économiques",
        description: "L'ambition économique à son plus haut niveau. Économie, gestion et comptabilité avec cas...",
        niveau: "bac2",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        total_chapters: 6,
        total_hours: 37,
        slug: "bac-2-sciences-eco"
      },
      {
        id: 3,
        title: "1ère année collège",
        description: "Une nouvelle étape, une nouvelle méthode. Toutes les matières du programme marocain avec des cours...",
        niveau: "college1",
        thumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        total_chapters: 7,
        total_hours: 42,
        slug: "college-1"
      }
    ];
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20 font-sans">
      {/* Header / Filter Background */}
      <div className="bg-gradient-to-br from-[#fffdf5] via-[#f0f9ff] to-white pt-24 pb-32 px-4 border-b border-slate-100">
        <div className="w-full mx-auto text-center">
          <h1 className="text-4xl md:text-[44px] font-black text-[#1f2937] tracking-tight mb-4 leading-tight">
            Toutes les classes
          </h1>
          <p className="text-[17px] text-slate-500 font-medium tracking-wide">
            Explorez nos classes conçues par des enseignants expérimentés
          </p>
        </div>
      </div>

      <div className="w-full mx-auto px-4 -mt-20">
        {/* Filter Card */}
        <div className="bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 p-6 md:p-8 mb-10">
          {/* Top Row: Search */}
          <div className="flex flex-col md:flex-row gap-3 w-full mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="h-[18px] w-[18px] text-[#0073e6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
              </div>
              <input 
                type="text" 
                placeholder="Rechercher par titre..." 
                className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>
            <button className="bg-[#1f2937] hover:bg-[#111827] text-white font-bold py-3.5 px-8 rounded-xl text-xs tracking-wider transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
              RECHERCHER
            </button>
          </div>
          
          {/* Middle Row: Selects */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-[18px] h-[18px] text-[#0073e6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
              </div>
              <select className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                <option>Tous les niveaux</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-[18px] h-[18px] text-[#0073e6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
              </div>
              <select className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                <option>Toutes les filières</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg className="w-[18px] h-[18px] text-[#0073e6]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <select className="w-full pl-11 pr-10 py-3 bg-white border border-slate-200 rounded-xl text-[13px] font-semibold text-slate-700 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 cursor-pointer">
                <option>Tous les niveaux scolaires</option>
              </select>
              <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"/></svg>
              </div>
            </div>
          </div>
          
          {/* Divider */}
          <div className="h-px bg-slate-100 w-full mb-5"></div>
          
          {/* Bottom Row: Action */}
          <div className="flex justify-end">
            <button className="bg-[#8ecae6] hover:bg-[#6ebad9] text-white font-bold py-2.5 px-6 rounded-xl text-xs tracking-wider transition-colors flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/></svg>
              APPLIQUER LES FILTRES
            </button>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6 border-b border-slate-200 pb-3">
          <p className="text-[13px] text-slate-500 font-medium">
            Affichage de {formations.length} sur {formations.length} classes
          </p>
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {formations.map((formation) => {
            const isCollege = formation.niveau?.toLowerCase().includes('college') || formation.title?.toLowerCase().includes('collège');
            const levelType = isCollege ? 'COLLÈGE' : 'LYCÉE';
            
            return (
              <div key={formation.id} className="bg-white rounded-2xl border border-slate-100 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 overflow-hidden flex flex-col group">
                {/* Image */}
                <div className="relative h-48 bg-slate-100 w-full">
                  <Image 
                    src={formation.thumbnail || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"}
                    alt={formation.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1">
                  {/* Badges */}
                  <div className="flex gap-2 mb-3">
                    <span className="bg-[#e6f4f1] text-[#008f8e] text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      CLASSE
                    </span>
                    <span className="bg-slate-100 text-slate-500 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                      {levelType}
                    </span>
                  </div>

                  {/* Title & Desc */}
                  <h3 className="text-lg font-bold text-[#1f2937] leading-tight mb-2 line-clamp-1">
                    {formation.title}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2 flex-1 font-medium leading-relaxed">
                    {formation.description || "Un programme complet pour assurer votre réussite et renforcer vos acquis."}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 mt-4 mb-6 text-[13px] text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
                      {formation.total_chapters || 5}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      {formation.total_hours || 40}h {Math.floor(Math.random() * 59)}m
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-lg font-black text-[#111827]">1500.00 MAD</span>
                      <span className="text-[11px] text-slate-400 font-medium tracking-wide">/ année scolaire</span>
                    </div>
                    <Link href={`/formations/${formation.slug}`} className="text-[13px] font-semibold text-[#0073e6] hover:text-[#005bb5] transition-colors">
                      Voir les détails <span className="ml-0.5">→</span>
                    </Link>
                  </div>

                  {/* Action Button */}
                  <Link href={`/formations/${formation.slug}`} className="w-full bg-[#0073e6] hover:bg-[#005bb5] text-white font-bold py-3.5 px-4 rounded-xl text-xs tracking-wider transition-colors flex items-center justify-center">
                    VOIR LE PROGRAMME COMPLET <span className="ml-2">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
