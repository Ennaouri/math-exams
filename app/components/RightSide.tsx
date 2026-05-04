'use client'

import { UnderCategory } from '@/lib/types'
import React from 'react'
import SocialMedias from './SocialMedias'
import Link from 'next/link'

export default function RightSide({ undercategories }: { undercategories: UnderCategory[] }) {
  return (
    <div >
                <SocialMedias />

                <div className="w-full bg-white shadow-sm rounded-sm p-4 mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-3 font-roboto">Tags</h3>
                    <div className="flex items-center flex-wrap gap-2">
                        <Link href="/category/examens"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">examens</Link>
                        <Link href="/postdetails/courslimitesetcontinuitepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">limites</Link>
                        <Link href="/category/2bacsciencepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">2bac</Link>
                        <Link href="/postdetails/courslimitesdunesuitepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">suites</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">trigonometrie</Link>
                        <Link href="/postdetails/courslimitesetcontinuitepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 rounded-sm transition hover:bg-blue-500 hover:text-white">reciproque</Link>
                        
                    </div>
                </div>
            </div>
  )
}
