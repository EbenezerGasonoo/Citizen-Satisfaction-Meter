import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const votes = await prisma.vote.findMany()
    
    const totalVotes = votes.length
    const positiveVotes = votes.filter(vote => vote.positive).length
    const score = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    return NextResponse.json({
      score,
      totalVotes,
      positiveVotes,
    })
  } catch (error) {
    console.error('Error fetching national score:', error)
    return NextResponse.json(
      { error: 'Failed to fetch national score' },
      { status: 500 }
    )
  }
} 