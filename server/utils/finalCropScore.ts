import { PrismaClient } from '@prisma/client';
import { analyzePlantHealth } from './aiAnalysis';
import { generateCropCreditReport } from './pdfGenerator';
import { awardPointsAndBadgesForCropScore } from './gamification';

const prisma = new PrismaClient();

/**
 * Calculate final crop score based on all mission photos
 * @param missionPlanId - The ID of the mission plan
 * @returns The final crop score and report URL
 */
export async function calculateFinalCropScore(missionPlanId: string) {
  try {
    // Get all missions for this plan
    const missionPlan = await prisma.missionPlan.findUnique({
      where: { id: missionPlanId },
      include: {
        missions: {
          include: {
            photos: true,
            analyses: true
          }
        },
        farm: {
          include: {
            farmer: true
          }
        }
      }
    });

    if (!missionPlan) {
      throw new Error('Mission plan not found');
    }

    // Aggregate all photo URLs from all missions
    const allPhotoUrls: string[] = [];
    missionPlan.missions.forEach((mission: any) => {
      mission.photos.forEach((photo: any) => {
        allPhotoUrls.push(photo.url);
      });
    });

    // Analyze each photo and collect health scores
    const healthScores: number[] = [];
    for (const photoUrl of allPhotoUrls) {
      try {
        const analysis = await analyzePlantHealth(photoUrl);
        healthScores.push(analysis.healthScore);
      } catch (error) {
        console.error(`Error analyzing photo ${photoUrl}:`, error);
        // Use a default score if analysis fails
        healthScores.push(50);
      }
    }

    // Calculate average health score (0-100) and convert to 0-10 scale
    const averageHealthScore = healthScores.length > 0 
      ? healthScores.reduce((sum, score) => sum + score, 0) / healthScores.length 
      : 0;
    
    const finalScore = Math.round((averageHealthScore / 100) * 10 * 10) / 10; // Round to 1 decimal place

    // Get farmer information for the report
    const farmer = missionPlan.farm.farmer;
    const user = await prisma.user.findUnique({
      where: { id: farmer.userId }
    });
    
    // Create report data with all required fields
    const reportData = {
      farmerName: user ? `${user.firstName} ${user.lastName}` : 'Unknown Farmer',
      farmLocation: missionPlan.farm.location,
      cropType: missionPlan.cropType,
      sowingDate: missionPlan.farm.sowingDate,
      growthTimeline: missionPlan.missions.map((mission: any, index: number) => ({
        stage: mission.title,
        date: mission.createdAt,
        healthScore: mission.analyses.length > 0 ? mission.analyses[0].healthScore : 50,
        notes: mission.analyses.length > 0 ? mission.analyses[0].notes || 'No notes' : 'No analysis'
      })),
      totalPhotos: allPhotoUrls.length,
      healthScore: finalScore * 10, // Convert back to 0-100 scale for the report
      predictedYield: {
        min: Math.round(finalScore * 80), // Example calculation
        max: Math.round(finalScore * 120), // Example calculation
        quality: finalScore >= 8 ? 'Excellent' : finalScore >= 6 ? 'Good' : finalScore >= 4 ? 'Fair' : 'Poor'
      },
      sustainabilityScore: farmer.sustainabilityScore.toNumber(), // Convert Decimal to number
      recommendations: generateRecommendations(finalScore),
      generatedAt: new Date()
    };

    // Generate PDF report
    const reportFileName = `crop-report-${missionPlan.farmId}-${Date.now()}.pdf`;
    const reportPath = `./public/reports/${reportFileName}`;
    
    // Ensure reports directory exists
    const fs = require('fs');
    const path = require('path');
    const reportsDir = './public/reports';
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    await generateCropCreditReport(reportData, reportPath);
    const reportUrl = `/reports/${reportFileName}`;

    // Save crop score to database
    const cropScoreRecord = await prisma.cropScore.create({
      data: {
        farmId: missionPlan.farmId,
        score: finalScore,
        reportUrl
      }
    });

    // Award points and badges for high crop scores
    try {
      await awardPointsAndBadgesForCropScore(missionPlan.farmId, finalScore);
    } catch (error) {
      console.error('Error awarding points and badges:', error);
      // Don't fail the entire operation if gamification fails
    }

    return {
      success: true,
      cropScore: cropScoreRecord,
      reportData
    };
  } catch (error) {
    console.error('Error calculating final crop score:', error);
    throw error;
  }
}

/**
 * Generate recommendations based on the final score
 * @param score - The final crop score (0-10)
 * @returns Array of recommendation strings
 */
function generateRecommendations(score: number): string[] {
  const recommendations: string[] = [];

  if (score < 3) {
    recommendations.push('Severe crop health issues detected. Immediate intervention required.');
    recommendations.push('Consider replanting or switching to a more resilient crop variety.');
    recommendations.push('Consult with local agricultural experts for emergency assistance.');
  } else if (score < 5) {
    recommendations.push('Poor crop health detected. Significant improvements needed.');
    recommendations.push('Implement better irrigation practices.');
    recommendations.push('Apply organic fertilizers to improve soil nutrition.');
    recommendations.push('Check for pest infestations and treat accordingly.');
  } else if (score < 7) {
    recommendations.push('Below average crop health. Several improvements recommended.');
    recommendations.push('Optimize watering schedule based on soil moisture.');
    recommendations.push('Add compost or organic matter to soil.');
    recommendations.push('Monitor for early signs of disease.');
  } else if (score < 9) {
    recommendations.push('Good crop health with room for improvement.');
    recommendations.push('Maintain current practices and monitor growth.');
    recommendations.push('Consider crop rotation for next season.');
  } else {
    recommendations.push('Excellent crop health! Continue current practices.');
    recommendations.push('Consider sharing your success with other farmers.');
    recommendations.push('Eligible for premium market prices.');
  }

  return recommendations;
}

/**
 * Get crop score by farm ID
 * @param farmId - The ID of the farm
 * @returns The crop score record
 */
export async function getCropScoreByFarmId(farmId: string) {
  try {
    const cropScoreRecord = await prisma.cropScore.findFirst({
      where: { farmId },
      orderBy: { createdAt: 'desc' }
    });

    return cropScoreRecord;
  } catch (error) {
    console.error('Error fetching crop score:', error);
    throw error;
  }
}