import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, message, email } = body

    // Validate input
    if (!type || !message) {
      return NextResponse.json(
        { error: 'Type and message are required' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['suggestion', 'bug', 'nominate'].includes(type)) {
      return NextResponse.json(
        { error: 'Invalid submission type' },
        { status: 400 }
      )
    }

    // Create submission
    const submission = await prisma.submission.create({
      data: {
        type,
        message,
        email: email || null,
        status: 'pending'
      }
    })

    return NextResponse.json({
      success: true,
      id: submission.id,
      message: 'Submission received successfully'
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating submission:', error)
    return NextResponse.json(
      { error: 'Failed to create submission' },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve submissions (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const limit = parseInt(searchParams.get('limit') || '50')

    const where: any = {}
    if (type) where.type = type
    if (status) where.status = status

    const submissions = await prisma.submission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: limit
    })

    return NextResponse.json({
      success: true,
      count: submissions.length,
      submissions
    })

  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    )
  }
}

