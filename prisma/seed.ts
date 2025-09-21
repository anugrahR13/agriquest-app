import { PrismaClient, CropCategory } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting AgriQuest database seeding...');

  // Clear existing data
  console.log('🧹 Cleaning existing data...');
  await prisma.user.deleteMany();
  await prisma.farmer.deleteMany();
  await prisma.adminProfile.deleteMany();

  // 1. Create Admin User
  console.log('👨‍💼 Creating admin user...');
  const adminUser = await prisma.user.create({
    data: {
      phone: '9999999999',
      phoneVerified: true,
      firstName: 'System',
      lastName: 'Admin',
      role: 'ADMIN',
      preferredLanguage: 'en',
      isActive: true,
    },
  });

  const adminProfile = await prisma.adminProfile.create({
    data: {
      userId: adminUser.id,
      department: 'Agriculture Technology',
      permissions: {
        canCreateMissions: true,
        canModerate: true,
        canManageUsers: true,
        canViewAnalytics: true,
      },
    },
  });

  // 2. Create Sample Farmers
  console.log('👨‍🌾 Creating sample farmers...');
  const user = await prisma.user.create({
    data: {
      phone: '9876543210',
      phoneVerified: true,
      firstName: 'Ramesh',
      lastName: 'Kumar',
      role: 'FARMER',
      preferredLanguage: 'en',
      isActive: true,
    },
  });

  const farmer = await prisma.farmer.create({
    data: {
      userId: user.id,
      farmerId: `AGQ${Date.now().toString().slice(-6)}`,
      farmName: 'Kumar Organic Farm',
      region: 'Uttar Pradesh',
      village: 'Ghazipur',
      panchayat: 'Ghazipur Gram Panchayat',
      farmSize: 5.5,
      primaryCrops: {
        set: [CropCategory.CEREALS, CropCategory.PULSES]
      },
      farmingExperience: 15,
      educationLevel: 'High School',
      totalPoints: 1500,
      currentStreak: 7,
      longestStreak: 15,
      sustainabilityScore: 75,
      level: 2,
    },
  });

  console.log('✅ Database seeding completed successfully!');
  console.log(`
📊 Summary:
- 1 admin created
- 1 farmer created
`);
  console.log('🎮 Demo Login Credentials:');
  console.log('Admin Phone: 9999999999 (Use OTP: 123456 in development)');
  console.log('Demo Farmer Phone: 9876543210 (Use OTP: 123456 in development)');
  console.log('\n🌱 AgriQuest is ready to use!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });