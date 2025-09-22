import express from 'express';
import { calculateFinalCropScore, getCropScoreByFarmId } from '../utils/finalCropScore';

const router = express.Router();

/**
 * POST /api/missions/:missionPlanId/final-score
 * Calculate final crop score when all missions are complete
 */
router.post('/missions/:missionPlanId/final-score', async (req, res) => {
  try {
    const { missionPlanId } = req.params;
    
    // In a real implementation, we would verify that all missions are complete
    // For now, we'll just calculate the score
    
    const result = await calculateFinalCropScore(missionPlanId);
    
    res.json(result);
  } catch (error) {
    console.error('Error calculating final crop score:', error);
    res.status(500).json({ 
      error: 'Failed to calculate final crop score',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/crop-score/:farmId
 * Fetch final score and report link
 */
router.get('/crop-score/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;
    
    const cropScore = await getCropScoreByFarmId(farmId);
    
    if (!cropScore) {
      return res.status(404).json({ error: 'Crop score not found' });
    }
    
    res.json({ cropScore });
  } catch (error) {
    console.error('Error fetching crop score:', error);
    res.status(500).json({ 
      error: 'Failed to fetch crop score',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;