import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const policies = await prisma.policy.findMany({
      include: {
        minister: {
          select: {
            fullName: true,
            portfolio: true
          }
        },
        votes: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Calculate analytics for each policy
    const policiesWithAnalytics = policies.map((policy: any) => {
      const totalVotes = policy.votes.length
      const positiveVotes = policy.votes.filter((vote: any) => vote.positive).length
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
        ministerId: policy.ministerId,
        minister: policy.minister,
        totalVotes,
        positiveVotes,
        satisfactionRate,
        createdAt: policy.createdAt,
        updatedAt: policy.updatedAt
      }
    })

    return NextResponse.json({ policies: policiesWithAnalytics })
  } catch (error) {
    console.error('Error fetching policies:', error)
    return NextResponse.json(
      { error: 'Failed to fetch policies' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      category,
      status,
      startDate,
      endDate,
      budget,
      impact,
      ministerId
    } = body

    // Validate required fields
    if (!title || !description || !category || !status || !impact || !ministerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify minister exists
    const minister = await prisma.minister.findUnique({
      where: { id: parseInt(ministerId) }
    })

    if (!minister) {
      return NextResponse.json(
        { error: 'Minister not found' },
        { status: 404 }
      )
    }

    const policy = await prisma.policy.create({
      data: {
        title,
        description,
        category,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        budget: budget ? parseFloat(budget) : null,
        impact,
        ministerId: parseInt(ministerId)
      },
      include: {
        minister: {
          select: {
            fullName: true,
            portfolio: true
          }
        }
      }
    })

    return NextResponse.json({
      policy: {
        ...policy,
        totalVotes: 0,
        positiveVotes: 0,
        satisfactionRate: 0
      }
    })
  } catch (error) {
    console.error('Error creating policy:', error)
    return NextResponse.json(
      { error: 'Failed to create policy' },
      { status: 500 }
    )
  }
} 