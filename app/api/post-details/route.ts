import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT pd.*, p.name as post_name 
      FROM "PostDetails" pd 
      LEFT JOIN "Post" p ON p.id = pd.post_id 
      ORDER BY pd."order" ASC, pd.id ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, slug, thumbnail, post_id, order } = body;
    const result = await pool.query(
      'INSERT INTO "PostDetails" (name, description, slug, thumbnail, post_id, "order", created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *',
      [name, description, slug, thumbnail, post_id, order || 0]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}