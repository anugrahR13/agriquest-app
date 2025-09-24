import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../shared/auth';

const prisma = new PrismaClient();

// Get all active auction listings
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Get all active auctions (approved and open for bidding)
    const auctions = await prisma.auction.findMany({
      where: {
        status: 'ACTIVE',
        endDate: {
          gte: new Date()
        }
      },
      include: {
        farm: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data for the frontend
    const auctionListings = auctions.map((auction: any) => ({
      id: auction.id,
      cropType: auction.cropType,
      variety: auction.variety || auction.farm.seedVariety,
      quantity: auction.quantity,
      startingPrice: auction.startingPrice,
      currentBid: auction.currentBid,
      startDate: auction.startDate.toISOString(),
      endDate: auction.endDate.toISOString(),
      farmerName: auction.farmerName || 'Unknown Farmer',
      farmLocation: auction.farmLocation || auction.farm.location,
      status: auction.status
    }));
    
    return NextResponse.json({ auctions: auctionListings });
  } catch (error) {
    console.error('Error fetching auction listings:', error);
    return NextResponse.json({ error: 'Failed to fetch auction listings' }, { status: 500 });
  }
}