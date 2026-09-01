import SearchBar from "./SearchBar";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative bg-[#0f172a] text-white border-b border-slate-800">
      <div className="relative max-w-screen-xl mx-auto px-4 py-12 sm:py-16 text-center">
        {/* Top Moroccan Curriculum Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-900/60 border border-blue-500/30 text-blue-200 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
          <span>Programme Officiel Marocain • Lycée & Concours</span>
        </div>

        {/* High-Contrast Clear Main Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-4 tracking-tight leading-tight max-w-4xl mx-auto">
          Réussir les Mathématiques au Lycée & Préparer l'Examen <span className="text-amber-400">National</span>
        </h1>

        {/* High-Contrast Crisp Subtitle */}
        <p className="text-base sm:text-lg text-slate-200 mb-8 max-w-2xl mx-auto leading-relaxed">
          Cours structurés, séances en direct (Lives), exercices d'application et annales d'examens corrigées pas à pas.
        </p>

        {/* Search bar */}
        <div className="max-w-xl mx-auto mb-8">
          <SearchBar />
        </div>

        {/* Clear Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {/*
          <Link
            href="/lives"
            className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <span>🔴 Séances en Direct (Lives)</span>
          </Link>

          <Link
            href="/tarifs"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <span>✨ Packs d'Abonnement</span>
          </Link>
          */}

          <Link
            href="/#niveaux"
            className="inline-flex items-center justify-center px-6 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            <span>Explorer par Niveau</span>
          </Link>
        </div>

        {/* Key Information Badges */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-wrap justify-center items-center gap-6 sm:gap-12 text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-black text-sm">✓</span>
            <span>+500 Examens Corrigés</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-black text-sm">✓</span>
            <span>100% Conforme au Cadre de Référence</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-black text-sm">✓</span>
            <span>Replays Vidéo & Téléchargement PDF</span>
          </div>
        </div>
      </div>
    </header>
  );
}
