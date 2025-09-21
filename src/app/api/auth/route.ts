import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from './mock-data';

// Get current user profile
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  
  // Simple mock token validation
  if (!token.startsWith('mock_jwt_')) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // Find user by token (in real app, decode JWT)
  // Token format: mock_jwt_user_demo_12345_1758479029606
  const tokenParts = token.split('_');
  const userId = `${tokenParts[2]}_${tokenParts[3]}`; // user_demo_12345
  
  // Look for user by ID
  let user = null;
  for (const [phone, userData] of mockUsers.entries()) {
    if (userData.id === userId) {
      user = userData;
      break;
    }
  }
  
  // If not found by ID, check if it's a timestamp-based ID
  if (!user) {
    // For timestamp-based IDs, we need to extract the user by phone
    // Since we're using demo phone, let's check for that
    user = mockUsers.get('9876543210');
  }
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  return NextResponse.json({
    user: {
      id: user.id,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      profileImage: user.profileImage,
      preferredLanguage: user.preferredLanguage,
      isProfileComplete: !!(user.firstName && user.lastName),
      farmer: user.farmer
    }
  });
}