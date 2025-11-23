import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const actions = [
    // Elizabeth Ofosu-Adjare - Trade & Industry
    {
        ministerName: 'Elizabeth Ofosu-Adjare (MP)',
        items: [
            {
                title: 'Industrial Policy and Local Manufacturing Support',
                description: 'Stepped up engagements with major local manufacturers including visits to Wahu Company Limited and Entrance Pharmaceutical to support local production and improve operating environment for manufacturers.',
                status: 'Active',
                date: new Date('2025-11-15'),
                impact: 'High'
            },
            {
                title: 'AfCFTA Private Sector Growth Initiative',
                description: 'Renewed focus on strengthening Ghana\'s position within the African Continental Free Trade Area and fostering an environment conducive to private sector growth.',
                status: 'Active',
                date: new Date('2025-10-01'),
                impact: 'High'
            },
            {
                title: 'Spare Parts Price Stability Meeting',
                description: 'Held high-level meeting with GUTA, spare parts dealers, and transport operators to address price hikes and ensure fair pricing, transparency, and market stability.',
                status: 'Completed',
                date: new Date('2025-11-20'),
                impact: 'Medium'
            },
            {
                title: 'US-Africa Business Summit Participation',
                description: 'Led Ghana\'s delegation to the 17th US-Africa Business Summit in Luanda, Angola, holding bilateral meetings to enhance trade relations and attract investors.',
                status: 'Completed',
                date: new Date('2025-06-15'),
                impact: 'High'
            },
        ]
    },
    // Joseph Bukari Nikpe - Transport
    {
        ministerName: 'Joseph Bukari Nikpe (MP)',
        items: [
            {
                title: 'National Airline Task Force',
                description: 'Established 10-member task force to oversee creation of new national airline, with inception report submitted and interim report expected soon.',
                status: 'In Progress',
                date: new Date('2025-09-01'),
                impact: 'High'
            },
            {
                title: 'Kotoka International Airport Upgrades',
                description: 'Repurposing Terminal 2 into dual-purpose facility and constructing new Air Traffic Control Tower (20% complete) to enhance aviation safety and passenger experience.',
                status: 'In Progress',
                date: new Date('2025-08-15'),
                impact: 'High'
            },
            {
                title: 'Railway Line Resumption',
                description: 'Resumed construction on Western Railway line from Takoradi Port to Huni Valley, with Tema-Mpakadan line nearing operational readiness for three daily trips.',
                status: 'In Progress',
                date: new Date('2025-07-20'),
                impact: 'High'
            },
            {
                title: 'Ghana Transport and Logistics Fair 2025',
                description: 'Launched fair scheduled for October 22-24 to showcase innovations, promote connectivity, and attract investment in transport sector.',
                status: 'Completed',
                date: new Date('2025-10-22'),
                impact: 'Medium'
            },
        ]
    },
    // Kwabena Mintah Akandoh - Health
    {
        ministerName: 'Kwabena Mintah Akandoh (MP)',
        items: [
            {
                title: 'Public Health Operations Response Centre',
                description: 'Commissioned Ghana\'s first Public Health Operations Response Centre to enhance emergency preparedness and response during outbreaks.',
                status: 'Completed',
                date: new Date('2025-11-10'),
                impact: 'High'
            },
            {
                title: 'Digital Health Transformation - GHIMS',
                description: 'Announced four-week plan to restore electronic healthcare management system by migrating to Ghana Healthcare Information Management System (GHIMS).',
                status: 'In Progress',
                date: new Date('2025-10-15'),
                impact: 'High'
            },
            {
                title: 'Agenda 111 Infrastructure Completion',
                description: 'Committed to significant investment in health infrastructure, prioritizing completion of Agenda 111 projects over 70% complete.',
                status: 'In Progress',
                date: new Date('2025-09-01'),
                impact: 'High'
            },
            {
                title: 'CHPS Compounds Construction',
                description: 'Released funding to district assemblies for annual construction of at least two new Community-based Health Planning and Services compounds.',
                status: 'Active',
                date: new Date('2025-08-01'),
                impact: 'Medium'
            },
        ]
    },
    // Eric Opoku - Food & Agriculture
    {
        ministerName: 'Eric Opoku (MP)',
        items: [
            {
                title: 'Feed Ghana Programme Launch',
                description: 'Launched flagship four-year program (2025-2028) to transform agricultural landscape, enhance food security, and reduce reliance on food imports.',
                status: 'Active',
                date: new Date('2025-04-15'),
                impact: 'High'
            },
            {
                title: 'School Farms Initiative',
                description: 'Established farms in every secondary school to integrate agriculture into education system and supply school feeding program.',
                status: 'In Progress',
                date: new Date('2025-09-01'),
                impact: 'High'
            },
            {
                title: 'Agricultural Mechanization Deployment',
                description: 'Plans to deploy over 4,000 machines and farm implements across 50 districts in 2026, with first 11 farmer service centers opening.',
                status: 'In Progress',
                date: new Date('2025-10-01'),
                impact: 'High'
            },
            {
                title: 'Import Permit Halt for Local Products',
                description: 'Halted issuance of new import permits for items that can be produced domestically to boost local production.',
                status: 'Active',
                date: new Date('2025-11-01'),
                impact: 'Medium'
            },
        ]
    },
    // Kofi Iddie Adams - Sports & Recreation
    {
        ministerName: 'Kofi Iddie Adams (MP)',
        items: [
            {
                title: 'Sports Development Fund Establishment',
                description: 'Cabinet-approved Sports Development Fund with Presidential backing to be laid before Parliament as sustainable financing mechanism.',
                status: 'In Progress',
                date: new Date('2025-10-01'),
                impact: 'High'
            },
            {
                title: 'National Recreation and Wellness Programme',
                description: 'Launched initiative anchored on National Aerobics Day to promote wellness, inclusivity, and mass participation in recreation.',
                status: 'Active',
                date: new Date('2025-09-15'),
                impact: 'Medium'
            },
            {
                title: 'School Sports Revitalization Agenda',
                description: 'Restoring grassroots sporting culture through structured U12–U20 pathways in partnership with Ministry of Education.',
                status: 'In Progress',
                date: new Date('2025-08-01'),
                impact: 'High'
            },
            {
                title: 'Sports Infrastructure Revitalization',
                description: 'Committed to enhancing sports infrastructure nationwide, with focus on stalled projects like Essipong Sports Stadium.',
                status: 'In Progress',
                date: new Date('2025-07-15'),
                impact: 'Medium'
            },
        ]
    },
    // Agnes Naa Momo Lartey - Gender, Children & Social Protection
    {
        ministerName: 'Agnes Naa Momo Lartey (MP)',
        items: [
            {
                title: 'Ministry Assumption of Office',
                description: 'Officially began tenure as Minister for Gender, Children, and Social Protection with commitment to social justice and protection.',
                status: 'Completed',
                date: new Date('2025-02-03'),
                impact: 'Medium'
            },
            {
                title: 'Social Protection Policy Framework',
                description: 'Developing comprehensive framework to protect vulnerable groups including women, children, and marginalized communities.',
                status: 'In Progress',
                date: new Date('2025-08-01'),
                impact: 'High'
            },
            {
                title: 'Gender Equality Advocacy',
                description: 'Championing gender equality initiatives and women\'s empowerment programs across all sectors.',
                status: 'Active',
                date: new Date('2025-09-01'),
                impact: 'High'
            },
        ]
    },
    // Emmanuel Armah Kofi Buah - Lands & Natural Resources
    {
        ministerName: 'Emmanuel Armah Kofi Buah (MP)',
        items: [
            {
                title: 'Five-Pillar Anti-Galamsey Strategy',
                description: 'Unveiled comprehensive strategy for conflict prevention and sustainable development in fight against illegal mining.',
                status: 'Active',
                date: new Date('2025-10-15'),
                impact: 'High'
            },
            {
                title: 'Blue Water Initiative',
                description: 'Training 2,000 community members as environmental vanguards to protect rivers and restore polluted water bodies.',
                status: 'In Progress',
                date: new Date('2025-09-20'),
                impact: 'High'
            },
            {
                title: 'Tree for Life Reforestation Campaign',
                description: 'Nationwide effort to plant 20 million trees in degraded forest reserves and riparian zones.',
                status: 'Active',
                date: new Date('2025-09-01'),
                impact: 'High'
            },
            {
                title: 'State Land Management Reforms',
                description: 'Comprehensive review of all state lands disposed since 1995 to ensure transparency and accountability.',
                status: 'In Progress',
                date: new Date('2025-08-01'),
                impact: 'Medium'
            },
        ]
    },
    // Ahmed Ibrahim - Local Government, Chieftaincy & Religious Affairs
    {
        ministerName: 'Ahmed Ibrahim (MP)',
        items: [
            {
                title: 'Sanitation and Waste Management Priority',
                description: 'Made sanitation top priority with commitment to achieving cleaner and healthier cities and towns across Ghana.',
                status: 'Active',
                date: new Date('2025-11-19'),
                impact: 'High'
            },
            {
                title: 'Chieftaincy Act Amendment Initiative',
                description: 'Discussions with Greater Accra Regional House of Chiefs to amend Section 63 of Chieftaincy Act to grant chiefs enhanced authority.',
                status: 'In Progress',
                date: new Date('2025-10-15'),
                impact: 'Medium'
            },
            {
                title: 'District Roads Improvement Program',
                description: 'Prioritizing program in 2025 to modernize rural road networks and enhance mining sector contribution to community development.',
                status: 'Active',
                date: new Date('2025-04-01'),
                impact: 'High'
            },
            {
                title: 'Local Governance Funding Disbursement',
                description: 'Disbursed GH¢1.4 billion to local governance in first quarter of 2025 to strengthen decentralization.',
                status: 'Completed',
                date: new Date('2025-03-31'),
                impact: 'High'
            },
        ]
    },
    // Dzifa Gomashie - Tourism, Culture & Creative Arts
    {
        ministerName: 'Dzifa Gomashie (MP)',
        items: [
            {
                title: 'Black Star Experience Initiative',
                description: 'Introduced lasting lifestyle initiative to showcase Ghana\'s rich cultural heritage, generate revenue, and create employment in the sector.',
                status: 'Active',
                date: new Date('2025-10-01'),
                impact: 'High'
            },
            {
                title: 'Ghana Museums and Monuments Board Inauguration',
                description: 'Inaugurated governing boards tasking them with strategic leadership and maintaining high standards of accountability.',
                status: 'Completed',
                date: new Date('2025-11-15'),
                impact: 'Medium'
            },
            {
                title: 'Intellectual Property Protection for Creatives',
                description: 'Dedicated to enhancing creative industry through improved IP systems and ensuring fair compensation for creators.',
                status: 'Active',
                date: new Date('2025-09-01'),
                impact: 'High'
            },
            {
                title: 'Afro Gastro Cultural Diplomacy',
                description: 'Championing initiative using food and music as powerful tools for connecting diverse cultures.',
                status: 'Active',
                date: new Date('2025-08-15'),
                impact: 'Medium'
            },
        ]
    },
    // Abdul-Rashid Pelpuo - Labour, Jobs & Employment
    {
        ministerName: 'Abdul-Rashid Pelpuo (MP)',
        items: [
            {
                title: 'Labour Market Information System Development',
                description: 'Developing comprehensive system to create database of job vacancies and candidates, facilitating connections between private sector and job seekers.',
                status: 'In Progress',
                date: new Date('2025-10-01'),
                impact: 'High'
            },
            {
                title: 'Health and Safety Compliance Taskforce',
                description: 'Launched regional taskforce to improve workplace safety and adherence to national labor laws.',
                status: 'Active',
                date: new Date('2025-09-15'),
                impact: 'Medium'
            },
            {
                title: '24-Hour Economy Support Initiative',
                description: 'Supporting government\'s 24-hour economy initiative to boost production and foster economic growth.',
                status: 'Active',
                date: new Date('2025-08-01'),
                impact: 'High'
            },
            {
                title: 'Labour Bill and OSH Bill Advancement',
                description: 'Working on Labour Bill and Occupational Safety and Health Bill to improve workplace safety and strengthen social protection.',
                status: 'In Progress',
                date: new Date('2025-07-01'),
                impact: 'High'
            },
        ]
    },
    // Kenneth Gilbert Adjei - Works, Housing & Water Resources
    {
        ministerName: 'Kenneth Gilbert Adjei',
        items: [
            {
                title: 'Blekusu Sea Defence Project Tour',
                description: 'Toured Blekusu Sea Defence Project to assess progress and ensure coastal protection infrastructure development.',
                status: 'Active',
                date: new Date('2025-11-20'),
                impact: 'Medium'
            },
            {
                title: 'Water Resources Commission Board Inauguration',
                description: 'Inaugurated governing boards of Water Resources Commission and Community Water and Sanitation Agency.',
                status: 'Completed',
                date: new Date('2025-08-15'),
                impact: 'Medium'
            },
            {
                title: 'Ghana Hydrological Authority Engagement',
                description: 'Visited Ghana Hydrological Authority to strengthen water resource management and planning.',
                status: 'Completed',
                date: new Date('2025-03-10'),
                impact: 'Low'
            },
            {
                title: 'Community Water and Sanitation Agency Visit',
                description: 'Paid working visit to Community Water and Sanitation Agency to improve rural water access.',
                status: 'Completed',
                date: new Date('2025-02-15'),
                impact: 'Medium'
            },
        ]
    },
    // George Opare Addo - Youth Development & Empowerment
    {
        ministerName: 'George Opare Addo',
        items: [
            {
                title: 'Decentralization of Youth Agencies',
                description: 'Plans to decentralize youth agencies to improve monitoring and management of beneficiaries for various funds and programs.',
                status: 'In Progress',
                date: new Date('2025-10-01'),
                impact: 'High'
            },
            {
                title: 'Youth Resource Centers Completion',
                description: 'Committed to completing youth resource centers across six regions, developing them into multi-purpose facilities.',
                status: 'In Progress',
                date: new Date('2025-09-15'),
                impact: 'High'
            },
            {
                title: 'National Apprenticeship Programme Funding',
                description: 'GH¢300 million allocated for National Apprenticeship Programme to address high youth unemployment.',
                status: 'Active',
                date: new Date('2025-08-01'),
                impact: 'High'
            },
            {
                title: 'City-Level Skills Hubs Establishment',
                description: 'Establishing skills hubs aligned with employer demands through National Entrepreneurship and Innovation Programme.',
                status: 'In Progress',
                date: new Date('2025-07-15'),
                impact: 'High'
            },
        ]
    },
]

async function main() {
    console.log('🌱 Seeding actions for remaining ministers...\n')

    for (const group of actions) {
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
            } else {
                console.log(`   - Skipped (exists): ${item.title}`)
            }
        }
        console.log('')
    }

    console.log('✅ Minister actions seeding completed!')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
