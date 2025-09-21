import { NextRequest, NextResponse } from 'next/server';
import { mockUsers, mockOTPs, demoPhones } from '../mock-data';

// Generate OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP for login/registration
export async function POST(request: NextRequest) {
  console.log('📥 POST /api/auth/request-otp - Request received');
  
  const body = await request.json();
  const { phone } = body;
  
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    console.log('❌ Invalid phone number:', phone);
    return NextResponse.json({ error: 'Valid Indian phone number required' }, { status: 400 });
  }
  
  // Generate OTP
  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  
  // Store OTP in mock database
  mockOTPs.set(phone, { code: otp, expiresAt, isUsed: false });
  
  // Check if it's a demo phone
  const isDemoPhone = demoPhones.includes(phone);
  
  // For demo phones, use OTP 123456
  if (isDemoPhone) {
    mockOTPs.set(phone, { code: '123456', expiresAt, isUsed: false });
  }
  
  console.log(`📱 Mock SMS to ${phone}: Your AgriQuest OTP is: ${isDemoPhone ? '123456' : otp}. Valid for 10 minutes.`);
  
  // Check if user exists
  const isNewUser = !mockUsers.has(phone);
  
  return NextResponse.json({ 
    success: true, 
    message: 'OTP sent successfully',
    isNewUser,
    ...(isDemoPhone && { mockOTP: '123456' }) // Include OTP in response for demo phones
  });
}