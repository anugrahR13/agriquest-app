import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '../auth/mock-data';

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
  
  // If not found by ID, check if it's a timestamp-based ID
  // For timestamp-based IDs, we need to extract the user by phone
  // Since we're using demo phone, let's check for that
  return mockUsers.get('9876543210');
};

// Get user statistics (mock version)
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const action = url.searchParams.get('action');
  
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  const user = validateMockToken(token);
  
  if (!user) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 403 });
  }
  
  if (action === 'stats') {
    // For demo purposes, return mock stats based on the user's farmer data
    const farmer = user.farmer;
    
    if (!farmer) {
      return NextResponse.json({ error: 'Farmer not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      totalPoints: farmer.totalPoints || 1500,
      thisMonthPoints: 500, // Mock value
      currentStreak: farmer.currentStreak || 7,
      level: farmer.level || 3,
      completedMissions: 12, // Mock value
      totalBadges: 5 // Mock value
    });
  } else if (action === 'profile') {
    return NextResponse.json({ user });
  } else if (action === 'crops') {
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
    
    return NextResponse.json({ crops: mockCrops });
  }
  
  return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
}