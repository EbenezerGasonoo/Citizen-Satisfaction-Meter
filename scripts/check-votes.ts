import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkVotes() {
    try {
        console.log('🔍 Checking vote counts...\n')

        // Get ALL votes
        const allVotes = await prisma.vote.count()
        console.log(`📊 Total votes in database: ${allVotes}`)

        // Get votes with demo_ prefix
        const demoVotes = await prisma.vote.count({
            where: {
                clientHash: {
                    startsWith: 'demo_vote'
                }
            }
        })
        console.log(`🎭 Demo votes: ${demoVotes}`)

        // Get real votes (non-demo)
        const realVotes = await prisma.vote.count({
            where: {
                clientHash: {
                    not: {
                        startsWith: 'demo_vote'
                    }
                }
            }
        })
        console.log(`✅ Real votes: ${realVotes}`)

        // Get recent votes (last 5)
        const recentVotes = await prisma.vote.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                ministerId: true,
                positive: true,
                clientHash: true,
                createdAt: true
            }
        })

        console.log('\n📝 Most recent 5 votes:')
        recentVotes.forEach((vote, index) => {
            const isDemo = vote.clientHash.startsWith('demo_vote')
            console.log(`  ${index + 1}. ID: ${vote.id}, Minister: ${vote.ministerId}, ${vote.positive ? '👍' : '👎'}, ${isDemo ? '🎭 DEMO' : '✅ REAL'}, Created: ${vote.createdAt.toISOString()}`)
        })

    } catch (error) {
        console.error('❌ Error checking votes:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

checkVotes()
    .then(() => {
        console.log('\n✨ Vote check complete!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Failed to check votes:', error)
        process.exit(1)
    })
