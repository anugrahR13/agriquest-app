import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

console.log('Available Prisma models:');
console.log(Object.keys(prisma));

async function main() {
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});