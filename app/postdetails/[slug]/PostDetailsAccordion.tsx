"use client";

import { useState } from "react";
import AdUnit from "@/app/components/AdUnit";

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
          <a
            href={mediaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Download PDF
          </a>
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
}: {
  items: PostDetailItem[];
  showDownload: boolean;
}) {
  const [openIndex, setOpenIndex] = useState(0);

  if (!items.length) {
    return (
      <div className="rounded-sm border border-gray-100 bg-white p-5 text-gray-600">
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
          <section key={postDetail.id || index} className="overflow-hidden rounded-sm border border-gray-200 bg-white shadow-sm">
            <button
              id={buttonId}
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-gray-50"
            >
              <span className="font-semibold text-gray-800">{postDetail.name || `Partie ${index + 1}`}</span>
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border border-gray-200 text-gray-600">
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
                className={`border-t border-gray-100 px-3 py-4 md:px-5 ${!showDownload ? "no-download" : ""}`}
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
