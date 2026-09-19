import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface TrendingCriteria {
  minTotalVotes: number
  minVotes24h: number
  minVoteVelocity: number // votes per hour
  minSatisfactionChange: number // percentage change
  maxTrendingCount: number
}

export type TrendingBadgeType = 'top_voted' | 'high_approval' | 'recent_action' | 'surging' | 'admin_pick'

export interface TrendingData {
  ministerId: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  totalVotes: number
  positiveVotes: number
  voteChange24h: number
  voteVelocity: number
  satisfactionChange: number
  trendingScore: number
  trendingRank?: number
  badgeType: TrendingBadgeType
  reason: string
  latestAction?: {
    title: string
    description: string
    date: Date
  } | null
}

export const DEFAULT_TRENDING_CRITERIA: TrendingCriteria = {
  minTotalVotes: 25, // Lowered from 100 to support adaptive scaling
  minVotes24h: 3,
  minVoteVelocity: 0.1,
  minSatisfactionChange: 5,
  maxTrendingCount: 6
}

export async function calculateTrendingMinisters(criteria: TrendingCriteria = DEFAULT_TRENDING_CRITERIA): Promise<TrendingData[]> {
  const now = new Date()
  const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000)
  const last60Days = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)

  // Get all ministers with their votes and most recent action
  const ministers = await prisma.minister.findMany({
    include: {
      votes: true,
      actions: {
        orderBy: { date: 'desc' },
        take: 1
      }
    }
  })

  if (ministers.length === 0) return []

  // Determine platform voting context for adaptive thresholds
  const maxVotes = Math.max(...ministers.map(m => m.votes.length), 0)
  const totalPlatformVotes = ministers.reduce((sum, m) => sum + m.votes.length, 0)
  
  // Adaptive minimum: If platform has < 100 votes, scale dynamically (e.g. min 2 votes or top quartile)
  const effectiveMinVotes = totalPlatformVotes < 100
    ? Math.max(2, Math.floor(maxVotes * 0.3))
    : Math.min(criteria.minTotalVotes, Math.max(5, Math.floor(maxVotes * 0.2)))

  const candidates: TrendingData[] = []

  for (const minister of ministers) {
    const totalVotes = minister.votes.length
    const isExplicitTrending = minister.isTrending

    // Filter votes by time windows
    const votes24h = minister.votes.filter(v => v.createdAt >= last24h)
    const votes48h = minister.votes.filter(v => v.createdAt >= last48h)

    const totalVotes24h = votes24h.length
    const positiveVotes24h = votes24h.filter(v => v.positive).length
    const satisfactionRate24h = totalVotes24h > 0 ? (positiveVotes24h / totalVotes24h) * 100 : 0

    const positiveVotesLifetime = minister.votes.filter(v => v.positive).length
    const satisfactionRateLifetime = totalVotes > 0 ? Math.round((positiveVotesLifetime / totalVotes) * 100) : 50

    // Only skip if both below effective min votes AND not flagged by admin
    if (totalVotes < effectiveMinVotes && !isExplicitTrending && totalVotes24h === 0) {
      continue
    }

    const voteVelocity = totalVotes24h / 24 // votes per hour
    const latestAction = minister.actions && minister.actions.length > 0 ? minister.actions[0] : null
    const hasRecentAction = latestAction && new Date(latestAction.date) >= last60Days

    // Calculate dynamic trending score
    let score = 0
    let badgeType: TrendingBadgeType = 'surging'
    let reason = ''

    // 1. Relative Volume Score (0 - 35 points)
    if (maxVotes > 0) {
      const volumeRatio = totalVotes / maxVotes
      score += Math.round(volumeRatio * 35)
      if (volumeRatio >= 0.8) {
        badgeType = 'top_voted'
        reason = `🔥 Top Citizen Engagement (${totalVotes} votes)`
      }
    }

    // 2. Recent 24h Activity Surge (0 - 30 points)
    if (totalVotes24h > 0) {
      score += Math.min(30, totalVotes24h * 10)
      if (totalVotes24h >= 2 && badgeType !== 'top_voted') {
        badgeType = 'surging'
        reason = `📈 Surging: +${totalVotes24h} votes in last 24h`
      }
    }

    // 3. Satisfaction Performance (0 - 20 points)
    if (satisfactionRateLifetime >= 75) {
      score += 20
      if (!reason) {
        badgeType = 'high_approval'
        reason = `⭐ High Approval (${satisfactionRateLifetime}% satisfied)`
      }
    } else if (satisfactionRateLifetime <= 30) {
      score += 15 // high dissatisfaction also drives public discourse
      if (!reason) {
        badgeType = 'surging'
        reason = `⚡ Intense Public Scrutiny (${satisfactionRateLifetime}% satisfaction)`
      }
    } else {
      score += 10
    }

    // 4. Policy/Action Boost (15 points)
    if (hasRecentAction) {
      score += 15
      if (!reason || badgeType === 'surging') {
        badgeType = 'recent_action'
        reason = `📰 ${latestAction.title}`
      }
    }

    // 5. Admin Spotlight Boost (25 points)
    if (isExplicitTrending) {
      score += 25
      if (!reason) {
        badgeType = 'admin_pick'
        reason = latestAction ? `📰 ${latestAction.title}` : `⭐ Top Newsmaker`
      }
    }

    candidates.push({
      ministerId: minister.id,
      fullName: minister.fullName,
      portfolio: minister.portfolio,
      photoUrl: minister.photoUrl,
      satisfactionRate: satisfactionRateLifetime,
      totalVotes,
      positiveVotes: positiveVotesLifetime,
      voteChange24h: totalVotes24h,
      voteVelocity: Math.round(voteVelocity * 10) / 10,
      satisfactionChange: Math.round((satisfactionRate24h - satisfactionRateLifetime) * 10) / 10,
      trendingScore: score,
      badgeType,
      reason,
      latestAction: latestAction ? {
        title: latestAction.title,
        description: latestAction.description,
        date: latestAction.date
      } : null
    })
  }

  // Sort candidates by trending score descending
  const sorted = candidates
    .sort((a, b) => b.trendingScore - a.trendingScore)
    .slice(0, criteria.maxTrendingCount)

  // Assign ranks
  return sorted.map((c, index) => ({
    ...c,
    trendingRank: index + 1
  }))
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
