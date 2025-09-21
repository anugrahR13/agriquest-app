import { NextRequest, NextResponse } from 'next/server';
import { authenticateToken } from '../shared/auth';

// Mock community posts data
const mockCommunityPosts = [
  {
    id: 'post_1',
    userId: 'user_demo_12345',
    userName: 'Rajesh Kumar',
    title: 'Tips for Organic Farming',
    content: 'Here are some tips I\'ve learned over the years for successful organic farming...',
    likes: 25,
    comments: 10,
    createdAt: new Date('2025-09-01'),
    updatedAt: new Date('2025-09-01')
  },
  {
    id: 'post_2',
    userId: 'user_2',
    userName: 'Amit Sharma',
    title: 'New Water Conservation Techniques',
    content: 'I\'ve been experimenting with some new water conservation techniques...',
    likes: 18,
    comments: 7,
    createdAt: new Date('2025-09-05'),
    updatedAt: new Date('2025-09-05')
  }
];

// Get community posts
export async function GET(request: NextRequest) {
  // Authenticate user
  const authResult = await authenticateToken(request);
  
  if (authResult.error) {
    return NextResponse.json({ error: authResult.error.message }, { status: authResult.error.status });
  }

  const user = authResult.user;
  
  // For demo, we'll just return the mock community posts
  return NextResponse.json({ posts: mockCommunityPosts });
}