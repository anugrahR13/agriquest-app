import { NextResponse } from 'next/server';

export async function GET() {
  // Check if required environment variables are set
  const hasDatabaseUrl = !!process.env.DATABASE_URL && process.env.DATABASE_URL !== '';
  const hasJwtSecret = !!process.env.JWT_SECRET && process.env.JWT_SECRET !== '';
  const hasAppUrl = !!process.env.NEXT_PUBLIC_APP_URL && process.env.NEXT_PUBLIC_APP_URL !== '';
  
  // Check if we're in production mode
  const isProduction = process.env.NODE_ENV === 'production';
  
  return NextResponse.json({ 
    status: 'ready', 
    message: 'AgriQuest is ready for deployment',
    checks: {
      databaseUrl: hasDatabaseUrl,
      jwtSecret: hasJwtSecret,
      appUrl: hasAppUrl,
      productionMode: isProduction
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}