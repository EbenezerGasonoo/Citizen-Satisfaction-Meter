import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import {
  cleanMinisterSearchName,
  fetchGoogleNews,
  synthesizeMinisterNews,
  harvestAndSaveMinisterNews
} from '@/lib/v2/news-harvester';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || (session.user as any)?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admins only' }, { status: 401 });
    }

    const body = await request.json();
    const { ministerId, autoSave } = body;

    if (!ministerId) {
      return NextResponse.json({ error: 'ministerId is required' }, { status: 400 });
    }

    const minister = await prisma.minister.findUnique({
      where: { id: Number(ministerId) }
    });

    if (!minister) {
      return NextResponse.json({ error: 'Minister not found' }, { status: 404 });
    }

    if (autoSave) {
      const result = await harvestAndSaveMinisterNews(minister.id);
      return NextResponse.json(result);
    }

    // Preview mode: fetch & synthesize without saving immediately
    const queryName = cleanMinisterSearchName(minister.fullName);
    const articles = await fetchGoogleNews(`"${queryName}" Ghana`);

    if (!articles || articles.length === 0) {
      return NextResponse.json({
        success: false,
        message: `No recent news articles found on Google News for ${minister.fullName}`
      });
    }

    const synthesized = await synthesizeMinisterNews(minister.fullName, minister.portfolio, articles);

    return NextResponse.json({
      success: true,
      minister: { id: minister.id, fullName: minister.fullName },
      synthesized,
      articlesFound: articles.length,
      sampleArticles: articles.slice(0, 3)
    });
  } catch (error: any) {
    console.error('Error fetching AI news for minister:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch AI news' }, { status: 500 });
  }
}
