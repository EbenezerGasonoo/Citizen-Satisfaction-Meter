import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashClient, getClientIP } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
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

    // Check if minister exists and if user already voted today in one query
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Use a transaction to ensure atomicity and better performance
    const result = await prisma.$transaction(async (tx) => {
      // Check if minister exists
      const minister = await tx.minister.findUnique({
        where: { id: ministerId },
        select: { id: true } // Only select what we need
      })

      if (!minister) {
        throw new Error('Minister not found')
      }

      // Check if user already voted for this minister today
      const existingVote = await tx.vote.findFirst({
        where: {
          ministerId,
          clientHash,
          createdAt: {
            gte: today,
            lt: tomorrow,
          },
        },
        select: { id: true } // Only select what we need
      })

      if (existingVote) {
        throw new Error('Already voted today')
      }

      // Create the vote
      const vote = await tx.vote.create({
        data: {
          ministerId,
          positive,
          clientHash,
        },
      })

      return vote
    })

    const vote = result
    const processingTime = Date.now() - startTime
    console.log(`Vote processed in ${processingTime}ms for minister ${ministerId}`)

    // TODO: Broadcast vote update via Ably

    return NextResponse.json({
      success: true,
      vote,
      processingTime: `${processingTime}ms`
    })
  } catch (error) {
    console.error('Error creating vote:', error)
    
    // Handle specific transaction errors
    if (error instanceof Error) {
      if (error.message === 'Minister not found') {
        return NextResponse.json(
          { error: 'Minister not found' },
          { status: 404 }
        )
      }
      if (error.message === 'Already voted today') {
        return NextResponse.json(
          { error: 'You have already voted for this minister today' },
          { status: 409 }
        )
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to create vote' },
      { status: 500 }
    )
  }
} 