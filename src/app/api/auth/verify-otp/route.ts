import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockOTPs } from '../mock-data';

// Verify OTP
export async function POST(request: NextRequest) {
  console.log('📥 POST /api/auth/verify-otp - Request received');
  
  const body = await request.json();
  const { phone, otp } = body;
  
  if (!phone || !otp) {
    return NextResponse.json({ error: 'Phone and OTP required' }, { status: 400 });
  }
  
  // Check OTP
  const otpRecord = mockOTPs.get(phone);
  if (!otpRecord || otpRecord.isUsed || otpRecord.expiresAt < new Date() || otpRecord.code !== otp) {
    return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
  }
  
  // Mark OTP as used
  otpRecord.isUsed = true;
  
  // Get or create user
  let user = mockUsers.get(phone);
  if (!user) {
    const userId = `user_${Date.now()}`;
    user = {
      id: userId,
      phone,
      role: 'FARMER',
      firstName: null,
      lastName: null,
      profileImage: null,
      preferredLanguage: 'en',
      phoneVerified: true,
      lastLoginAt: new Date(),
      farmer: {
        id: `farmer_${Date.now()}`,
        farmerId: `AGR${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        farmName: null,
        region: null,
        village: null,
        panchayat: null,
        farmSize: null,
        totalPoints: 0,
        currentStreak: 0,
        sustainabilityScore: 0,
        level: 1
      }
    };
    mockUsers.set(phone, user);
  }
  
  // Generate mock JWT
  const token = `mock_jwt_${user.id}_${Date.now()}`;
  
  return NextResponse.json({
    success: true,
    token,
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