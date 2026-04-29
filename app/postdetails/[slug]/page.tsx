import React from "react";
import "./postDetails.css";
import type { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug, getPostDetailsByPostSlug, getPostWithCategory } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import AdSenseLoader from "@/app/components/AdSenseLoader";
import { SITE_NAME, SITE_URL, buildPageMetadata } from "@/lib/seo";

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const postdetails = await getPostDetailsByPostSlug(slug);
  const firstDetail = postdetails[0];
  const title = post?.name ?? "Ressource de mathématiques";
  const description = post?.description || "Cours, exercice ou examen corrigé de mathématiques avec solution détaillée.";
  const image = getShareImage(firstDetail?.thumbnail, post?.thumbnail);
  
  return {
    ...buildPageMetadata({
      title,
      description,
      path: `/postdetails/${slug}`,
      type: "article",
      image,
    }),
    openGraph: {
      ...buildPageMetadata({
        title,
        description,
        path: `/postdetails/${slug}`,
        type: "article",
        image,
      }).openGraph,
      type: 'article',
      publishedTime: post?.created_at?.toISOString(),
      modifiedTime: post?.updated_at?.toISOString() || post?.created_at?.toISOString(),
    },
  };
}

function getYouTubeEmbedId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function getShareImage(...urls: Array<string | null | undefined>) {
  return urls.find((url) => url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) || null;
}

function renderContent(postDetail: any, showDownload = true) {
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
      <div className="pdf-container pdf-embed-wrapper" style={{ height: 'calc(100vh - 200px)', minHeight: '500px' }}>
        <embed
          src={`${thumbnail}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
          type="application/pdf"
          width="100%"
          height="100%"
          style={{ border: 'none', pointerEvents: 'auto' }}
        />
        {showDownload && (
          <a
            href={thumbnail}
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
        <video
          controls
          controlsList="nodownload"
          width="100%"
          className="rounded-lg"
          preload="metadata"
        >
          <source src={thumbnail} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {showDownload && (
          <a
            href={thumbnail}
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
          src={thumbnail}
          alt={postDetail.name}
          className="w-full max-h-[600px] object-contain rounded-lg"
        />
        {showDownload && (
          <a
            href={thumbnail}
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
        __html: description || '',
      }}
    />
  );
}

export default async function PostDetails({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const postdetails = await getPostDetailsByPostSlug(slug);
  const sortedPosts = postdetails.sort((a, b) => {
    return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
  });
  
  const post = await getPostBySlug(slug);
  const session = await auth();
  const postWithCategory = await getPostWithCategory(slug);
  
  const jsonLd = post ? {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    "headline": post.name,
    "description": post.description || "Examens et concours de mathématiques",
    "datePublished": post.created_at?.toISOString(),
    "dateModified": post.updated_at?.toISOString() || post.created_at?.toISOString(),
    "educationalLevel": postWithCategory?.category?.name,
    "learningResourceType": postWithCategory?.underCategory?.name || "Cours et exercice",
    "inLanguage": "fr-MA",
    "isAccessibleForFree": true,
    "about": ["Mathématiques", "Programme marocain", postWithCategory?.category?.name].filter(Boolean),
    "author": {
      "@type": "Organization",
      "name": SITE_NAME,
      "url": SITE_URL
    },
    "publisher": {
      "@type": "Organization",
      "name": SITE_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_URL}/favicon.ico`
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${SITE_URL}/postdetails/${slug}`
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
            <nav className="px-5 mb-3 text-sm text-gray-500">
              <ol className="flex items-center space-x-2 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-red-600">Accueil</Link>
                </li>
                {postWithCategory?.category && (
                  <>
                    <li>/</li>
                    <li>
                      <Link href={`/category/${postWithCategory.category.slug}`} className="hover:text-red-600">
                        {postWithCategory.category.name}
                      </Link>
                    </li>
                  </>
                )}
                {postWithCategory?.underCategory && postWithCategory?.category && (
                  <>
                    <li>/</li>
                    <li>
                      <Link 
                        href={`/category/${postWithCategory.category?.slug}/${postWithCategory.underCategory.slug}`} 
                        className="hover:text-red-600"
                      >
                        {postWithCategory.underCategory.name}
                      </Link>
                    </li>
                  </>
                )}
                <li>/</li>
                <li className="text-gray-700">{post?.name}</li>
              </ol>
            </nav>
            <h1 className="px-5 block text-2xl font-semibold text-gray-700 font-roboto">
              {post?.name}
            </h1>
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
              {sortedPosts.map((postDetail, index) => (
                <div key={postDetail.id || index} className="rounded-t-lg bg-white dark:border-neutral-600 dark:bg-body-dark">
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
                          <div className={`py-4 ${!session ? 'no-download' : ''}`}>
                            {renderContent(postDetail, Boolean(session))}
                            
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
      <AdSenseLoader />

    </>
  );
}
