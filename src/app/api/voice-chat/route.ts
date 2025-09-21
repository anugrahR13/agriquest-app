import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '../shared/auth';

// Mock voice chat sessions
const mockVoiceChatSessions = [
  {
    id: 'session_1',
    farmerId: 'farmer_demo_12345',
    expertId: 'expert_1',
    startTime: new Date('2025-09-01T10:00:00'),
    endTime: new Date('2025-09-01T10:30:00'),
    transcript: 'Farmer: I need help with pest control...\nExpert: You can try using neem oil...',
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-01')
  }
];

// Get voice chat sessions
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return the mock voice chat sessions
  return NextResponse.json({ sessions: mockVoiceChatSessions });
}