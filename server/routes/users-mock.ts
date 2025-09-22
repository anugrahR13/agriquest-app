import express, { Request, Response } from 'express';
import { mockUsers } from './auth-mock';

const router = express.Router();

// Mock function to validate mock token
const validateMockToken = (token: string) => {
  if (!token.startsWith('mock_jwt_')) {
    return null;
  }
  
  const tokenParts = token.split('_');
  if (tokenParts.length < 4) {
    return null;
  }
  
  // Token format: mock_jwt_user_TIMESTAMP_TIMESTAMP
  // We need to reconstruct the userId which is user_TIMESTAMP
  const userId = `user_${tokenParts[3]}`;
  
  // Find user by userId
  for (const [phone, userData] of mockUsers.entries()) {
    if (userData.id === userId) {
      return userData;
    }
  }
  
  return null;
};

// Get user statistics (mock version)
router.get('/stats', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  const user = validateMockToken(token);
  
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  // For demo purposes, return mock stats based on the user's farmer data
  const farmer = user.farmer;
  
  if (!farmer) {
    return res.status(404).json({ error: 'Farmer not found' });
  }
  
  res.json({
    totalPoints: farmer.totalPoints || 1500,
    thisMonthPoints: 500, // Mock value
    currentStreak: farmer.currentStreak || 7,
    level: farmer.level || 3,
    completedMissions: 12, // Mock value
    totalBadges: 5 // Mock value
  });
});

// Get user profile (mock version)
router.get('/profile', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  const user = validateMockToken(token);
  
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  res.json({ user });
});

// Get farmer's crop summary (mock version)
router.get('/crops', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  const user = validateMockToken(token);
  
  if (!user) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
  
  // Return mock crop data for demo
  const mockCrops = [
    {
      id: 'crop_1',
      cropType: 'WHEAT',
      variety: 'HD 2967',
      sowingDate: '2025-10-15',
      farmSize: 5.5,
      growthRecords: [],
      photos: [],
      aiAnalyses: []
    },
    {
      id: 'crop_2',
      cropType: 'TOMATOES',
      variety: 'Punjab Chuhara',
      sowingDate: '2025-11-01',
      farmSize: 3.0,
      growthRecords: [],
      photos: [],
      aiAnalyses: []
    }
  ];
  
  res.json({ crops: mockCrops });
});

export default router;