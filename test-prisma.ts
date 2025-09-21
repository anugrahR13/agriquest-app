import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function test() {
  // Test if cropScore model is accessible
  try {
    const test = await prisma.cropScore.findFirst({
      where: { id: 1 }
    });
    console.log('CropScore model is accessible');
  } catch (error) {
    console.log('Error accessing cropScore model:', error);
  }
  
  // Test if auctionRequest model is accessible
  try {
    const test = await prisma.auctionRequest.findFirst({
      where: { id: 1 }
    });
    console.log('AuctionRequest model is accessible');
  } catch (error) {
    console.log('Error accessing auctionRequest model:', error);
  }
  
  await prisma.$disconnect();
}

test();