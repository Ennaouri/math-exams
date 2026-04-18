"use client";

import { Post } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function SmallCard({ post }: { post: Post }) {
  if (!post || !post.slug) {
    return null;
  }
  
  return (
    <div className="rounded-sm bg-white p-4 pb-5 shadow-sm h-full">
      <Link
        href={`/postdetails/${post.slug}`}
        className="block rounded-md overflow-hidden"
      >
        <img
          src={post.thumbnail}
          className="w-full h-60  transform hover:scale-110 transition duration-500 "
          alt={post.name}
        />
      </Link>
      <div className="mt-3">
        <Link href={`/postdetails/${post.slug}`}>
          <p className="block text-xl font-semibold text-gray-700 hover:text-blue-500 transition font-roboto">
            {post.name}
          </p>
        </Link>
        <div className="mt-2 flex space-x-3">
          <div className="flex text-gray-400 text-sm items-center">
            <span className="mr-2 text-xs">
              <i className="far fa-clock"></i>
            </span>
            {new Date(post.created_at).toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
