import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Get votes from the last 30 seconds
    const thirtySecondsAgo = new Date()
    thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30)

    const recentVotes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: thirtySecondsAgo,
        },
        clientHash: {
          not: {
            startsWith: 'demo_vote'
          }
        }
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
      take: limit, // Use the limit parameter
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
