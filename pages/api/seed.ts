import type { NextApiRequest, NextApiResponse } from "next";
import { sql } from "@/lib/db";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await sql`TRUNCATE TABLE post_details CASCADE`;
  await sql`TRUNCATE TABLE post CASCADE`;
  await sql`TRUNCATE TABLE under_category CASCADE`;
  await sql`TRUNCATE TABLE category CASCADE`;

  const categoriesResult = await sql`SELECT * FROM category`;
  const postsResult = await sql`SELECT * FROM post`;
  const postDetailsResult = await sql`SELECT * FROM post_details`;
  const underCategoriesResult = await sql`SELECT * FROM under_category`;

  await sql`
    INSERT INTO category (name, thumbnail, description, slug, created_at, updated_at)
    VALUES (
      '2eme année bac science PC et SVT',
      'https://iwetzulq4xcy3rqa.public.blob.vercel-storage.com/Thumbnail2bacsvtetpc%20(1)-iaCmeJcnZB0U7PGMs7tlyyn1iLxQ73.png',
      'Cours, Exercices, Série et devoirs concernant 2eme année Bac PC et SVT.',
      '2bacsciencepcetsvt',
      NOW(),
      NOW()
    )
  `;

  res.status(200).json({ name: "Seed completed" });
}
