import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Only initialize Prisma Client if we have a DATABASE_URL
const hasDatabaseUrl = process.env.DATABASE_URL && process.env.DATABASE_URL !== '';
let prisma: PrismaClient | null = null;

if (hasDatabaseUrl) {
  prisma = new PrismaClient();
}

export async function GET() {
  // If no database URL is configured, return a simple response
  if (!hasDatabaseUrl) {
    return NextResponse.json({ 
      status: 'ok', 
      message: 'AgriQuest API is running (database not configured)',
      database: 'not_configured',
      timestamp: new Date().toISOString()
    });
  }

  try {
    // Test database connection
    await prisma!.$connect();
    
    // Perform a simple query to verify the connection
    const userCount = await prisma!.$queryRaw`SELECT 1`;
    
    // Close the connection
    await prisma!.$disconnect();
    
    return NextResponse.json({ 
      status: 'ok', 
      message: 'AgriQuest API is running',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    // Close the connection in case of error
    if (prisma) {
      await prisma.$disconnect();
    }
    
    return NextResponse.json({ 
      status: 'error', 
      message: 'AgriQuest API has database issues',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}