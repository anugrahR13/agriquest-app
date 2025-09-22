import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedTestData() {
  try {
    // Create a test user with farmer role
    const user = await prisma.user.upsert({
      where: { phone: '9876543210' },
      update: {},
      create: {
        phone: '9876543210',
        phoneVerified: true,
        firstName: 'Test',
        lastName: 'Farmer',
        role: 'FARMER',
        isActive: true,
        preferredLanguage: 'en'
      }
    });

    // Create farmer profile
    const farmer = await prisma.farmer.upsert({
      where: { userId: user.id },
      update: {},
      create: {
        userId: user.id,
        farmerId: 'farmer_demo_12345',
        farmName: 'Demo Farm',
        region: 'Test Region',
        village: 'Test Village',
        farmSize: 10.5,
        primaryCrops: ['CEREALS'],
        farmingExperience: 5,
        sustainabilityScore: 85.5,
        level: 1,
        isVerified: true
      }
    });

    // Create farm profile
    const farmProfile = await prisma.farmProfile.upsert({
      where: { id: 'farm_profile_demo_12345' },
      update: {},
      create: {
        id: 'farm_profile_demo_12345',
        userId: user.id,
        cropType: 'WHEAT',
        soilInfo: {},
        seedVariety: 'HD 2967',
        sowingDate: new Date(),
        size: 10.5,
        location: 'Test Location'
      }
    });

    // Create crop score
    const cropScore = await prisma.cropScore.upsert({
      where: { id: 1 },
      update: {},
      create: {
        farmId: farmProfile.id,
        score: 8.5,
        reportUrl: '/reports/crop-score-1.pdf'
      }
    });

    // Create auction request
    const auctionRequest = await prisma.auctionRequest.upsert({
      where: { id: 1 },
      update: {},
      create: {
        farmId: farmProfile.id,
        cropScoreId: cropScore.id,
        status: 'PENDING',
        govtNotes: 'Test auction request'
      }
    });

    // Create auction listing
    const auction = await prisma.auction.upsert({
      where: { id: 1 },
      update: {},
      create: {
        farmId: farmProfile.id,
        cropScoreId: cropScore.id,
        cropType: 'WHEAT',
        variety: 'HD 2967',
        quantity: 10.5,
        startingPrice: 850,
        currentBid: 900,
        startDate: new Date(),
        endDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        farmerName: 'Test Farmer',
        farmLocation: 'Test Location',
        status: 'ACTIVE',
        cropScore: 8.5,
        govtNotes: 'Test auction listing'
      }
    });

    console.log('Test data seeded successfully!');
    console.log('User ID:', user.id);
    console.log('Farmer ID:', farmer.id);
    console.log('Farm Profile ID:', farmProfile.id);
    console.log('Crop Score ID:', cropScore.id);
    console.log('Auction Request ID:', auctionRequest.id);
    console.log('Auction ID:', auction.id);
  } catch (error) {
    console.error('Error seeding test data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedTestData();