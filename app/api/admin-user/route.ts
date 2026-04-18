import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user
      await pool.query(
        'UPDATE users SET password = $1, role = $2 WHERE email = $3',
        [hashedPassword, 'admin', email]
      );
      return NextResponse.json({ success: true, message: 'User updated to admin' });
    } else {
      // Create new admin user
      await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        [email, hashedPassword, 'Admin', 'admin']
      );
      return NextResponse.json({ success: true, message: 'Admin user created' });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    // List all users (without password)
    const result = await pool.query('SELECT id, email, name, role, created_at FROM users');
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}