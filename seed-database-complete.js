/**
 * Complete Database Seeding Script
 * Seeds the database with initial data for all functions
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Seeding database with initial data...');
  
  try {
    // 1. Create admin user
    console.log('1. Creating admin user...');
    const adminUser = await prisma.user.upsert({
      where: { phone: '+919999999999' },
      update: {},
      create: {
        phone: '+919999999999',
        phoneVerified: true,
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        isActive: true,
      },
    });
    
    // Create admin profile
    const adminProfile = await prisma.adminProfile.upsert({
      where: { userId: adminUser.id },
      update: {},
      create: {
        userId: adminUser.id,
        department: 'Agriculture Department',
        canCreateMissions: true,
        canModerate: true,
        canManageUsers: true,
        canViewAnalytics: true,
      },
    });
    
    console.log('   ✅ Admin user created:', adminUser.firstName, adminUser.lastName);
    
    // 2. Create sample farmer
    console.log('2. Creating sample farmer...');
    const farmerUser = await prisma.user.upsert({
      where: { phone: '+918888888888' },
      update: {},
      create: {
        phone: '+918888888888',
        phoneVerified: true,
        firstName: 'Raj',
        lastName: 'Kumar',
        role: 'FARMER',
        isActive: true,
      },
    });
    
    const farmer = await prisma.farmer.upsert({
      where: { userId: farmerUser.id },
      update: {},
      create: {
        userId: farmerUser.id,
        farmerId: 'FARMER-001',
        farmName: 'Green Valley Farm',
        region: 'Punjab',
        village: 'Kotla',
        panchayat: 'Kotla Panchayat',
        farmSize: 10.5,
        primaryCrops: ['CEREALS', 'VEGETABLES'],
        farmingExperience: 15,
        educationLevel: 'High School',
        totalPoints: 1500,
        currentStreak: 30,
        longestStreak: 45,
        sustainabilityScore: 85.5,
        level: 5,
        isVerified: true,
        bio: 'Passionate farmer with 15 years of experience in sustainable farming practices.',
      },
    });
    
    console.log('   ✅ Farmer created:', farmer.farmName);
    
    // 3. Create farm profile
    console.log('3. Creating farm profile...');
    const farmProfile = await prisma.farmProfile.upsert({
      where: { userId: farmerUser.id },
      update: {},
      create: {
        userId: farmerUser.id,
        cropType: 'WHEAT',
        soilInfo: {
          type: 'Loamy',
          pH: 6.5,
          nutrients: {
            nitrogen: 'Medium',
            phosphorus: 'High',
            potassium: 'Medium'
          }
        },
        seedVariety: 'HD 2967',
        sowingDate: new Date('2025-11-15'),
        size: 10.5,
        location: 'Punjab, India',
      },
    });
    
    console.log('   ✅ Farm profile created for:', farmProfile.cropType);
    
    // 4. Create sample crop
    console.log('4. Creating sample crop...');
    const farmerCrop = await prisma.farmerCrop.upsert({
      where: { id: 'crop-001' },
      update: {},
      create: {
        id: 'crop-001',
        farmerId: farmer.id,
        cropType: 'WHEAT',
        variety: 'HD 2967',
        sowingDate: new Date('2025-11-15'),
        soilPH: 6.5,
        soilTexture: 'Loamy',
        soilFertility: 'HIGH',
        farmSize: 10.5,
        location: 'Field A',
        latitude: 31.6339,
        longitude: 74.8723,
        isActive: true,
      },
    });
    
    console.log('   ✅ Farmer crop created:', farmerCrop.cropType, farmerCrop.variety);
    
    // 5. Create sample AI analysis
    console.log('5. Creating sample AI analysis...');
    const aiAnalysis = await prisma.aIAnalysis.upsert({
      where: { id: 'analysis-001' },
      update: {},
      create: {
        id: 'analysis-001',
        farmerCropId: farmerCrop.id,
        healthScore: 92.5,
        leafColor: 'GREEN',
        density: 88.0,
        diseaseDetected: false,
        growthPercent: 75.0,
        canopyCover: 80.0,
        recommendations: {
          fertilization: 'Apply nitrogen based fertilizer',
          irrigation: 'Irrigate every 7 days',
          pestControl: 'Monitor for aphids',
          generalCare: 'Continue current practices'
        },
        analysisDate: new Date(),
      },
    });
    
    console.log('   ✅ AI analysis created with health score:', aiAnalysis.healthScore);
    
    // 6. Create sample crop credit report
    console.log('6. Creating sample crop credit report...');
    const cropCreditReport = await prisma.cropCreditReport.upsert({
      where: { id: 'report-001' },
      update: {},
      create: {
        id: 'report-001',
        farmerCropId: farmerCrop.id,
        farmerId: farmer.id,
        season: 'RABI',
        growthTimeline: {
          stages: [
            { stage: 'SOWING', date: '2025-11-15', notes: 'Sowing completed' },
            { stage: 'SPROUTING', date: '2025-11-25', notes: 'Good germination' },
            { stage: 'TILLERING', date: '2025-12-10', notes: 'Healthy tillering' }
          ]
        },
        totalPhotos: 5,
        aiAnalysisIds: [aiAnalysis.id],
        healthScore: 92.5,
        predictedYield: {
          min: 2500,
          max: 3000,
          unit: 'kg',
          quality: 'Good'
        },
        sustainabilityScore: 85.5,
        recommendations: {
          immediate: ['Continue regular irrigation', 'Apply nitrogen fertilizer'],
          longTerm: ['Plan for next crop rotation', 'Soil testing for micro-nutrients']
        },
        isGenerated: true,
        generatedAt: new Date(),
      },
    });
    
    console.log('   ✅ Crop credit report created with health score:', cropCreditReport.healthScore);
    
    // 7. Create sample auction
    console.log('7. Creating sample auction...');
    const auction = await prisma.auction.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        farmId: farmProfile.id,
        cropScoreId: 1, // This would reference an actual crop score
        cropType: 'WHEAT',
        variety: 'HD 2967',
        quantity: 3000,
        startingPrice: 2000,
        currentBid: 2100,
        startDate: new Date(),
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        farmerName: 'Raj Kumar',
        farmLocation: 'Punjab, India',
        status: 'ACTIVE',
        cropScore: 92.5,
        reportUrl: 'https://example.com/report-001.pdf',
      },
    });
    
    console.log('   ✅ Auction created for:', auction.cropType, 'with starting price:', auction.startingPrice);
    
    // 8. Create sample mission
    console.log('8. Creating sample mission...');
    const mission = await prisma.mission.upsert({
      where: { id: 'mission-001' },
      update: {},
      create: {
        id: 'mission-001',
        title: 'Soil Health Monitoring',
        description: 'Monitor and improve soil health through organic practices',
        shortDescription: 'Improve soil health',
        category: 'Soil Management',
        targetCrops: ['CEREALS', 'VEGETABLES'],
        targetRegions: ['Punjab', 'Haryana'],
        difficulty: 'INTERMEDIATE',
        estimatedDuration: 30,
        pointsReward: 100,
        isActive: true,
        instructions: [
          'Test soil pH weekly',
          'Apply organic compost',
          'Monitor moisture levels'
        ],
        resources: [
          'https://example.com/soil-testing-guide.pdf',
          'https://example.com/composting-video'
        ],
        createdById: adminProfile.id,
      },
    });
    
    console.log('   ✅ Mission created:', mission.title);
    
    // 9. Create sample farmer mission
    console.log('9. Creating sample farmer mission assignment...');
    const farmerMission = await prisma.farmerMission.upsert({
      where: { id: 'farmer-mission-001' },
      update: {},
      create: {
        id: 'farmer-mission-001',
        farmerId: farmer.id,
        missionId: mission.id,
        status: 'IN_PROGRESS',
        assignedAt: new Date(),
        startedAt: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        progress: {
          completedSteps: 2,
          totalSteps: 5
        },
        pointsEarned: 40,
      },
    });
    
    console.log('   ✅ Farmer mission assigned:', farmerMission.status);
    
    // 10. Create sample badge
    console.log('10. Creating sample badge...');
    const badge = await prisma.badge.upsert({
      where: { name: 'Soil Guardian' },
      update: {},
      create: {
        name: 'Soil Guardian',
        description: 'Awarded for completing soil health monitoring missions',
        type: 'ACHIEVEMENT',
        iconUrl: '/badges/soil-guardian.png',
        colorCode: '#8B4513',
        criteria: {
          missionsCompleted: 5,
          category: 'Soil Management'
        },
        pointsReward: 150,
        isActive: true,
        rarity: 'RARE',
      },
    });
    
    console.log('   ✅ Badge created:', badge.name);
    
    // 11. Create sample farmer badge
    console.log('11. Creating sample farmer badge assignment...');
    const farmerBadge = await prisma.farmerBadge.upsert({
      where: { id: 'farmer-badge-001' },
      update: {},
      create: {
        id: 'farmer-badge-001',
        farmerId: farmer.id,
        badgeId: badge.id,
        criteria: {
          missionsCompleted: 5,
          category: 'Soil Management'
        },
      },
    });
    
    console.log('   ✅ Farmer badge assigned:', badge.name);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('✅ Admin user created');
    console.log('✅ Sample farmer created');
    console.log('✅ Farm profile created');
    console.log('✅ Sample crop created');
    console.log('✅ AI analysis created');
    console.log('✅ Crop credit report created');
    console.log('✅ Sample auction created');
    console.log('✅ Sample mission created');
    console.log('✅ Farmer mission assigned');
    console.log('✅ Sample badge created');
    console.log('✅ Farmer badge assigned');
    
    console.log('\n📋 The application database is now fully loaded with sample data!');
    console.log('You can now start the development server and test all features.');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
seedDatabase();