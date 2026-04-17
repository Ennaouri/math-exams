import 'dotenv/config';
import pg from 'pg';
import { Category, UnderCategory, Post, PostDetails } from './types';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
});

export const sql = pool;

export async function getCategories(): Promise<Category[]> {
  const result = await pool.query('SELECT * FROM category');
  return result.rows as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const result = await pool.query('SELECT * FROM category WHERE slug = $1', [slug]);
  return (result.rows[0] as Category) ?? null;
}

export async function getUnderCategories(): Promise<UnderCategory[]> {
  const result = await pool.query('SELECT * FROM under_category');
  return result.rows as UnderCategory[];
}

export async function getUnderCategoriesByCategorySlug(slug: string): Promise<UnderCategory[]> {
  const result = await pool.query(
    'SELECT uc.* FROM under_category uc JOIN category c ON c.id = uc.category_id WHERE c.slug = $1',
    [slug]
  );
  return result.rows as UnderCategory[];
}

export async function getUnderCategoryBySlug(slug: string): Promise<UnderCategory | null> {
  const result = await pool.query('SELECT * FROM under_category WHERE slug = $1', [slug]);
  return (result.rows[0] as UnderCategory) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  const result = await pool.query('SELECT * FROM post');
  return result.rows as Post[];
}

export async function getPostsByUnderCategorySlug(slug: string): Promise<Post[]> {
  const result = await pool.query(
    'SELECT p.* FROM post p JOIN under_category uc ON uc.id = p.under_category_id WHERE uc.slug = $1',
    [slug]
  );
  return result.rows as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await pool.query('SELECT * FROM post WHERE slug = $1', [slug]);
  return (result.rows[0] as Post) ?? null;
}

export async function getPostDetailsByPostSlug(slug: string): Promise<PostDetails[]> {
  const result = await pool.query(
    'SELECT pd.* FROM post_details pd JOIN post p ON p.id = pd.post_id WHERE p.slug = $1',
    [slug]
  );
  return result.rows as PostDetails[];
}