import type { NextApiRequest, NextApiResponse } from "next";
import { pool } from "@/lib/db";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await pool.query(`TRUNCATE TABLE post_details CASCADE`);
  await pool.query(`TRUNCATE TABLE post CASCADE`);
  await pool.query(`TRUNCATE TABLE under_category CASCADE`);
  await pool.query(`TRUNCATE TABLE category CASCADE`);

  const categoriesResult = await pool.query('SELECT * FROM category');
  const postsResult = await pool.query('SELECT * FROM post');
  const postDetailsResult = await pool.query('SELECT * FROM post_details');
  const underCategoriesResult = await pool.query('SELECT * FROM under_category');

  res.status(200).json({ name: "Seed completed" });
}