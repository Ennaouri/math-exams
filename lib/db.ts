import pg from 'pg';
import { Category, UnderCategory, Post, PostDetails, User } from './types';
import bcrypt from 'bcrypt';

const { Pool } = pg;

function getConnectionString() {
  const connString = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL;
  if (!connString) return undefined;
  
  // Use libpq compatibility mode to avoid deprecation warning
  let baseUrl = connString;
  if (baseUrl.includes('?')) {
    baseUrl = `${baseUrl}&uselibpqcompat=true&sslmode=require`;
  } else {
    baseUrl = `${baseUrl}?uselibpqcompat=true&sslmode=require`;
  }
  return baseUrl;
}

const pool = new Pool({
  connectionString: getConnectionString(),
  max: 5,
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 10000,
  query_timeout: 10000,
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

export async function getLatestUnderCategories(limit = 4): Promise<UnderCategory[]> {
  const result = await pool.query(
    'SELECT * FROM "UnderCategory" ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
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
  const result = await pool.query('SELECT * FROM "Post" ORDER BY semestre, semestre_order NULLS LAST, created_at DESC');
  return result.rows as Post[];
}

export async function getLatestPosts(limit = 8): Promise<Post[]> {
  const result = await pool.query(
    'SELECT * FROM "Post" ORDER BY created_at DESC LIMIT $1',
    [limit]
  );
  return result.rows as Post[];
}

export async function getExamPosts(limit = 6): Promise<Post[]> {
  const result = await pool.query(
    `SELECT *
     FROM "Post"
     WHERE name ILIKE ANY($1)
        OR description ILIKE ANY($1)
     ORDER BY created_at DESC
     LIMIT $2`,
    [["%examen%", "%national%", "%bac%", "%concours%"], limit]
  );
  return result.rows as Post[];
}

export async function getPostsByUnderCategorySlug(slug: string): Promise<Post[]> {
  const result = await pool.query(
    'SELECT p.* FROM "Post" p JOIN "UnderCategory" uc ON uc.id = p."underCategory_id" WHERE uc.slug = $1 ORDER BY p.semestre, p.semestre_order NULLS LAST, p.created_at DESC',
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

export async function getAllPostDetails(): Promise<PostDetails[]> {
  const result = await pool.query('SELECT * FROM "PostDetails"');
  return result.rows as PostDetails[];
}

export async function getAllPostDetailsWithPostName(): Promise<(PostDetails & { post_name?: string })[]> {
  const result = await pool.query(`
    SELECT pd.*, p.name as post_name 
    FROM "PostDetails" pd 
    JOIN "Post" p ON p.id = pd.post_id
  `);
  return result.rows as (PostDetails & { post_name?: string })[];
}

export interface PostWithCategory {
  post: Post;
  category: Category | null;
  underCategory: UnderCategory | null;
}

export async function getPostWithCategory(slug: string): Promise<PostWithCategory | null> {
  const postResult = await pool.query('SELECT * FROM "Post" WHERE slug = $1', [slug]);
  const post = postResult.rows[0] as Post;
  if (!post) return null;
  
  const underCatResult = await pool.query(
    'SELECT uc.* FROM "UnderCategory" uc WHERE uc.id = $1',
    [post.underCategoryId]
  );
  const underCategory = underCatResult.rows[0] as UnderCategory;
  
  let category: Category | null = null;
  if (underCategory) {
    const catResult = await pool.query(
      'SELECT c.* FROM "Category" c WHERE c.id = $1',
      [underCategory.category_id]
    );
    category = catResult.rows[0] as Category;
  }
  
  return { post, category, underCategory };
}

export async function getRelatedPostsBySlug(slug: string, limit = 6): Promise<Post[]> {
  const currentPost = await getPostBySlug(slug);
  if (!currentPost) return [];

  const result = await pool.query(
    `SELECT *
     FROM "Post"
     WHERE "underCategory_id" = $1
       AND slug <> $2
     ORDER BY semestre NULLS LAST, semestre_order NULLS LAST, created_at DESC
     LIMIT $3`,
    [currentPost.underCategoryId, slug, limit]
  );

  if (result.rows.length > 0) {
    return result.rows as Post[];
  }

  const fallback = await pool.query(
    `SELECT *
     FROM "Post"
     WHERE slug <> $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [slug, limit]
  );

  return fallback.rows as Post[];
}

async function hashPassword(password: string): Promise<string> {
  if (!password) return '';
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function authenticateUser(email: string, password: string): Promise<User | null> {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1',
    [email]
  );
  if (result.rows.length === 0) return null;
  const user = result.rows[0] as User;
  
  if (!user.password) return null;
  
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return null;
  
  delete (user as any).password;
  
  if (user.metadata && typeof user.metadata === 'string' && user.metadata.startsWith('{')) {
    try {
      const meta = JSON.parse(user.metadata);
      if (meta.emailVerified === false) {
        return { ...user, needsVerification: true } as User & { needsVerification: boolean };
      }
    } catch (e) {}
  }
  
  return user;
}

export async function createUser(email: string, password: string, name: string, role: 'admin' | 'user' = 'user', metadata?: string): Promise<User> {
  const hashedPassword = password ? await hashPassword(password) : '';
  const result = await pool.query(
    'INSERT INTO users (email, password, name, role, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [email, hashedPassword, name, role, metadata || null]
  );
  const user = result.rows[0] as User;
  delete (user as any).password;
  return user;
}

export async function updateUser(id: number, data: { name?: string; metadata?: string; image?: string }): Promise<User | null> {
  const updates: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  if (data.name !== undefined) {
    updates.push(`name = $${paramIndex++}`);
    values.push(data.name);
  }
  if (data.metadata !== undefined) {
    updates.push(`metadata = $${paramIndex++}`);
    values.push(data.metadata);
  }
  if (data.image !== undefined) {
    updates.push(`image = $${paramIndex++}`);
    values.push(data.image);
  }

  if (updates.length === 0) return null;

  values.push(id);
  const result = await pool.query(
    `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
    values
  );
  if (result.rows.length === 0) return null;
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

export async function getUserById(id: number): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  if (result.rows.length === 0) return null;
  const user = result.rows[0] as User;
  delete (user as any).password;
  return user;
}

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT id, email, name, role, created_at FROM users');
  return result.rows as User[];
}
