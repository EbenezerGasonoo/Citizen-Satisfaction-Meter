import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const additionalActions = [
    // John Dramani Mahama - President
    {
        ministerName: 'John Dramani Mahama',
        items: [
            {
                title: 'Chief Justice Appointment',
                description: 'Swore in Justice Paul Baffoe-Bonnie as Ghana\'s new Chief Justice, emphasizing the importance of an independent judiciary for democracy.',
                status: 'Completed',
                date: new Date('2025-11-07'),
                impact: 'High'
            },
            {
                title: 'Fisheries Sector Support Package',
                description: 'Announced GH¢50 million support package for fisheries sector including outboard motors, equipment, and acquisition of two offshore patrol vessels.',
                status: 'Active',
                date: new Date('2025-11-21'),
                impact: 'High'
            },
            {
                title: 'School Infrastructure Upgrade Pledge',
                description: 'Pledged to upgrade all Category B and C Senior High Schools to Category A status, starting with Ghana Senior High School.',
                status: 'In Progress',
                date: new Date('2025-11-22'),
                impact: 'High'
            },
            {
                title: 'Hurricane Relief for Jamaica',
                description: 'Deployed Ghana\'s 48 Engineers Regiment to Jamaica for reconstruction following Hurricane Melissa as part of Pan-African solidarity.',
                status: 'Active',
                date: new Date('2025-11-19'),
                impact: 'Medium'
            },
            {
                title: 'Foreign Service Vehicle Duty Waiver',
                description: 'Approved new policy granting duty waivers on one vehicle for foreign service officers returning from overseas postings.',
                status: 'Completed',
                date: new Date('2025-11-19'),
                impact: 'Low'
            },
        ]
    },
    // Jane Naana Opoku-Agyemang - Vice President
    {
        ministerName: 'Jane Naana Opoku-Agyemang',
        items: [
            {
                title: 'EU Ambassador Diplomatic Engagement',
                description: 'Held discussions with EU Ambassador to strengthen Ghana-EU relations, deepen regional collaboration, and explore AfCFTA opportunities.',
                status: 'Completed',
                date: new Date('2025-11-20'),
                impact: 'High'
            },
            {
                title: 'Egypt Bilateral Cooperation',
                description: 'Hosted Egyptian Ambassador to advance cooperation in youth empowerment, training, technology, and knowledge exchange.',
                status: 'Completed',
                date: new Date('2025-11-20'),
                impact: 'Medium'
            },
            {
                title: 'Waste-to-Energy Partnership Engagement',
                description: 'Engaged with Portage Energy on potential partnership for waste-to-energy and sustainable aviation fuel initiatives.',
                status: 'In Progress',
                date: new Date('2025-11-20'),
                impact: 'High'
            },
            {
                title: 'Cocoa Sector Transformation Support',
                description: 'Reaffirmed commitment to transforming cocoa sector from exporting raw beans to high-value products, encouraging AfCFTA expansion.',
                status: 'Active',
                date: new Date('2025-11-22'),
                impact: 'High'
            },
            {
                title: 'AU-EU Summit Representation',
                description: 'Representing President Mahama at 7th AU-EU Summit in Luanda, Angola, advocating for equitable partnerships and inclusive global governance.',
                status: 'In Progress',
                date: new Date('2025-11-24'),
                impact: 'High'
            },
            {
                title: 'Academic Freedom Conference Advocacy',
                description: 'Urged Academic Staff Associations to ensure leadership development in universities to promote academic freedom and democratization.',
                status: 'Completed',
                date: new Date('2025-11-20'),
                impact: 'Medium'
            },
        ]
    },
    // Cassiel Ato Forson - Finance
    {
        ministerName: 'Cassiel Ato Forson (MP)',
        items: [
            {
                title: '2026 Budget Presentation',
                description: 'Presented 2026 Budget Statement themed "Resetting for Growth, Jobs, and Economic Transformation" to Parliament.',
                status: 'Completed',
                date: new Date('2025-11-13'),
                impact: 'High'
            },
            {
                title: 'IMF and World Bank Annual Meetings',
                description: 'Led delegation to 2025 IMF/World Bank meetings in Washington D.C. to discuss global economic priorities and attract investments.',
                status: 'Completed',
                date: new Date('2025-10-15'),
                impact: 'High'
            },
            {
                title: 'Women\'s Development Bank Funding',
                description: 'Allocated significant funding for establishment of Women\'s Development Bank to support women entrepreneurs.',
                status: 'In Progress',
                date: new Date('2025-11-13'),
                impact: 'High'
            },
        ]
    },
    // Samuel Okudzeto Ablakwa - Foreign Affairs
    {
        ministerName: 'Samuel Okudzeto Ablakwa (MP)',
        items: [
            {
                title: 'Qatar Official Visit',
                description: 'Embarked on official visit to Qatar to deepen bilateral cooperation including Ghana-Qatar labour cooperation discussions.',
                status: 'Completed',
                date: new Date('2025-11-15'),
                impact: 'Medium'
            },
            {
                title: 'Passport Reforms Achievement Report',
                description: 'Announced over 215,807 new ICAO-compliant chip-embedded passports issued since April 2025, clearing 40,000+ application backlog.',
                status: 'Completed',
                date: new Date('2025-11-18'),
                impact: 'High'
            },
            {
                title: 'Third-Party Deportee Policy Clarification',
                description: 'Addressed Parliament on accepting US deportees based purely on humanitarian and Pan-African grounds, no monetary support requested.',
                status: 'Completed',
                date: new Date('2025-11-12'),
                impact: 'Medium'
            },
            {
                title: 'Zambia Bilateral Cooperation Meeting',
                description: 'Held 2nd Session of Permanent Joint Commission for Cooperation in Lusaka to deepen Ghana-Zambia bilateral ties.',
                status: 'Completed',
                date: new Date('2025-11-10'),
                impact: 'Low'
            },
            {
                title: 'Diaspora Summit Promotion',
                description: 'Handed over diplomatic passports to cultural advocates, promoting upcoming Diaspora Summit scheduled for December 19-20, 2025.',
                status: 'Active',
                date: new Date('2025-10-25'),
                impact: 'Medium'
            },
        ]
    },
    // Haruna Iddrisu - Education
    {
        ministerName: 'Haruna Iddrisu (MP)',
        items: [
            {
                title: 'Free Education for Special Needs Learners',
                description: 'Announced plan to introduce free education across all special and integrated schools beginning January 2026, with GH¢65 million GETFund allocation.',
                status: 'In Progress',
                date: new Date('2025-11-20'),
                impact: 'High'
            },
            {
                title: 'Double-Track System Elimination',
                description: 'Rolling out US$180 million World Bank-supported Ghana Secondary Learning Improvement Programme to end double-track system.',
                status: 'In Progress',
                date: new Date('2025-11-15'),
                impact: 'High'
            },
            {
                title: 'Teacher Recruitment Approval',
                description: 'Cabinet approved recruitment of 6,100 teachers to address staffing gaps, with plans for 50,000 housing units for teachers.',
                status: 'Active',
                date: new Date('2025-11-18'),
                impact: 'High'
            },
            {
                title: 'National Defence University Bill',
                description: 'Announced plans to present National Defence University Bill to Parliament for specialized university for security services.',
                status: 'In Progress',
                date: new Date('2025-11-22'),
                impact: 'Medium'
            },
        ]
    },
    // Samuel Nartey George - Communications
    {
        ministerName: 'Samuel Nartey George (MP)',
        items: [
            {
                title: 'WMO Extraordinary Congress Leadership',
                description: 'Led Ghana\'s delegation to 2025 World Meteorological Organization Congress in Geneva, highlighting Africa\'s climate vulnerability.',
                status: 'Completed',
                date: new Date('2025-10-20'),
                impact: 'Medium'
            },
            {
                title: 'Ghana Post Transformation Commendation',
                description: 'Commended Ghana Post for transformation and innovation, encouraging sustainable practices like electric vehicles for delivery.',
                status: 'Completed',
                date: new Date('2025-10-15'),
                impact: 'Low'
            },
            {
                title: 'ITU Council Session Participation',
                description: 'Participated in International Telecommunication Union Council Session in Geneva, advocating for Ghana\'s telecommunication priorities.',
                status: 'Completed',
                date: new Date('2025-06-15'),
                impact: 'Medium'
            },
        ]
    },
    // John Abdulai Jinapor - Energy
    {
        ministerName: 'John Abdulai Jinapor (MP)',
        items: [
            {
                title: 'Nuclear Power Board Inauguration',
                description: 'Inaugurated Board of Nuclear Power Ghana, signaling decisive step towards developing nuclear energy for electricity generation.',
                status: 'Completed',
                date: new Date('2025-11-19'),
                impact: 'High'
            },
            {
                title: 'Petroleum Sector Regulatory Review',
                description: 'Announced comprehensive regulatory review of downstream petroleum sector including new NPA Act to align with global renewable shift.',
                status: 'In Progress',
                date: new Date('2025-11-15'),
                impact: 'High'
            },
            {
                title: 'Petroleum Hub Board Inauguration',
                description: 'Inaugurated Board of Petroleum Hub Development Corporation to attract strategic investments and establish Ghana as regional energy hub.',
                status: 'Completed',
                date: new Date('2025-11-22'),
                impact: 'Medium'
            },
            {
                title: 'World Bank Energy Sector Collaboration',
                description: 'Held discussions with World Bank delegation to strengthen collaboration on reducing system losses and improving operational efficiency.',
                status: 'Completed',
                date: new Date('2025-11-20'),
                impact: 'Medium'
            },
        ]
    },
    // Kwame Governs Agbodza - Roads & Highways
    {
        ministerName: 'Kwame Governs Agbodza (MP)',
        items: [
            {
                title: 'Big Push Programme Implementation',
                description: 'Announced over GHS 60 billion in road projects past procurement stage, with contractors working in all regions, completion by end 2027.',
                status: 'Active',
                date: new Date('2025-11-20'),
                impact: 'High'
            },
            {
                title: 'Accra-Kumasi Expressway Flagship',
                description: 'Highlighted Accra-Kumasi expressway as flagship component of Big Push Programme for national infrastructure development.',
                status: 'In Progress',
                date: new Date('2025-11-18'),
                impact: 'High'
            },
            {
                title: 'Ashaiman Interchange Development',
                description: 'Announced development of interchange in Ashaiman as part of Tema Motorway rehabilitation under Big Push Programme.',
                status: 'In Progress',
                date: new Date('2025-11-15'),
                impact: 'Medium'
            },
        ]
    },
]

async function main() {
    console.log('🌱 Seeding additional late 2025 actions...\n')

    let totalCreated = 0
    let totalSkipped = 0

    for (const group of additionalActions) {
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

    console.log(`✅ Additional actions seeding completed!`)
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
