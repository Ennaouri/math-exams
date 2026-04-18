import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const envKeys = Object.keys(process.env).filter(k => k.startsWith('NEXT'));
  return NextResponse.json({
    postgresUrl: process.env.POSTGRES_URL_NON_POOLING ? 'SET' : 'MISSING',
    nextAuthSecret: process.env.NEXTAUTH_SECRET ? 'SET' : 'MISSING',
    nextAuthUrl: process.env.NEXTAUTH_URL ? 'SET' : 'MISSING',
    nextAuthUrlInternal: process.env.NEXTAUTH_URL_INTERNAL ? 'SET' : 'MISSING',
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'SET' : 'MISSING',
    allNextVars: envKeys,
  });
}