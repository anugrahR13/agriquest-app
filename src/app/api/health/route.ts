import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    return NextResponse.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      database: 'connected',
      message: 'AgriQuest API is running smoothly'
    });
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      timestamp: new Date().toISOString(),
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Database connection failed'
    }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}