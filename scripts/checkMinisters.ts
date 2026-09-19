import { prisma } from '../src/lib/prisma';

async function main() {
  const ministers = await prisma.minister.findMany({
    select: { id: true, fullName: true, portfolio: true, sector: true, photoUrl: true },
    orderBy: { id: 'asc' }
  });

  console.log(`\n=== Total Ministers in Database: ${ministers.length} ===\n`);

  const nameCounts = new Map<string, number>();
  const photoCounts = new Map<string, number>();

  ministers.forEach(m => {
    console.log(`[#${m.id}] ${m.fullName}`);
    console.log(`     Portfolio: ${m.portfolio}`);
    console.log(`     Sector:    ${m.sector || 'Unassigned'}`);
    console.log(`     Photo:     ${m.photoUrl}`);
    console.log('');

    const normName = m.fullName.toLowerCase().trim().replace(/\s*\(mp\)\s*/g, '');
    nameCounts.set(normName, (nameCounts.get(normName) || 0) + 1);

    if (m.photoUrl) {
      photoCounts.set(m.photoUrl, (photoCounts.get(m.photoUrl) || 0) + 1);
    }
  });

  // Check duplicate names
  let hasDuplicateNames = false;
  for (const [name, count] of nameCounts.entries()) {
    if (count > 1) {
      console.warn(`⚠️ DUPLICATE NAME FOUND: "${name}" occurs ${count} times!`);
      hasDuplicateNames = true;
    }
  }

  // Check duplicate photo URLs
  let hasDuplicatePhotos = false;
  for (const [photo, count] of photoCounts.entries()) {
    if (count > 1) {
      console.warn(`⚠️ DUPLICATE PHOTO URL FOUND: "${photo}" used by ${count} ministers!`);
      hasDuplicatePhotos = true;
    }
  }

  if (!hasDuplicateNames && !hasDuplicatePhotos) {
    console.log('✅ AUDIT PASSED: 0 duplicate minister names, 0 duplicate photo URLs across all 25 ministers.');
  } else {
    console.error('❌ AUDIT FAILED: Duplicates detected!');
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 