import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT uc.*, c.name as category_name 
      FROM "UnderCategory" uc 
      LEFT JOIN "Category" c ON c.id = uc.category_id 
      ORDER BY uc.id
    `);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug, thumbnail, category_id } = body;
    const result = await pool.query(
      'INSERT INTO "UnderCategory" (name, description, slug, thumbnail, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, slug, thumbnail, category_id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}