import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    // Try to detect existing tables (case insensitive)
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    return NextResponse.json({ tables: tables.rows.map(t => t.table_name) });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}