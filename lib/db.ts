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

// ─── Categories ──────────────────────────────────────────────────────────────
// Recommended DB index: CREATE INDEX IF NOT EXISTS idx_category_slug ON "Category"(slug);

export async function getCategories(): Promise<Category[]> {
  const result = await pool.query('SELECT * FROM "Category" ORDER BY id');
  return result.rows as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const result = await pool.query('SELECT * FROM "Category" WHERE slug = $1', [slug]);
  return (result.rows[0] as Category) ?? null;
}

// ─── UnderCategories ─────────────────────────────────────────────────────────
// Recommended DB index: CREATE INDEX IF NOT EXISTS idx_undercategory_slug ON "UnderCategory"(slug);
// Recommended DB index: CREATE INDEX IF NOT EXISTS idx_undercategory_category_id ON "UnderCategory"(category_id);

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

// ─── Posts ───────────────────────────────────────────────────────────────────
// Recommended DB index: CREATE INDEX IF NOT EXISTS idx_post_slug ON "Post"(slug);
// Recommended DB index: CREATE INDEX IF NOT EXISTS idx_post_created_at ON "Post"(created_at DESC);
// Recommended DB index: CREATE INDEX IF NOT EXISTS idx_post_undercategory_id ON "Post"("underCategory_id");

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
  // Uses a dedicated attribute column when available, falls back to name/description search
  const result = await pool.query(
    `SELECT *
     FROM "Post"
     WHERE attribute = 'exam'
        OR name ILIKE ANY($1)
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

// ─── PostDetails ─────────────────────────────────────────────────────────────

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

// ─── Post with Category (single JOIN query — was 3 sequential queries) ───────

export interface PostWithCategory {
  post: Post;
  category: Category | null;
  underCategory: UnderCategory | null;
}

export async function getPostWithCategory(slug: string): Promise<PostWithCategory | null> {
  const result = await pool.query<{
    // Post columns
    p_id: number; p_name: string; p_thumbnail: string; p_description: string;
    p_slug: string; p_underCategoryId: number; p_attribute: string;
    p_semestre: number; p_semestre_order: number; p_created_at: Date; p_updated_at: Date;
    // UnderCategory columns
    uc_id: number; uc_name: string; uc_thumbnail: string; uc_description: string;
    uc_slug: string; uc_category_id: number; uc_created_at: Date; uc_updated_at: Date;
    // Category columns
    c_id: number; c_name: string; c_thumbnail: string; c_description: string;
    c_slug: string; c_created_at: Date; c_updated_at: Date;
  }>(
    `SELECT
       p.id            AS p_id,
       p.name          AS p_name,
       p.thumbnail     AS p_thumbnail,
       p.description   AS p_description,
       p.slug          AS p_slug,
       p."underCategory_id" AS "p_underCategoryId",
       p.attribute     AS p_attribute,
       p.semestre      AS p_semestre,
       p.semestre_order AS p_semestre_order,
       p.created_at    AS p_created_at,
       p.updated_at    AS p_updated_at,
       uc.id           AS uc_id,
       uc.name         AS uc_name,
       uc.thumbnail    AS uc_thumbnail,
       uc.description  AS uc_description,
       uc.slug         AS uc_slug,
       uc.category_id  AS uc_category_id,
       uc.created_at   AS uc_created_at,
       uc.updated_at   AS uc_updated_at,
       c.id            AS c_id,
       c.name          AS c_name,
       c.thumbnail     AS c_thumbnail,
       c.description   AS c_description,
       c.slug          AS c_slug,
       c.created_at    AS c_created_at,
       c.updated_at    AS c_updated_at
     FROM "Post" p
     LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id"
     LEFT JOIN "Category" c ON c.id = uc.category_id
     WHERE p.slug = $1`,
    [slug]
  );

  if (!result.rows.length) return null;
  const row = result.rows[0];

  const post: Post = {
    id: row.p_id,
    name: row.p_name,
    thumbnail: row.p_thumbnail,
    description: row.p_description,
    slug: row.p_slug,
    underCategoryId: row["p_underCategoryId"],
    attribute: row.p_attribute,
    semestre: row.p_semestre,
    semestre_order: row.p_semestre_order,
    created_at: row.p_created_at,
    updated_at: row.p_updated_at,
  };

  const underCategory: UnderCategory | null = row.uc_id
    ? {
        id: row.uc_id,
        name: row.uc_name,
        thumbnail: row.uc_thumbnail,
        description: row.uc_description,
        slug: row.uc_slug,
        category_id: row.uc_category_id,
        created_at: row.uc_created_at,
        updated_at: row.uc_updated_at,
      }
    : null;

  const category: Category | null = row.c_id
    ? {
        id: row.c_id,
        name: row.c_name,
        thumbnail: row.c_thumbnail,
        description: row.c_description,
        slug: row.c_slug,
        created_at: row.c_created_at,
        updated_at: row.c_updated_at,
      }
    : null;

  return { post, category, underCategory };
}

// ─── Related posts (single query using underCategoryId — was 2 sequential) ──

export async function getRelatedPostsBySlug(slug: string, limit = 6): Promise<Post[]> {
  // Single query: fetch the current post and its related posts in one round-trip
  const result = await pool.query<Post & { target_under_id: number }>(
    `WITH target AS (
       SELECT "underCategory_id" FROM "Post" WHERE slug = $1
     )
     SELECT p.* FROM "Post" p, target
     WHERE p."underCategory_id" = target."underCategory_id"
       AND p.slug <> $1
     ORDER BY p.semestre NULLS LAST, p.semestre_order NULLS LAST, p.created_at DESC
     LIMIT $2`,
    [slug, limit]
  );

  if (result.rows.length > 0) {
    return result.rows as Post[];
  }

  // Fallback: return latest posts if no same-category posts found
  const fallback = await pool.query(
    `SELECT * FROM "Post" WHERE slug <> $1 ORDER BY created_at DESC LIMIT $2`,
    [slug, limit]
  );
  return fallback.rows as Post[];
}

// ─── Users ───────────────────────────────────────────────────────────────────

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

  // Safely parse metadata JSON to check email verification status
  if (user.metadata && typeof user.metadata === 'string') {
    try {
      const meta = JSON.parse(user.metadata);
      if (meta?.emailVerified === false) {
        return { ...user, needsVerification: true } as User & { needsVerification: boolean };
      }
    } catch {
      // Metadata is not valid JSON — ignore
    }
  }

  return user;
}

export async function createUser(
  email: string,
  password: string,
  name: string,
  role: 'admin' | 'user' = 'user',
  metadata?: string
): Promise<User> {
  const hashedPassword = password ? await hashPassword(password) : '';
  const result = await pool.query(
    'INSERT INTO users (email, password, name, role, metadata) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [email, hashedPassword, name, role, metadata || null]
  );
  const user = result.rows[0] as User;
  delete (user as any).password;
  return user;
}

export async function updateUser(
  id: number,
  data: { name?: string; metadata?: string; image?: string }
): Promise<User | null> {
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
