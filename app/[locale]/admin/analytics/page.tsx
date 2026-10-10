"use client";
import { useEffect, useState } from "react";

interface AnalyticsData {
  pageViews: number;
  activeUsers: number;
  newUsers: number;
  topPages: { path: string; views: string }[];
}

interface InternalStats {
  totalUsers: number;
  totalPosts: number;
  activeSubscriptions: number;
  topViewedPosts: { post_slug: string; post_name: string; views: string }[];
  registrations: { date: string; count: string }[];
}

export default function AnalyticsPage() {
  const [gaStats, setGaStats] = useState<AnalyticsData | null>(null);
  const [internalStats, setInternalStats] = useState<InternalStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/analytics").then((res) => res.json()),
      fetch("/api/analytics/internal").then((res) => res.json())
    ])
      .then(([gaData, internalData]) => {
        if (gaData.error && internalData.error) {
          setError(gaData.error || internalData.error);
        } else {
          setGaStats(gaData.error ? null : gaData);
          setInternalStats(internalData.error ? null : internalData);
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const getPageTitle = (path: string) => {
    if (path === "/" || path === "") return "Home";
    if (path.startsWith("/category/")) return path.split("/category/")[1] || "Category";
    if (path.startsWith("/postdetails/")) return "Post Details";
    if (path === "/about") return "About";
    if (path === "/contactus") return "Contact";
    return path;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Tableau de Bord Analytics</h1>
        <p className="text-slate-600 dark:text-slate-400">Suivi des performances et de l'engagement utilisateur</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-600">Erreur: {error}</p>
        </div>
      )}

      {/* ── INTERNAL PLATFORM STATS ── */}
      {internalStats && (
        <section>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2">
            <span>📊</span> Statistiques Globales de la Plateforme
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Total Utilisateurs</h3>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{internalStats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-2">inscrits sur la plateforme</p>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-2xl shadow-sm text-white">
              <h3 className="text-sm font-bold text-blue-200 mb-1">Abonnements Actifs</h3>
              <p className="text-4xl font-black text-white">{internalStats.activeSubscriptions.toLocaleString()}</p>
              <p className="text-xs text-blue-200 mt-2">étudiants Premium</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Total Ressources</h3>
              <p className="text-4xl font-black text-slate-900 dark:text-white">{internalStats.totalPosts.toLocaleString()}</p>
              <p className="text-xs text-slate-400 mt-2">cours, exercices et examens publiés</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Top 10 Ressources (Lectures Internes)</h3>
            {internalStats.topViewedPosts.length > 0 ? (
              <div className="space-y-3">
                {internalStats.topViewedPosts.map((post, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div className="flex gap-4 items-center">
                      <span className="text-slate-400 dark:text-slate-500 font-bold w-4">{i + 1}.</span>
                      <div>
                        <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{post.post_name || post.post_slug}</p>
                        <p className="text-xs text-slate-500">{post.post_slug}</p>
                      </div>
                    </div>
                    <p className="font-black text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full text-xs">
                      {parseInt(post.views).toLocaleString()} vues
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">Aucune donnée de lecture interne.</p>
            )}
          </div>
        </section>
      )}

      {/* ── GOOGLE ANALYTICS STATS ── */}
      {gaStats && (
        <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <img src="https://www.gstatic.com/analytics-suite/header/suite/v2/ic_analytics.svg" alt="GA" className="w-6 h-6" />
              Google Analytics 4 (7 derniers jours)
            </h2>
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors"
            >
              Ouvrir la Console GA4
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Pages Vues (7j)</h3>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{gaStats.pageViews.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Nouveaux Utilisateurs (7j)</h3>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{gaStats.newUsers.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
              <h3 className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-1">Utilisateurs Actifs (7j)</h3>
              <p className="text-3xl font-black text-slate-900 dark:text-white">{gaStats.activeUsers.toLocaleString()}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
            <h3 className="text-base font-bold text-slate-800 dark:text-white mb-4">Top Pages (Trafic Public)</h3>
            {gaStats.topPages && gaStats.topPages.length > 0 ? (
              <div className="space-y-3">
                {gaStats.topPages.map((page, i) => (
                  <div key={i} className="flex justify-between items-center py-3 border-b border-slate-100 dark:border-slate-700 last:border-0">
                    <div>
                      <p className="font-bold text-sm text-slate-800 dark:text-slate-200">{getPageTitle(page.path)}</p>
                      <p className="text-xs text-slate-500 truncate max-w-[200px] sm:max-w-md">{page.path}</p>
                    </div>
                    <p className="font-black text-slate-700 dark:text-slate-300">
                      {parseInt(page.views).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic text-sm">Pas de données de pages disponibles dans GA.</p>
            )}
          </div>
        </section>
      )}
    </div>
  );
}