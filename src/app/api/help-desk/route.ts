import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '../shared/auth';

// Mock help desk tickets
const mockHelpDeskTickets = [
  {
    id: 'ticket_1',
    userId: 'user_demo_12345',
    title: 'Issue with Mission Progress Tracking',
    description: 'I\'m having trouble tracking my mission progress...',
    status: 'OPEN',
    priority: 'MEDIUM',
    category: 'TECHNICAL',
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-01')
  },
  {
    id: 'ticket_2',
    userId: 'user_demo_12345',
    title: 'Question about Rewards Redemption',
    description: 'How do I redeem my rewards points?',
    status: 'RESOLVED',
    priority: 'LOW',
    category: 'GENERAL',
    createdAt: new Date('2025-09-05'),
    updatedAt: new Date('2025-09-06')
  }
];

// Get help desk tickets
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return the mock help desk tickets
  return NextResponse.json({ tickets: mockHelpDeskTickets });
}