"use client";

import { useEffect } from "react";

type AdUnitProps = {
  slot: string;
  format?: string;
  layout?: string;
  className?: string;
};

export default function AdUnit({
  slot,
  format = "auto",
  layout,
  className = "",
}: AdUnitProps) {
  const adsEnabled = process.env.NODE_ENV === "production";

  useEffect(() => {
    if (!adsEnabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, [adsEnabled]);

  if (!adsEnabled) {
    return null;
  }

  return (
    <aside className={`my-8 overflow-hidden rounded-sm border border-gray-100 bg-white px-2 py-4 ${className}`} aria-label="Publicité">
      <div className="mb-2 text-center text-[11px] uppercase tracking-wide text-gray-400">
        Publicité
      </div>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-5587331919297301"
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
