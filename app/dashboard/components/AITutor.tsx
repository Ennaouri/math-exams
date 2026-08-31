'use client';

import { useState, useEffect } from 'react';
import { UserProgressStats } from '@/lib/types';

interface AITutorProps {
  progressStats: UserProgressStats;
  niveau?: string;
}

interface AIResponse {
  message: string;
  suggestions: string[];
}

export default function AITutor({ progressStats, niveau }: AITutorProps) {
  const [data, setData] = useState<AIResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchSuggestions = async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ progressStats, niveau }),
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 border border-indigo-100 dark:border-indigo-800 shadow-sm relative overflow-hidden">
      {/* Decorative AI Icon */}
      <div className="absolute -right-4 -top-4 opacity-10">
        <svg className="w-32 h-32 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
        <div className="flex-shrink-0 bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-sm border border-indigo-100 dark:border-indigo-900">
          <div className="text-3xl">✨</div>
        </div>
        
        <div className="flex-grow w-full">
          <h3 className="text-lg font-black text-indigo-900 dark:text-indigo-300 mb-1 flex items-center gap-2">
            Coach IA (Gemini)
          </h3>
          <p className="text-xs text-indigo-700/70 dark:text-indigo-400/70 font-semibold mb-4">
            Ton assistant intelligent pour optimiser tes révisions
          </p>

          {!data && !loading && !error && (
            <button
              onClick={fetchSuggestions}
              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-sm"
            >
              Générer mon plan d'étude personnalisé
            </button>
          )}

          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-indigo-200/50 dark:bg-indigo-700/50 rounded w-3/4"></div>
              <div className="h-4 bg-indigo-200/50 dark:bg-indigo-700/50 rounded w-1/2"></div>
              <div className="h-4 bg-indigo-200/50 dark:bg-indigo-700/50 rounded w-5/6"></div>
            </div>
          )}

          {error && (
            <div className="text-red-500 text-xs font-bold bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/50">
              Oups, impossible de joindre l'IA pour le moment. Réessaie plus tard !
              <button onClick={fetchSuggestions} className="ml-2 underline text-red-600 dark:text-red-400">Réessayer</button>
            </div>
          )}

          {data && !loading && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic border-l-2 border-indigo-300 dark:border-indigo-600 pl-3">
                "{data.message}"
              </p>
              
              <div className="bg-white/60 dark:bg-slate-800/60 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800">
                <h4 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-3">
                  Mes conseils pour aujourd'hui :
                </h4>
                <ul className="space-y-2">
                  {data.suggestions.map((suggestion, idx) => (
                    <li key={idx} className="flex gap-2 text-sm text-slate-700 dark:text-slate-300">
                      <span className="text-indigo-500 font-bold">✓</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
