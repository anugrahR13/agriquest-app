import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../shared/auth';

const prisma = new PrismaClient();

// Get all farms for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Get all farms for the user
    const farms = await prisma.farmProfile.findMany({
      where: {
        userId: user.id
      },
      include: {
        cropScores: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data for the frontend
    const farmList = farms.map(farm => ({
      id: farm.id,
      cropType: farm.cropType,
      seedVariety: farm.seedVariety,
      sowingDate: farm.sowingDate.toISOString(),
      size: farm.size,
      location: farm.location,
      cropScores: farm.cropScores.map(score => ({
        id: score.id,
        score: score.score,
        reportUrl: score.reportUrl,
        createdAt: score.createdAt.toISOString()
      }))
    }));
    
    return NextResponse.json({ farms: farmList });
  } catch (error) {
    console.error('Error fetching farms:', error);
    return NextResponse.json({ error: 'Failed to fetch farms' }, { status: 500 });
  }
}