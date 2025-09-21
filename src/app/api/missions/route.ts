import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from './auth';

// Mock missions data
const mockMissions = [
  {
    id: 'mission_1',
    title: 'Soil Preparation',
    description: 'Prepare your soil for the upcoming planting season',
    category: 'SOIL_HEALTH',
    difficulty: 'EASY',
    pointsReward: 50,
    estimatedDuration: 3,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mission_2',
    title: 'Plant Seeds',
    description: 'Plant seeds for your primary crop',
    category: 'CROP_MANAGEMENT',
    difficulty: 'MEDIUM',
    pointsReward: 75,
    estimatedDuration: 2,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'mission_3',
    title: 'Water Management',
    description: 'Implement water-saving techniques in your farm',
    category: 'SUSTAINABILITY',
    difficulty: 'HARD',
    pointsReward: 100,
    estimatedDuration: 5,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Mock farmer missions data
const mockFarmerMissions = [
  {
    id: 'farmer_mission_1',
    farmerId: 'farmer_demo_12345',
    missionId: 'mission_1',
    status: 'COMPLETED',
    progress: 100,
    startedAt: new Date('2025-09-01'),
    completedAt: new Date('2025-09-03'),
    dueDate: new Date('2025-09-05'),
    evidenceSubmitted: [],
    pointsEarned: 50,
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-03')
  },
  {
    id: 'farmer_mission_2',
    farmerId: 'farmer_demo_12345',
    missionId: 'mission_2',
    status: 'IN_PROGRESS',
    progress: 50,
    startedAt: new Date('2025-09-10'),
    completedAt: null,
    dueDate: new Date('2025-09-20'),
    evidenceSubmitted: [],
    pointsEarned: 0,
    createdAt: new Date('2025-09-10'),
    updatedAt: new Date('2025-09-15')
  }
];

// Get all available missions for a farmer
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return all mock missions with status
  const formattedMissions = mockMissions.map(mission => {
    const farmerMission = mockFarmerMissions.find(fm => fm.missionId === mission.id);
    return {
      ...mission,
      status: farmerMission ? farmerMission.status : 'available',
      progress: farmerMission ? farmerMission.progress : null
    };
  });

  return NextResponse.json({ missions: formattedMissions });
}