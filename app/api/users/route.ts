import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { updateUser, getUserById } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    console.log('GET /api/users - userId from session:', userId, 'type:', typeof userId);
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }
    
    const parsedId = parseInt(userId);
    console.log('GET /api/users - parsedId:', parsedId, 'isNaN:', isNaN(parsedId));
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const user = await getUserById(parsedId);
    console.log('GET /api/users - user:', user);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found in session' }, { status: 400 });
    }
    
    const parsedId = parseInt(userId);
    if (isNaN(parsedId)) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }
    
    const body = await request.json();
    
    let user: any = null;
    
    // Always store image in metadata (safer than direct column)
    if (body.image) {
      const { getUserById } = await import('@/lib/db');
      const existingUser = await getUserById(parsedId);
      let meta: any = { role: 'user' };
      if (existingUser?.metadata) {
        try {
          meta = JSON.parse(existingUser.metadata);
        } catch (e) {}
      }
      meta.image = body.image;
      user = await updateUser(parsedId, { metadata: JSON.stringify(meta) });
    } else if (Object.keys(body).length > 0) {
      // For other updates like name
      const { getUserById } = await import('@/lib/db');
      const existingUser = await getUserById(parsedId);
      if (existingUser) {
        user = await updateUser(parsedId, body);
      }
    }
    
    if (!user && Object.keys(body).length > 0) {
      return NextResponse.json({ error: 'Failed to update user' }, { status: 404 });
    }

    // Return updated user
    const { getUserById } = await import('@/lib/db');
    const updatedUser = await getUserById(parsedId);
    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Failed to update user' }, { status: 500 });
  }
}