import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const ministers = await prisma.minister.findMany({
      include: {
        votes: true,
      },
    })

    const ministersWithStats = ministers.map(minister => {
      const totalVotes = minister.votes.length
      const positiveVotes = minister.votes.filter(vote => vote.positive).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

      return {
        id: minister.id,
        fullName: minister.fullName,
        portfolio: minister.portfolio,
        photoUrl: minister.photoUrl,
        bio: minister.bio,
        satisfactionRate,
        totalVotes,
        positiveVotes,
      }
    })

    return NextResponse.json(ministersWithStats)
  } catch (error) {
    console.error('Error fetching ministers:', error)
    return NextResponse.json(
      { error: 'Failed to fetch ministers' },
      { status: 500 }
    )
  }
} 