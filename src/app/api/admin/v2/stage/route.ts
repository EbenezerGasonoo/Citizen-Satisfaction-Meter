import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { WikipediaHarvester } from '@/lib/v2/wikipedia-harvester';

export const dynamic = 'force-dynamic';

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  return (session?.user as any)?.role === 'ADMIN';
}

// GET: List all staged ministers with counts
export async function GET(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};
    if (status && status !== 'ALL') {
      where.status = status;
    }

    const staged = await prisma.stagedMinister.findMany({
      where,
      orderBy: { id: 'asc' }
    });

    const counts = await prisma.stagedMinister.groupBy({
      by: ['status'],
      _count: { id: true }
    });

    const stats = {
      total: 0,
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      PUBLISHED: 0
    };

    counts.forEach(c => {
      stats.total += c._count.id;
      if (c.status in stats) {
        (stats as any)[c.status] = c._count.id;
      }
    });

    return NextResponse.json({ success: true, staged, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch staged ministers' }, { status: 500 });
  }
}

// POST: Trigger harvest or create single staged item
export async function POST(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();

    if (body.action === 'harvest') {
      const limit = body.limit ? parseInt(body.limit) : undefined;
      const harvester = new WikipediaHarvester();
      const harvested = await harvester.harvestAll(limit);

      let created = 0;
      let updated = 0;

      for (const item of harvested) {
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
              metadata: JSON.stringify(item.metadata)
            }
          });
          updated++;
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
          created++;
        }
      }

      return NextResponse.json({
        success: true,
        message: `Harvested ${harvested.length} ministers. Created: ${created}, Updated: ${updated}`,
        created,
        updated,
        total: harvested.length
      });
    }

    // Manual creation
    const { fullName, portfolio, bio, photoUrl, sourceUrl } = body;
    if (!fullName || !portfolio) {
      return NextResponse.json({ error: 'Full name and portfolio are required' }, { status: 400 });
    }

    const newStaged = await prisma.stagedMinister.create({
      data: {
        fullName,
        portfolio,
        bio: bio || null,
        photoUrl: photoUrl || null,
        sourceUrl: sourceUrl || null,
        status: 'PENDING'
      }
    });

    return NextResponse.json({ success: true, item: newStaged });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to process request' }, { status: 500 });
  }
}

// PATCH: Update staged item (status, fields)
export async function PATCH(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, fullName, portfolio, bio, photoUrl, status } = body;

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (fullName !== undefined) updateData.fullName = fullName;
    if (portfolio !== undefined) updateData.portfolio = portfolio;
    if (bio !== undefined) updateData.bio = bio;
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl;
    if (status !== undefined) updateData.status = status;

    const updated = await prisma.stagedMinister.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    return NextResponse.json({ success: true, item: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update staged minister' }, { status: 500 });
  }
}

// DELETE: Remove staged item
export async function DELETE(request: NextRequest) {
  if (!(await checkAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    await prisma.stagedMinister.delete({
      where: { id: parseInt(id) }
    });

    return NextResponse.json({ success: true, message: 'Deleted staged record' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete staged record' }, { status: 500 });
  }
}
