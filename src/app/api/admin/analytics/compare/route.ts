import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)

    if (!session || (session.user as any).role !== 'ADMIN') {
        return new NextResponse('Unauthorized', { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ministerIds = searchParams.get('ids')?.split(',').map(Number)

    if (!ministerIds || ministerIds.length === 0) {
        return NextResponse.json([])
    }

    try {
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const votes = await prisma.vote.findMany({
            where: {
                ministerId: {
                    in: ministerIds
                },
                createdAt: {
                    gte: sevenDaysAgo
                }
            },
            include: {
                minister: {
                    select: {
                        fullName: true
                    }
                }
            },
            orderBy: {
                createdAt: 'asc'
            }
        })

        // Process data into daily stats per minister
        const dailyStats: Record<string, any> = {}

        // Initialize dates
        for (let i = 0; i < 7; i++) {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            dailyStats[dateStr] = { date: dateStr }
        }

        // Group votes by date and minister
        votes.forEach(vote => {
            const dateStr = vote.createdAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            if (dailyStats[dateStr]) {
                const ministerKey = vote.minister.fullName
                if (!dailyStats[dateStr][ministerKey]) {
                    dailyStats[dateStr][ministerKey] = { total: 0, positive: 0 }
                }
                dailyStats[dateStr][ministerKey].total++
                if (vote.positive) dailyStats[dateStr][ministerKey].positive++
            }
        })

        // Calculate percentages
        const result = Object.values(dailyStats).map(day => {
            const formattedDay: any = { date: day.date }
            Object.keys(day).forEach(key => {
                if (key !== 'date') {
                    const stats = day[key]
                    formattedDay[key] = stats.total > 0 ? Math.round((stats.positive / stats.total) * 100) : 0
                }
            })
            return formattedDay
        })

        return NextResponse.json(result)
    } catch (error) {
        console.error('Error fetching comparative analytics:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
