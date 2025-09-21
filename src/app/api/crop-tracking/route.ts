import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '../shared/auth';

// Mock crop tracking data
const mockCropTracking = [
  {
    id: 'crop_1',
    farmerId: 'farmer_demo_12345',
    cropType: 'WHEAT',
    variety: 'HD 2967',
    sowingDate: new Date('2025-10-15'),
    farmSize: 5.5,
    growthRecords: [],
    photos: [],
    aiAnalyses: []
  },
  {
    id: 'crop_2',
    farmerId: 'farmer_demo_12345',
    cropType: 'TOMATOES',
    variety: 'Punjab Chuhara',
    sowingDate: new Date('2025-11-01'),
    farmSize: 3.0,
    growthRecords: [],
    photos: [],
    aiAnalyses: []
  }
];

// Get crop tracking data
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return the mock crop tracking data
  return NextResponse.json({ crops: mockCropTracking });
}