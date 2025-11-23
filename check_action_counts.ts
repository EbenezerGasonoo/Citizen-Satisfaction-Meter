import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const ministers = await prisma.minister.findMany({
        include: {
            actions: true
        },
        orderBy: {
            fullName: 'asc'
        }
    })

    console.log('Action counts per minister:\n')

    ministers.forEach(m => {
        console.log(`${m.fullName.padEnd(50)} - ${m.actions.length} actions`)
    })

    console.log(`\nTotal ministers: ${ministers.length}`)
    console.log(`Total actions: ${ministers.reduce((sum, m) => sum + m.actions.length, 0)}`)

    const minActions = Math.min(...ministers.map(m => m.actions.length))
    const maxActions = Math.max(...ministers.map(m => m.actions.length))
    console.log(`\nMin actions: ${minActions}`)
    console.log(`Max actions: ${maxActions}`)

    console.log(`\nMinisters with fewer than 5 actions:`)
    ministers.filter(m => m.actions.length < 5).forEach(m => {
        console.log(`  - ${m.fullName}: ${m.actions.length} actions`)
    })
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
