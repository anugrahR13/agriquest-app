/**
 * Gamification utilities for AgriQuest
 * 
 * This module provides functions for awarding points and badges based on farmer activities,
 * particularly crop scores and sustainable farming practices.
 */

import { PrismaClient, Badge, BadgeType, CropCategory } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Initialize crop-related badges in the database
 * @returns Object containing the created badges
 */
export async function initializeCropBadges() {
  console.log('🌱 Initializing crop-related badges...');
  
  // Create Top Crop Score badge
  const topCropBadge = await prisma.badge.upsert({
    where: { name: 'Top Crop Score' },
    update: {},
    create: {
      name: 'Top Crop Score',
      description: 'Achieved a crop health score of 90+',
      type: BadgeType.ACHIEVEMENT,
      iconUrl: '/badges/top-crop-score.png',
      colorCode: '#10B981',
      criteria: { minCropScore: 90 },
      pointsReward: 200,
      rarity: 'RARE',
    },
  });

  // Create Excellent Crop Health badge
  const excellentCropBadge = await prisma.badge.upsert({
    where: { name: 'Excellent Crop Health' },
    update: {},
    create: {
      name: 'Excellent Crop Health',
      description: 'Maintained excellent crop health across multiple assessments',
      type: BadgeType.MILESTONE,
      iconUrl: '/badges/excellent-crop-health.png',
      colorCode: '#059669',
      criteria: { consistentHighScores: 5, minScore: 80 },
      pointsReward: 150,
      rarity: 'EPIC',
    },
  });

  console.log('✅ Crop badges initialized successfully');
  
  return {
    topCropBadge,
    excellentCropBadge
  };
}

/**
 * Award points and badges for a crop score
 * @param farmerId The ID of the farmer
 * @param cropScore The crop health score (0-100)
 * @param cropType The type of crop
 * @returns Object containing awarded points and badges
 */
export async function awardPointsAndBadgesForCropScore(
  farmerId: string,
  cropScore: number,
  cropType: CropCategory
) {
  console.log(`🏆 Awarding points and badges for farmer ${farmerId} with crop score ${cropScore}`);
  
  const awardedBadges: Badge[] = [];
  let pointsAwarded = 0;
  
  // Award points based on crop score
  if (cropScore >= 90) {
    pointsAwarded += 100;
  } else if (cropScore >= 80) {
    pointsAwarded += 75;
  } else if (cropScore >= 70) {
    pointsAwarded += 50;
  } else if (cropScore >= 60) {
    pointsAwarded += 25;
  }
  
  // Check for Top Crop Score badge
  if (cropScore >= 90) {
    const topCropBadge = await prisma.badge.findUnique({
      where: { name: 'Top Crop Score' }
    });
    
    if (topCropBadge) {
      // Check if farmer already has this badge
      const existingBadge = await prisma.farmerBadge.findUnique({
        where: {
          farmerId_badgeId: {
            farmerId,
            badgeId: topCropBadge.id
          }
        }
      });
      
      if (!existingBadge) {
        await prisma.farmerBadge.create({
          data: {
            farmerId,
            badgeId: topCropBadge.id,
            earnedAt: new Date(),
            criteria: { cropScore, cropType }
          }
        });
        awardedBadges.push(topCropBadge);
        pointsAwarded += topCropBadge.pointsReward;
      }
    }
  }
  
  // Update farmer's total points
  if (pointsAwarded > 0) {
    await prisma.farmer.update({
      where: { userId: farmerId },
      data: {
        totalPoints: {
          increment: pointsAwarded
        }
      }
    });
  }
  
  console.log(`✅ Awarded ${pointsAwarded} points and ${awardedBadges.length} badges`);
  
  return {
    pointsAwarded,
    awardedBadges
  };
}