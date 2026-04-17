import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT pd.*, p.name as post_name 
      FROM post_details pd 
      LEFT JOIN post p ON p.id = pd.post_id 
      ORDER BY pd.id
    `);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug, thumbnail, post_id } = body;
    const result = await pool.query(
      'INSERT INTO post_details (name, description, slug, thumbnail, post_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, slug, thumbnail, post_id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}