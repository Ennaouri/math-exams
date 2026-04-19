import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { name, description, slug, thumbnail, underCategoryId, attribute } = body;
    const id = parseInt(params.id);
    const result = await pool.query(
      'UPDATE "Post" SET name = $1, description = $2, slug = $3, thumbnail = $4, "underCategory_id" = $5, attribute = $6 WHERE id = $7 RETURNING *',
      [name, description, slug, thumbnail, underCategoryId, attribute || null, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = parseInt(params.id);
    await pool.query('DELETE FROM "Post" WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}