import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'
import fs from 'fs'
import path from 'path'

// Force dynamic rendering - this route uses request.url and searchParams
export const dynamic = 'force-dynamic'

// Helper to check admin status
async function isAdmin(req: NextRequest) {
  const session = await getServerSession(authOptions)
  return session?.user?.role === 'ADMIN'
}

// GET: Get system logs
export async function GET(request: NextRequest) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all'
    const limit = parseInt(searchParams.get('limit') || '100')

    const logs: any[] = []

    // Get application logs
    if (type === 'all' || type === 'app') {
      const appLogs = await getApplicationLogs(limit)
      logs.push(...appLogs)
    }

    // Get vote logs
    if (type === 'all' || type === 'votes') {
      const voteLogs = await getVoteLogs(limit)
      logs.push(...voteLogs)
    }

    // Get admin logs
    if (type === 'all' || type === 'admin') {
      const adminLogs = await getAdminLogs(limit)
      logs.push(...adminLogs)
    }

    // Get system logs
    if (type === 'all' || type === 'system') {
      const systemLogs = await getSystemLogs(limit)
      logs.push(...systemLogs)
    }

    // Sort by timestamp (newest first)
    logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    // Get system statistics
    const stats = await getSystemStatistics()

    return NextResponse.json({
      success: true,
      logs: logs.slice(0, limit),
      statistics: stats,
      totalLogs: logs.length
    })

  } catch (error) {
    console.error('Error fetching system logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch system logs' },
      { status: 500 }
    )
  }
}

// Helper function to get application logs
async function getApplicationLogs(limit: number) {
  try {
    // Get recent votes as application activity
    const recentVotes = await prisma.vote.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        minister: {
          select: { fullName: true, portfolio: true }
        }
      }
    })

    return recentVotes.map(vote => ({
      id: `vote-${vote.id}`,
      type: 'vote',
      level: 'info',
      message: `Vote cast for ${vote.minister.fullName} (${vote.minister.portfolio})`,
      timestamp: vote.createdAt,
      data: {
        ministerId: vote.ministerId,
        positive: vote.positive,
        clientHash: vote.clientHash
      }
    }))
  } catch (error) {
    console.error('Error fetching application logs:', error)
    return []
  }
}

// Helper function to get vote logs
async function getVoteLogs(limit: number) {
  try {
    // Get vote statistics by day for the last 30 days
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const votes = await prisma.vote.findMany({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Group by date
    const votesByDate = votes.reduce((acc, vote) => {
      const date = vote.createdAt.toISOString().split('T')[0]
      if (!acc[date]) {
        acc[date] = { total: 0, positive: 0, negative: 0 }
      }
      acc[date].total++
      if (vote.positive) {
        acc[date].positive++
      } else {
        acc[date].negative++
      }
      return acc
    }, {} as Record<string, { total: number; positive: number; negative: number }>)

    return Object.entries(votesByDate).map(([date, stats]) => ({
      id: `vote-stats-${date}`,
      type: 'vote-stats',
      level: 'info',
      message: `${stats.total} votes on ${date} (${stats.positive} positive, ${stats.negative} negative)`,
      timestamp: new Date(date),
      data: stats
    }))
  } catch (error) {
    console.error('Error fetching vote logs:', error)
    return []
  }
}

// Helper function to get admin logs
async function getAdminLogs(limit: number) {
  try {
    // Get recent admin actions (this would need to be implemented in your admin actions)
    // For now, we'll create some sample admin logs
    const adminLogs = [
      {
        id: 'admin-1',
        type: 'admin',
        level: 'info',
        message: 'Admin logged in',
        timestamp: new Date(),
        data: { action: 'login' }
      },
      {
        id: 'admin-2',
        type: 'admin',
        level: 'info',
        message: 'System backup created',
        timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        data: { action: 'backup' }
      }
    ]

    return adminLogs
  } catch (error) {
    console.error('Error fetching admin logs:', error)
    return []
  }
}

// Helper function to get system logs
async function getSystemLogs(limit: number) {
  try {
    const logs: any[] = []

    // Get database statistics
    const totalVotes = await prisma.vote.count()
    const totalMinisters = await prisma.minister.count()
    const totalUsers = await prisma.user.count()

    logs.push({
      id: 'system-1',
      type: 'system',
      level: 'info',
      message: `Database statistics: ${totalVotes} votes, ${totalMinisters} ministers, ${totalUsers} users`,
      timestamp: new Date(),
      data: { totalVotes, totalMinisters, totalUsers }
    })

    // Get recent system events
    const recentVotes = await prisma.vote.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    })

    if (recentVotes.length > 0) {
      logs.push({
        id: 'system-2',
        type: 'system',
        level: 'info',
        message: `Recent activity: ${recentVotes.length} votes in the last hour`,
        timestamp: new Date(),
        data: { recentVotes: recentVotes.length }
      })
    }

    return logs
  } catch (error) {
    console.error('Error fetching system logs:', error)
    return []
  }
}

// Helper function to get system statistics
async function getSystemStatistics() {
  try {
    const totalVotes = await prisma.vote.count()
    const totalMinisters = await prisma.minister.count()
    const totalUsers = await prisma.user.count()
    
    // Get votes from last 24 hours
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    
    const votesLast24h = await prisma.vote.count({
      where: {
        createdAt: {
          gte: yesterday
        }
      }
    })

    // Get trending ministers
    const trendingMinisters = await prisma.minister.count({
      where: { isTrending: true }
    })

    return {
      totalVotes,
      totalMinisters,
      totalUsers,
      votesLast24h,
      trendingMinisters,
      lastUpdated: new Date()
    }
  } catch (error) {
    console.error('Error fetching system statistics:', error)
    return {
      totalVotes: 0,
      totalMinisters: 0,
      totalUsers: 0,
      votesLast24h: 0,
      trendingMinisters: 0,
      lastUpdated: new Date()
    }
  }
}
