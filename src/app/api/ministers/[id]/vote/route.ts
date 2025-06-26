import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashClient, getClientIP } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { positive } = await request.json()
    const ministerId = parseInt(params.id)
    
    if (isNaN(ministerId)) {
      return NextResponse.json(
        { error: 'Invalid minister ID' },
        { status: 400 }
      )
    }

    // Get client information
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const clientHash = hashClient(ip, userAgent)

    // Check if minister exists
    const minister = await prisma.minister.findUnique({
      where: { id: ministerId },
    })

    if (!minister) {
      return NextResponse.json(
        { error: 'Minister not found' },
        { status: 404 }
      )
    }

    // Check if user already voted for this minister today
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const existingVote = await prisma.vote.findFirst({
      where: {
        ministerId,
        clientHash,
        createdAt: {
          gte: today,
          lt: tomorrow,
        },
      },
    })

    if (existingVote) {
      return NextResponse.json(
        { error: 'You have already voted for this minister today' },
        { status: 409 }
      )
    }

    // Create the vote
    const vote = await prisma.vote.create({
      data: {
        ministerId,
        positive,
        clientHash,
      },
    })

    // TODO: Broadcast vote update via Ably

    return NextResponse.json({
      success: true,
      vote,
    })
  } catch (error) {
    console.error('Error creating vote:', error)
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    )
  }
} 