import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyId = parseInt(params.id)
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

    // Check if policy exists
    const existingPolicy = await prisma.policy.findUnique({
      where: { id: policyId }
    })

    if (!existingPolicy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
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

    const updatedPolicy = await prisma.policy.update({
      where: { id: policyId },
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
        },
        votes: true
      }
    })

    // Calculate analytics
    const totalVotes = updatedPolicy.votes.length
    const positiveVotes = updatedPolicy.votes.filter((vote: any) => vote.positive).length
    const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    return NextResponse.json({
      policy: {
        ...updatedPolicy,
        totalVotes,
        positiveVotes,
        satisfactionRate
      }
    })
  } catch (error) {
    console.error('Error updating policy:', error)
    return NextResponse.json(
      { error: 'Failed to update policy' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const policyId = parseInt(params.id)

    // Check if policy exists
    const existingPolicy = await prisma.policy.findUnique({
      where: { id: policyId }
    })

    if (!existingPolicy) {
      return NextResponse.json(
        { error: 'Policy not found' },
        { status: 404 }
      )
    }

    // Delete policy votes first (due to foreign key constraint)
    await prisma.policyVote.deleteMany({
      where: { policyId }
    })

    // Delete the policy
    await prisma.policy.delete({
      where: { id: policyId }
    })

    return NextResponse.json({ message: 'Policy deleted successfully' })
  } catch (error) {
    console.error('Error deleting policy:', error)
    return NextResponse.json(
      { error: 'Failed to delete policy' },
      { status: 500 }
    )
  }
} 