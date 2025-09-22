import { PrismaClient } from '@prisma/client';
import { io } from '../index';

const prisma = new PrismaClient();

/**
 * Award points and badges for high crop scores
 * @param farmId - The ID of the farm
 * @param cropScore - The final crop score (0-10)
 * @returns The awarded points and badges
 */
export async function awardPointsAndBadgesForCropScore(farmId: string, cropScore: number) {
  try {
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmId },
      include: {
        user: true
      }
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    // Calculate points based on crop score
    // Higher scores get more points (0-10 score maps to 0-500 points)
    const points = Math.round(cropScore * 50);
    
    // Update farmer's total points
    const updatedFarmer = await prisma.farmer.update({
      where: { id: farmId },
      data: {
        totalPoints: {
          increment: points
        }
      }
    });

    // Check for badges to award
    const badgesToAward: string[] = [];
    
    // Award "Top Crop Score" badge for scores 9+
    if (cropScore >= 9) {
      const topCropBadge = await prisma.badge.findFirst({
        where: { name: 'Top Crop Score' }
      });
      
      if (topCropBadge) {
        const existingBadge = await prisma.farmerBadge.findFirst({
          where: {
            farmerId: farmId,
            badgeId: topCropBadge.id
          }
        });
        
        if (!existingBadge) {
          await prisma.farmerBadge.create({
            data: {
              farmerId: farmId,
              badgeId: topCropBadge.id
            }
          });
          badgesToAward.push(topCropBadge.name);
        }
      }
    }
    
    // Award "Excellent Crop Health" badge for scores 8+
    if (cropScore >= 8) {
      const excellentCropBadge = await prisma.badge.findFirst({
        where: { name: 'Excellent Crop Health' }
      });
      
      if (excellentCropBadge) {
        const existingBadge = await prisma.farmerBadge.findFirst({
          where: {
            farmerId: farmId,
            badgeId: excellentCropBadge.id
          }
        });
        
        if (!existingBadge) {
          await prisma.farmerBadge.create({
            data: {
              farmerId: farmId,
              badgeId: excellentCropBadge.id
            }
          });
          badgesToAward.push(excellentCropBadge.name);
        }
      }
    }
    
    // Update leaderboard entries
    await updateLeaderboardEntries(farmId, points);
    
    // Notify via Socket.IO
    if (io) {
      // Emit to user's room
      io.emit(`farmer-${farmId}-points-update`, {
        pointsAwarded: points,
        totalPoints: updatedFarmer.totalPoints + points,
        badgesAwarded: badgesToAward
      });
      
      // Emit to leaderboard rooms
      if (farmer.region) {
        io.to(`leaderboard-REGION-${farmer.region}`).emit('leaderboard-update', {
          region: farmer.region
        });
      }
      
      if (farmer.panchayat) {
        io.to(`leaderboard-PANCHAYAT-${farmer.panchayat}`).emit('leaderboard-update', {
          panchayat: farmer.panchayat
        });
      }
    }
    
    return {
      success: true,
      pointsAwarded: points,
      badgesAwarded: badgesToAward
    };
  } catch (error) {
    console.error('Error awarding points and badges for crop score:', error);
    throw error;
  }
}

/**
 * Update leaderboard entries with new points
 * @param farmId - The ID of the farm
 * @param points - Points to add
 */
async function updateLeaderboardEntries(farmId: string, points: number) {
  try {
    // Get the farmer with region and panchayat info
    const farmer = await prisma.farmer.findUnique({
      where: { id: farmId }
    });

    if (!farmer) {
      throw new Error('Farmer not found');
    }

    // Get all active leaderboards for this farmer
    const leaderboards = await prisma.leaderboard.findMany({
      where: {
        isActive: true,
        OR: [
          { type: 'GLOBAL' },
          { type: 'REGION', scope: farmer.region || undefined },
          { type: 'PANCHAYAT', scope: farmer.panchayat || undefined }
        ]
      }
    });

    // Update entries in each leaderboard
    for (const leaderboard of leaderboards) {
      // Get existing entry or create new one
      let entry = await prisma.leaderboardEntry.findUnique({
        where: {
          leaderboardId_farmerId: {
            leaderboardId: leaderboard.id,
            farmerId: farmId
          }
        }
      });

      if (entry) {
        // Update existing entry
        await prisma.leaderboardEntry.update({
          where: { id: entry.id },
          data: {
            points: {
              increment: points
            },
            score: {
              increment: points
            },
            lastUpdated: new Date()
          }
        });
      } else {
        // Create new entry
        await prisma.leaderboardEntry.create({
          data: {
            leaderboardId: leaderboard.id,
            farmerId: farmId,
            rank: 0, // Will be updated when leaderboard is refreshed
            score: points,
            points: points,
            missionsCompleted: 0,
            streak: 0,
            badges: 0,
            metadata: {
              region: farmer.region,
              village: farmer.village,
              sustainabilityScore: farmer.sustainabilityScore
            }
          }
        });
      }
    }
  } catch (error) {
    console.error('Error updating leaderboard entries:', error);
    // Don't throw error as this is supplementary functionality
  }
}

/**
 * Create crop-related badges if they don't exist
 */
export async function initializeCropBadges() {
  try {
    // Create "Top Crop Score" badge
    const topCropBadge = await prisma.badge.upsert({
      where: { name: 'Top Crop Score' },
      update: {},
      create: {
        name: 'Top Crop Score',
        description: 'Achieved an exceptional crop health score of 9 or higher',
        type: 'ACHIEVEMENT',
        iconUrl: '/badges/top-crop-score.png',
        colorCode: '#10B981',
        criteria: { minCropScore: 9 },
        pointsReward: 300,
        rarity: 'EPIC'
      }
    });

    // Create "Excellent Crop Health" badge
    const excellentCropBadge = await prisma.badge.upsert({
      where: { name: 'Excellent Crop Health' },
      update: {},
      create: {
        name: 'Excellent Crop Health',
        description: 'Achieved an excellent crop health score of 8 or higher',
        type: 'ACHIEVEMENT',
        iconUrl: '/badges/excellent-crop-health.png',
        colorCode: '#3B82F6',
        criteria: { minCropScore: 8 },
        pointsReward: 200,
        rarity: 'RARE'
      }
    });

    return {
      topCropBadge,
      excellentCropBadge
    };
  } catch (error) {
    console.error('Error initializing crop badges:', error);
    throw error;
  }
}