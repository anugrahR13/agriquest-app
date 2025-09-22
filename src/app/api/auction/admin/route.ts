import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../../shared/auth';

const prisma = new PrismaClient();

// Get all auctions for admin dashboard
export async function GET(request: NextRequest) {
  try {
    // Authenticate and authorize admin
    const authResult = await requireAdmin(request);
    
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    
    // Get all auctions with farmer info
    const auctions = await prisma.auction.findMany({
      include: {
        farm: {
          include: {
            farmer: {
              include: {
                user: true
              }
            }
          }
        },
        cropScoreRecord: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data for the frontend
    const auctionList = auctions.map(auction => ({
      id: auction.id,
      cropType: auction.cropType,
      variety: auction.variety || auction.farm.seedVariety,
      quantity: auction.quantity,
      startingPrice: auction.startingPrice,
      currentBid: auction.currentBid,
      startDate: auction.startDate.toISOString(),
      endDate: auction.endDate.toISOString(),
      farmerName: auction.farmerName || `${auction.farm.farmer.user.firstName} ${auction.farm.farmer.user.lastName}`,
      farmLocation: auction.farmLocation || auction.farm.location,
      status: auction.status,
      cropScore: auction.cropScore,
      reportUrl: auction.reportUrl,
      governmentNotes: auction.govtNotes
    }));
    
    return NextResponse.json({ auctions: auctionList });
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json({ error: 'Failed to fetch auctions' }, { status: 500 });
  }
}

// Create a new auction
export async function POST(request: NextRequest) {
  try {
    // Authenticate and authorize admin
    const authResult = await requireAdmin(request);
    
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    const body = await request.json();
    const { 
      farmId, 
      cropScoreId, 
      cropType, 
      variety, 
      quantity, 
      startingPrice, 
      endDate, 
      farmerName, 
      farmLocation,
      cropScore,
      governmentNotes 
    } = body;
    
    // Validate required fields
    if (!farmId || !cropScoreId || !cropType || !quantity || !startingPrice || !endDate) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Create the auction
    const auction = await prisma.auction.create({
      data: {
        farmId,
        cropScoreId: parseInt(cropScoreId),
        cropType,
        variety,
        quantity: parseFloat(quantity),
        startingPrice: parseFloat(startingPrice),
        currentBid: parseFloat(startingPrice),
        endDate: new Date(endDate),
        farmerName,
        farmLocation,
        status: 'ACTIVE',
        cropScore: parseFloat(cropScore) || 0,
        govtNotes: governmentNotes
      }
    });
    
    return NextResponse.json({ 
      message: 'Auction created successfully', 
      auction 
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating auction:', error);
    return NextResponse.json({ error: 'Failed to create auction' }, { status: 500 });
  }
}

// Delete an auction
export async function DELETE(request: NextRequest) {
  try {
    // Authenticate and authorize admin
    const authResult = await requireAdmin(request);
    
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
    }

    const user = authResult.user;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Auction ID is required' }, { status: 400 });
    }
    
    // Delete the auction
    await prisma.auction.delete({
      where: {
        id: parseInt(id)
      }
    });
    
    return NextResponse.json({ message: 'Auction deleted successfully' });
  } catch (error) {
    console.error('Error deleting auction:', error);
    return NextResponse.json({ error: 'Failed to delete auction' }, { status: 500 });
  }
}