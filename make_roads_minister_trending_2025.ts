import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🔥 Making Roads Minister trending...\n')

    // Find the Roads Minister
    const roadsMinister = await prisma.minister.findFirst({
        where: {
            portfolio: {
                contains: 'Roads',
                mode: 'insensitive'
            }
        }
    })

    if (!roadsMinister) {
        console.error('❌ Roads Minister not found!')
        return
    }

    console.log(`Found: ${roadsMinister.fullName} - ${roadsMinister.portfolio}`)

    // Update to make trending
    const updated = await prisma.minister.update({
        where: { id: roadsMinister.id },
        data: { isTrending: true }
    })

    console.log(`\n✅ ${updated.fullName} is now trending!`)
    console.log(`   Portfolio: ${updated.portfolio}`)
    console.log(`   Trending: ${updated.isTrending}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
