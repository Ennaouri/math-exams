'use client';

import React, { useState, useEffect, useCallback, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────

const NIVEAUX = [
  { label: 'Tous les niveaux', value: '' },
  { label: 'Tronc Commun', value: 'tronc-commun-sciences' },
  { label: '1ère BAC', value: '1ere-annee-bac' },
  { label: '2ème BAC', value: '2eme-annee-bac' },
  { label: 'Concours Post-BAC', value: 'concours-post-bac' },
];

const TYPES = [
  { label: 'Tous les types', value: '' },
  { label: '📚 Cours', value: 'cours' },
  { label: '✏️ Exercices', value: 'exercices' },
  { label: '📝 Examens', value: 'examen' },
  { label: '📄 Devoirs', value: 'devoir' },
];

const SEMESTRES = [
  { label: 'Tous', value: '' },
  { label: 'Semestre 1', value: '1' },
  { label: 'Semestre 2', value: '2' },
];

const SORTS = [
  { label: '🕐 Plus récents', value: 'recent' },
  { label: '🔤 A → Z', value: 'name' },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface SearchResult {
  id: number;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  attribute?: string;
  semestre?: number;
  category_name?: string;
  category_slug?: string;
  under_category_name?: string;
}

// ─── ResultCard ───────────────────────────────────────────────────────────────

function ResultCard({ post }: { post: SearchResult }) {
  const typeColors: Record<string, string> = {
    cours: 'bg-blue-100 text-blue-800',
    exercices: 'bg-purple-100 text-purple-800',
    examen: 'bg-amber-100 text-amber-800',
    devoir: 'bg-emerald-100 text-emerald-800',
  };
  const typeColor = post.attribute ? (typeColors[post.attribute.toLowerCase()] || 'bg-slate-100 text-slate-700') : 'bg-slate-100 text-slate-700';

  const isImage = post.thumbnail?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <Link
      href={`/postdetails/${post.slug}`}
      className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      {isImage ? (
        <div className="aspect-video overflow-hidden bg-slate-100">
          <img
            src={post.thumbnail!}
            alt={post.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      ) : (
        <div className="aspect-video flex items-center justify-center bg-gradient-to-br from-slate-100 to-blue-50 text-4xl">
          {post.attribute?.toLowerCase() === 'cours' ? '📚'
            : post.attribute?.toLowerCase() === 'exercices' ? '✏️'
            : post.attribute?.toLowerCase() === 'examen' ? '📝'
            : '📄'}
        </div>
      )}

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          {post.attribute && (
            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${typeColor}`}>
              {post.attribute}
            </span>
          )}
          {post.semestre && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600">
              S{post.semestre}
            </span>
          )}
          {post.category_name && (
            <span className="text-[10px] text-slate-400 font-medium truncate">{post.category_name}</span>
          )}
        </div>

        <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition-colors line-clamp-2">
          {post.name}
        </h3>

        {post.description && (
          <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">{post.description}</p>
        )}

        <span className="text-xs font-bold text-blue-600 group-hover:gap-2 flex items-center gap-1 mt-auto transition-all">
          Consulter →
        </span>
      </div>
    </Link>
  );
}

// ─── Main Search Content ──────────────────────────────────────────────────────

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [niveau, setNiveau] = useState(searchParams?.get('niveau') || '');
  const [type, setType] = useState(searchParams?.get('type') || '');
  const [semestre, setSemestre] = useState(searchParams?.get('semestre') || '');
  const [sort, setSort] = useState(searchParams?.get('sort') || 'recent');
  const [page, setPage] = useState(Number(searchParams?.get('page') || 1));

  const [results, setResults] = useState<SearchResult[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const buildParams = useCallback((overrides: Record<string, any> = {}) => {
    const p: Record<string, string> = {};
    const q = overrides.query ?? query;
    const n = overrides.niveau ?? niveau;
    const t = overrides.type ?? type;
    const s = overrides.semestre ?? semestre;
    const so = overrides.sort ?? sort;
    const pg = overrides.page ?? page;
    if (q) p.q = q;
    if (n) p.niveau = n;
    if (t) p.type = t;
    if (s) p.semestre = s;
    if (so && so !== 'recent') p.sort = so;
    if (pg > 1) p.page = String(pg);
    return p;
  }, [query, niveau, type, semestre, sort, page]);

  const doSearch = useCallback(async (params: Record<string, string>) => {
    const hasFilter = params.q || params.niveau || params.type || params.semestre;
    if (!hasFilter) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`/api/search?${qs}`);
      const data = await res.json();
      setResults(data.results || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 0);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // On mount: run if URL already has params
  useEffect(() => {
    const params = buildParams({ page: 1 });
    if (Object.keys(params).length) doSearch(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = (overrides: Record<string, any> = {}) => {
    const newPage = overrides.page ?? 1;
    setPage(newPage);
    const params = buildParams({ ...overrides, page: newPage });
    router.push(`/search?${new URLSearchParams(params).toString()}`, { scroll: false });
    doSearch(params);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFilters({ query, page: 1 });
  };

  const handleFilterChange = (key: string, value: string) => {
    const setters: Record<string, (v: string) => void> = {
      niveau: setNiveau, type: setType, semestre: setSemestre, sort: setSort,
    };
    setters[key]?.(value);
    applyFilters({ [key]: value, page: 1 });
  };

  const hasActiveFilter = niveau || type || semestre || sort !== 'recent';

  return (
    <div className="py-6">
      {/* Hero search bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-7 sm:p-10 mb-8 shadow-xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-2 flex items-center gap-2">
          🔍 <span>Recherche Avancée</span>
        </h1>
        <p className="text-slate-300 text-sm mb-6">Trouvez rapidement cours, exercices, examens et devoirs corrigés.</p>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Mots-clés : dérivation, intégrale, probabilités…"
            className="flex-1 px-4 py-3 rounded-xl text-slate-900 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-md"
            autoFocus
          />
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-black text-sm rounded-xl shadow-md shadow-blue-900/30 transition-all flex items-center gap-2 shrink-0"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
            Chercher
          </button>
        </form>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-6 shadow-sm flex flex-wrap gap-3 items-center">
        <span className="text-xs font-black uppercase text-slate-400 tracking-wider shrink-0">Filtres :</span>

        {/* Niveau */}
        <select
          value={niveau}
          onChange={(e) => handleFilterChange('niveau', e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {NIVEAUX.map((n) => <option key={n.value} value={n.value}>{n.label}</option>)}
        </select>

        {/* Type */}
        <select
          value={type}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>

        {/* Semestre */}
        <select
          value={semestre}
          onChange={(e) => handleFilterChange('semestre', e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {SEMESTRES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => handleFilterChange('sort', e.target.value)}
          className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>

        {/* Reset */}
        {hasActiveFilter && (
          <button
            onClick={() => {
              setNiveau(''); setType(''); setSemestre(''); setSort('recent');
              applyFilters({ niveau: '', type: '', semestre: '', sort: 'recent', page: 1 });
            }}
            className="text-xs text-red-500 hover:text-red-700 font-bold flex items-center gap-1 ml-auto"
          >
            ✕ Réinitialiser
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-500">
          <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
          </svg>
          <span className="text-sm">Recherche en cours…</span>
        </div>
      ) : searched ? (
        results.length > 0 ? (
          <>
            <p className="text-xs text-slate-500 mb-4 font-medium">
              <span className="font-black text-slate-800">{total}</span> résultat{total > 1 ? 's' : ''} trouvé{total > 1 ? 's' : ''}
              {query && <> pour <span className="text-blue-600 font-bold">« {query} »</span></>}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((post) => <ResultCard key={post.id} post={post} />)}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => applyFilters({ page: page - 1 })}
                  disabled={page <= 1}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  ← Précédent
                </button>
                <span className="text-xs font-bold text-slate-500">
                  Page {page} / {totalPages}
                </span>
                <button
                  onClick={() => applyFilters({ page: page + 1 })}
                  disabled={page >= totalPages}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  Suivant →
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <span className="text-5xl">🔍</span>
            <p className="text-lg font-black text-slate-700">Aucun résultat trouvé</p>
            <p className="text-sm text-slate-400 max-w-xs">
              Essayez avec des mots-clés différents ou réinitialisez les filtres.
            </p>
          </div>
        )
      ) : (
        /* Empty state — no search yet */
        <div className="py-10">
          <p className="text-center text-sm font-semibold text-slate-500 mb-6">Ou parcourez par niveau :</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {NIVEAUX.filter((n) => n.value).map((n) => (
              <button
                key={n.value}
                onClick={() => handleFilterChange('niveau', n.value)}
                className="p-4 rounded-2xl border-2 border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-sm font-bold text-slate-700 hover:text-blue-700 transition-all text-center"
              >
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <svg className="animate-spin h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
        </svg>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}