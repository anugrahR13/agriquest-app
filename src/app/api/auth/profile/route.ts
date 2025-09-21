import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '../mock-data';

// Update user profile
export async function PUT(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  const tokenParts = token.split('_');
  const userId = `user_${tokenParts[3]}`;
  
  let user = null;
  let userPhone = null;
  
  for (const [phone, userData] of mockUsers.entries()) {
    if (userData.id === userId) {
      user = userData;
      userPhone = phone;
      break;
    }
  }
  
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  const body = await request.json();
  const { firstName, lastName, farmName, region, village, panchayat, farmSize, primaryCrops, goals } = body;
  
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  
  if (user.farmer) {
    if (farmName) user.farmer.farmName = farmName;
    if (region) user.farmer.region = region;
    if (village) user.farmer.village = village;
    if (panchayat) user.farmer.panchayat = panchayat;
    if (farmSize) user.farmer.farmSize = farmSize;
    if (primaryCrops) user.farmer.primaryCrops = primaryCrops;
    if (goals) user.farmer.goals = goals;
  }
  
  mockUsers.set(userPhone, user);
  
  return NextResponse.json({
    success: true,
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