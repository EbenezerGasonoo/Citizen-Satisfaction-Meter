import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { harvestAndSaveMinisterNews } from '@/lib/v2/news-harvester';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const isAdmin = session?.user?.role === 'ADMIN';
    const authHeader = request.headers.get('authorization');
    const isCronSecret = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;

    if (!isAdmin && !isCronSecret && process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Harvest news for trending ministers and top newsmakers
    const targetMinisters = await prisma.minister.findMany({
      where: { isTrending: true },
      select: { id: true, fullName: true, portfolio: true }
    });

    const results = [];
    for (const minister of targetMinisters) {
      try {
        const res = await harvestAndSaveMinisterNews(minister.id);
        results.push({
          ministerId: minister.id,
          fullName: minister.fullName,
          status: res.success ? (res.isNew ? 'CREATED' : 'UPDATED') : 'SKIPPED',
          headline: res.action?.title || null
        });
      } catch (err: any) {
        results.push({
          ministerId: minister.id,
          fullName: minister.fullName,
          status: 'ERROR',
          error: err.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      processed: results.length,
      results
    });
  } catch (error: any) {
    console.error('Error in automated news cron:', error);
    return NextResponse.json({ error: 'Failed to run news cron' }, { status: 500 });
  }
}
