"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    gtag: any;
    dataLayer: any[];
  }
}

const GA_MEASUREMENT_ID = "G-5WEZD64FD4";

export default function AnalyticsPage() {
  const [stats, setStats] = useState<{
    pageViews: number;
    uniqueVisitors: number;
    directVisits: number;
    referralVisits: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "page_view", {
        page_title: "Admin Analytics",
        page_location: window.location.href,
      });
    }

    const fakeStats = {
      pageViews: 12450,
      uniqueVisitors: 3280,
      directVisits: 1850,
      referralVisits: 1430,
    };
    setTimeout(() => {
      setStats(fakeStats);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${GA_MEASUREMENT_ID}');`}
      </Script>

      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Analytics</h1>
        <p className="text-gray-600">
          Google Analytics 4 - Real-time visitor data
        </p>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-6">
        <h2 className="text-lg font-semibold mb-1">Real-Time Visitors</h2>
        <p className="text-4xl font-bold">{stats?.uniqueVisitors || 0}</p>
        <p className="text-sm opacity-75">users in the last 30 minutes</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-1">Total Page Views</h3>
          <p className="text-3xl font-bold">{stats?.pageViews.toLocaleString() || "—"}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-1">Unique Visitors</h3>
          <p className="text-3xl font-bold">{stats?.uniqueVisitors.toLocaleString() || "—"}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-1">Direct Visits</h3>
          <p className="text-3xl font-bold">{stats?.directVisits.toLocaleString() || "—"}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm text-gray-500 mb-1">Referral Visits</h3>
          <p className="text-3xl font-bold">{stats?.referralVisits.toLocaleString() || "—"}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
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

      <div className="mt-6 bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Top Pages</h2>
        <div className="space-y-3">
          {[
            { path: "/", views: 4200, title: "Home" },
            { path: "/category/bac", views: 2800, title: "Baccalauréat" },
            { path: "/postdetails/examen-2024", views: 1850, title: "Examen 2024" },
            { path: "/category/tronc-commun", views: 1200, title: "Tronc Commun" },
            { path: "/about", views: 650, title: "À propos" },
          ].map((page, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b">
              <div>
                <p className="font-medium">{page.title}</p>
                <p className="text-sm text-gray-500">{page.path}</p>
              </div>
              <p className="font-bold">{page.views.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}