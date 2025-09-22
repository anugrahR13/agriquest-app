import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from './auth';

// Mock farmer missions data
let mockFarmerMissions: any[] = [
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

// Complete a mission
export async function POST(request: NextRequest, { params }: { params: Promise<{ missionId: string }> }) {
  // Resolve the params promise
  const resolvedParams = await params;
  const { missionId } = resolvedParams;
  const body = await request.json();
  const { evidence } = body;

  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll use a fixed farmer ID
  const farmerId = 'farmer_demo_12345';
  
  // Find farmer mission and include mission data
  const farmerMission = mockFarmerMissions.find(fm => 
    fm.farmerId === farmerId && fm.missionId === missionId
  );

  if (!farmerMission) {
    return NextResponse.json({ error: 'Mission not started' }, { status: 404 });
  }

  // Find the mission data
  const mission = mockMissions.find(m => m.id === missionId);
  
  if (!mission) {
    return NextResponse.json({ error: 'Mission not found' }, { status: 404 });
  }

  // Prepare evidence data
  let evidenceSubmitted: any[] = farmerMission.evidenceSubmitted;
  if (evidence) {
    evidenceSubmitted = [...evidenceSubmitted, evidence];
  }

  // Update mission status to completed
  farmerMission.status = 'COMPLETED';
  farmerMission.completedAt = new Date();
  farmerMission.evidenceSubmitted = evidenceSubmitted;
  farmerMission.pointsEarned = mission.pointsReward;
  farmerMission.updatedAt = new Date();

  return NextResponse.json({ mission: farmerMission });
}