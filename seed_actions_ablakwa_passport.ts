import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const actions = [
    // Samuel Okudzeto Ablakwa (Foreign Affairs)
    {
        ministerName: 'Samuel Okudzeto Ablakwa (MP)',
        items: [
            {
                title: 'Passport Backlog Clearance',
                description: 'Successfully cleared an inherited backlog of over 70,000 uncollected passports, ending prolonged delays for applicants.',
                status: 'Completed',
                date: new Date('2025-06-15'),
                impact: 'High'
            },
            {
                title: 'Passport Fee Reduction',
                description: 'Implemented a 30% reduction in passport application fees (from GH₵500 to GH₵350) to make passports more affordable.',
                status: 'Completed',
                date: new Date('2025-04-28'),
                impact: 'High'
            },
            {
                title: '24-Hour Passport Service',
                description: 'Launched a 24-hour expedited passport processing service and began 24-hour operations at the passport office.',
                status: 'Active',
                date: new Date('2025-05-01'),
                impact: 'High'
            },
            {
                title: 'Chip-Embedded Passports',
                description: 'Transitioned from biometric to ICAO-compliant chip-embedded passports for enhanced security and global acceptance.',
                status: 'Completed',
                date: new Date('2025-04-28'),
                impact: 'Medium'
            },
            {
                title: 'Elimination of "Goro Boys"',
                description: 'Implemented transparent digital systems that successfully eliminated middlemen ("goro boys") from the passport acquisition process.',
                status: 'Completed',
                date: new Date('2025-07-01'),
                impact: 'High'
            }
        ]
    }
]

async function main() {
    console.log('🌱 Seeding Ablakwa passport actions...')

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

    console.log('✅ Ablakwa passport actions seeding completed.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
