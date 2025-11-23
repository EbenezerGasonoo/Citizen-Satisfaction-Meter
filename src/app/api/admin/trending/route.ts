import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { 
  calculateTrendingMinisters, 
  updateTrendingStatus, 
  getTrendingAnalytics,
  DEFAULT_TRENDING_CRITERIA,
  type TrendingCriteria 
} from '@/lib/trending-calculator'

// Force dynamic rendering - this route uses request.url and searchParams
export const dynamic = 'force-dynamic'

// GET: Fetch trending candidates and current trending ministers
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')

    if (action === 'candidates') {
      // Get trending candidates
      const candidates = await calculateTrendingMinisters()
      return NextResponse.json({ candidates })
    }

    if (action === 'analytics') {
      // Get trending analytics
      const analytics = await getTrendingAnalytics()
      return NextResponse.json({ analytics })
    }

    // Get current trending ministers
    const trendingMinisters = await prisma.minister.findMany({
      where: { isTrending: true },
      include: {
        votes: {
          where: {
            createdAt: {
              gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
            }
          }
        }
      },
      orderBy: { fullName: 'asc' }
    })

    const formattedMinisters = trendingMinisters.map(minister => {
      const totalVotes = minister.votes.length
      const positiveVotes = minister.votes.filter(v => v.positive).length
      const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 50

      return {
        id: minister.id,
        fullName: minister.fullName,
        portfolio: minister.portfolio,
        photoUrl: minister.photoUrl,
        satisfactionRate,
        voteChange: totalVotes,
        trend: satisfactionRate > 50 ? 'up' as const : 'down' as const,
        isTrending: true
      }
    })

    return NextResponse.json({ ministers: formattedMinisters })
  } catch (error) {
    console.error('Error fetching trending data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch trending data' },
      { status: 500 }
    )
  }
}

// POST: Update trending ministers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, ministerIds, criteria } = body

    if (action === 'update') {
      // Update trending status for specific ministers
      await updateTrendingStatus(ministerIds || [])
      
      return NextResponse.json({ 
        success: true, 
        message: `Updated trending status for ${ministerIds?.length || 0} ministers` 
      })
    }

    if (action === 'auto-update') {
      // Automatically calculate and update trending ministers
      const trendingCriteria = criteria || DEFAULT_TRENDING_CRITERIA
      const candidates = await calculateTrendingMinisters(trendingCriteria)
      
      const ministerIds = candidates.map(c => c.ministerId)
      await updateTrendingStatus(ministerIds)
      
      return NextResponse.json({ 
        success: true, 
        message: `Auto-updated trending status for ${ministerIds.length} ministers`,
        candidates 
      })
    }

    if (action === 'reset') {
      // Reset all trending flags
      await updateTrendingStatus([])
      
      return NextResponse.json({ 
        success: true, 
        message: 'Reset all trending ministers' 
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error updating trending ministers:', error)
    return NextResponse.json(
      { error: 'Failed to update trending ministers' },
      { status: 500 }
    )
  }
}
