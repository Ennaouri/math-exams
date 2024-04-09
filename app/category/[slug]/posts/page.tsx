import { PrismaClient } from '@prisma/client'
import React from 'react'
import SmallCard from '../../../components/SmallCard'


import type { Metadata, ResolvingMetadata } from 'next'
 
type Props = {
  params: { slug: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

const prisma = new PrismaClient()

const fetchUnderCategory = async(slug: string) =>{
  const underCategory = await prisma.underCategory.findUnique({
      where:{
          slug
      }
  })
  if(!underCategory){
      throw new Error("error")
  }
  return underCategory
}
 
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const id = params.slug
 const category = await fetchUnderCategory(id)
  return {
    title: `UnderCategory Posts | ${category.name}`
  }
}

const fetchPosts = async(slug: string) =>{
    const underCategories = await prisma.underCategory.findUnique({
        where:{
            slug
        },
        select:{
            posts: true
        }
    })
    if(!underCategories){
        throw new Error("error")
    }
    return underCategories.posts
}
export default async function CategoryPosts({params} : {params : {slug: string}}) {
    console.log("slug is ", params.slug)
    const posts = await fetchPosts(params.slug)
    console.log("posts are : ", posts)
  return (
    
<div >
         <div className="flex bg-white px-3 py-2 justify-between items-center rounded-sm mb-5">
        <h5 className="text-base uppercase font-semibold font-roboto">Popular Posts</h5>
        
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {posts.map((post) => (
          <SmallCard post={post} />
        ))}
      </div>
    </div>
  )
}
