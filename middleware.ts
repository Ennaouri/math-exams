import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/admin') && req.auth?.user?.role !== 'admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
});

export const config = {
  matcher: ['/admin/:path*'],
};