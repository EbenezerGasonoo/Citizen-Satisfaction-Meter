import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const dbConnected = await prisma.$queryRaw`SELECT 1 as connected`.catch(() => null)
    
    // Get all votes without any filtering
    const allVotes = await prisma.vote.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    })

    // Get total counts
    const totalCount = await prisma.vote.count()
    const realVotesCount = await prisma.vote.count({
      where: {
        clientHash: {
          not: {
            startsWith: 'demo_vote'
          }
        }
      }
    })
    const demoVotesCount = totalCount - realVotesCount

    // Get votes by time period
    const now = new Date()
    const last24h = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const last7d = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const votesLast24h = await prisma.vote.count({
      where: {
        createdAt: { gte: last24h },
        clientHash: { not: { startsWith: 'demo_vote' } }
      }
    })
    
    const votesLast7d = await prisma.vote.count({
      where: {
        createdAt: { gte: last7d },
        clientHash: { not: { startsWith: 'demo_vote' } }
      }
    })

    // Get minister count
    const ministerCount = await prisma.minister.count()

    // Sample some clientHashes
    const sampleHashes = allVotes.slice(0, 5).map(v => ({
      id: v.id,
      ministerId: v.ministerId,
      positive: v.positive,
      clientHash: v.clientHash.substring(0, 20) + '...',
      isDemo: v.clientHash.startsWith('demo_vote'),
      createdAt: v.createdAt
    }))

    return NextResponse.json({
      database: {
        connected: !!dbConnected,
        environment: process.env.NODE_ENV,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      votes: {
        total: totalCount,
        real: realVotesCount,
        demo: demoVotesCount,
        last24h: votesLast24h,
        last7d: votesLast7d,
        recent: allVotes.length
      },
      ministers: {
        total: ministerCount
      },
      sampleHashes,
      recentVotes: allVotes.slice(0, 10).map(v => ({
        id: v.id,
        ministerId: v.ministerId,
        positive: v.positive,
        clientHash: v.clientHash.substring(0, 30) + '...',
        isDemo: v.clientHash.startsWith('demo_vote'),
        createdAt: v.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching debug votes:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch votes', 
        details: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

