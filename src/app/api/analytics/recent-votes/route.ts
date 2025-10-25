import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get votes from the last 30 seconds
    const thirtySecondsAgo = new Date()
    thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30)

    const recentVotes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: thirtySecondsAgo,
        },
      },
      include: {
        minister: {
          select: {
            fullName: true,
            portfolio: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10, // Limit to 10 most recent votes
    })

    const formattedVotes = recentVotes.map(vote => ({
      id: vote.id,
      ministerName: vote.minister.fullName,
      portfolio: vote.minister.portfolio,
      positive: vote.positive,
      createdAt: vote.createdAt,
    }))

    return NextResponse.json(formattedVotes)
  } catch (error) {
    console.error('Error fetching recent votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recent votes' },
      { status: 500 }
    )
  }
}
