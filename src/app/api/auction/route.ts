import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../shared/auth';

const prisma = new PrismaClient();

// Get auction data or specific auction by farmId
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Get the latest auction request for the farmer
    // @ts-ignore - Prisma client typing issue
    const auctionRequest = await prisma.auctionRequest.findFirst({
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

// Apply for auction
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    const body = await request.json();
    const { farmId, cropScoreId } = body;
    
    // Validate input
    if (!farmId || !cropScoreId) {
      return NextResponse.json({ error: 'Farm ID and Crop Score ID are required' }, { status: 400 });
    }
    
    // Check if farm belongs to user
    // @ts-ignore - Prisma client typing issue
    const farm = await prisma.farmProfile.findUnique({
      where: {
        id: farmId,
        farmer: {
          userId: user.id
        }
      }
    });
    
    if (!farm) {
      return NextResponse.json({ error: 'Farm not found or not owned by user' }, { status: 404 });
    }
    
    // Check if crop score exists
    // @ts-ignore - Prisma client typing issue
    const cropScore = await prisma.cropScore.findUnique({
      where: {
        id: cropScoreId,
        farmId: farmId
      }
    });
    
    if (!cropScore) {
      return NextResponse.json({ error: 'Crop score not found' }, { status: 404 });
    }
    
    // Check if auction request already exists
    // @ts-ignore - Prisma client typing issue
    const existingRequest = await prisma.auctionRequest.findFirst({
      where: {
        farmId: farmId,
        cropScoreId: cropScoreId
      }
    });
    
    if (existingRequest) {
      return NextResponse.json({ error: 'Auction request already exists for this crop score' }, { status: 400 });
    }
    
    // Create auction request
    // @ts-ignore - Prisma client typing issue
    const auctionRequest = await prisma.auctionRequest.create({
      data: {
        farmId: farmId,
        cropScoreId: cropScoreId,
        status: 'PENDING'
      }
    });
    
    return NextResponse.json({ 
      message: 'Auction application submitted successfully', 
      auctionRequest 
    }, { status: 201 });
  } catch (error) {
    console.error('Error submitting auction application:', error);
    return NextResponse.json({ error: 'Failed to submit auction application' }, { status: 500 });
  }
}