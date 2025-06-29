import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

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

    const comments = await prisma.comment.findMany({
      where: { ministerId },
      orderBy: { createdAt: 'desc' },
      take: 50, // Limit to 50 most recent comments
    })

    return NextResponse.json({ comments })
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
    const clientHash = generateClientHash(request)
    const { content } = await request.json()

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
      where: { id: ministerId }
    })

    if (!minister) {
      return NextResponse.json(
        { error: 'Minister not found' },
        { status: 404 }
      )
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        ministerId,
        content: content.trim(),
        clientHash
      }
    })

    return NextResponse.json({ comment })
  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 