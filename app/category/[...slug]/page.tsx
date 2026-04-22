import React from "react";
import { getUnderCategoriesByCategorySlug, getPostsByUnderCategorySlug, getCategoryBySlug, getUnderCategoryBySlug } from "@/lib/db";
import Link from "next/link";
import type { Metadata } from "next";

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
    return {
      title: underCategory?.name || "Catégorie",
      description: underCategory?.description || "Examens et exercices de mathématiques",
    };
  }
  
  const category = await getCategoryBySlug(categorySlug);
  return {
    title: category?.name || "Catégorie",
    description: category?.description || "Examens et exercices de mathématiques",
  };
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
    
    return (
      <div>
        <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
          <h5 className="text-base uppercase font-semibold font-roboto">
            {title}
          </h5>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post, index) => (
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
          ))}
        </div>
      </div>
    );
  }

  const category = await getCategoryBySlug(categorySlug);
  const underCategories = await getUnderCategoriesByCategorySlug(categorySlug);
  
  return (
    <div>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          {category?.name || 'Under Categories'}
        </h5>
      </div>
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