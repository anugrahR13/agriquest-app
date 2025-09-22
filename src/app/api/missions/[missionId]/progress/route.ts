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

// Update mission progress
export async function PUT(request: NextRequest, { params }: { params: { missionId: string } }) {
  const { missionId } = params;
  const body = await request.json();
  const { progress, evidence } = body;

  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll use a fixed farmer ID
  const farmerId = 'farmer_demo_12345';
  
  // Find farmer mission
  const farmerMission = mockFarmerMissions.find(fm => 
    fm.farmerId === farmerId && fm.missionId === missionId
  );

  if (!farmerMission) {
    return NextResponse.json({ error: 'Mission not started' }, { status: 404 });
  }

  // Prepare evidence data
  let evidenceSubmitted: any[] = farmerMission.evidenceSubmitted;
  if (evidence) {
    evidenceSubmitted = [...evidenceSubmitted, evidence];
  }

  // Update progress
  farmerMission.progress = progress || farmerMission.progress;
  farmerMission.evidenceSubmitted = evidenceSubmitted;
  farmerMission.updatedAt = new Date();

  return NextResponse.json({ mission: farmerMission });
}