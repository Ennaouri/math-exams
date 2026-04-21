"use client";
import { Post } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import React from "react";

export default function FirstCard({ post }: { post: Post | null }) {
  if (!post || !post.slug) {
    return (
      <div className="rounded-sm overflow-hidden bg-white shadow-sm mx-4 p-4">
        <p className="text-gray-500 text-center">Aucun post récent disponible.</p>
      </div>
    );
  }
  
  return (
    <div className="rounded-sm overflow-hidden bg-white shadow-sm mx-4">
      <Link href={`/postdetails/${post.slug}`} className="block rounded-md overflow-hidden">
        <div className="relative w-full h-96">
          <Image
            src={post.thumbnail || '/placeholder.jpg'}
            alt={post.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-500"
            unoptimized
          />
        </div>
      </Link>
      <div className="p-4 pb-5">
        <Link href={`/postdetails/${post.slug}`}>
          <h2 className="text-2xl font-semibold text-gray-700 hover:text-blue-500 transition-colors">
            {post.name}
          </h2>
        </Link>

        <p className="text-gray-500 text-sm mt-2 line-clamp-2">{post.description}</p>
        <div className="mt-3 flex space-x-4 text-gray-400 text-sm">
          <span>{new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
        </div>
      </div>
    </div>
  );
}
