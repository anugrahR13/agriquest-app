import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../shared/auth';

const prisma = new PrismaClient();

// Get crop score by farm ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ farmId: string }> }
) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    // Resolve the params promise
    const resolvedParams = await params;
    const { farmId } = resolvedParams;
    
    // Find the crop score for this farm
    const cropScore = await prisma.cropScore.findFirst({
      where: {
        farmId: farmId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    if (!cropScore) {
      return NextResponse.json({ error: 'Crop score not found' }, { status: 404 });
    }
    
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