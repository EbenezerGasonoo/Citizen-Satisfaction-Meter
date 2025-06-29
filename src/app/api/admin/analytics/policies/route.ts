import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    // Fetch all policies with votes
    const policies = await prisma.policy.findMany({
      include: {
        minister: {
          select: {
            fullName: true
          }
        },
        votes: {
          where: {
            createdAt: {
              gte: startDate
            }
          }
        }
      },
      where: {
        createdAt: {
          gte: startDate
        }
      }
    })

    // Calculate metrics
    const totalPolicies = policies.length
    const activePolicies = policies.filter((p: any) => p.status === 'Active').length
    const completedPolicies = policies.filter((p: any) => p.status === 'Completed').length
    const totalBudget = policies.reduce((sum: number, p: any) => sum + (p.budget || 0), 0)
    const totalVotes = policies.reduce((sum: number, p: any) => sum + p.votes.length, 0)
    
    // Calculate average satisfaction
    let totalSatisfaction = 0
    let policiesWithVotes = 0
    
    policies.forEach((policy: any) => {
      if (policy.votes.length > 0) {
        const positiveVotes = policy.votes.filter((v: any) => v.positive).length
        totalSatisfaction += (positiveVotes / policy.votes.length) * 100
        policiesWithVotes++
      }
    })
    
    const averageSatisfaction = policiesWithVotes > 0 ? Math.round(totalSatisfaction / policiesWithVotes) : 0

    // Category breakdown
    const categoryMap = new Map<string, { count: number; totalVotes: number; positiveVotes: number }>()
    
    policies.forEach((policy: any) => {
      const existing = categoryMap.get(policy.category) || { count: 0, totalVotes: 0, positiveVotes: 0 }
      existing.count++
      existing.totalVotes += policy.votes.length
      existing.positiveVotes += policy.votes.filter((v: any) => v.positive).length
      categoryMap.set(policy.category, existing)
    })

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      count: data.count,
      satisfaction: data.totalVotes > 0 ? Math.round((data.positiveVotes / data.totalVotes) * 100) : 0
    }))

    // Impact breakdown
    const impactMap = new Map<string, { count: number; totalVotes: number; positiveVotes: number }>()
    
    policies.forEach((policy: any) => {
      const existing = impactMap.get(policy.impact) || { count: 0, totalVotes: 0, positiveVotes: 0 }
      existing.count++
      existing.totalVotes += policy.votes.length
      existing.positiveVotes += policy.votes.filter((v: any) => v.positive).length
      impactMap.set(policy.impact, existing)
    })

    const impactBreakdown = Array.from(impactMap.entries()).map(([impact, data]) => ({
      impact,
      count: data.count,
      satisfaction: data.totalVotes > 0 ? Math.round((data.positiveVotes / data.totalVotes) * 100) : 0
    }))

    // Status breakdown
    const statusMap = new Map<string, number>()
    policies.forEach((policy: any) => {
      statusMap.set(policy.status, (statusMap.get(policy.status) || 0) + 1)
    })

    const statusBreakdown = Array.from(statusMap.entries()).map(([status, count]) => ({
      status,
      count
    }))

    // Top performing policies
    const policiesWithSatisfaction = policies.map((policy: any) => {
      const totalVotes = policy.votes.length
      const positiveVotes = policy.votes.filter((v: any) => v.positive).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0
      
      return {
        id: policy.id,
        title: policy.title,
        satisfactionRate,
        totalVotes,
        minister: policy.minister.fullName
      }
    }).filter((p: any) => p.totalVotes > 0)
      .sort((a: any, b: any) => b.satisfactionRate - a.satisfactionRate)
      .slice(0, 10)

    // Recent activity (simulated for now)
    const recentActivity = policies.slice(0, 5).map((policy: any) => ({
      id: policy.id,
      title: policy.title,
      action: 'Created',
      timestamp: policy.createdAt.toISOString()
    }))

    const analytics = {
      totalPolicies,
      activePolicies,
      completedPolicies,
      totalBudget,
      averageSatisfaction,
      totalVotes,
      categoryBreakdown,
      impactBreakdown,
      statusBreakdown,
      topPolicies: policiesWithSatisfaction,
      recentActivity
    }

    return NextResponse.json(analytics)
  } catch (error) {
    console.error('Error fetching policy analytics:', error)
    return NextResponse.json(
      { error: 'Failed to fetch policy analytics' },
      { status: 500 }
    )
  }
} 