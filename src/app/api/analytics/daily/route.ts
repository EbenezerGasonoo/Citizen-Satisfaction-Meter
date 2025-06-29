import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get votes for the last 7 days
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const votes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo,
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
    })

    // Group votes by date
    const dailyStats = new Map<string, { votes: number; positiveVotes: number }>()

    // Initialize all 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      dailyStats.set(dateKey, { votes: 0, positiveVotes: 0 })
    }

    // Count votes for each day
    votes.forEach(vote => {
      const dateKey = vote.createdAt.toISOString().split('T')[0]
      const stats = dailyStats.get(dateKey)
      if (stats) {
        stats.votes++
        if (vote.positive) {
          stats.positiveVotes++
        }
      }
    })

    // Convert to array format for charts
    const dailyData = Array.from(dailyStats.entries()).map(([date, stats]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      votes: stats.votes,
      positiveVotes: stats.positiveVotes,
      satisfactionRate: stats.votes > 0 ? Math.round((stats.positiveVotes / stats.votes) * 100) : 0,
    }))

    // Get today's stats
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const todayVotes = await prisma.vote.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    const todayPositiveVotes = await prisma.vote.count({
      where: {
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
        positive: true,
      },
    })

    // Get minister-specific daily stats using raw queries for better control
    const ministerDailyStats = await prisma.$queryRaw`
      SELECT 
        "ministerId",
        COUNT(*) as vote_count,
        SUM(CASE WHEN positive THEN 1 ELSE 0 END) as positive_votes
      FROM "Vote"
      WHERE "createdAt" >= ${today} AND "createdAt" < ${tomorrow}
      GROUP BY "ministerId"
      ORDER BY vote_count DESC
    `

    const ministerStats = await Promise.all(
      (ministerDailyStats as any[]).map(async (stat) => {
        const minister = await prisma.minister.findUnique({
          where: { id: stat.ministerId },
          select: { fullName: true, portfolio: true },
        })

        const voteCount = Number(stat.vote_count)
        const positiveVoteCount = Number(stat.positive_votes)

        return {
          ministerId: stat.ministerId,
          ministerName: minister?.fullName || 'Unknown',
          portfolio: minister?.portfolio || 'Unknown',
          votes: voteCount,
          positiveVotes: positiveVoteCount,
          satisfactionRate: voteCount > 0 ? Math.round((positiveVoteCount / voteCount) * 100) : 0,
        }
      })
    )

    return NextResponse.json({
      dailyData,
      todayStats: {
        totalVotes: todayVotes,
        positiveVotes: todayPositiveVotes,
        satisfactionRate: todayVotes > 0 ? Math.round((todayPositiveVotes / todayVotes) * 100) : 0,
      },
      ministerStats,
    })
  } catch (error) {
    console.error('Error fetching daily analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch daily analytics' },
      { status: 500 }
    )
  }
} 