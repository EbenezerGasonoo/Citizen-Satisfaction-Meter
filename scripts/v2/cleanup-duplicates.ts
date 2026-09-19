/**
 * CLI Script: Cleanup Duplicates
 * Safely merges duplicate ministers, re-links votes and comments, and removes redundant records.
 */

import { PrismaClient } from '@prisma/client';
import { NameMatcher } from '../../src/lib/v2/name-matcher';

const prisma = new PrismaClient();

async function mergeMinisters(sourceId: number, targetId: number) {
  const source = await prisma.minister.findUnique({ where: { id: sourceId } });
  const target = await prisma.minister.findUnique({ where: { id: targetId } });

  if (!source || !target) {
    console.log(`[Merge] Skipping merge (${sourceId} -> ${targetId}): one or both records do not exist.`);
    return;
  }

  console.log(`[Merge] Merging "${source.fullName}" (#${source.id}) into "${target.fullName}" (#${target.id})...`);

  // 1. Re-link votes
  const votesMoved = await prisma.vote.updateMany({
    where: { ministerId: sourceId },
    data: { ministerId: targetId }
  });

  // 2. Re-link comments
  const commentsMoved = await prisma.comment.updateMany({
    where: { ministerId: sourceId },
    data: { ministerId: targetId }
  });

  // 3. Re-link actions
  const actionsMoved = await prisma.action.updateMany({
    where: { ministerId: sourceId },
    data: { ministerId: targetId }
  });

  // 4. Re-link policies
  const policiesMoved = await prisma.policy.updateMany({
    where: { ministerId: sourceId },
    data: { ministerId: targetId }
  });

  // 5. Re-link statements
  const statementsMoved = await prisma.statement.updateMany({
    where: { ministerId: sourceId },
    data: { ministerId: targetId }
  });

  // 6. Delete source favorites to avoid unique constraint collisions
  await prisma.favorite.deleteMany({
    where: { ministerId: sourceId }
  });

  // 7. Delete source minister
  await prisma.minister.delete({
    where: { id: sourceId }
  });

  console.log(`  └─ Successfully transferred: ${votesMoved.count} votes, ${commentsMoved.count} comments, ${actionsMoved.count} actions.`);
  console.log(`  └─ Removed duplicate record #${sourceId}.`);
}

async function main() {
  console.log('=====================================================');
  console.log('🧹 Citizen Satisfaction Meter V2: Duplicate Cleaner');
  console.log('=====================================================\n');

  // Check specific known duplicates
  const m24 = await prisma.minister.findUnique({ where: { id: 24 } });
  if (m24) {
    await mergeMinisters(24, 5); // Mubarak Mohammed Muntaka -> Mohammed Mubarak Muntaka (MP)
  }

  const m26 = await prisma.minister.findUnique({ where: { id: 26 } });
  if (m26) {
    await mergeMinisters(26, 12); // Sam Nartey George -> Samuel Nartey George (MP)
  }

  // Scan all remaining ministers for any duplicate token matches
  const ministers = await prisma.minister.findMany({ orderBy: { id: 'asc' } });
  console.log(`\nScanning ${ministers.length} ministers for potential duplicate pairs...`);

  const visited = new Set<number>();
  let additionalFound = 0;

  for (let i = 0; i < ministers.length; i++) {
    const a = ministers[i];
    if (visited.has(a.id)) continue;

    for (let j = i + 1; j < ministers.length; j++) {
      const b = ministers[j];
      if (visited.has(b.id)) continue;

      const match = NameMatcher.findBestMatch(a.fullName, a.portfolio, [b], 0.85);
      if (match) {
        console.log(`⚠️ Found potential duplicate: #${a.id} "${a.fullName}" and #${b.id} "${b.fullName}" (${match.matchReason})`);
        additionalFound++;
      }
    }
  }

  if (additionalFound === 0) {
    console.log('✅ Roster scan complete: Zero duplicate ministers detected in live database.');
  }

  const totalFinal = await prisma.minister.count();
  console.log(`\nFinal unique ministers in database: ${totalFinal}`);
}

main()
  .catch(err => {
    console.error('Fatal error during duplicate cleanup:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
