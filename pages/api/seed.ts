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

  await prisma.category.createMany({
    data: [
      // INDIAN //
      {
        name: "'2eme année bac science PC et SVT'",
        thumbnail:
          "'https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/Thumbnail2bacsvtetpc%20(1)-iaCmeJcnZB0U7PGMs7tlyyn1iLxQ73.png",
        description:
          "'Cours, Exercices, Série et devoirs concernant 2eme année Bac PC et SVT.",
        
        created_at: "14:30:00.000Z",
        updated_at: "21:30:00.000Z",
        slug: "2bacsciencepcetsvt"
      }
    ]
    })
 
}

/*ki1lLX3j8Jlju1gv*/