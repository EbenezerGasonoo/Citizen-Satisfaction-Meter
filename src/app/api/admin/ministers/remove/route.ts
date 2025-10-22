import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

// Helper to check admin status
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

// DELETE: Remove a minister
export async function DELETE(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const ministerId = searchParams.get('id')

    if (!ministerId) {
      return NextResponse.json(
        { error: 'Minister ID is required' },
        { status: 400 }
      )
    }

    const id = parseInt(ministerId)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid minister ID' },
        { status: 400 }
      )
    }

    // Check if minister exists
    const minister = await prisma.minister.findUnique({
      where: { id },
      select: { 
        id: true, 
        fullName: true, 
        portfolio: true,
        votes: { select: { id: true } },
        comments: { select: { id: true } },
        favorites: { select: { id: true } },
        policies: { select: { id: true } },
        actions: { select: { id: true } }
      }
    })

    if (!minister) {
      return NextResponse.json(
        { error: 'Minister not found' },
        { status: 404 }
      )
    }

    // Get counts for logging
    const voteCount = minister.votes.length
    const commentCount = minister.comments.length
    const favoriteCount = minister.favorites.length
    const policyCount = minister.policies.length
    const actionCount = minister.actions.length

    console.log(`🗑️ Removing minister: ${minister.fullName} (${minister.portfolio})`)
    console.log(`📊 Related data: ${voteCount} votes, ${commentCount} comments, ${favoriteCount} favorites, ${policyCount} policies, ${actionCount} actions`)

    // Delete all related data in the correct order (respecting foreign key constraints)
    
    // 1. Delete votes
    if (voteCount > 0) {
      await prisma.vote.deleteMany({
        where: { ministerId: id }
      })
      console.log(`✅ Deleted ${voteCount} votes`)
    }

    // 2. Delete comments
    if (commentCount > 0) {
      await prisma.comment.deleteMany({
        where: { ministerId: id }
      })
      console.log(`✅ Deleted ${commentCount} comments`)
    }

    // 3. Delete favorites
    if (favoriteCount > 0) {
      await prisma.favorite.deleteMany({
        where: { ministerId: id }
      })
      console.log(`✅ Deleted ${favoriteCount} favorites`)
    }

    // 4. Delete policies
    if (policyCount > 0) {
      await prisma.policy.deleteMany({
        where: { ministerId: id }
      })
      console.log(`✅ Deleted ${policyCount} policies`)
    }

    // 5. Delete actions
    if (actionCount > 0) {
      await prisma.action.deleteMany({
        where: { ministerId: id }
      })
      console.log(`✅ Deleted ${actionCount} actions`)
    }

    // 6. Finally delete the minister
    await prisma.minister.delete({
      where: { id }
    })
    console.log(`✅ Deleted minister: ${minister.fullName}`)

    return NextResponse.json({
      success: true,
      message: `Minister ${minister.fullName} and all related data have been successfully removed`,
      removedData: {
        votes: voteCount,
        comments: commentCount,
        favorites: favoriteCount,
        policies: policyCount,
        actions: actionCount
      }
    })

  } catch (error) {
    console.error('Error removing minister:', error)
    return NextResponse.json(
      { error: 'Failed to remove minister' },
      { status: 500 }
    )
  }
}

// POST: Bulk remove ministers
export async function POST(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { ministerIds } = body

    if (!ministerIds || !Array.isArray(ministerIds) || ministerIds.length === 0) {
      return NextResponse.json(
        { error: 'Minister IDs array is required' },
        { status: 400 }
      )
    }

    const validIds = ministerIds.filter(id => !isNaN(parseInt(id))).map(id => parseInt(id))
    
    if (validIds.length === 0) {
      return NextResponse.json(
        { error: 'No valid minister IDs provided' },
        { status: 400 }
      )
    }

    // Get ministers to be removed
    const ministers = await prisma.minister.findMany({
      where: { id: { in: validIds } },
      select: { 
        id: true, 
        fullName: true, 
        portfolio: true,
        votes: { select: { id: true } },
        comments: { select: { id: true } },
        favorites: { select: { id: true } },
        policies: { select: { id: true } },
        actions: { select: { id: true } }
      }
    })

    if (ministers.length === 0) {
      return NextResponse.json(
        { error: 'No ministers found with the provided IDs' },
        { status: 404 }
      )
    }

    console.log(`🗑️ Bulk removing ${ministers.length} ministers`)

    let totalVotes = 0
    let totalComments = 0
    let totalFavorites = 0
    let totalPolicies = 0
    let totalActions = 0

    // Process each minister
    for (const minister of ministers) {
      const voteCount = minister.votes.length
      const commentCount = minister.comments.length
      const favoriteCount = minister.favorites.length
      const policyCount = minister.policies.length
      const actionCount = minister.actions.length

      totalVotes += voteCount
      totalComments += commentCount
      totalFavorites += favoriteCount
      totalPolicies += policyCount
      totalActions += actionCount

      // Delete all related data
      await prisma.vote.deleteMany({ where: { ministerId: minister.id } })
      await prisma.comment.deleteMany({ where: { ministerId: minister.id } })
      await prisma.favorite.deleteMany({ where: { ministerId: minister.id } })
      await prisma.policy.deleteMany({ where: { ministerId: minister.id } })
      await prisma.action.deleteMany({ where: { ministerId: minister.id } })
      await prisma.minister.delete({ where: { id: minister.id } })

      console.log(`✅ Removed ${minister.fullName} (${voteCount} votes, ${commentCount} comments, ${favoriteCount} favorites, ${policyCount} policies, ${actionCount} actions)`)
    }

    return NextResponse.json({
      success: true,
      message: `Successfully removed ${ministers.length} ministers and all related data`,
      removedMinisters: ministers.map(m => ({ id: m.id, name: m.fullName, portfolio: m.portfolio })),
      removedData: {
        votes: totalVotes,
        comments: totalComments,
        favorites: totalFavorites,
        policies: totalPolicies,
        actions: totalActions
      }
    })

  } catch (error) {
    console.error('Error bulk removing ministers:', error)
    return NextResponse.json(
      { error: 'Failed to bulk remove ministers' },
      { status: 500 }
    )
  }
}
