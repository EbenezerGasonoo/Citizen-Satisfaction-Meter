import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SentimentAnalyzer } from '@/lib/v2/sentiment-analyzer'
import crypto from 'crypto'

export const dynamic = 'force-dynamic'

const sentimentAnalyzer = new SentimentAnalyzer()

function generateClientHash(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const salt = process.env.NEXTAUTH_SECRET || 'default-salt'
  
  return crypto
    .createHash('sha256')
    .update(`${ip}-${userAgent}-${salt}`)
    .digest('hex')
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id)
    if (isNaN(ministerId)) {
      return NextResponse.json({ error: 'Invalid minister ID' }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: { ministerId },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })

    // Calculate aggregated sentiment metrics
    const analytics = sentimentAnalyzer.calculateAggregatedSentiment(comments)

    return NextResponse.json({
      comments,
      analytics
    })
  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id)
    if (isNaN(ministerId)) {
      return NextResponse.json({ error: 'Invalid minister ID' }, { status: 400 })
    }

    const clientHash = generateClientHash(request)
    const { content } = await request.json().catch(() => ({}))

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Comment content is required' },
        { status: 400 }
      )
    }

    if (content.length > 500) {
      return NextResponse.json(
        { error: 'Comment must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Check if minister exists
    const minister = await prisma.minister.findUnique({
      where: { id: ministerId },
      select: { id: true }
    })

    if (!minister) {
      return NextResponse.json(
        { error: 'Minister not found' },
        { status: 404 }
      )
    }

    // Run AI Sentiment Analysis
    const analysis = sentimentAnalyzer.analyzeComment(content)

    // Save comment with sentiment scoring & detected topics
    const comment = await prisma.comment.create({
      data: {
        ministerId,
        content: content.trim(),
        clientHash,
        sentiment: analysis.sentiment,
        sentimentScore: analysis.sentimentScore,
        topics: analysis.topics.length > 0 ? JSON.stringify(analysis.topics) : null
      }
    })

    return NextResponse.json({
      success: true,
      comment,
      analysis
    })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}