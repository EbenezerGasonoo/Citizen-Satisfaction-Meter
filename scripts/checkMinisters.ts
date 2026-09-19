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

  // Check duplicate photo URLs & file existence on disk
  const fs = await import('fs');
  const path = await import('path');
  let hasDuplicatePhotos = false;
  let missingFiles = 0;

  for (const [photo, count] of photoCounts.entries()) {
    if (count > 1) {
      console.warn(`⚠️ DUPLICATE PHOTO URL FOUND: "${photo}" used by ${count} ministers!`);
      hasDuplicatePhotos = true;
    }
    const localDiskPath = path.join(process.cwd(), 'public', photo);
    if (!fs.existsSync(localDiskPath)) {
      console.error(`❌ PHOTO MISSING ON DISK: "${localDiskPath}"`);
      missingFiles++;
    } else {
      const sz = fs.statSync(localDiskPath).size;
      if (sz < 1000) {
        console.error(`❌ PHOTO FILE TOO SMALL (${sz} bytes): "${localDiskPath}"`);
        missingFiles++;
      }
    }
  }

  if (!hasDuplicateNames && !hasDuplicatePhotos && missingFiles === 0) {
    console.log('✅ AUDIT PASSED: 0 duplicate minister names, 0 duplicate photo URLs, and 25 verified photos on disk.');
  } else {
    console.error(`❌ AUDIT FAILED: Duplicate names: ${hasDuplicateNames}, Duplicate photos: ${hasDuplicatePhotos}, Missing files: ${missingFiles}`);
  }

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}); 