/**
 * CLI Script: Publish Ministers (V2 Publisher)
 * Safely transfers approved staged ministers to the live database.
 */

import { PrismaClient } from '@prisma/client';
import { V2Publisher } from '../../src/lib/v2/publisher';

const prisma = new PrismaClient();

async function main() {
  console.log('=====================================================');
  console.log('🚀 Citizen Satisfaction Meter V2: Minister Publisher');
  console.log('=====================================================\n');

  const args = process.argv.slice(2);
  const forcePending = args.includes('--all') || args.includes('--force');

  console.log(`Mode: ${forcePending ? 'Publish ALL (including PENDING)' : 'Publish APPROVED only'}`);

  const publisher = new V2Publisher(prisma);
  const result = await publisher.publish({ forcePending });

  console.log('\nPublish results:');
  console.log(`- Total published: ${result.publishedCount}`);
  console.log(`  └─ Created new ministers: ${result.createdCount}`);
  console.log(`  └─ Updated existing ministers: ${result.updatedCount}`);

  if (result.details.length > 0) {
    console.log('\nDetails:');
    result.details.forEach(d => {
      console.log(`  • [${d.action.toUpperCase()}] ${d.fullName} (Live ID: ${d.liveMinisterId || 'N/A'})`);
    });
  }

  if (result.errors.length > 0) {
    console.error('\n⚠️ Errors encountered:');
    result.errors.forEach(e => console.error(`  - ${e}`));
  }

  if (result.publishedCount === 0) {
    console.log('\nNo ministers published. Tip: Mark staged ministers as APPROVED in the Admin Review page, or pass --all.');
  } else {
    console.log('\n✅ Successfully published to production database!');
  }
}

main()
  .catch(err => {
    console.error('Fatal error during publishing:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
