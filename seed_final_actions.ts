import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const finalActions = [
    // Dr Dominic Akuritinga Ayine - Justice & Attorney General
    {
        ministerName: 'Dr Dominic Akuritinga Ayine (MP)',
        items: [
            {
                title: 'Intellectual Property Reforms',
                description: 'Announced significant IP system reforms including new online systems for trademarks/patents, accelerated service delivery, and expanded SME access.',
                status: 'In Progress',
                date: new Date('2025-11-18'),
                impact: 'High'
            },
            {
                title: 'Extradition Efforts for MASLOC CEO',
                description: 'Confirmed active work with US government on extradition of Sedina Tamakloe Attionu to serve 10-year prison sentence.',
                status: 'In Progress',
                date: new Date('2025-11-19'),
                impact: 'Medium'
            },
            {
                title: 'UN Crime Prevention Commission Leadership',
                description: 'Led Ghana\'s delegation to 34th CCPCJ session in Vienna, highlighting SDG integration and anti-corruption initiatives.',
                status: 'Completed',
                date: new Date('2025-05-20'),
                impact: 'Medium'
            },
        ]
    },
    // Mohammed Mubarak Muntaka - Interior
    {
        ministerName: 'Mohammed Mubarak Muntaka (MP)',
        items: [
            {
                title: 'Gun Amnesty Programme Launch',
                description: 'Announced six-week nationwide gun amnesty (Dec 1 - Jan 15) to reduce illicit firearms, with temporary ban on powdered guns at festivals.',
                status: 'Active',
                date: new Date('2025-11-20'),
                impact: 'High'
            },
            {
                title: 'Security Services Recruitment Reform',
                description: 'Restructured recruitment limiting applicants to 1,000 per center daily, implementing centralized e-recruitment portal for transparency.',
                status: 'Active',
                date: new Date('2025-11-15'),
                impact: 'High'
            },
            {
                title: 'Prison Operations Strengthening',
                description: 'Committed to improving prison security with surveillance upgrades, facility expansion, and rehabilitation programs.',
                status: 'In Progress',
                date: new Date('2025-11-10'),
                impact: 'Medium'
            },
        ]
    },
    // Emelia Arthur - Fisheries & Aquaculture
    {
        ministerName: 'Emelia Arthur (MP)',
        items: [
            {
                title: 'Fisheries and Aquaculture Act 2025',
                description: 'Passed landmark Act 1146 extending inshore exclusive zone to 12 nautical miles, introducing enhanced IUU fishing penalties.',
                status: 'Completed',
                date: new Date('2025-11-25'),
                impact: 'High'
            },
            {
                title: 'Marine Protected Area Establishment',
                description: 'Approved Ghana\'s first Marine Protected Area at Cape Three Points to rebuild fish stocks and protect biodiversity.',
                status: 'In Progress',
                date: new Date('2025-11-20'),
                impact: 'High'
            },
            {
                title: 'Anomabo Fisheries College Launch',
                description: 'Assured Anomabo Fisheries College will be operational by Q1 2026, offering specialized marine science and aquaculture programs.',
                status: 'In Progress',
                date: new Date('2025-11-18'),
                impact: 'Medium'
            },
        ]
    },
    // Abdul-Rashid Pelpuo - Labour (already has 4, adding 1 more)
    {
        ministerName: 'Abdul-Rashid Pelpuo (MP)',
        items: [
            {
                title: 'Workers Rights Protection Framework',
                description: 'Advancing comprehensive framework to safeguard workers\' rights, promote decent work, and create sustainable employment opportunities.',
                status: 'Active',
                date: new Date('2025-11-15'),
                impact: 'High'
            },
        ]
    },
    // Agnes Naa Momo Lartey - Gender (already has 3, adding 2 more)
    {
        ministerName: 'Agnes Naa Momo Lartey (MP)',
        items: [
            {
                title: 'Women Empowerment Programs',
                description: 'Developing comprehensive women empowerment programs focusing on economic independence and leadership development.',
                status: 'In Progress',
                date: new Date('2025-11-10'),
                impact: 'High'
            },
            {
                title: 'Child Protection Initiatives',
                description: 'Strengthening child protection frameworks and social services for vulnerable children across Ghana.',
                status: 'Active',
                date: new Date('2025-10-15'),
                impact: 'High'
            },
        ]
    },
]

async function main() {
    console.log('🌱 Seeding final additional actions...\n')

    let totalCreated = 0
    let totalSkipped = 0

    for (const group of finalActions) {
        const minister = await prisma.minister.findFirst({
            where: { fullName: group.ministerName }
        })

        if (!minister) {
            console.warn(`⚠️  Minister not found: ${group.ministerName}`)
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
                console.log(`   ✓ Created: ${item.title}`)
                totalCreated++
            } else {
                console.log(`   - Skipped (exists): ${item.title}`)
                totalSkipped++
            }
        }
        console.log('')
    }

    console.log(`✅ Final actions seeding completed!`)
    console.log(`   Created: ${totalCreated} actions`)
    console.log(`   Skipped: ${totalSkipped} actions`)
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
