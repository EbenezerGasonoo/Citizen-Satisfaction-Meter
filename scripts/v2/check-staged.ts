import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const staged = await prisma.stagedMinister.findMany({
    select: { id: true, fullName: true, portfolio: true, photoUrl: true, status: true }
  });
  console.log(`Total Staged Ministers: ${staged.length}`);
  staged.forEach(s => {
    console.log(`[#${s.id}] [${s.status}] ${s.fullName} - ${s.portfolio} (Photo: ${s.photoUrl || 'none'})`);
  });
}

main().finally(() => prisma.$disconnect());
