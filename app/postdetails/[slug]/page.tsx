import React from "react";
import "./postDetails.css";
import type { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug, getPostDetailsByPostSlug } from "@/lib/db";

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  const postdetails = await getPostDetailsByPostSlug(params.slug);
  const firstDetail = postdetails[0];
  
  return {
    title: post?.name ?? 'Post',
    description: post?.description || "Solution détaillée de l'examen de mathématiques",
    openGraph: {
      title: post?.name ?? 'Examens de Maths',
      description: post?.description || "Solution détaillée de l'examen de mathématiques",
      url: `https://maths-exams.com/postdetails/${params.slug}`,
      type: 'article',
      publishedTime: post?.created_at?.toISOString(),
      modifiedTime: post?.updated_at?.toISOString() || post?.created_at?.toISOString(),
      images: firstDetail?.thumbnail ? [{ url: firstDetail.thumbnail }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post?.name ?? 'Examens de Maths',
      description: post?.description || "Solution détaillée de l'examen de mathématiques",
      images: firstDetail?.thumbnail ? [firstDetail.thumbnail] : [],
    },
  };
}

function getYouTubeEmbedId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function renderContent(postDetail: any) {
  const { thumbnail, description } = postDetail;

  const isYouTube = thumbnail?.includes('youtube.com') || thumbnail?.includes('youtu.be');
  const isPdf = thumbnail?.toLowerCase().endsWith('.pdf');
  const isVideo = thumbnail?.match(/\.(mp4|webm|mov)$/i);
  const isImage = thumbnail?.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  if (isYouTube || getYouTubeEmbedId(thumbnail || '')) {
    const youtubeId = isYouTube ? getYouTubeEmbedId(thumbnail) : getYouTubeEmbedId(thumbnail || '');
    return (
      <div className="video-container">
        <iframe
          width="100%"
          height="400"
          src={`https://www.youtube.com/embed/${youtubeId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
        ></iframe>
      </div>
    );
  }

  if (isPdf) {
    return (
      <div className="pdf-container" style={{ minHeight: '80vh' }}>
        <div className="pdf-preview">
          <iframe
            src={thumbnail}
            width="100%"
            height="800"
            style={{ border: 'none', minHeight: '70vh' }}
            title="PDF Viewer"
          ></iframe>
          <a
            href={thumbnail}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Download PDF
          </a>
        </div>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className="video-container">
        <video
          controls
          width="100%"
          className="rounded-lg"
          preload="metadata"
        >
          <source src={thumbnail} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  if (isImage) {
    return (
      <div className="mt-4">
        <img
          src={thumbnail}
          alt={postDetail.name}
          className="w-full max-h-[600px] object-contain rounded-lg"
        />
      </div>
    );
  }

  return (
    <div
      className="paragraph atag"
      dangerouslySetInnerHTML={{
        __html: description || '',
      }}
    />
  );
}

export default async function PostDetails({
  params,
}: {
  params: { slug: string };
}) {
  const postdetails = await getPostDetailsByPostSlug(params.slug);
  const sortedPosts = postdetails.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  
  const post = await getPostBySlug(params.slug);
  
  const jsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.name,
    "description": post.description || "Examens et concours de mathématiques",
    "datePublished": post.created_at?.toISOString(),
    "dateModified": post.updated_at?.toISOString() || post.created_at?.toISOString(),
    "author": {
      "@type": "Organization",
      "name": "Maths-Exams",
      "url": "https://maths-exams.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Maths-Exams",
      "logo": {
        "@type": "ImageObject",
        "url": "https://maths-exams.com/logo.png"
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://maths-exams.com/postdetails/${params.slug}`
    }
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="">
        <div className="rounded-sm overflow-hidden bg-white shadow-sm">
          <div className=" pb-5">
            <h2 className="px-5 block text-2xl font-semibold text-gray-700 font-roboto">
              {post?.name}
            </h2>
            <div className="px-5 mt-2 flex space-x-4">
              <div className="flex text-gray-400 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-user"></i>
                </span>
                Cours
              </div>
              <div className="px-5 flex text-gray-400 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-clock"></i>
                </span>
                {post?.created_at?.toDateString()}
              </div>
            </div>
            <div id="accordionExample" className="px-1 md:px-5 ">
              {sortedPosts.map((postDetail) => (
                <div className="rounded-t-lg   bg-white dark:border-neutral-600 dark:bg-body-dark">
                  <div
                    id="collapseOne"
                    className="!visible"
                    data-twe-collapse-item
                    data-twe-collapse-show
                    aria-labelledby="headingOne"
                    data-twe-parent="#accordionExample"
                  >
                    <div className="py-4">
                      <div className="rounded-t-lg  bg-white">
                        <h2 className="px-5 mb-0" id="headingOne">
                          {postDetail.name}
                        </h2>
                        <div
                          id="collapseOne"
                          className="!visible"
                          data-twe-collapse-item
                          data-twe-collapse-show
                          aria-labelledby="headingOne"
                          data-twe-parent="#accordionExample"
                        >
                          <div className="py-4">
                            {renderContent(postDetail)}
                            
                            {postDetail.description && !postDetail.thumbnail && (
                              <div
                                className="paragraph atag"
                                dangerouslySetInnerHTML={{
                                  __html: `<div>${postDetail.description}</div>`,
                                }}
                              />
                            )}

                            <div style={{ overflow: "hidden", margin: "5px" }}>
                              <ins
                                className="adsbygoogle"
                                style={{
                                  display: "block",
                                  textAlign: "center",
                                }}
                                data-ad-layout="in-article"
                                data-ad-format="fluid"
                                data-ad-client="ca-pub-5587331919297301"
                                data-ad-slot="5512454890"
                              ></ins>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});" }} />

    </>
  );
}