import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeDemoVotes() {
    try {
        console.log('🔍 Checking for demo votes...')

        // Find all demo votes
        const demoVotes = await prisma.vote.findMany({
            where: {
                clientHash: {
                    startsWith: 'demo_vote'
                }
            }
        })

        console.log(`Found ${demoVotes.length} demo votes`)

        if (demoVotes.length === 0) {
            console.log('✅ No demo votes found. Database is clean!')
            return
        }

        // Show details of demo votes
        console.log('\nDemo votes to be deleted:')
        demoVotes.forEach((vote, index) => {
            console.log(`  ${index + 1}. Vote ID: ${vote.id}, Minister ID: ${vote.ministerId}, Created: ${vote.createdAt}`)
        })

        // Delete all demo votes
        const result = await prisma.vote.deleteMany({
            where: {
                clientHash: {
                    startsWith: 'demo_vote'
                }
            }
        })

        console.log(`\n✅ Successfully deleted ${result.count} demo votes!`)

        // Verify the deletion
        const remainingVotes = await prisma.vote.count()
        console.log(`📊 Total votes remaining in database: ${remainingVotes}`)

    } catch (error) {
        console.error('❌ Error removing demo votes:', error)
        throw error
    } finally {
        await prisma.$disconnect()
    }
}

removeDemoVotes()
    .then(() => {
        console.log('\n✨ Demo vote removal complete!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('Failed to remove demo votes:', error)
        process.exit(1)
    })
