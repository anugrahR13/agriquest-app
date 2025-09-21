const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function initializeCropBadges() {
  try {
    // Create "Top Crop Score" badge
    const topCropBadge = await prisma.badge.upsert({
      where: { name: 'Top Crop Score' },
      update: {},
      create: {
        name: 'Top Crop Score',
        description: 'Achieved an exceptional crop health score of 9 or higher',
        type: 'ACHIEVEMENT',
        iconUrl: '/badges/top-crop-score.png',
        colorCode: '#10B981',
        criteria: JSON.stringify({ minCropScore: 9 }),
        pointsReward: 300,
        rarity: 'EPIC'
      }
    });

    // Create "Excellent Crop Health" badge
    const excellentCropBadge = await prisma.badge.upsert({
      where: { name: 'Excellent Crop Health' },
      update: {},
      create: {
        name: 'Excellent Crop Health',
        description: 'Achieved an excellent crop health score of 8 or higher',
        type: 'ACHIEVEMENT',
        iconUrl: '/badges/excellent-crop-health.png',
        colorCode: '#3B82F6',
        criteria: JSON.stringify({ minCropScore: 8 }),
        pointsReward: 200,
        rarity: 'RARE'
      }
    });

    return {
      topCropBadge,
      excellentCropBadge
    };
  } catch (error) {
    console.error('Error initializing crop badges:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Initializing crop-related badges...');
    
    const badges = await initializeCropBadges();
    
    console.log('✅ Crop badges initialized successfully:');
    console.log(`- Top Crop Score badge: ${badges.topCropBadge.name}`);
    console.log(`- Excellent Crop Health badge: ${badges.excellentCropBadge.name}`);
    
    console.log('\n🌱 Badges are now ready to be awarded for high crop scores!');
  } catch (error) {
    console.error('❌ Error initializing crop badges:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();