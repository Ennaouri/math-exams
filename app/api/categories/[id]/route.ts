import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const body = await request.json();
    const { name, description, slug, thumbnail } = body;
    const id = parseInt(idStr);

    const result = await pool.query(
      'UPDATE "Category" SET name = $1, description = $2, slug = $3, thumbnail = $4 WHERE id = $5 RETURNING *',
      [name, description, slug, thumbnail, id]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params;
    const id = parseInt(idStr);

    await pool.query('DELETE FROM "Category" WHERE id = $1', [id]);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}