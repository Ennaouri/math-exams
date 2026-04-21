"use client";
import { useEffect, useState } from "react";

interface AnalyticsData {
  pageViews: number;
  activeUsers: number;
  newUsers: number;
  topPages: { path: string; views: string }[];
}

export default function AnalyticsPage() {
  const [stats, setStats] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/analytics")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setStats(data);
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600">Google Analytics 4 - 7 days data</p>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600">Error: {error}</p>
          <p className="text-sm text-red-500 mt-2">
            Make sure GA_PROPERTY_ID and GOOGLE_APPLICATION_CREDENTIALS are configured
          </p>
        </div>
      )}

      {!loading && !error && stats && (
        <>
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
            <h2 className="text-lg font-semibold mb-1">Active Users</h2>
            <p className="text-4xl font-bold">{stats.activeUsers}</p>
            <p className="text-sm opacity-75">users in the last 7 days</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">Page Views</h3>
              <p className="text-3xl font-bold">{stats.pageViews.toLocaleString()}</p>
              <p className="text-xs text-gray-400">last 7 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">New Users</h3>
              <p className="text-3xl font-bold">{stats.newUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-400">last 7 days</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-sm text-gray-500 mb-1">Active Users</h3>
              <p className="text-3xl font-bold">{stats.activeUsers.toLocaleString()}</p>
              <p className="text-xs text-gray-400">last 7 days</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-lg font-semibold mb-4">Google Analytics Dashboard</h2>
            <p className="text-gray-600 mb-4">
              View detailed analytics in Google Analytics console:
            </p>
            <a
              href="https://analytics.google.com/analytics/web/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Open Google Analytics
            </a>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
            {stats.topPages && stats.topPages.length > 0 ? (
              <div className="space-y-3">
                {stats.topPages.map((page, i) => (
                  <div key={i} className="flex justify-between items-center py-2 border-b">
                    <div>
                      <p className="font-medium">{getPageTitle(page.path)}</p>
                      <p className="text-sm text-gray-500">{page.path}</p>
                    </div>
                    <p className="font-bold">{parseInt(page.views).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No page data available</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}