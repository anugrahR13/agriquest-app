import express from 'express';
import { submitAuctionRequest, getAuctionRequestStatus } from '../utils/auctionRequest';

const router = express.Router();

/**
 * POST /api/auction/apply
 * Submit farmer's AI report and profile to government auction
 */
router.post('/auction/apply', async (req, res) => {
  try {
    const { farmId, cropScoreId } = req.body;
    
    // Validate required fields
    if (!farmId || !cropScoreId) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['farmId', 'cropScoreId'] 
      });
    }
    
    const result = await submitAuctionRequest(farmId, cropScoreId);
    
    res.json(result);
  } catch (error) {
    console.error('Error submitting auction request:', error);
    res.status(500).json({ 
      error: 'Failed to submit auction request',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

/**
 * GET /api/auction/:farmId
 * Retrieve auction status
 */
router.get('/auction/:farmId', async (req, res) => {
  try {
    const { farmId } = req.params;
    
    const auctionRequest = await getAuctionRequestStatus(farmId);
    
    if (!auctionRequest) {
      return res.status(404).json({ error: 'Auction request not found' });
    }
    
    res.json({ auctionRequest });
  } catch (error) {
    console.error('Error fetching auction request status:', error);
    res.status(500).json({ 
      error: 'Failed to fetch auction request status',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;