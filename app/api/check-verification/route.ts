import { NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ needsVerification: false });
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ needsVerification: false });
    }

    if (user.metadata) {
      const meta = JSON.parse(user.metadata);
      if (meta.emailVerified === false) {
        return NextResponse.json({ needsVerification: true });
      }
    }

    return NextResponse.json({ needsVerification: false });
  } catch (error) {
    console.error('Check verification error:', error);
    return NextResponse.json({ needsVerification: false });
  }
}