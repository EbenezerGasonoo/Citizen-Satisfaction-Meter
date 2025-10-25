import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Fetching national score...')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set')
    
    // Get ALL votes (temporarily including demo votes for debugging)
    const allVotes = await prisma.vote.findMany()
    console.log('All votes found:', allVotes.length)
    
    // Get only real votes (exclude sample/demo votes)
    const votes = allVotes.filter(vote => !vote.clientHash.startsWith('demo_vote'))
    console.log('Real votes found:', votes.length)
    console.log('Demo votes found:', allVotes.length - votes.length)
    
    // Log some sample client hashes for debugging
    if (allVotes.length > 0) {
      console.log('Sample client hashes:', allVotes.slice(0, 3).map(v => ({ id: v.id, clientHash: v.clientHash.substring(0, 20) + '...' })))
    }
    
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