import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCabinetSocialOverview, getMinisterSocialReadings } from '@/lib/v2/social-media-reader'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ministerIdParam = searchParams.get('ministerId')

    if (ministerIdParam) {
      const ministerId = parseInt(ministerIdParam)
      if (isNaN(ministerId)) {
        return NextResponse.json({ error: 'Invalid ministerId' }, { status: 400 })
      }

      const minister = await prisma.minister.findUnique({
        where: { id: ministerId },
        include: {
          votes: { select: { positive: true } }
        }
      })

      if (!minister) {
        return NextResponse.json({ error: 'Minister not found' }, { status: 404 })
      }

      const total = minister.votes.length
      const positive = minister.votes.filter(v => v.positive).length
      const satisfactionRate = total > 0 ? Math.round((positive / total) * 100) : 60

      const pulse = getMinisterSocialReadings(
        minister.id,
        minister.fullName,
        minister.portfolio,
        satisfactionRate
      )

      return NextResponse.json({
        success: true,
        data: pulse
      })
    }

    // Otherwise return Cabinet-wide overview
    const ministers = await prisma.minister.findMany({
      select: {
        id: true,
        fullName: true,
        portfolio: true,
        photoUrl: true,
        votes: { select: { positive: true } }
      }
    })

    const overview = getCabinetSocialOverview(ministers)

    return NextResponse.json({
      success: true,
      data: overview
    })
  } catch (error: any) {
    console.error('Error fetching social media readings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch social media readings' },
      { status: 500 }
    )
  }
}
