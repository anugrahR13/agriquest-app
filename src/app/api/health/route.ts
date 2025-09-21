import { NextResponse } from 'next/server';

export async function GET() {
  // Simple health check that doesn't require database connection
  return NextResponse.json({ 
    status: 'ok', 
    message: 'AgriQuest API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}
