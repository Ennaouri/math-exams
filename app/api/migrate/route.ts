import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT');
    await pool.query('ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS attribute VARCHAR(50)');
    return NextResponse.json({ success: true, message: 'Migration completed' });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}