import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const ministers = await prisma.minister.findMany({
    select: { id: true, fullName: true, portfolio: true }
  });
  if (ministers.length === 0) {
    console.log('No ministers found in the database.');
  } else {
    console.log('Ministers in the database:');
    ministers.forEach(m => {
      console.log(`ID: ${m.id}, Name: ${m.fullName}, Portfolio: ${m.portfolio}`);
    });
  }
  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 