import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../shared/auth';

const prisma = new PrismaClient();

// Get auction status for the authenticated user
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Get all auction requests for the farmer
    const auctionRequests = await prisma.auctionRequest.findMany({
      where: {
        farm: {
          farmer: {
            userId: user.id
          }
        }
      },
      include: {
        cropScore: true,
        farm: {
          include: {
            farmer: {
              include: {
                user: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data for the frontend
    const auctionStatusList = auctionRequests.map(request => ({
      id: request.id,
      farmId: request.farmId,
      cropScoreId: request.cropScoreId,
      status: request.status,
      govtNotes: request.govtNotes,
      createdAt: request.createdAt.toISOString(),
      cropScore: {
        score: request.cropScore.score,
        reportUrl: request.cropScore.reportUrl
      },
      farm: {
        farmer: {
          user: {
            firstName: request.farm.farmer.user.firstName,
            lastName: request.farm.farmer.user.lastName
          },
          farmName: request.farm.farmer.farmName,
          region: request.farm.farmer.region,
          village: request.farm.farmer.village
        },
        cropType: request.farm.cropType,
        sowingDate: request.farm.sowingDate.toISOString()
      }
    }));
    
    return NextResponse.json({ auctionRequests: auctionStatusList });
  } catch (error) {
    console.error('Error fetching auction status:', error);
    return NextResponse.json({ error: 'Failed to fetch auction status' }, { status: 500 });
  }
}