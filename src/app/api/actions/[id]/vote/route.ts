import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hashClient, getClientIP } from '@/lib/utils';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { positive } = await request.json();
    const actionId = parseInt(params.id);
    if (isNaN(actionId)) {
      return NextResponse.json({ error: 'Invalid action ID' }, { status: 400 });
    }
    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || '';
    const clientHash = hashClient(ip, userAgent);

    // Check if action exists
    const action = await prisma.action.findUnique({ where: { id: actionId } });
    if (!action) {
      return NextResponse.json({ error: 'Action not found' }, { status: 404 });
    }

    // Check if user already voted for this action today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const existingVote = await prisma.actionVote.findFirst({
      where: {
        actionId,
        clientHash,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    });
    if (existingVote) {
      return NextResponse.json({ error: 'You have already voted for this action today' }, { status: 409 });
    }

    // Create the vote
    const vote = await prisma.actionVote.create({
      data: {
        actionId,
        positive,
        clientHash,
      },
    });
    return NextResponse.json({ success: true, vote });
  } catch (error) {
    console.error('Error voting on action:', error);
    return NextResponse.json({ error: 'Failed to vote on action' }, { status: 500 });
  }
} 