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
                deviceType: true,
                userAgent: true
            }
        })

        // Process device types
        const deviceStats = {
            Mobile: 0,
            Desktop: 0,
            Unknown: 0
        }

        // Process browsers (simple detection)
        const browserStats: Record<string, number> = {
            Chrome: 0,
            Safari: 0,
            Firefox: 0,
            Edge: 0,
            Other: 0
        }

        votes.forEach(vote => {
            // Device Type
            if (vote.deviceType === 'Mobile') deviceStats.Mobile++
            else if (vote.deviceType === 'Desktop') deviceStats.Desktop++
            else deviceStats.Unknown++

            // Browser
            const ua = vote.userAgent?.toLowerCase() || ''
            if (ua.includes('chrome') && !ua.includes('edg')) browserStats.Chrome++
            else if (ua.includes('safari') && !ua.includes('chrome')) browserStats.Safari++
            else if (ua.includes('firefox')) browserStats.Firefox++
            else if (ua.includes('edg')) browserStats.Edge++
            else browserStats.Other++
        })

        return NextResponse.json({
            devices: Object.entries(deviceStats).map(([name, value]) => ({ name, value })),
            browsers: Object.entries(browserStats).map(([name, value]) => ({ name, value }))
        })
    } catch (error) {
        console.error('Error fetching device analytics:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
