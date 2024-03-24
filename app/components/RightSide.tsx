'use client'

import { Post, UnderCategory } from '@prisma/client'
import React from 'react'
import SocialMedias from './SocialMedias'
import Link from 'next/link'

export default function RightSide({ undercategories }: { undercategories: UnderCategory[] }) {
  return (
    <div >
                <SocialMedias />

                <div className=" w-full bg-white shadow-sm rounded-sm p-4">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">Under Categories</h3>
                    <div className="space-y-4">
                        {undercategories.toReversed().slice(0, 4).map((underCategory) => (
                            <Link href={`/category/${underCategory.slug}/posts`} className="flex group">
                            <div className="flex-shrink-0">
                                <img src={underCategory.thumbnail} className="h-14 w-20 lg:w-14 xl:w-20 rounded object-cover"/>
                            </div>
                            <div className="flex-grow pl-3">
                                <h5
                                    className="text-md leading-5 block font-roboto font-semibold  transition group-hover:text-blue-500">
                                    {underCategory.name}
                                </h5>
                                <div className="flex text-gray-400 text-sm items-center">
                                    <span className="mr-1 text-xs"><i className="far fa-clock"></i></span>
                                    {underCategory.created_at.toDateString()}
                                </div>
                            </div>
                        </Link>
                        ))}
                    </div>
                </div>

                <div className="w-full bg-white shadow-sm rounded-sm p-4  mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">Tags</h3>
                    <div className="flex items-center flex-wrap gap-2">
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">examens</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">limites</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">2bac</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">suites</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">trigonometrie</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">reciproque</Link>
                        
                    </div>
                </div>
            </div>
  )
}
