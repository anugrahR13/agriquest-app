import express, { Request, Response } from 'express';

const router = express.Router();

// Mock database for testing
export const mockUsers = new Map();
export const mockOTPs = new Map();

// Predefined demo user with complete profile
const demoUser = {
  id: 'user_demo_12345',
  phone: '9876543210',
  role: 'FARMER',
  firstName: 'Rajesh',
  lastName: 'Kumar',
  profileImage: null,
  preferredLanguage: 'en',
  phoneVerified: true,
  lastLoginAt: new Date(),
  farmer: {
    id: 'farmer_demo_12345',
    farmerId: 'AGR0001',
    farmName: 'Green Valley Organic Farm',
    region: 'Punjab',
    village: 'Kotla Nihal Singh',
    panchayat: 'Kotla Nihal Singh',
    farmSize: 12.5,
    primaryCrops: ['CEREALS', 'VEGETABLES'],
    secondaryCrops: ['FRUITS'],
    farmingExperience: 15,
    educationLevel: 'Graduate',
    totalPoints: 1500,
    currentStreak: 7,
    sustainabilityScore: 85,
    level: 3,
    // Additional fields for a complete demo
    goals: ['Increase yield by 20%', 'Reduce water usage', 'Improve soil health'],
    bio: 'Passionate organic farmer with 15 years of experience in sustainable agriculture.',
    achievements: [
      { id: 'badge_1', name: 'Sustainability Champion', earnedAt: '2025-01-15' },
      { id: 'badge_2', name: 'Mission Master', earnedAt: '2025-02-20' },
      { id: 'badge_3', name: 'Community Leader', earnedAt: '2025-03-10' }
    ],
    preferences: {
      notificationEnabled: true,
      language: 'en',
      preferredCrops: ['WHEAT', 'RICE', 'TOMATOES']
    }
  }
};

// Add demo user to mock database
mockUsers.set('9876543210', demoUser);

// Demo phone numbers from memory
const demoPhones = [
  '9876543210', '9876543211', '9876543212', '9876543213', '9876543214',
  '8765432109', '7654321098', '6543210987'
];

// Generate OTP
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Request OTP for login/registration
router.post('/request-otp', async (req: Request, res: Response) => {
  console.log('📥 POST /api/auth/request-otp - Request received:', { phone: req.body.phone });
  
  const { phone } = req.body;
  
  if (!phone || !/^[6-9]\d{9}$/.test(phone)) {
    console.log('❌ Invalid phone number:', phone);
    return res.status(400).json({ error: 'Valid Indian phone number required' });
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
  
  res.json({ 
    success: true, 
    message: 'OTP sent successfully',
    isNewUser,
    ...(isDemoPhone && { mockOTP: '123456' }) // Include OTP in response for demo phones
  });
});

// Verify OTP and login
router.post('/verify-otp', async (req: Request, res: Response) => {
  console.log('📥 POST /api/auth/verify-otp - Request received:', { phone: req.body.phone, otp: req.body.otp });
  
  const { phone, otp } = req.body;
  
  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP required' });
  }
  
  // Check OTP
  const otpRecord = mockOTPs.get(phone);
  if (!otpRecord || otpRecord.isUsed || otpRecord.expiresAt < new Date() || otpRecord.code !== otp) {
    return res.status(400).json({ error: 'Invalid or expired OTP' });
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
  
  res.json({
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
});

// Get current user profile
router.get('/me', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  
  // Simple mock token validation
  if (!token.startsWith('mock_jwt_')) {
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  // Find user by token (in real app, decode JWT)
  const tokenParts = token.split('_');
  const userId = `user_${tokenParts[3]}`;
  let user = null;
  
  for (const [phone, userData] of mockUsers.entries()) {
    if (userData.id === userId) {
      user = userData;
      break;
    }
  }
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
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
});

// Update user profile
router.put('/profile', async (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
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
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update user data
  const { firstName, lastName, farmName, region, village, panchayat, farmSize, primaryCrops, goals } = req.body;
  
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
  
  res.json({
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
});

// Complete profile endpoint for onboarding
router.post('/complete-profile', async (req: Request, res: Response) => {
  console.log('📥 POST /api/auth/complete-profile - Request received');
  
  const authHeader = req.headers.authorization;
  console.log('🔑 Authorization header:', authHeader);
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('❌ No valid authorization header');
    return res.status(401).json({ error: 'No token provided' });
  }
  
  const token = authHeader.substring(7);
  console.log('🎫 Token:', token);
  
  // Simple mock token validation
  if (!token.startsWith('mock_jwt_')) {
    console.log('❌ Invalid token format');
    return res.status(401).json({ error: 'Invalid token' });
  }
  
  const tokenParts = token.split('_');
  console.log('🔍 Token parts:', tokenParts);
  
  if (tokenParts.length < 4) {
    console.log('❌ Invalid token structure');
    return res.status(401).json({ error: 'Invalid token' });
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
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Update user data from onboarding form
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
  } = req.body;
  
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
  res.json(responseData);
});

// Logout
router.post('/logout', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

export default router;