/**
 * CLI Script: Sync Presidency (V2 Government Adapter)
 * Pulls authoritative cabinet data from presidency.gov.gh and updates matching live ministers in-place.
 */

import { prisma } from '../../src/lib/prisma';
import { PresidencyHarvester } from '../../src/lib/v2/presidency-harvester';

async function main() {
  console.log('=====================================================');
  console.log('🏛️ Citizen Satisfaction Meter V2: Presidency Sync');
  console.log('=====================================================\n');

  const harvester = new PresidencyHarvester(prisma);
  const result = await harvester.sync();

  console.log(`\nSync Summary:`);
  console.log(`- Total Official Cabinet Members Found: ${result.totalOfficial}`);
  console.log(`- Matched & Updated in Live Database: ${result.updatedCount}`);
  console.log(`- Unmatched: ${result.unmatchedCount}\n`);

  console.log('Detailed Matches:');
  result.details.forEach(d => {
    if (d.action === 'updated') {
      console.log(`  • [MATCHED] "${d.officialName}" -> Live: "${d.matchedLiveName}" (#${d.matchedMinisterId})`);
      console.log(`     Portfolio: "${d.portfolio}"`);
      console.log(`     Confidence: ${((d.confidence || 0) * 100).toFixed(0)}% | Photo: ${d.photoSavedAs || 'preserved'}\n`);
    } else {
      console.log(`  • [UNMATCHED] "${d.officialName}" (${d.portfolio})\n`);
    }
  });

  const totalMinistersAfter = await prisma.minister.count();
  console.log(`✅ Sync Complete! Total unique ministers in database: ${totalMinistersAfter}`);
}

main()
  .catch(err => {
    console.error('Fatal error during Presidency sync:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
