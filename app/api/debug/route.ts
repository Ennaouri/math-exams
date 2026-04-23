import { NextRequest, NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import bcrypt from 'bcrypt';

async function handleRequest(request: NextRequest) {
  try {
    let body: any = {};
    let secret: string | null = null;
    
    if (request.method === 'POST') {
      body = await request.json();
      secret = body.secret;
    } else {
      const { searchParams } = new URL(request.url);
      body = {
        email: searchParams.get('email'),
        password: searchParams.get('password'),
        name: searchParams.get('name'),
        role: searchParams.get('role'),
        secret: searchParams.get('secret'),
      };
      secret = body.secret;
    }
    
    const { email, password, name, role } = body;
    
    if (secret !== 'mysecret123') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'admin';
    const userName = name || 'Admin';
    
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (existingUser.rows.length > 0) {
      await pool.query(
        'UPDATE users SET password = $1, role = $2, name = $3 WHERE email = $4',
        [hashedPassword, userRole, userName, email]
      );
    } else {
      await pool.query(
        'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
        [email, hashedPassword, userName, userRole]
      );
    }
    
    return NextResponse.json({ success: true, message: `User ${existingUser.rows.length > 0 ? 'updated' : 'created'}` });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  return handleRequest(request);
}

export async function POST(request: NextRequest) {
  return handleRequest(request);
}