"use client";

import { UnderCategory } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function SmallCard({ undercategory }: { undercategory: UnderCategory }) {
  return (
    <div className="rounded-lg bg-white p-4 pb-5 shadow-lg hover:shadow-xl transition-shadow">
      <Link href={`/category/${undercategory.slug}/posts`} className="block rounded-md overflow-hidden">
        <div className="relative w-full h-48">
          <Image
            src={undercategory.thumbnail || '/placeholder.jpg'}
            alt={undercategory.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
      </Link>
      <div className="mt-3">
        <Link href={`/category/${undercategory.slug}/posts`}>
          <h2 className="block text-xl font-semibold text-gray-700 hover:text-blue-600 transition-colors">
            {undercategory.name}
          </h2>
        </Link>
        <p className="mt-2 text-gray-500 text-sm line-clamp-2">{undercategory.description}</p>
      </div>
    </div>
  );
}
