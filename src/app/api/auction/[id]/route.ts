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
    
    // Check if this is a numeric ID (auction) or a string ID (farm)
    if (/^\d+$/.test(id)) {
      // This is an auction ID
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
    } else {
      // This is a farm ID, get the latest auction request for this farm
      const auctionRequest = await prisma.auctionRequest.findFirst({
        where: {
          farmId: id
        },
        include: {
          cropScore: true,
          farm: true
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
            id: auctionRequest.farm.id,
            cropType: auctionRequest.farm.cropType,
            seedVariety: auctionRequest.farm.seedVariety,
            sowingDate: auctionRequest.farm.sowingDate.toISOString(),
            size: auctionRequest.farm.size,
            location: auctionRequest.farm.location
          }
        }
      });
    }
  } catch (error) {
    console.error('Error fetching auction details:', error);
    return NextResponse.json({ error: 'Failed to fetch auction details' }, { status: 500 });
  }
}