import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Admin check
  const session = await getServerSession(authOptions)
  if (!session || session.user?.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const ministerId = parseInt(params.id)
    if (isNaN(ministerId)) {
      return NextResponse.json(
        { error: 'Invalid minister ID' },
        { status: 400 }
      )
    }
    const body = await request.json()
    const { fullName, portfolio, photoUrl, bio } = body
    if (!fullName || !portfolio) {
      return NextResponse.json(
        { error: 'Full name and portfolio are required.' },
        { status: 400 }
      )
    }
    const updatedMinister = await prisma.minister.update({
      where: { id: ministerId },
      data: {
        fullName,
        portfolio,
        photoUrl,
        bio,
      },
    })
    return NextResponse.json({
      id: updatedMinister.id,
      fullName: updatedMinister.fullName,
      portfolio: updatedMinister.portfolio,
      photoUrl: updatedMinister.photoUrl,
      bio: updatedMinister.bio,
    })
  } catch (error) {
    console.error('Error updating minister:', error)
    return NextResponse.json(
      { error: 'Failed to update minister' },
      { status: 500 }
    )
  }
} 