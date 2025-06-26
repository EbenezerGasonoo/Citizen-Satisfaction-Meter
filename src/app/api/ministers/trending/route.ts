import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Fetch only ministers marked as trending by admins
    const trendingMinisters = await prisma.minister.findMany({
      where: {
        isTrending: true,
      },
      include: {
        votes: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        },
      },
      orderBy: {
        fullName: 'asc', // Alphabetical order
      },
    })

    const formattedTrendingMinisters = trendingMinisters.map((minister: any) => {
      const totalVotes = minister.votes.length
      const positiveVotes = minister.votes.filter((vote: any) => vote.positive).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 50 // Default to 50% if no votes

      return {
        id: minister.id,
        fullName: minister.fullName,
        portfolio: minister.portfolio,
        photoUrl: minister.photoUrl,
        satisfactionRate,
        voteChange: totalVotes,
        trend: satisfactionRate > 50 ? 'up' as const : 'down' as const,
        isTrending: true,
      }
    })

    return NextResponse.json(formattedTrendingMinisters)
  } catch (error) {
    console.error('Error fetching trending ministers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending ministers' },
      { status: 500 }
    )
  }
} 