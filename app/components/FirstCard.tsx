"use client";
import { Post } from "@prisma/client";
import React from "react";

export default function FirstCard({ post }: { post: Post }) {
  return (
    <div className="rounded-sm overflow-hidden bg-white shadow-sm">
      <a href={`/postdetails/${post.slug}`} className="block rounded-md overflow-hidden">
        <img
          src={post.thumbnail}
          className="w-full h-96 object-cover transform hover:scale-110 transition duration-500"
        />
      </a>
      <div className="p-4 pb-5">
        <a href="view.html">
          <h2 className="block text-2xl font-semibold text-gray-700 hover:text-blue-500 transition font-roboto">
            {post.name}
          </h2>
        </a>

        <p className="text-gray-500 text-sm mt-2">{post.description}</p>
        <div className="mt-3 flex space-x-4">
          <div className="flex text-gray-400 text-sm items-center">
            <span className="mr-2 text-xs">
              <i className="far fa-user"></i>
            </span>
            {post.description}
          </div>
          <div className="flex text-gray-400 text-sm items-center">
            <span className="mr-2 text-xs">
              <i className="far fa-clock"></i>
            </span>
            {post.created_at.toDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}
