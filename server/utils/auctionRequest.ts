import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Submit an auction request for a farmer's crop
 * @param farmId - The ID of the farm
 * @param cropScoreId - The ID of the crop score record
 * @returns The created auction request
 */
export async function submitAuctionRequest(farmId: string, cropScoreId: number) {
  try {
    // Check if there's already a pending request
    const existingRequest = await prisma.auctionRequest.findFirst({
      where: {
        farmId,
        status: 'PENDING'
      }
    });

    if (existingRequest) {
      throw new Error('Auction request already exists for this farm');
    }

    // Create auction request
    const auctionRequest = await prisma.auctionRequest.create({
      data: {
        farmId,
        cropScoreId,
        status: 'PENDING'
      }
    });

    // In a real implementation, we would send this to a government endpoint
    // For now, we'll just log it
    console.log(`Auction request submitted for farm ${farmId} with crop score ${cropScoreId}`);
    console.log('In a real implementation, this would be sent to government authorities');

    return {
      success: true,
      auctionRequest
    };
  } catch (error) {
    console.error('Error submitting auction request:', error);
    throw error;
  }
}

/**
 * Get auction request status by farm ID
 * @param farmId - The ID of the farm
 * @returns The auction request with status
 */
export async function getAuctionRequestStatus(farmId: string) {
  try {
    const auctionRequest = await prisma.auctionRequest.findFirst({
      where: { farmId },
      orderBy: { createdAt: 'desc' },
      include: {
        cropScore: true,
        farm: {
          include: {
            farmer: true
          }
        }
      }
    });

    return auctionRequest;
  } catch (error) {
    console.error('Error fetching auction request status:', error);
    throw error;
  }
}

/**
 * Update auction request status (for government authority use)
 * @param auctionRequestId - The ID of the auction request
 * @param status - The new status
 * @param govtNotes - Notes from government authority
 * @returns The updated auction request
 */
export async function updateAuctionRequestStatus(
  auctionRequestId: number, 
  status: string, 
  govtNotes?: string
) {
  try {
    const auctionRequest = await prisma.auctionRequest.update({
      where: { id: auctionRequestId },
      data: {
        status,
        govtNotes
      }
    });

    // Notify farmer about status update
    console.log(`Auction request ${auctionRequestId} status updated to ${status}`);
    
    // In a real implementation, we would send a notification to the farmer
    // For now, we'll just log it

    return {
      success: true,
      auctionRequest
    };
  } catch (error) {
    console.error('Error updating auction request status:', error);
    throw error;
  }
}