import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { CategoryCardType } from '../layout';


interface Props {
    category : CategoryCardType;
}
export default function Card({category}: Props) {
  return (
    <article className="flex flex-col shadow-lg my-4 bg-white rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
      <Link href={`/category/${category.slug}`}>
        <div className="relative h-48">
          <Image 
            src={category.thumbnail || '/placeholder.jpg'} 
            alt={category.name}
            fill
            className="object-cover hover:opacity-90 transition-opacity"
            unoptimized
          />
        </div>
        <div className="bg-white flex flex-col justify-start p-6">
          <h2 className="text-2xl font-bold hover:text-blue-600 pb-2">{category.name}</h2>
          <p className="text-gray-600 pb-4 line-clamp-2">{category.description}</p>
          <span className="w-full bg-blue-600 text-white font-semibold text-center rounded hover:bg-blue-700 transition-colors px-2 py-3 mt-4">
            Consulter
          </span>
        </div>
      </Link>
    </article>
  )
}
