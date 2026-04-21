import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { CategoryCardType } from '../../layout';

interface Props {
    post : CategoryCardType;
}

export default function PostCard({post}: Props) {
  return (
  <article className="flex flex-col shadow-lg my-4 bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
    <Link href={`/postdetails/${post.slug}`}>
      <div className="relative h-48">
        <Image 
          src={post.thumbnail || '/placeholder.jpg'} 
          alt={post.name}
          fill
          className="object-cover hover:scale-105 transition-transform duration-500"
          unoptimized
        />
      </div>
      <div className="bg-white flex flex-col justify-start p-6">
        <h2 className="text-xl font-bold hover:text-blue-600 pb-2">{post.name}</h2>
        <p className="text-gray-600 text-sm pb-4 line-clamp-2">{post.description}</p>
        <span className="w-full bg-blue-600 text-white font-semibold text-center rounded hover:bg-blue-700 transition-colors px-2 py-3 mt-4">
          Consulter
        </span>
      </div>
    </Link>
  </article>
  )
}
