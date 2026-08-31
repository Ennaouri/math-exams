'use client'

import { UnderCategory } from '@/lib/types'
import React from 'react'
import SocialMedias from './SocialMedias'
import Link from 'next/link'

export default function RightSide({ undercategories }: { undercategories: UnderCategory[] }) {
  return (
    <div >
                <SocialMedias />

                <div className="bg-white dark:bg-slate-800 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-700 shadow-sm mb-6">
        <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-4 flex items-center gap-2">
          <span>📚</span>
          Les plus consultés
        </h3>
        <div className="space-y-4">
          {undercategories.map((uc) => (
            <Link
              href={`/category/${uc.slug}`}
              key={uc.id}
              className="group flex flex-col items-start gap-1 p-3 -mx-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
            >
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 leading-tight">
                {uc.name}
              </h4>
            </Link>
          ))}
        </div>
      </div>

                <div className="w-full bg-white dark:bg-slate-800 shadow-sm rounded-sm p-4 mt-8">
                    <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 font-roboto">Tags</h3>
                    <div className="flex items-center flex-wrap gap-2">
                        <Link href="/category/examens"
                            className="px-3 py-1  text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-sm transition hover:bg-blue-500 hover:text-white">examens</Link>
                        <Link href="/postdetails/courslimitesetcontinuitepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-sm transition hover:bg-blue-500 hover:text-white">limites</Link>
                        <Link href="/category/2bacsciencepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-sm transition hover:bg-blue-500 hover:text-white">2bac</Link>
                        <Link href="/postdetails/courslimitesdunesuitepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-sm transition hover:bg-blue-500 hover:text-white">suites</Link>
                        <Link href="#"
                            className="px-3 py-1  text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-sm transition hover:bg-blue-500 hover:text-white">trigonometrie</Link>
                        <Link href="/postdetails/courslimitesetcontinuitepcetsvt"
                            className="px-3 py-1  text-sm border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 rounded-sm transition hover:bg-blue-500 hover:text-white">reciproque</Link>
                        
                    </div>
                </div>
            </div>
  )
}
