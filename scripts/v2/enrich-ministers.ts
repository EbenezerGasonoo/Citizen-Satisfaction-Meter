/**
 * CLI Script: Enrich Ministers (Phase 2 AI Service)
 * Categorizes portfolios into governance sectors and polishes biographies.
 */

import { PrismaClient } from '@prisma/client';
import { AIService } from '../../src/lib/v2/ai-service';

const prisma = new PrismaClient();

async function main() {
  console.log('=====================================================');
  console.log('✨ Citizen Satisfaction Meter V2: AI Enrichment');
  console.log('=====================================================\n');

  const aiService = new AIService();

  // 1. Enrich Staged Ministers
  console.log('[AI Enrichment] Processing Staged Ministers...');
  const staged = await prisma.stagedMinister.findMany({ orderBy: { id: 'asc' } });

  let stagedUpdated = 0;
  for (const s of staged) {
    const sector = aiService.classifySector(s.portfolio);
    const polishedBio = await aiService.generateStandardizedBio(s.bio || '', s.fullName, s.portfolio);

    await prisma.stagedMinister.update({
      where: { id: s.id },
      data: {
        sector,
        bio: polishedBio
      }
    });
    stagedUpdated++;
  }
  console.log(`✅ Staged Ministers Enriched: ${stagedUpdated}`);

  // 2. Enrich Live Ministers
  console.log('\n[AI Enrichment] Processing Live Ministers...');
  const live = await prisma.minister.findMany({ orderBy: { id: 'asc' } });

  let liveUpdated = 0;
  for (const m of live) {
    const sector = aiService.classifySector(m.portfolio);
    const polishedBio = await aiService.generateStandardizedBio(m.bio || '', m.fullName, m.portfolio);

    await prisma.minister.update({
      where: { id: m.id },
      data: {
        sector,
        bio: m.bio ? m.bio : polishedBio // preserve custom live bio if already present
      }
    });
    liveUpdated++;
  }
  console.log(`✅ Live Ministers Enriched: ${liveUpdated}`);
}

main()
  .catch(err => {
    console.error('Fatal error during enrichment:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
