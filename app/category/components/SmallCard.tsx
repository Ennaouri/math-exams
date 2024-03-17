"use client";

import { UnderCategory } from "@prisma/client";
import Link from "next/link";
import React from "react";

export default function SmallCard({ undercategory }: { undercategory: UnderCategory }) {
  return (
    <div className="rounded-sm bg-white p-4 pb-5 shadow-sm">
      <Link href={`/category/${undercategory.slug}/posts`} className="block rounded-md overflow-hidden">
        <img
          src={undercategory.thumbnail}
          className="w-full h-60  transform hover:scale-110 transition duration-500 "
        />
      </Link>
      <div className="mt-3">
        <Link href={`/category/${undercategory.slug}/posts`}>
          <h2 className="block text-xl font-semibold text-gray-700 hover:text-blue-500 transition font-roboto">
            {undercategory.name}
          </h2>
        </Link>
        <div className="mt-2 flex space-x-3">
          <div className="flex text-gray-400 text-sm items-center">
            <span className="mr-2 text-xs">
              <i className="far fa-user"></i>
            </span>
            {undercategory.description}
          </div>
          <div className="flex text-gray-400 text-sm items-center">
            <span className="mr-2 text-xs">
              <i className="far fa-clock"></i>
            </span>
            {undercategory.created_at.toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
