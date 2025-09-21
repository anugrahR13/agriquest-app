import { initializeCropBadges } from '../server/utils/gamification';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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