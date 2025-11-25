import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Fetching national score...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    console.log('Environment:', process.env.NODE_ENV)

    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last48h = new Date(now.getTime() - 48 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const last30d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    // Get ALL votes (temporarily including demo votes for debugging)
    const allVotes = await prisma.vote.findMany()
    console.log('All votes found:', allVotes.length)

    // Log all client hashes for debugging
    if (allVotes.length > 0) {
      console.log('Sample client hashes:', allVotes.slice(0, 10).map(v => ({
        id: v.id,
        clientHash: v.clientHash,
        startsWithDemo: v.clientHash.startsWith('demo_vote')
      })))
    }

    // Get only real votes (exclude sample/demo votes)
    const votes = allVotes.filter(vote => !vote.clientHash.startsWith('demo_vote'))
    console.log('Real votes found:', votes.length)
    console.log('Demo votes found:', allVotes.length - votes.length)

    // Use only real votes (exclude demo votes)
    const votesToUse = votes

    const totalVotes = votesToUse.length
    const positiveVotes = votesToUse.filter(vote => vote.positive).length
    const satisfactionPercentage = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    // Calculate votes for different time periods
    const votesLast24h = votesToUse.filter(v => v.createdAt >= last24h)
    const votesLast48h = votesToUse.filter(v => v.createdAt >= last48h)
    const votesLast7d = votesToUse.filter(v => v.createdAt >= last7d)
    const votesLast30d = votesToUse.filter(v => v.createdAt >= last30d)

    const totalVotesLast24h = votesLast24h.length
    const totalVotesLast48h = votesLast48h.length
    const totalVotesLast7d = votesLast7d.length
    const totalVotesLast30d = votesLast30d.length

    const positiveVotesLast24h = votesLast24h.filter(vote => vote.positive).length
    const positiveVotesLast48h = votesLast48h.filter(vote => vote.positive).length
    const positiveVotesLast7d = votesLast7d.filter(vote => vote.positive).length
    const positiveVotesLast30d = votesLast30d.filter(vote => vote.positive).length

    const satisfactionLast24h = totalVotesLast24h > 0 ? Math.round((positiveVotesLast24h / totalVotesLast24h) * 100) : 0
    const satisfactionLast7d = totalVotesLast7d > 0 ? Math.round((positiveVotesLast7d / totalVotesLast7d) * 100) : 0
    const satisfactionLast30d = totalVotesLast30d > 0 ? Math.round((positiveVotesLast30d / totalVotesLast30d) * 100) : 0

    // Calculate trend changes
    const satisfactionChange24h = totalVotesLast48h > 0 ? satisfactionLast24h - satisfactionLast7d : 0
    const voteChange24h = totalVotesLast24h - (totalVotesLast48h - totalVotesLast24h) // Votes in period vs previous period

    console.log('National score calculated:', {
      satisfactionPercentage,
      totalVotes,
      positiveVotes,
      satisfactionLast24h,
      satisfactionChange24h,
      voteChange24h
    })

    const response = NextResponse.json({
      satisfactionPercentage,
      totalVotes,
      positiveVotes,
      // Trend data
      last24h: {
        satisfactionPercentage: satisfactionLast24h,
        totalVotes: totalVotesLast24h,
        positiveVotes: positiveVotesLast24h,
      },
      last7d: {
        satisfactionPercentage: satisfactionLast7d,
        totalVotes: totalVotesLast7d,
        positiveVotes: positiveVotesLast7d,
      },
      last30d: {
        satisfactionPercentage: satisfactionLast30d,
        totalVotes: totalVotesLast30d,
        positiveVotes: positiveVotesLast30d,
      },
      trends: {
        satisfactionChange24h: satisfactionChange24h,
        voteChange24h: voteChange24h,
      }
    }, { status: 200 })

    // Add cache control headers to prevent caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')

    return response
  } catch (error) {
    console.error('Error fetching national score:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to fetch national score', details: errorMessage },
      { status: 500 }
    )
  }
}