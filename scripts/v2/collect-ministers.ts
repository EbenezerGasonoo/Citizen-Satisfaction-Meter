/**
 * CLI Script: Collect Ministers (V2 Harvester)
 * Scrapes cabinet ministers from Wikipedia and stages them in the database and local JSON cache.
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { WikipediaHarvester } from '../../src/lib/v2/wikipedia-harvester';

const prisma = new PrismaClient();

async function main() {
  console.log('=====================================================');
  console.log('🇬🇭 Citizen Satisfaction Meter V2: Minister Harvester');
  console.log('=====================================================\n');

  const harvester = new WikipediaHarvester({ delayMs: 400 });
  const scraped = await harvester.harvestAll();

  console.log(`\n[Harvester] Extracted ${scraped.length} ministers. Staging to database...`);

  // Ensure data/ directory exists for JSON staging fallback
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  const jsonPath = path.join(dataDir, 'staged-ministers.json');
  fs.writeFileSync(jsonPath, JSON.stringify(scraped, null, 2), 'utf-8');
  console.log(`[Harvester] Local backup written to ${jsonPath}`);

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of scraped) {
    // Check if staged record already exists
    const existing = await prisma.stagedMinister.findFirst({
      where: { fullName: item.fullName }
    });

    if (existing) {
      await prisma.stagedMinister.update({
        where: { id: existing.id },
        data: {
          portfolio: item.portfolio,
          bio: item.bio || existing.bio,
          photoUrl: item.photoUrl || existing.photoUrl,
          sourceUrl: item.sourceUrl,
          metadata: JSON.stringify(item.metadata),
          // Keep status if already APPROVED or PUBLISHED
          status: existing.status === 'PUBLISHED' ? 'PUBLISHED' : existing.status === 'APPROVED' ? 'APPROVED' : 'PENDING'
        }
      });
      updatedCount++;
    } else {
      await prisma.stagedMinister.create({
        data: {
          fullName: item.fullName,
          portfolio: item.portfolio,
          bio: item.bio,
          photoUrl: item.photoUrl,
          sourceUrl: item.sourceUrl,
          metadata: JSON.stringify(item.metadata),
          status: 'PENDING'
        }
      });
      createdCount++;
    }
  }

  console.log(`\n✅ Staging complete:`);
  console.log(`   - Created in staging: ${createdCount}`);
  console.log(`   - Updated in staging: ${updatedCount}`);
  console.log(`   - Total staged: ${scraped.length}`);
  console.log('\nNext step: Run "npm run v2:download-photos" to download portraits locally.');
}

main()
  .catch(err => {
    console.error('Fatal error during collection:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
