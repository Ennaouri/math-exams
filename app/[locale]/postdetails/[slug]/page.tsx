import React from "react";
import "./postDetails.css";
import type { Metadata, ResolvingMetadata } from "next";
import { getPostBySlug, getPostDetailsByPostSlug, getPostWithCategory, getRelatedPostsBySlug } from "@/lib/db";
import { auth } from "@/lib/auth";
import Link from "next/link";
import Script from "next/script";
import AdSenseLoader from "@/app/components/AdSenseLoader";
import { SITE_NAME, SITE_URL, buildPageMetadata } from "@/lib/seo";
import AdUnit from "@/app/components/AdUnit";
import PostDetailsAccordion from "./PostDetailsAccordion";
import QuizBlock from "@/app/components/QuizBlock";

export const revalidate = 3600;

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

function getShareImage(...urls: Array<string | null | undefined>) {
  return urls.find((url) => url && /\.(jpg|jpeg|png|gif|webp)$/i.test(url)) || null;
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
  const accordionItems = sortedPosts.map((postDetail) => ({
    id: postDetail.id,
    name: postDetail.name,
    thumbnail: postDetail.thumbnail,
    description: postDetail.description,
  }));
  
  const post = await getPostBySlug(slug);
  const session = await auth();
  const postWithCategory = await getPostWithCategory(slug);
  const relatedPosts = await getRelatedPostsBySlug(slug);
  
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
        <Script
          id="post-json-ld"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <div className="">
        <div className="rounded-sm overflow-hidden bg-white dark:bg-slate-800 shadow-sm border dark:border-slate-700">
          <div className=" pb-5">
            <nav className="px-5 mb-3 text-sm text-gray-500 dark:text-gray-400">
              <ol className="flex items-center space-x-2 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-red-600 dark:hover:text-red-400">Accueil</Link>
                </li>
                {postWithCategory?.category && (
                  <>
                    <li>/</li>
                    <li>
                      <Link href={`/category/${postWithCategory.category.slug}`} className="hover:text-red-600 dark:hover:text-red-400">
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
                        className="hover:text-red-600 dark:hover:text-red-400"
                      >
                        {postWithCategory.underCategory.name}
                      </Link>
                    </li>
                  </>
                )}
                <li>/</li>
                <li className="text-gray-700 dark:text-gray-300">{post?.name}</li>
              </ol>
            </nav>
            <h1 className="px-5 block text-2xl font-semibold text-gray-700 dark:text-gray-100 font-roboto">
              {post?.name}
            </h1>
            <div className="px-5 mt-2 flex space-x-4">
              <div className="flex text-gray-400 dark:text-gray-500 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-user"></i>
                </span>
                Cours
              </div>
              <div className="px-5 flex text-gray-400 dark:text-gray-500 text-sm items-center">
                <span className="mr-2 text-xs">
                  <i className="far fa-clock"></i>
                </span>
                {post?.created_at?.toDateString()}
              </div>
            </div>
            <section className="mx-5 mt-5 rounded-sm border border-blue-100 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-blue-200">À propos de cette ressource</h2>
              <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-blue-100/70">
                Cette page vous aide à travailler {postWithCategory?.underCategory?.name || "les mathématiques"} pour {postWithCategory?.category?.name || "le programme de mathématiques"}. Consultez le contenu, notez les méthodes importantes, puis entraînez-vous avec les ressources liées en bas de page.
              </p>
              {post?.description && (
                <p className="mt-2 text-sm leading-6 text-gray-700 dark:text-blue-100/70">{post.description}</p>
              )}
            </section>
            <div className="px-5">
              <AdUnit slot="5512454890" format="fluid" layout="in-article" />
            </div>
            <PostDetailsAccordion
              items={accordionItems}
              showDownload={Boolean(session)}
              postId={post?.id}
              postSlug={slug}
              postName={post?.name}
              categoryName={postWithCategory?.category?.name}
              categorySlug={postWithCategory?.category?.slug}
            />

            {/* QCM interactif — s'affiche si un quiz existe pour ce post */}
            {post?.id && (
              <div className="px-1 md:px-5 mt-2">
                <QuizBlock postId={post.id} isLoggedIn={Boolean(session)} />
              </div>
            )}
          </div>
        </div>
        {relatedPosts.length > 0 && (
          <section className="mt-6 rounded-sm bg-white dark:bg-slate-800 p-5 shadow-sm border dark:border-slate-700">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Ressources liées</h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Continuez avec des cours, exercices ou examens du même niveau pour augmenter vos chances de réussite.
            </p>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/postdetails/${relatedPost.slug}`}
                  className="block rounded-sm border border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 shadow-sm transition-shadow hover:shadow-md hover:border-blue-300 dark:hover:border-blue-600"
                >
                  <h3 className="font-semibold text-gray-800 dark:text-gray-200">{relatedPost.name}</h3>
                  {relatedPost.description && (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{relatedPost.description}</p>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
      <AdSenseLoader />

    </>
  );
}
