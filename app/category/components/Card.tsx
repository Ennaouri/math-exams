import React from 'react'
import Link from 'next/link';
import { CategoryCardType } from '../../page';
import { PrismaClient } from '@prisma/client';


interface Props {
  underCategory : CategoryCardType;
}
const prisma = new PrismaClient()

export default function Card({underCategory}: Props) {
    

  return (
  
  <article className="flex flex-col shadow my-4">
  <Link href={`/category/${underCategory.slug}/posts`}>
<div className="hover:opacity-75">
    <img src={underCategory.thumbnail} alt={underCategory.name}/>
</div>
<div className="bg-white flex flex-col justify-start p-6">
    <p className="text-blue-700 text-sm font-bold uppercase pb-4">Technology</p>
    <p className="text-3xl font-bold hover:text-gray-700 pb-4">{underCategory.name}</p>
    <p  className="text-sm pb-3">
        By <span className="font-semibold hover:text-gray-800">Ennaouri</span>, Published on April 25th, 2020
    </p>
    <p className="pb-6">{underCategory.description}</p>
    <p className="w-full bg-blue-800 text-white font-bold text-sm uppercase rounded hover:bg-blue-700 flex items-center justify-center px-2 py-3 mt-4">
                Consulter
            </p>
</div>
</Link>
</article>

  )
}
 {/* <div
      className="w-64 h-72 m-3 rounded overflow-hidden border cursor-pointer"
    >
      <Link href={`/category/${category.slug}/posts`}>
      <img
        src={category.thumbnail}
        alt=""
        className="w-full h-36"
      />
      <div className="p-1">
        <h3 className="font-bold text-2xl mb-2">{category.name}</h3>
        <div className="flex items-start">
          <div className="flex mb-2">*****</div>
          <p className="ml-2">77 reviews</p>
        </div>
        <div className="flex text-reg font-light capitalize">
          <p className=" mr-3">Mexican</p>
          <p className="mr-3">$$$$</p>
          <p>Toronto</p>
        </div>
        <p className="text-sm mt-1 font-bold">Booked 3 times today</p>
      </div>
      </Link>
  </div>*/}