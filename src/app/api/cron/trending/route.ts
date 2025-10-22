import { NextRequest, NextResponse } from 'next/server'
import { 
  calculateTrendingMinisters, 
  updateTrendingStatus,
  DEFAULT_TRENDING_CRITERIA 
} from '@/lib/trending-calculator'

export async function POST(request: NextRequest) {
  try {
    // Verify this is a cron job request (you can add authentication here)
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Calculate trending ministers
    const candidates = await calculateTrendingMinisters(DEFAULT_TRENDING_CRITERIA)
    
    // Update trending status
    const ministerIds = candidates.map(c => c.ministerId)
    await updateTrendingStatus(ministerIds)

    return NextResponse.json({
      success: true,
      message: `Updated trending status for ${ministerIds.length} ministers`,
      candidates: candidates.map(c => ({
        ministerId: c.ministerId,
        fullName: c.fullName,
        trendingScore: c.trendingScore,
        reason: c.reason
      }))
    })
  } catch (error) {
    console.error('Error in trending cron job:', error)
    return NextResponse.json(
      { error: 'Failed to update trending ministers' },
      { status: 500 }
    )
  }
}
