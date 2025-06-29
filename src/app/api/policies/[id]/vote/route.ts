import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function generateClientHash(request: NextRequest): string {
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const salt = process.env.NEXTAUTH_SECRET || 'default-salt'
  return crypto.createHash('sha256').update(`${ip}-${userAgent}-${salt}`).digest('hex')
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const policyId = parseInt(params.id)
    const { positive } = await request.json()
    const clientHash = generateClientHash(request)

    // Check if already voted
    const existing = await prisma.policyVote.findUnique({
      where: { policyId_clientHash: { policyId, clientHash } }
    })
    if (existing) {
      return NextResponse.json({ error: 'You have already voted on this policy.' }, { status: 400 })
    }

    // Check if policy exists
    const policy = await prisma.policy.findUnique({ where: { id: policyId } })
    if (!policy) {
      return NextResponse.json({ error: 'Policy not found' }, { status: 404 })
    }

    // Create vote
    await prisma.policyVote.create({
      data: { policyId, positive, clientHash }
    })

    // Return updated stats
    const votes = await prisma.policyVote.findMany({ where: { policyId } })
    const totalVotes = votes.length
    const positiveVotes = votes.filter(v => v.positive).length
    const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    return NextResponse.json({ stats: { totalVotes, positiveVotes, satisfactionRate } })
  } catch (error) {
    console.error('Error voting on policy:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 