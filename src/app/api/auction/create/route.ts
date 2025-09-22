import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../shared/auth';

const prisma = new PrismaClient();

// Create a new auction
export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    const body = await request.json();
    const { farmId, cropScoreId, quantity, startingPrice, endDate } = body;
    
    // Validate input
    if (!farmId || !cropScoreId || !quantity || !startingPrice || !endDate) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    
    // Check if farm belongs to user
    const farm = await prisma.farmProfile.findUnique({
      where: {
        id: farmId,
        farmer: {
          userId: user.id
        }
      },
      include: {
        farmer: {
          include: {
            user: true
          }
        }
      }
    });
    
    if (!farm) {
      return NextResponse.json({ error: 'Farm not found or not owned by user' }, { status: 404 });
    }
    
    // Check if crop score exists and belongs to the farm
    const cropScore = await prisma.cropScore.findUnique({
      where: {
        id: cropScoreId,
        farmId: farmId
      }
    });
    
    if (!cropScore) {
      return NextResponse.json({ error: 'Crop score not found or not associated with this farm' }, { status: 404 });
    }
    
    // Create the auction
    const auction = await prisma.auction.create({
      data: {
        farmId: farmId,
        cropScoreId: cropScoreId,
        cropType: farm.cropType,
        variety: farm.seedVariety,
        quantity: quantity,
        startingPrice: startingPrice,
        currentBid: startingPrice,
        endDate: new Date(endDate),
        farmerName: `${farm.farmer.user.firstName} ${farm.farmer.user.lastName}`,
        farmLocation: farm.location,
        status: 'ACTIVE',
        cropScore: cropScore.score,
        reportUrl: cropScore.reportUrl
      }
    });
    
    return NextResponse.json({ 
      message: 'Auction created successfully', 
      auction: {
        id: auction.id,
        cropType: auction.cropType,
        variety: auction.variety,
        quantity: auction.quantity,
        startingPrice: auction.startingPrice,
        currentBid: auction.currentBid,
        startDate: auction.startDate.toISOString(),
        endDate: auction.endDate.toISOString(),
        farmerName: auction.farmerName,
        farmLocation: auction.farmLocation,
        status: auction.status,
        cropScore: auction.cropScore,
        reportUrl: auction.reportUrl
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json({ error: 'Failed to create auction' }, { status: 500 });
  }
}