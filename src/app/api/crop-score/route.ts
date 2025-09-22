import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../shared/auth';

const prisma = new PrismaClient();

// Get crop score by farm ID
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Find the farm profile for this user
    // @ts-ignore - Prisma client typing issue
    const farmProfile = await prisma.farmProfile.findFirst({
      where: {
        userId: user.id
      },
      include: {
        cropScores: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    });
    
    if (!farmProfile || farmProfile.cropScores.length === 0) {
      return NextResponse.json({ error: 'Crop score not found' }, { status: 404 });
    }
    
    const cropScore = farmProfile.cropScores[0];
    
    // Return the crop score with proper formatting
    return NextResponse.json({
      cropScore: {
        id: cropScore.id,
        farmId: cropScore.farmId,
        score: cropScore.score,
        reportUrl: cropScore.reportUrl,
        createdAt: cropScore.createdAt.toISOString()
      }
    });
  } catch (error) {
    console.error('Error fetching crop score:', error);
    return NextResponse.json({ error: 'Failed to fetch crop score' }, { status: 500 });
  }
}