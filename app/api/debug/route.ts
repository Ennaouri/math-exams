import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const allEnv = Object.keys(process.env).sort();
  const authRelated = allEnv.filter(k => 
    k.toLowerCase().includes('auth') || 
    k.toLowerCase().includes('google') || 
    k.toLowerCase().includes('postgres') ||
    k.toLowerCase().includes('blob')
  );
  return NextResponse.json({
    allEnvCount: allEnv.length,
    authRelated,
  });
}