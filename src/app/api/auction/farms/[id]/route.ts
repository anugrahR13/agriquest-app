import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../../shared/auth';

const prisma = new PrismaClient();

// Get auction status for a specific farm
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const { id } = params;
    
    // Find the latest auction request for this farm
    // @ts-ignore - Prisma client typing issue
    const auctionRequest = await prisma.auctionRequest.findFirst({
      where: {
        farmId: id
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
    
    if (!auctionRequest) {
      return NextResponse.json({ error: 'Auction request not found' }, { status: 404 });
    }
    
    // Return the auction request with proper formatting
    return NextResponse.json({
      auctionRequest: {
        id: auctionRequest.id,
        farmId: auctionRequest.farmId,
        cropScoreId: auctionRequest.cropScoreId,
        status: auctionRequest.status,
        govtNotes: auctionRequest.govtNotes,
        createdAt: auctionRequest.createdAt.toISOString(),
        cropScore: {
          score: auctionRequest.cropScore.score,
          reportUrl: auctionRequest.cropScore.reportUrl
        },
        farm: {
          farmer: {
            user: {
              firstName: auctionRequest.farm.farmer.user.firstName,
              lastName: auctionRequest.farm.farmer.user.lastName
            }
          }
        }
      }
    });
  } catch (error) {
    console.error('Error fetching auction status:', error);
    return NextResponse.json({ error: 'Failed to fetch auction status' }, { status: 500 });
  }
}