import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get all votes without any filtering
    const allVotes = await prisma.vote.findMany({
      take: 50,
      orderBy: { createdAt: 'desc' }
    })

    // Get total count
    const totalCount = await prisma.vote.count()

    // Sample some clientHashes
    const sampleHashes = allVotes.slice(0, 5).map(v => ({
      id: v.id,
      ministerId: v.ministerId,
      positive: v.positive,
      clientHash: v.clientHash.substring(0, 20) + '...',
      createdAt: v.createdAt
    }))

    return NextResponse.json({
      totalVotes: totalCount,
      recentVotes: allVotes.length,
      sampleHashes,
      votes: allVotes.map(v => ({
        id: v.id,
        ministerId: v.ministerId,
        positive: v.positive,
        clientHash: v.clientHash,
        createdAt: v.createdAt
      }))
    })
  } catch (error) {
    console.error('Error fetching debug votes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch votes', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

