import { NextResponse } from 'next/server';
import { getUserByEmail, updateUser } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { token, email } = await request.json();

    if (!token || !email) {
      return NextResponse.json(
        { error: 'Token and email are required', success: false },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'User not found', success: false },
        { status: 404 }
      );
    }

    const metadata = user.metadata ? JSON.parse(user.metadata) : {};
    
    if (!metadata.verifyToken || metadata.verifyToken !== token) {
      return NextResponse.json(
        { error: 'Invalid token', success: false },
        { status: 400 }
      );
    }

    if (metadata.verifyExpires && new Date(metadata.verifyExpires) < new Date()) {
      return NextResponse.json(
        { error: 'Token expired', success: false },
        { status: 400 }
      );
    }

    if (metadata.emailVerified) {
      return NextResponse.json(
        { message: 'Email already verified', success: true }
      );
    }

    metadata.emailVerified = true;
    delete metadata.verifyToken;
    delete metadata.verifyExpires;

    await updateUser(user.id, { metadata: JSON.stringify(metadata) });

    return NextResponse.json({
      message: 'Email verified successfully',
      success: true
    });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify email', success: false },
      { status: 500 }
    );
  }
}