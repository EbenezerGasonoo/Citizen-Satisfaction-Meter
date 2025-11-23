import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const ministers = await prisma.minister.findMany({
        include: {
            actions: true
        }
    })

    console.log('Ministers without actions:\n')
    const ministersWithoutActions = ministers.filter(m => m.actions.length === 0)

    ministersWithoutActions.forEach(m => {
        console.log(`- ${m.fullName} (${m.portfolio})`)
    })

    console.log(`\nTotal: ${ministersWithoutActions.length} ministers without actions`)
    console.log(`\nMinisters with actions: ${ministers.length - ministersWithoutActions.length}`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
