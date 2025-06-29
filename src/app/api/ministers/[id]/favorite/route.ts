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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id)
    const clientHash = generateClientHash(request)

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

    // Check if already favorited
    const existingFavorite = await prisma.favorite.findUnique({
      where: {
        ministerId_clientHash: {
          ministerId,
          clientHash
        }
      }
    })

    if (existingFavorite) {
      // Remove favorite
      await prisma.favorite.delete({
        where: {
          ministerId_clientHash: {
            ministerId,
            clientHash
          }
        }
      })

      return NextResponse.json({ favorited: false })
    } else {
      // Add favorite
      await prisma.favorite.create({
        data: {
          ministerId,
          clientHash
        }
      })

      return NextResponse.json({ favorited: true })
    }
  } catch (error) {
    console.error('Error handling favorite:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id)
    const clientHash = generateClientHash(request)

    const favorite = await prisma.favorite.findUnique({
      where: {
        ministerId_clientHash: {
          ministerId,
          clientHash
        }
      }
    })

    return NextResponse.json({ favorited: !!favorite })
  } catch (error) {
    console.error('Error checking favorite status:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 