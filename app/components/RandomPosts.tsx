"use client";
import { Post } from "@prisma/client";
import Link from "next/link";
import React from "react";



export default function RandomPosts({ posts }: { posts: Post[] }) {
  

  return (
    <div className="w-full mt-8 bg-white shadow-sm rounded-sm p-4">
      <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">
        Random Posts
      </h3>
      <div className="space-y-4">
        {posts.map((post, index) => (
          <Link href={`/postdetails/${post.slug}`} className="flex group" key={index}>
            <div className="flex-shrink-0">
              <img
                src={post.thumbnail}
                className="h-14 w-20 rounded object-cover"
              />
            </div>
            <div className="flex-grow pl-3">
              <h5 className="text-md leading-5 block font-roboto font-semibold  transition group-hover:text-blue-500">
                {post.name}
              </h5>
              <div className="flex text-gray-400 text-sm items-center">
                <span className="mr-1 text-xs">
                  <i className="far fa-clock"></i>
                </span>
                {post.created_at.toDateString()}
              </div>
            </div>
          </Link>
        ))}

      </div>
    </div>
  );
}
