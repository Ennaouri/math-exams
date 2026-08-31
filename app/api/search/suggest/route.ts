import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// GET /api/search/suggest?q=XXX — returns top 6 matching post names fast
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = (searchParams.get('q') || '').trim();

    if (q.length < 2) return NextResponse.json([]);

    const result = await pool.query(
      `SELECT p.name, p.slug, c.name AS category_name, c.slug AS category_slug
       FROM "Post" p
       LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id"
       LEFT JOIN "Category"      c  ON c.id  = uc.category_id
       WHERE p.name ILIKE $1
       ORDER BY p.created_at DESC
       LIMIT 6`,
      [`%${q}%`]
    );

    return NextResponse.json(result.rows);
  } catch {
    return NextResponse.json([]);
  }
}
