import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create a test user (farmer)
  const farmer = await prisma.user.upsert({
    where: { phone: '9999999999' },
    update: {},
    create: {
      phone: '9999999999',
      phoneVerified: true,
      firstName: 'Test',
      lastName: 'Farmer',
      role: 'FARMER',
      isActive: true,
      preferredLanguage: 'en',
    },
  });

  // Create a farmer profile
  const farmerProfile = await prisma.farmer.upsert({
    where: { userId: farmer.id },
    update: {},
    create: {
      userId: farmer.id,
      farmerId: 'FARMER-001',
      farmName: 'Test Farm',
      region: 'Test Region',
      village: 'Test Village',
      panchayat: 'Test Panchayat',
      farmSize: 5.5,
      primaryCrops: ['CEREALS'],
      farmingExperience: 10,
      sustainabilityScore: 85.5,
      level: 5,
      isVerified: true,
      totalPoints: 1500,
    },
  });

  // Create a farm profile
  const farmProfile = await prisma.farmProfile.upsert({
    where: { id: 'farm-001' },
    update: {},
    create: {
      id: 'farm-001',
      userId: farmer.id,
      cropType: 'WHEAT',
      soilInfo: {},
      seedVariety: 'HD 2967',
      sowingDate: new Date(),
      size: 5.5,
      location: 'Test Location',
    },
  });

  // Create a crop score
  const cropScore = await prisma.cropScore.upsert({
    where: { id: 1 },
    update: {},
    create: {
      farmId: farmProfile.id,
      score: 8.5,
      reportUrl: '/sample-report.pdf',
    },
  });

  // Create a test auction
  const auction = await prisma.auction.upsert({
    where: { id: 1 },
    update: {},
    create: {
      farmId: farmProfile.id,
      cropScoreId: cropScore.id,
      cropType: 'WHEAT',
      variety: 'HD 2967',
      quantity: 5.5,
      startingPrice: 2000,
      currentBid: 2000,
      startDate: new Date(),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      farmerName: 'Test Farmer',
      farmLocation: 'Test Location',
      status: 'ACTIVE',
      cropScore: 8.5,
      reportUrl: '/sample-report.pdf',
      govtNotes: 'High quality produce with excellent health score. Recommended for premium markets.',
    },
  });

  console.log('Seed data created successfully!');
  console.log('Farmer ID:', farmer.id);
  console.log('Farm Profile ID:', farmProfile.id);
  console.log('Crop Score ID:', cropScore.id);
  console.log('Auction ID:', auction.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });