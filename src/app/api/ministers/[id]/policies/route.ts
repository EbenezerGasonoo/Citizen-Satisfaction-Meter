import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const ministerId = parseInt(params.id)

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

    // Get policies with vote counts
    const policies = await prisma.policy.findMany({
      where: { ministerId },
      include: {
        votes: true,
        _count: {
          select: {
            votes: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Calculate satisfaction rates for each policy
    const policiesWithStats = policies.map(policy => {
      const totalVotes = policy.votes.length
      const positiveVotes = policy.votes.filter(vote => vote.positive).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

      return {
        id: policy.id,
        title: policy.title,
        description: policy.description,
        category: policy.category,
        status: policy.status,
        startDate: policy.startDate,
        endDate: policy.endDate,
        budget: policy.budget,
        impact: policy.impact,
        createdAt: policy.createdAt,
        updatedAt: policy.updatedAt,
        totalVotes,
        positiveVotes,
        satisfactionRate
      }
    })

    return NextResponse.json({ policies: policiesWithStats })
  } catch (error) {
    console.error('Error fetching policies:', error)
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
    const { title, description, category, status, startDate, endDate, budget, impact } = await request.json()

    // Validate required fields
    if (!title || !description || !category || !status || !impact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create policy
    const policy = await prisma.policy.create({
      data: {
        title: title.trim(),
        description: description.trim(),
        category,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        impact,
        ministerId
      }
    })

    return NextResponse.json({ policy })
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 