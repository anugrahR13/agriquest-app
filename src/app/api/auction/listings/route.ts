import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../shared/auth';

const prisma = new PrismaClient();

// Get all active auction listings
export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if (authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Get all active auctions (approved and open for bidding)
    // @ts-ignore - Prisma client typing issue
    const auctions = await prisma.auctionRequest.findMany({
      where: {
        status: 'APPROVED',
        // Add date filtering for active auctions
        // Assuming we have startDate and endDate fields in a future enhancement
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
    const auctionListings = auctions.map((auction: any) => ({
      id: auction.id,
      cropType: auction.farm.cropType,
      variety: auction.farm.seedVariety,
      quantity: auction.farm.size, // Using farm size as quantity for demo
      startingPrice: Math.floor(auction.cropScore.score * 100), // Mock pricing based on crop score
      currentBid: Math.floor(auction.cropScore.score * 110), // Mock current bid
      startDate: new Date(auction.createdAt).toISOString(),
      endDate: new Date(new Date(auction.createdAt).getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days from creation
      farmerName: `${auction.farm.farmer.user.firstName} ${auction.farm.farmer.user.lastName}`,
      farmLocation: auction.farm.location,
      status: auction.status
    }));
    
    return NextResponse.json({ auctions: auctionListings });
  } catch (error) {
    console.error('Error fetching auction listings:', error);
    return NextResponse.json({ error: 'Failed to fetch auction listings' }, { status: 500 });
  }
}