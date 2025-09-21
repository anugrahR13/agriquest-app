import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from './auth';

// Mock rewards data
const mockRewards = [
  {
    id: 'reward_1',
    title: 'Farmers Market Voucher',
    description: 'Get a voucher worth ₹500 for the local farmers market',
    pointsRequired: 200,
    category: 'VOUCHER',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'reward_2',
    title: 'Organic Seeds Pack',
    description: 'Get a pack of organic seeds for your next planting season',
    pointsRequired: 300,
    category: 'PRODUCT',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'reward_3',
    title: 'Soil Testing Kit',
    description: 'Professional soil testing kit to improve your farm productivity',
    pointsRequired: 500,
    category: 'TOOL',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock user rewards data
const mockUserRewards = [
  {
    id: 'user_reward_1',
    userId: 'user_demo_12345',
    rewardId: 'reward_1',
    status: 'REDEEMED',
    redeemedAt: new Date('2025-09-01'),
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-01')
  }
];

// Get all available rewards
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return all mock rewards with status
  const formattedRewards = mockRewards.map(reward => {
    const userReward = mockUserRewards.find(ur => ur.userId === user.id && ur.rewardId === reward.id);
    return {
      ...reward,
      status: userReward ? userReward.status : 'AVAILABLE'
    };
  });

  return NextResponse.json({ rewards: formattedRewards });
}