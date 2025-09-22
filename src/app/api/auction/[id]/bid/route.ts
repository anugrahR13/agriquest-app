import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken } from '../../../shared/auth';

const prisma = new PrismaClient();

// Place a bid on an auction
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Authenticate user
    const authResult = await authenticateToken(request);
    
    if ('error' in authResult && authResult.error) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    const { id } = params;
    const body = await request.json();
    const { amount } = body;
    
    // Validate input
    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Valid bid amount is required' }, { status: 400 });
    }
    
    // Find the auction
    const auction = await prisma.auction.findUnique({
      where: {
        id: parseInt(id)
      }
    });
    
    if (!auction) {
      return NextResponse.json({ error: 'Auction not found' }, { status: 404 });
    }
    
    // Check if auction is active
    if (auction.status !== 'ACTIVE' || new Date(auction.endDate) < new Date()) {
      return NextResponse.json({ error: 'Auction is not active' }, { status: 400 });
    }
    
    // Check if bid amount is higher than current bid
    if (amount <= auction.currentBid) {
      return NextResponse.json({ error: 'Bid amount must be higher than current bid' }, { status: 400 });
    }
    
    // Create the bid
    const bid = await prisma.bid.create({
      data: {
        auctionId: auction.id,
        bidderId: user.id,
        amount: amount
      }
    });
    
    // Update auction current bid
    await prisma.auction.update({
      where: {
        id: auction.id
      },
      data: {
        currentBid: amount
      }
    });
    
    return NextResponse.json({ 
      message: 'Bid placed successfully',
      bid: {
        id: bid.id,
        amount: bid.amount,
        timestamp: bid.createdAt.toISOString()
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json({ error: 'Failed to place bid' }, { status: 500 });
  }
}