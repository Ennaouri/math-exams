import 'dotenv/config';
import pg from 'pg';
import { Category, UnderCategory, Post, PostDetails, User } from './types';
import crypto from 'crypto';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL,
});

export const sql = pool;
export { pool };

export async function getCategories(): Promise<Category[]> {
  const result = await pool.query('SELECT * FROM "Category"');
  return result.rows as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const result = await pool.query('SELECT * FROM "Category" WHERE slug = $1', [slug]);
  return (result.rows[0] as Category) ?? null;
}

export async function getUnderCategories(): Promise<UnderCategory[]> {
  const result = await pool.query('SELECT * FROM "UnderCategory"');
  return result.rows as UnderCategory[];
}

export async function getUnderCategoriesByCategorySlug(slug: string): Promise<UnderCategory[]> {
  const result = await pool.query(
    'SELECT uc.* FROM "UnderCategory" uc JOIN "Category" c ON c.id = uc.category_id WHERE c.slug = $1',
    [slug]
  );
  return result.rows as UnderCategory[];
}

export async function getUnderCategoryBySlug(slug: string): Promise<UnderCategory | null> {
  const result = await pool.query('SELECT * FROM "UnderCategory" WHERE slug = $1', [slug]);
  return (result.rows[0] as UnderCategory) ?? null;
}

export async function getPosts(): Promise<Post[]> {
  const result = await pool.query('SELECT * FROM "Post"');
  return result.rows as Post[];
}

export async function getPostsByUnderCategorySlug(slug: string): Promise<Post[]> {
  const result = await pool.query(
    'SELECT p.* FROM "Post" p JOIN "UnderCategory" uc ON uc.id = p.under_category_id WHERE uc.slug = $1',
    [slug]
  );
  return result.rows as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const result = await pool.query('SELECT * FROM "Post" WHERE slug = $1', [slug]);
  return (result.rows[0] as Post) ?? null;
}

export async function getPostDetailsByPostSlug(slug: string): Promise<PostDetails[]> {
  const result = await pool.query(
    'SELECT pd.* FROM "PostDetails" pd JOIN "Post" p ON p.id = pd.post_id WHERE p.slug = $1',
    [slug]
  );
  return result.rows as PostDetails[];
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const hashedPassword = hashPassword(password);
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2',
    [email, hashedPassword]
  );
  if (result.rows.length === 0) return null;
  const user = result.rows[0] as User;
  delete (user as any).password;
  return user;
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user'): Promise<User> {
  const hashedPassword = hashPassword(password);
  const result = await pool.query(
    'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [email, hashedPassword, name, role]
  );
  const user = result.rows[0] as User;
  delete (user as any).password;
  return user;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  if (result.rows.length === 0) return null;
  const user = result.rows[0] as User;
  delete (user as any).password;
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT id, email, name, role, created_at FROM users');
  return result.rows as User[];
}