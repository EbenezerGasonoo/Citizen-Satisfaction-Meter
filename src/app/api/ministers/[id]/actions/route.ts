import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id);
    if (isNaN(ministerId)) {
      return NextResponse.json({ error: 'Invalid minister ID' }, { status: 400 });
    }
    const actions = await prisma.action.findMany({
      where: { ministerId },
      orderBy: { date: 'desc' },
      include: { votes: true },
    });
    const actionsWithStats = actions.map((action: any) => {
      const totalVotes = action.votes.length;
      const positiveVotes = action.votes.filter((vote: any) => vote.positive).length;
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0;
      return {
        id: action.id,
        title: action.title,
        description: action.description,
        status: action.status,
        date: action.date,
        impact: action.impact,
        totalVotes,
        positiveVotes,
        satisfactionRate,
      };
    });
    return NextResponse.json({ actions: actionsWithStats });
  } catch (error) {
    console.error('Error fetching actions:', error);
    return NextResponse.json({ error: 'Failed to fetch actions' }, { status: 500 });
  }
} 