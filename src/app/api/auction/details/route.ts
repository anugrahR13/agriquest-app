import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../shared/auth';

const prisma = new PrismaClient();

// Get auction details
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
    
    // Find the auction with bids
    const auction = await prisma.auction.findUnique({
      where: {
        id: parseInt(id)
      },
      include: {
        bids: {
          include: {
            bidder: true
          },
          orderBy: {
            amount: 'desc'
          }
        }
      }
    });
    
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    // Transform the data for the frontend
    const auctionDetails = {
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
      reportUrl: auction.reportUrl,
      governmentNotes: auction.govtNotes,
      bids: auction.bids.map(bid => ({
        id: bid.id,
        bidderName: `${bid.bidder.firstName} ${bid.bidder.lastName}`,
        amount: bid.amount,
        timestamp: bid.createdAt.toISOString(),
        isWinner: bid.isWinner
      }))
    };
    
    return NextResponse.json({ auction: auctionDetails });
  } catch (error) {
    console.error('Error fetching auction details:', error);
    return NextResponse.json({ error: 'Failed to fetch auction details' }, { status: 500 });
  }
}