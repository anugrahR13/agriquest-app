import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from './auth';

// Mock farmer missions data
let mockFarmerMissions = [
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

// Start a mission
export async function POST(request: NextRequest, { params }: { params: { missionId: string } }) {
  const { missionId } = params;
  
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll use a fixed farmer ID
  const farmerId = 'farmer_demo_12345';
  
  // Check if mission exists
  const mission = mockMissions.find(m => m.id === missionId);
  
  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
  }

  // Check if farmer already started this mission
  const existingFarmerMission = mockFarmerMissions.find(fm => 
    fm.farmerId === farmerId && fm.missionId === missionId
  );

  if (existingFarmerMission) {
    return NextResponse.json({ error: 'Mission already started' }, { status: 400 });
  }

  // Create farmer mission
  const farmerMission = {
    id: `farmer_mission_${Date.now()}`,
    farmerId: farmerId,
    missionId: missionId,
    status: 'IN_PROGRESS',
    progress: 0,
    startedAt: new Date(),
    completedAt: null,
    dueDate: new Date(Date.now() + mission.estimatedDuration * 24 * 60 * 60 * 1000), // Add duration in days
    evidenceSubmitted: [],
    pointsEarned: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  mockFarmerMissions.push(farmerMission);

  return NextResponse.json({ mission: farmerMission }, { status: 201 });
}