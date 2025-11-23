import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashClient, getClientIP } from '@/lib/utils'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const startTime = Date.now()
  try {
    console.log('Vote API called with minister ID:', params.id)
    const { positive } = await request.json()
    const ministerId = parseInt(params.id)

    console.log('Parsed minister ID:', ministerId, 'Positive:', positive)

    if (isNaN(ministerId)) {
      console.log('Invalid minister ID:', params.id)
      return NextResponse.json(
        { error: 'Invalid minister ID' },
        { status: 400 }
      )
    }

    // Test database connection
    console.log('Testing database connection...')
    const ministerCount = await prisma.minister.count()
    console.log('Total ministers in database:', ministerCount)

    // Get client information
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || ''
    const clientHash = hashClient(ip, userAgent)

    // Get geo info from headers (Vercel)
    const geo = {
      country: request.headers.get('x-vercel-ip-country') || null,
      region: request.headers.get('x-vercel-ip-region') || null,
      city: request.headers.get('x-vercel-ip-city') || null
    }

    console.log('Client info - IP:', ip, 'UserAgent:', userAgent.substring(0, 50), 'Hash:', clientHash.substring(0, 20) + '...')

    // Check if minister exists and if user already voted today in one query
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Use a transaction to ensure atomicity and better performance
    const result = await prisma.$transaction(async (tx) => {
      // Check if minister exists
      console.log('Looking for minister with ID:', ministerId)
      const minister = await tx.minister.findUnique({
        where: { id: ministerId },
        select: { id: true } // Only select what we need
      })

      console.log('Minister found:', minister)

      if (!minister) {
        console.log('Minister not found in database')
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

      // Determine device type
      const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent)
      const deviceType = isMobile ? 'Mobile' : 'Desktop'

      // Create the vote
      console.log('Creating vote with data:', { ministerId, positive, clientHash: clientHash.substring(0, 20) + '...', ipAddress: ip, country: geo.country, region: geo.region, city: geo.city, userAgent: userAgent.substring(0, 50), deviceType })
      const vote = await tx.vote.create({
        data: {
          ministerId,
          positive,
          clientHash,
          ipAddress: ip,
          country: geo.country,
          region: geo.region,
          city: geo.city,
          userAgent,
          deviceType,
        },
      })

      console.log('✅ Vote created in transaction:', vote.id)

      return vote
    })

    const vote = result
    const processingTime = Date.now() - startTime
    console.log(`Vote processed in ${processingTime}ms for minister ${ministerId}`)
    console.log(`✅ Vote created successfully with ID: ${vote.id}, clientHash: ${vote.clientHash.substring(0, 20)}...`)

    // TODO: Broadcast vote update via Ably

    return NextResponse.json({
      success: true,
      vote,
      processingTime: `${processingTime}ms`
    })
  } catch (error) {
    console.error('❌ Error creating vote:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    })

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
      { error: 'Failed to create vote', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 