import React from "react";
import { getUnderCategoriesByCategorySlug, getPostsByUnderCategorySlug, getCategoryBySlug, getUnderCategoryBySlug } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";
import AdUnit from "@/app/components/AdUnit";

export const dynamic = 'force-dynamic';

type CategoryProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({ params }: CategoryProps): Promise<Metadata> {
  const { slug } = await params;
  const categorySlug = slug[0];
  const underCategorySlug = slug[1];
  
  if (underCategorySlug) {
    const underCategory = await getUnderCategoryBySlug(underCategorySlug);
    const category = await getCategoryBySlug(categorySlug);
    const title = underCategory?.name || "Cours et exercices de mathématiques";
    return buildPageMetadata({
      title,
      description:
        underCategory?.description ||
        `Cours, exercices et examens corrigés de mathématiques pour ${title}${category?.name ? ` - ${category.name}` : ""}.`,
      path: `/category/${categorySlug}/${underCategorySlug}`,
      image: underCategory?.thumbnail,
    });
  }
  
  const category = await getCategoryBySlug(categorySlug);
  const title = category?.name || "Niveau de mathématiques";
  return buildPageMetadata({
    title,
    description:
      category?.description ||
      `Cours, exercices, devoirs et examens corrigés de mathématiques pour ${title}, selon le programme marocain.`,
    path: `/category/${categorySlug}`,
    image: category?.thumbnail,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const categorySlug = slug[0];
  const underCategorySlug = slug[1];

  if (underCategorySlug) {
    const posts = await getPostsByUnderCategorySlug(underCategorySlug);
    const underCategory = await getUnderCategoryBySlug(underCategorySlug);
    const category = await getCategoryBySlug(categorySlug);
    const title = underCategory?.name || category?.name || 'Posts';
    
    const postsWithSemestre = posts.filter(p => p.semestre != null);
    const postsWithoutSemestre = posts.filter(p => p.semestre == null);
    
    const semester1Posts = postsWithSemestre.filter(p => p.semestre === 1).sort((a, b) => (a.semestre_order || 0) - (b.semestre_order || 0));
    const semester2Posts = postsWithSemestre.filter(p => p.semestre === 2).sort((a, b) => (a.semestre_order || 0) - (b.semestre_order || 0));
    const allPosts = [...semester1Posts, ...semester2Posts, ...postsWithoutSemestre];
    
    const renderPost = (post: typeof posts[0], index: number) => (
      <Link 
        key={index} 
        href={`/postdetails/${post.slug}`}
        className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
      >
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors text-center">
          {post.name}
        </h3>
        {post.description && (
          <p className="text-sm text-gray-500 mt-2 text-center line-clamp-2">
            {post.description}
          </p>
        )}
      </Link>
    );
    
    return (
      <div>
        <nav className="mb-4 text-sm text-gray-500">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="hover:text-red-600">Accueil</Link></li>
            {category && (<><li>/</li><li><Link href={`/category/${category.slug}`} className="hover:text-red-600">{category.name}</Link></li></>)}
            <li>/</li>
            <li className="text-gray-700">{underCategory?.name}</li>
          </ol>
        </nav>
        <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
          <h1 className="text-base uppercase font-semibold font-roboto">
            {title}
          </h1>
        </div>
        <section className="bg-white px-5 py-5 rounded-sm mb-5">
          <p className="text-gray-700 leading-7">
            Retrouvez les ressources de {title} pour apprendre, s'entraîner et préparer les devoirs ou examens. Les contenus sont organisés pour suivre le programme marocain tout en restant utiles aux élèves francophones qui travaillent les mêmes notions.
          </p>
        </section>
        <AdUnit slot="5512454890" format="fluid" layout="in-article" />
        
        {semester1Posts.length > 0 && (
          <div className="mb-8">
            <div className="flex bg-blue-600 px-3 py-2 justify-between items-center rounded-sm mb-4">
              <h2 className="text-base uppercase font-semibold font-roboto text-white">
                Semestre 1
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semester1Posts.map(renderPost)}
            </div>
          </div>
        )}
        
        {semester2Posts.length > 0 && (
          <div className="mb-8">
            <div className="flex bg-green-600 px-3 py-2 justify-between items-center rounded-sm mb-4">
              <h2 className="text-base uppercase font-semibold font-roboto text-white">
                Semestre 2
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {semester2Posts.map(renderPost)}
            </div>
          </div>
        )}
        
        {postsWithoutSemestre.length > 0 && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {postsWithoutSemestre.map(renderPost)}
            </div>
          </div>
        )}
        
        {allPosts.length === 0 && (
          <p className="text-gray-500">Aucun post disponible.</p>
        )}
      </div>
    );
  }

  const category = await getCategoryBySlug(categorySlug);
  const underCategories = await getUnderCategoriesByCategorySlug(categorySlug);
  
  return (
    <div>
      <nav className="mb-4 text-sm text-gray-500">
        <ol className="flex items-center space-x-2">
          <li><Link href="/" className="hover:text-red-600">Accueil</Link></li>
          <li>/</li>
          <li className="text-gray-700">{category?.name}</li>
        </ol>
      </nav>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h1 className="text-base uppercase font-semibold font-roboto">
          {category?.name || 'Under Categories'}
        </h1>
      </div>
      <section className="bg-white px-5 py-5 rounded-sm mb-5">
        <p className="text-gray-700 leading-7">
          Choisissez un chapitre ou un type de ressource pour travailler {category?.name || "ce niveau"}: cours, exercices, devoirs, examens et corrections détaillées.
        </p>
      </section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {underCategories.map((underCategory, index) => (
          <Link 
            key={index} 
            href={`/category/${categorySlug}/${underCategory.slug}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 p-6 border border-gray-100"
          >
            <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 hover:text-green-600 transition-colors text-center">
              {underCategory.name}
            </h3>
            {underCategory.description && (
              <p className="text-sm text-gray-500 mt-2 text-center line-clamp-2">
                {underCategory.description}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
