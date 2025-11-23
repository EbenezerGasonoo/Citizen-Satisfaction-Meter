import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    try {
        // Get votes from the last 30 days
        const thirtyDaysAgo = new Date()
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

        const votes = await prisma.vote.findMany({
            where: {
                createdAt: {
                    gte: thirtyDaysAgo
                }
            },
            select: {
                createdAt: true
            }
        })

        // Group by hour (0-23)
        const hourlyStats = new Array(24).fill(0)

        votes.forEach(vote => {
            // Use UTC hours to be consistent, or adjust for Ghana time (UTC)
            const hour = vote.createdAt.getUTCHours()
            hourlyStats[hour]++
        })

        const result = hourlyStats.map((count, hour) => ({
            hour: `${hour.toString().padStart(2, '0')}:00`,
            count
        }))

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching time analytics:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
