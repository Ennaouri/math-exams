import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const body = await request.json();
    const { name, description, slug, thumbnail, underCategoryId, attribute, semestre, semestre_order } = body;
    const id = parseInt(idStr);
    const result = await pool.query(
      'UPDATE "Post" SET name = $1, description = $2, slug = $3, thumbnail = $4, "underCategory_id" = $5, attribute = $6, semestre = $7, semestre_order = $8 WHERE id = $9 RETURNING *',
      [name, description, slug, thumbnail, underCategoryId, attribute || null, semestre || null, semestre_order || null, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);
    await pool.query('DELETE FROM "Post" WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}