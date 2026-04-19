import React from "react";
import { getUnderCategoriesByCategorySlug, getPostsByUnderCategorySlug } from "@/lib/db";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function CategoryPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const categorySlug = params.slug[0];
  const underCategorySlug = params.slug[1];

  if (underCategorySlug) {
    const posts = await getPostsByUnderCategorySlug(underCategorySlug);
    return (
      <div>
        <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
          <h5 className="text-base uppercase font-semibold font-roboto">
            Posts
          </h5>
        </div>
        <div className="bg-white rounded shadow overflow-hidden">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {posts.map((post, index) => (
                <tr key={index}>
                  <td className="px-6 py-4">{post.name}</td>
                  <td className="px-6 py-4">{post.description}</td>
                  <td className="px-6 py-4">
                    <Link href={`/postdetails/${post.slug}`} className="text-blue-500 hover:text-blue-700">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  const underCategories = await getUnderCategoriesByCategorySlug(categorySlug);
  return (
    <div>
      <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">
          Under Categories
        </h5>
      </div>
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {underCategories.map((underCategory, index) => (
              <tr key={index}>
                <td className="px-6 py-4">{underCategory.name}</td>
                <td className="px-6 py-4">{underCategory.description}</td>
                <td className="px-6 py-4">
                  <Link href={`/category/${categorySlug}/${underCategory.slug}`} className="text-blue-500 hover:text-blue-700">
                    View Posts
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}