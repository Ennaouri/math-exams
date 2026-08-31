'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Suggestion {
  name: string;
  slug: string;
  category_name: string;
  category_slug: string;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const fetchSuggestions = useCallback((q: string) => {
    if (q.length < 2) { setSuggestions([]); setOpen(false); return; }
    setLoading(true);
    fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`)
      .then((r) => r.json())
      .then((data) => { setSuggestions(data); setOpen(data.length > 0); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 260);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      setOpen(false);
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const highlight = (text: string) => {
    if (!query) return <>{text}</>;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return (
      <>
        {parts.map((part, i) =>
          regex.test(part)
            ? <mark key={i} className="bg-blue-200 text-blue-900 rounded px-0.5 not-italic">{part}</mark>
            : part
        )}
      </>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-sm">
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            {loading ? (
              <svg className="animate-spin h-3.5 w-3.5 text-slate-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
              </svg>
            )}
          </div>
          <input
            type="search"
            value={query}
            onChange={handleChange}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Rechercher un cours, exercice…"
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
        >
          OK
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <div className="absolute top-full mt-1.5 left-0 right-0 z-50 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
          <ul>
            {suggestions.map((s, i) => (
              <li key={i}>
                <Link
                  href={`/postdetails/${s.slug}`}
                  onClick={() => { setOpen(false); setQuery(''); }}
                  className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 transition-colors group"
                >
                  <svg className="h-3.5 w-3.5 text-slate-500 shrink-0 group-hover:text-blue-400 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6M9 16h6M9 8h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v2"/>
                  </svg>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-100 truncate">{highlight(s.name)}</p>
                    {s.category_name && (
                      <p className="text-[10px] text-slate-400 truncate">{s.category_name}</p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
            <li className="border-t border-slate-700">
              <button
                onClick={() => { setOpen(false); router.push(`/search?q=${encodeURIComponent(query.trim())}`); }}
                className="w-full text-left px-4 py-2.5 text-xs text-blue-400 hover:bg-slate-700 transition-colors font-semibold flex items-center gap-2"
              >
                <svg className="h-3 w-3 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
                </svg>
                Voir tous les résultats pour « {query} »
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
