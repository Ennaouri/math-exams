import { PrismaClient } from '@prisma/client'
import React from 'react'

const prisma = new PrismaClient()

const fetchPostDetails = async(slug: string) =>{
    const post = await prisma.post.findUnique({
        where:{
            slug
        },
        select:{
            postDetails: true
        }
    })
    if(!post){
        throw new Error()
    }
    return post.postDetails
}
export default async function page({params} : {params : {slug: string}}) {
  const postdetails = await fetchPostDetails(params.slug)
  return (
    <div>page</div>
  )
}
