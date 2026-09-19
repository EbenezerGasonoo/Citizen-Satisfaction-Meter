/**
 * V2 Publisher
 * Safely transfers approved staged ministers into the live Minister table
 * without disrupting votes, comments, or policies.
 */

import { PrismaClient } from '@prisma/client';

export interface PublishOptions {
  stagedIds?: number[];
  forcePending?: boolean; // allow publishing PENDING items without explicit approval
  preserveExistingBio?: boolean; // don't overwrite if live minister already has bio
}

export interface PublishResult {
  publishedCount: number;
  createdCount: number;
  updatedCount: number;
  errors: string[];
  details: {
    stagedId: number;
    fullName: string;
    action: 'created' | 'updated' | 'skipped' | 'failed';
    liveMinisterId?: number;
    reason?: string;
  }[];
}

export class V2Publisher {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  /**
   * Publishes approved (or selected) staged ministers to the live Minister table
   */
  async publish(options?: PublishOptions): Promise<PublishResult> {
    const result: PublishResult = {
      publishedCount: 0,
      createdCount: 0,
      updatedCount: 0,
      errors: [],
      details: []
    };

    try {
      // Find candidate staged ministers
      const whereClause: any = {};
      if (options?.stagedIds && options.stagedIds.length > 0) {
        whereClause.id = { in: options.stagedIds };
      } else {
        whereClause.status = options?.forcePending ? { in: ['APPROVED', 'PENDING'] } : 'APPROVED';
      }

      const stagedMinisters = await this.prisma.stagedMinister.findMany({
        where: whereClause,
        orderBy: { id: 'asc' }
      });

      if (stagedMinisters.length === 0) {
        return result;
      }

      for (const staged of stagedMinisters) {
        try {
          // Normalize name for matching (ignoring (MP), whitespace)
          const normalizedStagedName = staged.fullName.replace(/\s*\(mp\)\s*/gi, '').trim().toLowerCase();

          // Find existing live minister by name matching
          const liveMinisters = await this.prisma.minister.findMany();
          const existing = liveMinisters.find(m => {
            const normalizedLiveName = m.fullName.replace(/\s*\(mp\)\s*/gi, '').trim().toLowerCase();
            return (
              normalizedLiveName === normalizedStagedName ||
              normalizedLiveName.includes(normalizedStagedName) ||
              normalizedStagedName.includes(normalizedLiveName)
            );
          });

          let liveId: number;
          let actionType: 'created' | 'updated';

          if (existing) {
            // Update existing minister - preserve votes and relations!
            const updated = await this.prisma.minister.update({
              where: { id: existing.id },
              data: {
                portfolio: staged.portfolio || existing.portfolio,
                sector: staged.sector || existing.sector || null,
                photoUrl: staged.photoUrl || existing.photoUrl,
                bio: options?.preserveExistingBio && existing.bio ? existing.bio : (staged.bio || existing.bio)
              }
            });

            liveId = updated.id;
            actionType = 'updated';
            result.updatedCount++;
          } else {
            // Create new minister
            const created = await this.prisma.minister.create({
              data: {
                fullName: staged.fullName,
                portfolio: staged.portfolio,
                sector: staged.sector || null,
                bio: staged.bio || null,
                photoUrl: staged.photoUrl || '/uploads/default-minister.jpg',
                isTrending: false
              }
            });

            liveId = created.id;
            actionType = 'created';
            result.createdCount++;
          }

          // Mark staged minister as PUBLISHED
          await this.prisma.stagedMinister.update({
            where: { id: staged.id },
            data: { status: 'PUBLISHED' }
          });

          result.publishedCount++;
          result.details.push({
            stagedId: staged.id,
            fullName: staged.fullName,
            action: actionType,
            liveMinisterId: liveId
          });
        } catch (itemErr: any) {
          const errMsg = `Error publishing ${staged.fullName} (Staged #${staged.id}): ${itemErr?.message}`;
          result.errors.push(errMsg);
          result.details.push({
            stagedId: staged.id,
            fullName: staged.fullName,
            action: 'failed',
            reason: itemErr?.message
          });
        }
      }
    } catch (err: any) {
      result.errors.push(`Global publish error: ${err?.message}`);
    }

    return result;
  }
}
