import React from 'react'
import type { Metadata, ResolvingMetadata } from 'next'
import { PrismaClient } from '@prisma/client'
 
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const prisma = new PrismaClient()
const fetchCategory = async (slug : string) => {
  const category = await prisma.category.findUnique({
      where : {
          slug
      }
  })

  if(!category){
      throw new Error
  }
  return category
}
 
/* export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.slug
  return {
    title: `Category | ${id}`
  }
} */

export default function CategoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      {children}
    <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js"></script>
    <script dangerouslySetInnerHTML={{ __html: "(window.adsbygoogle = window.adsbygoogle || []).push({});" }} />
  </>
  )
}
