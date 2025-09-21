import { NextRequest, NextResponse } from 'next/server';
import { mockUsers } from '../mock-data';

// Complete profile endpoint for onboarding
export async function POST(request: NextRequest) {
  console.log('📥 POST /api/auth/complete-profile - Request received');
  
  const authHeader = request.headers.get('authorization');
  console.log('🔑 Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid authorization header');
    return NextResponse.json({ error: 'No token provided' }, { status: 401 });
  }
  
  const token = authHeader.substring(7);
  console.log('🎫 Token:', token);
  
  // Simple mock token validation
  if (!token.startsWith('mock_jwt_')) {
    console.log('❌ Invalid token format');
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  const tokenParts = token.split('_');
  console.log('🔍 Token parts:', tokenParts);
  
  if (tokenParts.length < 4) {
    console.log('❌ Invalid token structure');
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }
  
  // Token format: mock_jwt_user_TIMESTAMP_TIMESTAMP
  // We need to reconstruct the userId which is user_TIMESTAMP
  const userId = `user_${tokenParts[3]}`;
  console.log('👤 User ID from token:', userId);
  console.log('📋 Current mock users:', Array.from(mockUsers.keys()));
  
  let user = null;
  let userPhone = null;
  
  for (const [phone, userData] of mockUsers.entries()) {
    console.log(`🔍 Checking user ${userData.id} for phone ${phone}`);
    if (userData.id === userId) {
      user = userData;
      userPhone = phone;
      console.log('✅ User found!');
      break;
    }
  }
  
  if (!user) {
    console.log('❌ User not found in mock database');
    console.log('📋 Available users:', Array.from(mockUsers.entries()).map(([phone, user]) => ({ phone, id: user.id })));
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }
  
  // Update user data from onboarding form
  const body = await request.json();
  const { 
    firstName, 
    lastName, 
    farmName, 
    region, 
    village, 
    panchayat, 
    farmSize, 
    primaryCrops, 
    secondaryCrops,
    farmingExperience,
    educationLevel,
    preferredLanguage 
  } = body;
  
  console.log('📝 Profile data to update:', {
    firstName, lastName, farmName, region, village, 
    panchayat, farmSize, primaryCrops, secondaryCrops,
    farmingExperience, educationLevel, preferredLanguage
  });
  
  // Update user profile
  if (firstName) user.firstName = firstName;
  if (lastName) user.lastName = lastName;
  if (preferredLanguage) user.preferredLanguage = preferredLanguage;
  
  // Update farmer profile
  if (user.farmer) {
    if (farmName) user.farmer.farmName = farmName;
    if (region) user.farmer.region = region;
    if (village) user.farmer.village = village;
    if (panchayat) user.farmer.panchayat = panchayat;
    if (farmSize) user.farmer.farmSize = parseFloat(farmSize);
    if (primaryCrops) user.farmer.primaryCrops = primaryCrops;
    if (secondaryCrops) user.farmer.secondaryCrops = secondaryCrops;
    if (farmingExperience) user.farmer.farmingExperience = parseInt(farmingExperience);
    if (educationLevel) user.farmer.educationLevel = educationLevel;
    
    // Give welcome points for completing profile
    user.farmer.totalPoints = 100;
    user.farmer.sustainabilityScore = 25;
  }
  
  mockUsers.set(userPhone, user);
  
  console.log('✅ Profile updated successfully for user:', user.id);
  
  const responseData = {
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
  };
  
  console.log('📤 Sending response:', responseData);
  return NextResponse.json(responseData);
}