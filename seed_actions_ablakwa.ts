import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const actions = [
    // Samuel Okudzeto Ablakwa (Foreign Affairs)
    {
        ministerName: 'Samuel Okudzeto Ablakwa (MP)',
        items: [
            {
                title: 'Protection of State Assets Bill',
                description: 'Initiated formal steps to re-submit a private member\'s bill to prohibit politicians from purchasing state assets to curb state capture.',
                status: 'Active',
                date: new Date('2025-01-15'),
                impact: 'High'
            },
            {
                title: 'Expanded Scholarship Scheme',
                description: 'Granted an additional 100 tertiary scholarships to constituents, bringing the total beneficiaries for the year to 400.',
                status: 'Completed',
                date: new Date('2025-04-10'),
                impact: 'High'
            },
            {
                title: 'Defense of Deportee MoU',
                description: 'Defended the government\'s decision to host African deportees from the US under a non-binding MoU, clarifying legal requirements.',
                status: 'Active',
                date: new Date('2025-11-05'),
                impact: 'Medium'
            }
        ]
    }
]

async function main() {
    console.log('🌱 Seeding Ablakwa actions...')

    for (const group of actions) {
        const minister = await prisma.minister.findFirst({
            where: { fullName: group.ministerName }
        })

        if (!minister) {
            console.warn(`⚠️ Minister not found: ${group.ministerName}`)
            continue
        }

        console.log(`Processing actions for ${minister.fullName}...`)

        for (const item of group.items) {
            const existing = await prisma.action.findFirst({
                where: {
                    title: item.title,
                    ministerId: minister.id
                }
            })

            if (!existing) {
                await prisma.action.create({
                    data: {
                        ...item,
                        ministerId: minister.id
                    }
                })
                console.log(`   + Created: ${item.title}`)
            } else {
                console.log(`   . Skipped (Exists): ${item.title}`)
            }
        }
    }

    console.log('✅ Ablakwa actions seeding completed.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
