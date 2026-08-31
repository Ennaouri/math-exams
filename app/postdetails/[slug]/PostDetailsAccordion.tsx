"use client";

import { useState, useEffect, useRef } from "react";
import AdUnit from "@/app/components/AdUnit";
import WatermarkedDownloadButton from "@/app/components/WatermarkedDownloadButton";

type PostDetailItem = {
  id?: number;
  name: string;
  thumbnail?: string | null;
  description?: string | null;
};

function getYouTubeEmbedId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

function renderContent(postDetail: PostDetailItem, showDownload = true) {
  const { thumbnail, description } = postDetail;
  const mediaUrl = thumbnail || "";

  const isYouTube = thumbnail?.includes("youtube.com") || thumbnail?.includes("youtu.be");
  const isPdf = thumbnail?.toLowerCase().endsWith(".pdf");
  const isVideo = thumbnail?.match(/\.(mp4|webm|mov)$/i);
  const isImage = thumbnail?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  // Derive a clean filename from the URL path
  const rawFileName = thumbnail?.split('/').pop()?.split('?')[0] || 'document.pdf';
  const cleanFileName = decodeURIComponent(rawFileName).replace(/^\d+-/, '');

  if (isYouTube || getYouTubeEmbedId(thumbnail || "")) {
    const youtubeId = getYouTubeEmbedId(mediaUrl);
    return (
      <div className="video-container">
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={postDetail.name}
        />
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="pdf-container pdf-embed-wrapper" style={{ height: "calc(100vh - 200px)", minHeight: "500px" }}>
        <embed
          src={`${mediaUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ border: "none", pointerEvents: "auto" }}
        />
        {showDownload && (
          <div className="mt-3 flex items-center gap-3 flex-wrap">
            <WatermarkedDownloadButton
              pdfUrl={mediaUrl}
              fileName={cleanFileName}
              label="⬇ Télécharger (avec filigrane)"
            />
            <span className="text-xs text-slate-400 italic">
              Le PDF téléchargé contiendra votre nom en filigrane.
            </span>
          </div>
        )}
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="video-container">
        <video controls controlsList="nodownload" width="100%" className="rounded-lg" preload="metadata">
          <source src={mediaUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {showDownload && (
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Download Video
          </a>
        )}
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="mt-4">
        <img
          src={mediaUrl}
          alt={postDetail.name}
          className="w-full max-h-[600px] object-contain rounded-lg"
        />
        {showDownload && (
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Download Image
          </a>
        )}
      </div>
    );
  }

  return (
    <div
      className="paragraph atag"
      dangerouslySetInnerHTML={{
        __html: description || "",
      }}
    />
  );
}

export default function PostDetailsAccordion({
  items,
  showDownload,
  postId,
  postSlug,
  postName,
  categoryName,
  categorySlug,
}: {
  items: PostDetailItem[];
  showDownload: boolean;
  postId?: number;
  postSlug?: string;
  postName?: string;
  categoryName?: string;
  categorySlug?: string;
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const tracked = useRef(false);

  // Track the post view once when the page loads (only if user is logged in = showDownload)
  useEffect(() => {
    if (showDownload && postId && postSlug && !tracked.current) {
      tracked.current = true;
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId, postSlug, postName, categoryName, categorySlug }),
      }).catch(() => {/* non-critical */});
    }
  }, [showDownload, postId, postSlug, postName, categoryName, categorySlug]);

  if (!items.length) {
    return (
      <div className="rounded-sm border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 text-gray-600 dark:text-gray-400">
        Aucun contenu disponible pour cette ressource.
      </div>
    );
  }

  return (
    <div className="space-y-3 px-1 md:px-5">
      {items.map((postDetail, index) => {
        const isOpen = openIndex === index;
        const panelId = `post-detail-panel-${postDetail.id || index}`;
        const buttonId = `post-detail-button-${postDetail.id || index}`;

        return (
          <section
            key={postDetail.id || index}
            className={`overflow-hidden rounded-sm border bg-white dark:bg-slate-800 shadow-sm transition-shadow ${
              isOpen ? "border-blue-500 shadow-md" : "border-gray-200 dark:border-slate-700"
            }`}
          >
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition ${
                isOpen ? "bg-blue-50 dark:bg-blue-900/30" : "bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/20"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm text-sm font-bold ${
                    isOpen ? "bg-blue-600 text-white" : "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  {index + 1}
                </span>
                <span className={`text-base font-bold md:text-lg ${isOpen ? "text-blue-700 dark:text-blue-400" : "text-slate-800 dark:text-slate-200"}`}>
                  {postDetail.name || `Partie ${index + 1}`}
                </span>
              </span>
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border ${
                  isOpen ? "border-blue-600 bg-blue-600 text-white" : "border-blue-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-blue-700 dark:text-blue-300"
                }`}
              >
                <svg
                  className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div
                id={panelId}
                role="region"
                aria-labelledby={buttonId}
                className={`border-t border-gray-100 dark:border-slate-700 px-3 py-4 md:px-5 ${!showDownload ? "no-download" : ""}`}
              >
                {renderContent(postDetail, showDownload)}
                <AdUnit slot="5512454890" format="fluid" layout="in-article" />
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}
