import React from "react";
import type { CategoryCardType } from "../layout";
import Link from "next/link";

export default function CategoriesSideBar({
  categories,
}: {
  categories: CategoryCardType[];
}) {
  return (
    <nav className="w-full bg-white dark:bg-slate-800 shadow-sm rounded-sm p-4" aria-label="Catégories">
      <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 font-roboto">
        Catégories
      </h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.id}>
            <Link
              href={`/category/${category.slug}`}
              className="flex leading-4 items-center text-gray-700 dark:text-gray-300 font-semibold text-sm uppercase transition hover:text-blue-500"
            >
              <span className="mr-2" aria-hidden="true">
                <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </span>
              <span>{category.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
