import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT p.*, uc.name as under_category_name 
      FROM "Post" p 
      LEFT JOIN "UnderCategory" uc ON uc.id = p."underCategory_id" 
      ORDER BY p.id
    `);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug, thumbnail, underCategoryId } = body;
    const result = await pool.query(
      'INSERT INTO post (name, description, slug, thumbnail, "underCategory_id") VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, slug, thumbnail, underCategoryId]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}