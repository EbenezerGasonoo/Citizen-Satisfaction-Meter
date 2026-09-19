import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { calculateTrendingMinisters } from '@/lib/trending-calculator'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    // Get automatically calculated trending ministers
    const trendingCandidates = await calculateTrendingMinisters()

    // Get ministers manually marked as trending by admins
    const adminTrendingMinisters = await prisma.minister.findMany({
      where: {
        isTrending: true,
      },
      select: { id: true }
    })

    // Combine candidate IDs
    const candidateMap = new Map(trendingCandidates.map(c => [c.ministerId, c]))
    const allTrendingIds = Array.from(new Set([
      ...trendingCandidates.map(c => c.ministerId),
      ...adminTrendingMinisters.map(m => m.id)
    ]))

    // Get final list of ministers with all votes & latest action
    const ministers = await prisma.minister.findMany({
      where: {
        id: { in: allTrendingIds }
      },
      include: {
        votes: true,
        actions: {
          orderBy: { date: 'desc' },
          take: 1
        }
      }
    })

    const formatted = ministers.map((minister) => {
      const candidate = candidateMap.get(minister.id)
      const totalVotes = minister.votes.length
      const positiveVotes = minister.votes.filter(v => v.positive).length
      const negativeVotes = totalVotes - positiveVotes
      const votes24h = minister.votes.filter(v => v.createdAt >= last24h).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 50

      const latestAction = minister.actions && minister.actions.length > 0 ? minister.actions[0] : null
      const trendingScore = candidate?.trendingScore || (minister.isTrending ? 60 : 10)
      const trendingReason = candidate?.reason && !candidate.reason.includes('Moderation')
        ? candidate.reason
        : (latestAction ? `📰 ${latestAction.title}` : (minister.isTrending ? '⭐ In the News' : 'Active Engagement'))
      const badgeType = candidate?.badgeType || (latestAction ? 'recent_action' : (minister.isTrending ? 'admin_pick' : 'surging'))

      return {
        id: minister.id,
        fullName: minister.fullName,
        portfolio: minister.portfolio,
        photoUrl: minister.photoUrl,
        satisfactionRate,
        totalVotes,
        positiveVotes,
        negativeVotes,
        votes24h,
        trend: satisfactionRate >= 50 ? ('up' as const) : ('down' as const),
        isTrending: true,
        trendingScore,
        trendingReason,
        badgeType,
        latestAction: latestAction ? {
          title: latestAction.title,
          description: latestAction.description,
          date: latestAction.date
        } : null
      }
    })

    // Sort by trendingScore descending, then by total votes descending
    formatted.sort((a, b) => {
      if (b.trendingScore !== a.trendingScore) {
        return b.trendingScore - a.trendingScore
      }
      return b.totalVotes - a.totalVotes
    })

    // Attach rank
    const ranked = formatted.map((item, index) => ({
      ...item,
      trendingRank: index + 1
    }))

    return NextResponse.json(ranked)
  } catch (error) {
    console.error('Error fetching trending ministers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending ministers' },
      { status: 500 }
    )
  }
}