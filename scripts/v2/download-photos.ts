/**
 * CLI Script: Download Photos (V2 Photo Pipeline)
 * Downloads and standardizes portraits for staged ministers.
 */

import { PrismaClient } from '@prisma/client';
import { PhotoPipeline } from '../../src/lib/v2/photo-pipeline';

const prisma = new PrismaClient();

async function main() {
  console.log('=====================================================');
  console.log('🖼️ Citizen Satisfaction Meter V2: Photo Pipeline');
  console.log('=====================================================\n');

  const staged = await prisma.stagedMinister.findMany({
    orderBy: { id: 'asc' }
  });

  if (staged.length === 0) {
    console.log('No staged ministers found in database. Run "npm run v2:collect" first.');
    return;
  }

  const pipeline = new PhotoPipeline();
  let downloadedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const minister of staged) {
    if (!minister.photoUrl) {
      console.log(`[PhotoPipeline] ⚠️ No photo URL for ${minister.fullName}`);
      continue;
    }

    // If it's already a local path, skip or check if file exists
    if (minister.photoUrl.startsWith('/uploads/')) {
      console.log(`[PhotoPipeline] ⏩ Already localized: ${minister.fullName} -> ${minister.photoUrl}`);
      skippedCount++;
      continue;
    }

    console.log(`[PhotoPipeline] ⬇️ Downloading photo for ${minister.fullName}...`);
    const result = await pipeline.processMinisterPhoto(minister.fullName, minister.photoUrl);

    if (result.success) {
      // Update the staged record with the new local path
      await prisma.stagedMinister.update({
        where: { id: minister.id },
        data: { photoUrl: result.localPath }
      });

      if (result.skipped) {
        console.log(`  └─ Existing local file reused: ${result.localPath} (${(result.bytes / 1024).toFixed(1)} KB)`);
        skippedCount++;
      } else {
        console.log(`  └─ Successfully saved to: ${result.localPath} (${(result.bytes / 1024).toFixed(1)} KB)`);
        downloadedCount++;
      }
    } else {
      console.error(`  └─ ❌ Failed to download for ${minister.fullName}: ${result.error}`);
      failedCount++;
    }
  }

  console.log(`\n✅ Photo Pipeline summary:`);
  console.log(`   - Newly downloaded: ${downloadedCount}`);
  console.log(`   - Reused/Skipped: ${skippedCount}`);
  console.log(`   - Failed: ${failedCount}`);
  console.log('\nNext step: Review in admin dashboard or run "npm run v2:publish"');
}

main()
  .catch(err => {
    console.error('Fatal error during photo processing:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
