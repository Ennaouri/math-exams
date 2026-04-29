"use client";
import { Post } from "@/lib/types";
import Link from "next/link";
import React from "react";

export default function RandomPosts({ posts }: { posts: Post[] }) {
  return (
    <div className="w-full mt-8 bg-white shadow-sm rounded-sm p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">
        Derniers ajouts
      </h3>
      <div className="space-y-3">
        {posts.filter(Boolean).map((post, index) => (
          <Link href={`/postdetails/${post.slug}`} className="block group" key={index}>
            <h5 className="text-md leading-5 block font-roboto font-semibold transition group-hover:text-blue-500">
              {post.name}
            </h5>
            <div className="flex text-gray-400 text-sm items-center mt-1">
              <span className="mr-1 text-xs">
                <i className="far fa-clock"></i>
              </span>
              {new Date(post.created_at).toDateString()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
