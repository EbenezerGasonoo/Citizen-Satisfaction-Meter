import { NextRequest, NextResponse } from 'next/server'
import { 
  calculateTrendingMinisters, 
  updateTrendingStatus, 
  DEFAULT_TRENDING_CRITERIA 
} from '@/lib/trending-calculator'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    const isAdmin = session?.user?.role === 'ADMIN'
    const authHeader = request.headers.get('authorization')
    const isCronSecret = process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`

    if (!isAdmin && !isCronSecret && process.env.CRON_SECRET) {
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
