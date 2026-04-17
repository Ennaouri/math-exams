import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { getUnderCategoriesByCategorySlug, getCategoryBySlug } from '@/lib/db';
import CarouselCard from '../../components/CarouselCard';
import SmallCard from '../components/SmallCard';

export const dynamic = 'force-dynamic';
  
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CategoryLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { slug: string }
}) {
  const underCategories = await getUnderCategoriesByCategorySlug(params.slug);

  return (
    <>
      <div>
        <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
          <h5 className="text-base uppercase font-semibold font-roboto">
            Under Categories
          </h5>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {underCategories.map((underCategory, index) => (
           <div key={index}>
                        <SmallCard undercategory={underCategory} />
                      </div>
                    ))}
        </div>
      </div>
      {children}
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script dangerouslySetInnerHTML={{ __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});" }} />
  </>
  )
}
