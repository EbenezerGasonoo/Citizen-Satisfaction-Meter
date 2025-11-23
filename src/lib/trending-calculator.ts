import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface TrendingCriteria {
  minTotalVotes: number
  minVotes24h: number
  minVoteVelocity: number // votes per hour
  minSatisfactionChange: number // percentage change
  maxTrendingCount: number
}

export interface TrendingData {
  ministerId: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  voteChange24h: number
  voteVelocity: number
  satisfactionChange: number
  trendingScore: number
  reason: string
}

export const DEFAULT_TRENDING_CRITERIA: TrendingCriteria = {
  minTotalVotes: 100,
  minVotes24h: 10,
  minVoteVelocity: 2,
  minSatisfactionChange: 5,
  maxTrendingCount: 8
}

export async function calculateTrendingMinisters(criteria: TrendingCriteria = DEFAULT_TRENDING_CRITERIA): Promise<TrendingData[]> {
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000)

  // Get all ministers with their votes
  const ministers = await prisma.minister.findMany({
    include: {
      votes: true
    }
  })

  const trendingData: TrendingData[] = []

  for (const minister of ministers) {
    // Check total votes first
    const totalVotes = minister.votes.length

    // Skip if not enough total votes
    if (totalVotes < criteria.minTotalVotes) {
      continue
    }

    // Filter votes by time windows
    const votes24h = minister.votes.filter(v => v.createdAt >= last24h)
    const votes48h = minister.votes.filter(v => v.createdAt >= last48h)

    const totalVotes24h = votes24h.length
    const positiveVotes24h = votes24h.filter(v => v.positive).length
    const satisfactionRate24h = totalVotes24h > 0 ? (positiveVotes24h / totalVotes24h) * 100 : 0

    const totalVotes48h = votes48h.length
    const positiveVotes48h = votes48h.filter(v => v.positive).length
    const satisfactionRate48h = totalVotes48h > 0 ? (positiveVotes48h / totalVotes48h) * 100 : 0

    const voteVelocity = totalVotes24h / 24 // votes per hour
    const satisfactionChange = satisfactionRate24h - satisfactionRate48h

    // Calculate trending score
    let trendingScore = 0
    let reason = ''

    if (totalVotes24h >= criteria.minVotes24h) {
      trendingScore += 30
      reason += `High activity (${totalVotes24h} votes) `
    }

    if (voteVelocity >= criteria.minVoteVelocity) {
      trendingScore += 25
      reason += `Fast voting (${voteVelocity.toFixed(1)}/hr) `
    }

    if (Math.abs(satisfactionChange) >= criteria.minSatisfactionChange) {
      trendingScore += 20
      reason += `Satisfaction ${satisfactionChange > 0 ? 'rising' : 'falling'} (${satisfactionChange.toFixed(1)}%) `
    }

    // Bonus for high satisfaction rates
    if (satisfactionRate24h >= 70) {
      trendingScore += 15
      reason += 'High satisfaction '
    } else if (satisfactionRate24h <= 30) {
      trendingScore += 10
      reason += 'Low satisfaction '
    }

    // Bonus for recent activity (last 2 hours)
    const last2h = new Date(now.getTime() - 2 * 60 * 60 * 1000)
    const recentVotes = votes24h.filter(v => v.createdAt >= last2h).length
    if (recentVotes >= 3) {
      trendingScore += 10
      reason += 'Recent surge '
    }

    if (trendingScore >= 30) { // Minimum threshold
      trendingData.push({
        ministerId: minister.id,
        fullName: minister.fullName,
        portfolio: minister.portfolio,
        photoUrl: minister.photoUrl,
        satisfactionRate: Math.round(satisfactionRate24h),
        voteChange24h: totalVotes24h,
        voteVelocity: Math.round(voteVelocity * 10) / 10,
        satisfactionChange: Math.round(satisfactionChange * 10) / 10,
        trendingScore,
        reason: reason.trim()
      })
    }
  }

  // Sort by trending score and limit results
  return trendingData
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, criteria.maxTrendingCount)
}

export async function updateTrendingStatus(ministerIds: number[]) {
  // Reset all trending flags
  await prisma.minister.updateMany({
    where: { isTrending: true },
    data: { isTrending: false }
  })

  // Set new trending flags
  if (ministerIds.length > 0) {
    await prisma.minister.updateMany({
      where: { id: { in: ministerIds } },
      data: { isTrending: true }
    })
  }
}

export async function getTrendingAnalytics() {
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const votes24h = await prisma.vote.findMany({
    where: { createdAt: { gte: last24h } }
  })

  const totalVotes24h = votes24h.length

  const totalVotesWeek = await prisma.vote.count({
    where: { createdAt: { gte: lastWeek } }
  })

  const trendingMinisters = await prisma.minister.count({
    where: { isTrending: true }
  })

  // Calculate hourly votes
  const hourlyVotesMap = new Map<string, number>()
  for (let i = 0; i < 24; i++) {
    const d = new Date(now.getTime() - i * 60 * 60 * 1000)
    const hour = d.getHours().toString().padStart(2, '0') + ':00'
    hourlyVotesMap.set(hour, 0)
  }

  votes24h.forEach(vote => {
    const hour = vote.createdAt.getHours().toString().padStart(2, '0') + ':00'
    if (hourlyVotesMap.has(hour)) {
      hourlyVotesMap.set(hour, (hourlyVotesMap.get(hour) || 0) + 1)
    }
  })

  const hourlyVotes = Array.from(hourlyVotesMap.entries())
    .map(([hour, count]) => ({ hour, count }))
    .reverse()

  // Get top trending
  const trendingCandidates = await calculateTrendingMinisters()
  const topTrending = trendingCandidates
    .slice(0, 5)
    .map(c => ({ name: c.fullName, score: c.trendingScore }))

  return {
    totalVotes24h,
    totalVotesWeek,
    trendingMinisters,
    voteVelocity: totalVotes24h / 24,
    weeklyVelocity: totalVotesWeek / (7 * 24),
    hourlyVotes,
    topTrending
  }
}
