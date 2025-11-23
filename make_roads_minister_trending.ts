import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔄 Updating Roads Minister to be trending...')

    // Find the minister by portfolio keyword or name
    const minister = await prisma.minister.findFirst({
        where: {
            OR: [
                { portfolio: { contains: 'Roads', mode: 'insensitive' } },
                { fullName: { contains: 'Agbodza', mode: 'insensitive' } }
            ]
        }
    })

    if (!minister) {
        console.error('❌ Roads Minister not found!')
        return
    }

    // Update isTrending to true
    const updated = await prisma.minister.update({
        where: { id: minister.id },
        data: { isTrending: true }
    })

    console.log(`✅ Successfully set ${updated.fullName} (${updated.portfolio}) as TRENDING.`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
