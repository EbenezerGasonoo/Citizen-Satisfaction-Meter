import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching national score...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    const votes = await prisma.vote.findMany()
    console.log('Votes found:', votes.length)
    
    const totalVotes = votes.length
    const positiveVotes = votes.filter(vote => vote.positive).length
    const satisfactionPercentage = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    console.log('National score calculated:', { satisfactionPercentage, totalVotes, positiveVotes })

    return NextResponse.json({
      satisfactionPercentage,
      totalVotes,
      positiveVotes,
    })
  } catch (error) {
    console.error('Error fetching national score:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    return NextResponse.json(
      { error: 'Failed to fetch national score', details: errorMessage },
      { status: 500 }
    )
  }
} 