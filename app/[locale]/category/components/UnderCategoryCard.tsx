import React from 'react'
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';

export default function UnderCategoryCard({underCategory}: {underCategory : Category}) {
  return (
    <Link
      href={`/category/${underCategory.slug}`}
      className="w-64 h-72 m-3 rounded-lg overflow-hidden border dark:border-slate-700 hover:shadow-xl transition-shadow bg-white dark:bg-slate-800 block"
    >
      <div className="relative h-36 w-full">
        <Image
          src={underCategory.thumbnail || '/placeholder.jpg'}
          alt={underCategory.name}
          fill
          className="object-cover hover:scale-105 transition-transform"
          unoptimized
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-xl mb-2 text-slate-900 dark:text-slate-100">{underCategory.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{underCategory.description}</p>
      </div>
    </Link>
  )
}
