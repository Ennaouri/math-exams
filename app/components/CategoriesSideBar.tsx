"use client";
import React from "react";
import { CategoryCardType } from "../page";

export default function CategoriesSideBar({
  categories,
}: {
  categories: CategoryCardType[];
}) {
  return (
    <div className="w-full bg-white shadow-sm rounded-sm p-4 ">
      <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">
        Categories
      </h3>
      <div className="space-y-2">
        {categories.map((category) => (
          <a
            href={`/category/${category.slug}`}
            className="flex leading-4 items-center text-gray-700 font-semibold text-sm uppercase transition hover:text-blue-500"
          >
            <span className="mr-2">
              <i className="far fa-folder-open"></i>
            </span>
            <span>{category.name}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
