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
        const votes = await prisma.vote.groupBy({
            by: ['region'],
            _count: {
                id: true
            },
            where: {
                region: {
                    not: null
                }
            },
            orderBy: {
                _count: {
                    id: 'desc'
                }
            },
            take: 10
        })

        const formattedData = votes.map(v => ({
            region: v.region || 'Unknown',
            count: v._count.id
        }))

        return NextResponse.json(formattedData)
    } catch (error) {
        console.error('Error fetching geo analytics:', error)
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}
