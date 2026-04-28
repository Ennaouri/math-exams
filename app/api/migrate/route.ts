import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

async function runMigration() {
  try {
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS metadata JSONB');
    await pool.query('ALTER TABLE users ADD COLUMN IF NOT EXISTS image TEXT');
    await pool.query('ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS attribute VARCHAR(50)');
    await pool.query('ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS semestre INTEGER');
    await pool.query('ALTER TABLE "Post" ADD COLUMN IF NOT EXISTS semestre_order INTEGER');
    return { success: true, message: 'Migration completed' };
  } catch (error: any) {
    console.error('Migration error:', error);
    return { error: error.message };
  }
}

export async function GET() {
  const result = await runMigration();
  if (result.error) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}

export async function POST() {
  return GET();
}

export async function PUT() {
  return GET();
}