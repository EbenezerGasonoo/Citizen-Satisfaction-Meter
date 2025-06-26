import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id)
    
    if (isNaN(ministerId)) {
      return NextResponse.json(
        { error: 'Invalid minister ID' },
        { status: 400 }
      )
    }

    const minister = await prisma.minister.findUnique({
      where: { id: ministerId },
      include: {
        votes: true,
      },
    })

    if (!minister) {
      return NextResponse.json(
        { error: 'Minister not found' },
        { status: 404 }
      )
    }

    const totalVotes = minister.votes.length
    const positiveVotes = minister.votes.filter(vote => vote.positive).length
    const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    return NextResponse.json({
      id: minister.id,
      fullName: minister.fullName,
      portfolio: minister.portfolio,
      photoUrl: minister.photoUrl,
      bio: minister.bio,
      satisfactionRate,
      totalVotes,
      positiveVotes,
    })
  } catch (error) {
    console.error('Error fetching minister:', error)
    return NextResponse.json(
      { error: 'Failed to fetch minister' },
      { status: 500 }
    )
  }
} 