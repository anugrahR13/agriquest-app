import { PrismaClient } from '@prisma/client';

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
  const farmerData = {
    phone: '9876543210',
    firstName: 'Ramesh',
    lastName: 'Kumar',
    farmName: 'Kumar Organic Farm',
    region: 'Uttar Pradesh',
    village: 'Ghazipur',
    panchayat: 'Ghazipur Gram Panchayat',
    farmSize: 5.5,
    primaryCrops: ['CEREALS', 'PULSES'],
    farmingExperience: 15,
    educationLevel: 'High School',
  };

  const user = await prisma.user.create({
    data: {
      phone: farmerData.phone,
      phoneVerified: true,
      firstName: farmerData.firstName,
      lastName: farmerData.lastName,
      role: 'FARMER',
      preferredLanguage: 'en',
      isActive: true,
    },
  });

  const farmer = await prisma.farmer.create({
    data: {
      userId: user.id,
      farmerId: `AGQ${Date.now().toString().slice(-6)}`,
      farmName: farmerData.farmName,
      region: farmerData.region,
      village: farmerData.village,
      panchayat: farmerData.panchayat,
      farmSize: farmerData.farmSize,
      primaryCrops: farmerData.primaryCrops,
      farmingExperience: farmerData.farmingExperience,
      educationLevel: farmerData.educationLevel,
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
  console.log('Admin Phone: 9999999999');
  console.log('Demo Farmer Phone: 9876543210');
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
      description: 'Actively shared knowledge with fellow farmers',
      type: 'COMMUNITY',
      iconUrl: '/badges/community-leader.png',
      colorCode: '#F59E0B',
      criteria: { postsShared: 10, helpfulVotes: 50 },
      pointsReward: 150,
      rarity: 'EPIC',
    },
    {
      name: 'Streak Master',
      description: 'Maintained a 30-day mission completion streak',
      type: BadgeType.MILESTONE,
      iconUrl: '/badges/streak-master.png',
      colorCode: '#EF4444',
      criteria: { longestStreak: 30 },
      pointsReward: 200,
      rarity: 'LEGENDARY',
    },
  ];

  const createdBadges = [];
  for (const badgeData of badges) {
    const badge = await prisma.badge.create({
      data: badgeData,
    });
    createdBadges.push(badge);
  }

  // 4. Create Rewards
  console.log('🎁 Creating rewards...');
  const rewards = [
    {
      title: 'Organic Seeds Voucher',
      description: 'Get premium organic seeds worth ₹500',
      type: RewardType.COUPON,
      pointsCost: 1000,
      value: 500,
      category: 'seeds',
      stockQuantity: 100,
    },
    {
      title: 'Farming Equipment Discount',
      description: '20% discount on farming equipment',
      type: RewardType.COUPON,
      pointsCost: 1500,
      value: 2000,
      category: 'equipment',
      stockQuantity: 50,
    },
    {
      title: 'Sustainable Farming Training',
      description: 'Free access to online sustainable farming course',
      type: 'TRAINING_CREDIT',
      pointsCost: 2000,
      value: 1500,
      category: 'education',
      stockQuantity: 30,
    },
    {
      title: 'Soil Testing Kit',
      description: 'Professional soil testing kit for farm analysis',
      type: RewardType.COUPON,
      pointsCost: 800,
      value: 1200,
      category: 'testing',
      stockQuantity: 25,
    },
    {
      title: 'Sustainable Farming Certificate',
      description: 'Official certificate of sustainable farming practices',
      type: 'CERTIFICATE',
      pointsCost: 3000,
      value: 0,
      category: 'certification',
      stockQuantity: 10,
    },
  ];

  const createdRewards = [];
  for (const rewardData of rewards) {
    const reward = await prisma.reward.create({
      data: {
        ...rewardData,
        createdById: adminProfile.id,
      },
    });
    createdRewards.push(reward);
  }

  // 5. Create Missions
  console.log('🎯 Creating missions...');
  const missions = [
    {
      title: 'Install Drip Irrigation System',
      description: 'Set up a drip irrigation system to conserve water and improve crop yield',
      shortDescription: 'Install drip irrigation for water conservation',
      instructions: [
        'Purchase drip irrigation components',
        'Plan the layout for your field',
        'Install main water line and laterals',
        'Test the system for proper water flow',
        'Monitor water usage for 1 week',
      ],
      category: 'water-conservation',
      targetCrops: ['VEGETABLES', 'FRUITS'],
      targetRegions: ['Punjab', 'Haryana', 'Uttar Pradesh'],
      targetSeason: 'KHARIF',
      difficulty: 'INTERMEDIATE',
      estimatedDuration: 14,
      pointsReward: 300,
      prerequisites: ['basic-irrigation-knowledge'],
      resources: [
        { type: 'video', url: '/resources/drip-irrigation-setup.mp4', title: 'Drip Irrigation Setup Guide' },
        { type: 'pdf', url: '/resources/irrigation-manual.pdf', title: 'Installation Manual' },
      ],
      verificationSteps: [
        'Submit photos of installed system',
        'Provide water usage measurements',
        'Complete system functionality test',
      ],
      tags: ['water-conservation', 'irrigation', 'efficiency'],
    },
    {
      title: 'Switch to Bio-Pesticides',
      description: 'Replace chemical pesticides with organic bio-pesticides for 30 days',
      shortDescription: 'Use organic pest control methods',
      instructions: [
        'Source approved bio-pesticides',
        'Stop using chemical pesticides',
        'Apply bio-pesticides as per guidelines',
        'Monitor pest control effectiveness',
        'Document the transition process',
      ],
      category: 'organic-farming',
      targetCrops: ['VEGETABLES', 'CEREALS'],
      targetRegions: ['Maharashtra', 'Karnataka', 'Tamil Nadu'],
      difficulty: 'BEGINNER',
      estimatedDuration: 30,
      pointsReward: 250,
      prerequisites: [],
      resources: [
        { type: 'article', url: '/resources/bio-pesticides-guide.html', title: 'Bio-Pesticides Usage Guide' },
        { type: 'contact', info: 'Local organic farming expert: +91-98765-43210' },
      ],
      verificationSteps: [
        'Submit purchase receipts for bio-pesticides',
        'Provide before/after photos of crops',
        'Record pest control observations',
      ],
      tags: ['organic', 'pesticides', 'sustainable'],
    },
    {
      title: 'Apply Vermicompost to Fields',
      description: 'Improve soil fertility by applying vermicompost to your crop fields',
      shortDescription: 'Enhance soil health with vermicompost',
      instructions: [
        'Prepare or purchase quality vermicompost',
        'Test soil before application',
        'Apply vermicompost evenly across field',
        'Mix with soil using appropriate tools',
        'Monitor soil health improvements',
      ],
      category: 'soil-health',
      targetCrops: ['CEREALS', 'PULSES', 'VEGETABLES'],
      targetRegions: ['West Bengal', 'Bihar', 'Jharkhand'],
      difficulty: 'BEGINNER',
      estimatedDuration: 7,
      pointsReward: 200,
      prerequisites: [],
      resources: [
        { type: 'video', url: '/resources/vermicompost-application.mp4', title: 'Vermicompost Application Tutorial' },
        { type: 'checklist', items: ['Quality vermicompost', 'Soil testing kit', 'Application tools'] },
      ],
      verificationSteps: [
        'Submit soil test results before and after',
        'Provide photos of vermicompost application',
        'Record application dates and quantities',
      ],
      tags: ['soil-health', 'organic-matter', 'fertility'],
    },
    {
      title: 'Implement Crop Rotation',
      description: 'Practice crop rotation to maintain soil fertility and reduce pest problems',
      shortDescription: 'Rotate crops for better soil health',
      instructions: [
        'Plan crop rotation schedule',
        'Choose complementary crop varieties',
        'Prepare fields for new crop',
        'Plant according to rotation plan',
        'Monitor soil and crop health',
      ],
      category: 'sustainable-practices',
      targetCrops: ['CEREALS', 'PULSES'],
      targetRegions: ['Madhya Pradesh', 'Rajasthan', 'Gujarat'],
      targetSeason: 'RABI',
      difficulty: 'INTERMEDIATE',
      estimatedDuration: 90,
      pointsReward: 400,
      prerequisites: ['crop-selection-knowledge'],
      resources: [
        { type: 'guide', url: '/resources/crop-rotation-guide.pdf', title: 'Crop Rotation Planning Guide' },
        { type: 'calculator', url: '/tools/rotation-planner', title: 'Crop Rotation Planner Tool' },
      ],
      verificationSteps: [
        'Submit crop rotation plan',
        'Provide planting schedule documentation',
        'Show evidence of different crops planted',
      ],
      tags: ['crop-rotation', 'soil-fertility', 'pest-control'],
    },
    {
      title: 'Share Farming Success Story',
      description: 'Share your sustainable farming journey and inspire other farmers',
      shortDescription: 'Inspire others with your farming story',
      instructions: [
        'Document your farming journey',
        'Take photos of your sustainable practices',
        'Write a detailed success story',
        'Share tips and lessons learned',
        'Post in the community section',
      ],
      category: 'community-engagement',
      targetCrops: [],
      targetRegions: [],
      difficulty: 'BEGINNER',
      estimatedDuration: 3,
      pointsReward: 150,
      prerequisites: [],
      resources: [
        { type: 'template', url: '/resources/story-template.html', title: 'Success Story Template' },
        { type: 'tips', items: ['Include before/after photos', 'Share specific techniques', 'Mention challenges faced'] },
      ],
      verificationSteps: [
        'Post story in community section',
        'Include at least 3 photos',
        'Receive community engagement (likes/comments)',
      ],
      tags: ['community', 'knowledge-sharing', 'inspiration'],
    },
  ];

  const createdMissions = [];
  for (const missionData of missions) {
    const mission = await prisma.mission.create({
      data: {
        ...missionData,
        createdById: adminProfile.id,
      },
    });
    createdMissions.push(mission);
  }

  // 6. Assign missions to farmers
  console.log('📋 Assigning missions to farmers...');
  for (const { farmer } of createdFarmers) {
    // Randomly assign 2-4 missions to each farmer
    const assignedMissions = createdMissions
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 3) + 2);

    for (const mission of assignedMissions) {
      const status = Math.random() > 0.6 ? 'COMPLETED' : 'IN_PROGRESS';
      const farmerMission = await prisma.farmerMission.create({
        data: {
          farmerId: farmer.id,
          missionId: mission.id,
          status: status as any,
          assignedAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
          startedAt: status !== 'ASSIGNED' ? new Date(Date.now() - Math.random() * 20 * 24 * 60 * 60 * 1000) : null,
          completedAt: status === 'COMPLETED' ? new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000) : null,
          pointsEarned: status === 'COMPLETED' ? mission.pointsReward : 0,
          progress: {
            currentStep: status === 'COMPLETED' ? mission.instructions.length : Math.floor(Math.random() * mission.instructions.length),
            totalSteps: mission.instructions.length,
            completedSteps: status === 'COMPLETED' ? mission.instructions.length : Math.floor(Math.random() * mission.instructions.length),
          },
        },
      });
    }
  }

  // 7. Award some badges to farmers
  console.log('🏅 Awarding badges to farmers...');
  for (const { farmer } of createdFarmers.slice(0, 3)) {
    const randomBadges = createdBadges.sort(() => 0.5 - Math.random()).slice(0, 2);
    for (const badge of randomBadges) {
      await prisma.farmerBadge.create({
        data: {
          farmerId: farmer.id,
          badgeId: badge.id,
          earnedAt: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000),
          criteria: { missionCompleted: true, category: 'water-conservation' },
        },
      });
    }
  }

  // 8. Create some community posts
  console.log('💬 Creating community posts...');
  const posts = [
    {
      title: 'Amazing Results with Drip Irrigation!',
      content: 'I installed a drip irrigation system last month and my water usage has reduced by 40% while crop yield increased by 25%. Highly recommend this to all vegetable farmers!',
      images: ['/posts/drip-irrigation-success.jpg'],
      tags: ['drip-irrigation', 'water-conservation', 'success-story'],
      category: 'Success Story',
    },
    {
      title: 'Tips for Bio-Pesticide Application',
      content: 'Here are some key tips I learned while switching to bio-pesticides: 1) Apply during early morning or evening, 2) Mix only required quantity, 3) Monitor effectiveness weekly. Happy to answer questions!',
      tags: ['bio-pesticides', 'organic-farming', 'tips'],
      category: 'Tip',
    },
    {
      title: 'Vermicompost preparation at home',
      content: 'Started making vermicompost at home using kitchen waste. After 3 months, I have enough compost for my entire 2-acre field. Cost saving is tremendous!',
      images: ['/posts/vermicompost-setup.jpg', '/posts/vermicompost-ready.jpg'],
      tags: ['vermicompost', 'organic-matter', 'cost-saving'],
      category: 'Success Story',
    },
  ];

  for (let i = 0; i < posts.length; i++) {
    const postData = posts[i];
    const randomFarmer = createdFarmers[i];
    await prisma.post.create({
      data: {
        farmerId: randomFarmer.farmer.id,
        authorId: randomFarmer.user.id,
        title: postData.title,
        content: postData.content,
        images: postData.images || [],
        tags: postData.tags,
        category: postData.category,
        likesCount: Math.floor(Math.random() * 20) + 5,
        commentsCount: Math.floor(Math.random() * 10) + 2,
        viewsCount: Math.floor(Math.random() * 100) + 20,
      },
    });
  }

  // 9. Create system settings
  console.log('⚙️ Creating system settings...');
  const systemSettings = [
    { key: 'POINTS_PER_MISSION', value: '100', description: 'Default points awarded per mission completion', category: 'gamification' },
    { key: 'STREAK_BONUS_MULTIPLIER', value: '1.5', description: 'Multiplier for streak bonuses', category: 'gamification' },
    { key: 'LEVEL_UP_THRESHOLD', value: '1000', description: 'Points required to level up', category: 'gamification' },
    { key: 'MAX_MISSIONS_PER_FARMER', value: '5', description: 'Maximum active missions per farmer', category: 'missions' },
    { key: 'COMMUNITY_POST_MODERATION', value: 'true', description: 'Enable post moderation', category: 'community' },
    { key: 'NOTIFICATION_BATCH_SIZE', value: '50', description: 'Number of notifications sent per batch', category: 'notifications' },
    { key: 'LEADERBOARD_UPDATE_INTERVAL', value: '3600', description: 'Leaderboard update interval in seconds', category: 'leaderboard' },
  ];

  for (const setting of systemSettings) {
    await prisma.systemSetting.create({
      data: setting,
    });
  }

  // 10. Create sample leaderboards
  console.log('🏆 Creating leaderboards...');
  const leaderboards = [
    {
      name: 'Global Farmers Leaderboard',
      type: 'GLOBAL',
      startDate: new Date('2024-01-01'),
      criteria: { sortBy: 'totalPoints', order: 'desc' },
    },
    {
      name: 'Punjab Regional Leaderboard',
      type: 'REGION',
      scope: 'Punjab',
      startDate: new Date('2024-01-01'),
      criteria: { sortBy: 'totalPoints', order: 'desc', region: 'Punjab' },
    },
    {
      name: 'Ghazipur Panchayat Leaderboard',
      type: 'PANCHAYAT',
      scope: 'Ghazipur Gram Panchayat',
      startDate: new Date('2024-01-01'),
      criteria: { sortBy: 'totalPoints', order: 'desc', panchayat: 'Ghazipur Gram Panchayat' },
    },
  ];

  for (const leaderboardData of leaderboards) {
    const leaderboard = await prisma.leaderboard.create({
      data: leaderboardData,
    });

    // Add farmers to leaderboard
    let relevantFarmers = createdFarmers;
    if (leaderboardData.type === 'REGION') {
      relevantFarmers = createdFarmers.filter(f => f.farmer.region === leaderboardData.scope);
    } else if (leaderboardData.type === 'PANCHAYAT') {
      relevantFarmers = createdFarmers.filter(f => f.farmer.panchayat === leaderboardData.scope);
    }

    const sortedFarmers = relevantFarmers.sort((a, b) => b.farmer.totalPoints - a.farmer.totalPoints);

    for (let i = 0; i < sortedFarmers.length; i++) {
      const { farmer } = sortedFarmers[i];
      await prisma.leaderboardEntry.create({
        data: {
          leaderboardId: leaderboard.id,
          farmerId: farmer.id,
          rank: i + 1,
          score: farmer.totalPoints,
          points: farmer.totalPoints,
          missionsCompleted: Math.floor(Math.random() * 10) + 5,
          streak: farmer.currentStreak,
          badges: Math.floor(Math.random() * 5) + 1,
          metadata: {
            region: farmer.region,
            village: farmer.village,
            sustainabilityScore: farmer.sustainabilityScore,
          },
        },
      });
    }
  }

  console.log('✅ Database seeding completed successfully!');
  console.log(`
📊 Summary:
- ${createdFarmers.length} farmers created
- ${createdMissions.length} missions created
- ${createdBadges.length} badges created
- ${createdRewards.length} rewards created
- ${posts.length} community posts created
- ${leaderboards.length} leaderboards created
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