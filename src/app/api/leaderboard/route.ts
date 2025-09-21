import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '../shared/auth';

// Mock leaderboard data
const mockLeaderboard = [
  {
    id: 'leaderboard_1',
    farmerId: 'farmer_demo_12345',
    farmerName: 'Rajesh Kumar',
    farmName: 'Green Valley Organic Farm',
    region: 'Punjab',
    panchayat: 'Kotla Nihal Singh',
    totalPoints: 1500,
    level: 3,
    rank: 1,
    sustainabilityScore: 85,
    lastUpdated: new Date()
  },
  {
    id: 'leaderboard_2',
    farmerId: 'farmer_2',
    farmerName: 'Amit Sharma',
    farmName: 'Golden Wheat Fields',
    region: 'Punjab',
    panchayat: 'Kotla Nihal Singh',
    totalPoints: 1200,
    level: 2,
    rank: 2,
    sustainabilityScore: 75,
    lastUpdated: new Date()
  },
  {
    id: 'leaderboard_3',
    farmerId: 'farmer_3',
    farmerName: 'Priya Patel',
    farmName: 'Organic Greens',
    region: 'Punjab',
    panchayat: 'Kotla Nihal Singh',
    totalPoints: 1000,
    level: 2,
    rank: 3,
    sustainabilityScore: 80,
    lastUpdated: new Date()
  }
];

// Get leaderboard data
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return the mock leaderboard
  return NextResponse.json({ leaderboard: mockLeaderboard });
}