import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateTrendingMinisters } from '@/lib/trending-calculator'

export async function GET() {
  try {
    // Get automatically calculated trending ministers
    const trendingCandidates = await calculateTrendingMinisters()
    
    // Get ministers marked as trending by admins
    const adminTrendingMinisters = await prisma.minister.findMany({
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

    // Combine both sources and remove duplicates
    const allTrendingIds = new Set([
      ...trendingCandidates.map(c => c.ministerId),
      ...adminTrendingMinisters.map(m => m.id)
    ])

    // Get final list of trending ministers
    const finalTrendingMinisters = await prisma.minister.findMany({
      where: {
        id: { in: Array.from(allTrendingIds) }
      },
      include: {
        votes: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            },
          },
        },
        actions: {
          orderBy: {
            date: 'desc',
          },
          take: 1, // Get only the most recent action
        },
      },
      orderBy: {
        fullName: 'asc',
      },
    })

    const formattedTrendingMinisters = finalTrendingMinisters.map((minister: any) => {
      const totalVotes = minister.votes.length
      const positiveVotes = minister.votes.filter((vote: any) => vote.positive).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 50 // Default to 50% if no votes

      // Check if this minister was auto-detected as trending
      const autoDetected = trendingCandidates.find(c => c.ministerId === minister.id)
      const trendingScore = autoDetected?.trendingScore || 0
      const trendingReason = autoDetected?.reason || 'Admin selected'

      // Get the most recent action
      const latestAction = minister.actions && minister.actions.length > 0 ? minister.actions[0] : null

      return {
        id: minister.id,
        fullName: minister.fullName,
        portfolio: minister.portfolio,
        photoUrl: minister.photoUrl,
        satisfactionRate,
        voteChange: totalVotes,
        trend: satisfactionRate > 50 ? 'up' as const : 'down' as const,
        isTrending: true,
        trendingScore,
        trendingReason,
        autoDetected: !!autoDetected,
        latestAction: latestAction ? {
          title: latestAction.title,
          description: latestAction.description,
          date: latestAction.date,
        } : null
      }
    })

    // Sort by trending score (auto-detected first), then by satisfaction rate
    formattedTrendingMinisters.sort((a, b) => {
      if (a.autoDetected && !b.autoDetected) return -1
      if (!a.autoDetected && b.autoDetected) return 1
      if (a.trendingScore !== b.trendingScore) return b.trendingScore - a.trendingScore
      return b.satisfactionRate - a.satisfactionRate
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