// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";


const prisma = new PrismaClient();
type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
    await prisma.category.deleteMany();
    await prisma.underCategory.deleteMany();
  await prisma.post.deleteMany();
  await prisma.postDetails.deleteMany();

  const categories = await prisma.category.findMany();
  const posts = await prisma.post.findMany();
  const postDetails = await prisma.postDetails.findMany();
  const underCategories = await prisma.underCategory.findMany()

 
}

/*ki1lLX3j8Jlju1gv*/