import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const searchPattern = `%${query}%`;
    
    const result = await pool.query(
      `SELECT p.*, uc.name as under_category_name, c.name as category_name
       FROM "Post" p
       LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id"
       LEFT JOIN "Category" c ON c.id = uc.category_id
       WHERE p.name ILIKE $1
          OR p.description ILIKE $1
          OR p.slug ILIKE $1
          OR uc.name ILIKE $1
          OR c.name ILIKE $1
       ORDER BY p.created_at DESC
       LIMIT 20`,
      [searchPattern]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json([]);
  }
}