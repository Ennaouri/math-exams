import React from 'react'
import Link from 'next/link';
import { CategoryCardType } from '../layout';


interface Props {
    category : CategoryCardType;
}
export default function Card({category}: Props) {
  return (
          <article className="flex flex-col shadow my-4">
      <Link href={`/category/${category.slug}`}>
    <div className="hover:opacity-75">
        <img src={category.thumbnail} alt={category.name}/>
    </div>
    <div className="bg-white flex flex-col justify-start p-6">
        <p className="text-blue-700 text-sm font-bold uppercase pb-4">Technology</p>
        <p className="text-3xl font-bold hover:text-gray-700 pb-4">{category.name}</p>
        <p  className="text-sm pb-3">
            By <span className="font-semibold hover:text-gray-800">Ennaouri</span>, Published on April 25th, 2020
        </p>
        <p className="pb-6">{category.description}</p>
        <p className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
                    Consulter
                </p>
    </div>
    </Link>
</article>
  )
}
