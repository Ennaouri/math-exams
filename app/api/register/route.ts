import { NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, name, role, niveau } = await request.json();

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    const userMeta = JSON.stringify({ 
      role, 
      niveau, 
      emailVerified: true
    });
    const user = await createUser(email, password, name, 'user', userMeta);
    
    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}