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
export const demoPhones = [
  '9876543210', '9876543211', '9876543212', '9876543213', '9876543214',
  '8765432109', '7654321098', '6543210987'
];