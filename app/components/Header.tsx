import SearchBar from "./SearchBar";
import Link from "next/link";

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white border-b border-blue-900/30">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 opacity-10" aria-hidden="true">
        <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" aria-hidden="true"></div>

      <div className="relative max-w-screen-xl mx-auto px-4 py-16 sm:py-20 text-center">
        {/* Top Live Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/20 text-blue-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Plateforme Pédagogique d'Excellence • Programme Marocain
        </div>

        {/* Hero Title */}
        <p className="text-3xl sm:text-5xl lg:text-6xl font-black text-white mb-4 tracking-tight leading-tight">
          Maîtrisez les Mathématiques du Lycée & Préparez le <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">National</span>
        </p>

        {/* Subtitle */}
        <p className="text-sm sm:text-lg text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed font-normal">
          Cours complets, séances interactives en direct (Lives), banques d'exercices corrigés pas à pas et accompagnement personnalisé pour le Tronc Commun, la 1ère BAC et la 2ème BAC.
        </p>

        {/* Search bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar />
        </div>

        {/* Call to actions */}
        <div className="flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/lives"
            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all"
          >
            <span>🔴 Voir les Séances en Direct</span>
          </Link>

          <Link
            href="/tarifs"
            className="inline-flex items-center justify-center px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-400/20 transition-all"
          >
            <span>✨ Packs d'Abonnement</span>
          </Link>

          <Link
            href="/#niveaux"
            className="inline-flex items-center justify-center px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl border border-slate-700 backdrop-blur-sm transition-all"
          >
            <span>Explorer par Niveau</span>
          </Link>
        </div>

        {/* Stats and Highlights */}
        <div className="mt-12 pt-8 border-t border-slate-800/60 flex flex-wrap justify-center items-center gap-8 sm:gap-14 text-xs font-semibold text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-blue-400 font-bold text-base">500+</span>
            <span>Examens & Devoirs Corrigés</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-emerald-400 font-bold text-base">100%</span>
            <span>Conforme Programme Marocain</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber-400 font-bold text-base">24/7</span>
            <span>Replays Vidéo & Téléchargement PDF</span>
          </div>
        </div>
      </div>
    </header>
  );
}
