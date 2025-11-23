import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔍 Checking Roads Minister data...\n')

    const minister = await prisma.minister.findFirst({
        where: {
            OR: [
                { portfolio: { contains: 'Roads', mode: 'insensitive' } },
                { fullName: { contains: 'Agbodza', mode: 'insensitive' } }
            ]
        },
        include: {
            actions: {
                orderBy: { date: 'desc' },
                take: 5
            },
            votes: {
                where: {
                    createdAt: {
                        gte: new Date(Date.now() - 24 * 60 * 60 * 1000)
                    }
                }
            }
        }
    })

    if (!minister) {
        console.error('❌ Roads Minister not found!')
        return
    }

    console.log(`Minister: ${minister.fullName}`)
    console.log(`Portfolio: ${minister.portfolio}`)
    console.log(`Is Trending: ${minister.isTrending}`)
    console.log(`Photo URL: ${minister.photoUrl}`)
    console.log(`\nActions (${minister.actions.length}):`)
    minister.actions.forEach((action, i) => {
        console.log(`  ${i + 1}. ${action.title} (${action.date.toISOString().split('T')[0]})`)
    })
    console.log(`\nVotes in last 24h: ${minister.votes.length}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
