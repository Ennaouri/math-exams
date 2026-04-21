"use client";

import { Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function SmallCard({ post }: { post: Post }) {
  if (!post || !post.slug) {
    return null;
  }
  
  return (
    <div className="rounded-sm bg-white p-4 pb-5 shadow-sm h-full hover:shadow-lg transition-shadow">
      <Link
        href={`/postdetails/${post.slug}`}
        className="block rounded-md overflow-hidden"
      >
        <div className="relative w-full h-60">
          <Image
            src={post.thumbnail || '/placeholder.jpg'}
            alt={post.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
      </Link>
      <div className="mt-3">
        <Link href={`/postdetails/${post.slug}`}>
          <h3 className="text-xl font-semibold text-gray-700 hover:text-blue-500 transition-colors line-clamp-2">
            {post.name}
          </h3>
        </Link>
        <div className="mt-2 text-gray-400 text-sm">
          {new Date(post.created_at).toLocaleDateString('fr-FR')}
        </div>
      </div>
    </div>
  );
}
