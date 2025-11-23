import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const actions = [
    // John Dramani Mahama (President)
    {
        ministerName: 'John Dramani Mahama',
        items: [
            {
                title: '24-Hour Economy Policy',
                description: 'Pledged to implement a "24-hour economy" policy to transform Ghana\'s economic landscape, create jobs, and foster an entrepreneurial spirit.',
                status: 'In Progress',
                date: new Date('2025-01-01'),
                impact: 'High'
            },
            {
                title: 'Administrative Restructuring',
                description: 'Initiated an administrative restructuring to reduce the number of ministries and enhance government efficiency.',
                status: 'Completed',
                date: new Date('2025-01-07'),
                impact: 'High'
            },
            {
                title: 'Ban on Non-Essential Travel',
                description: 'Ordered a ban on non-essential travel by government officials to cut costs and ensure modest spending.',
                status: 'Active',
                date: new Date('2025-02-10'),
                impact: 'Medium'
            },
            {
                title: 'Pan-African Congress Address',
                description: 'Called for renewed efforts towards Africa\'s economic liberation and proposed a "League of African Free Movement Countries" at the 5th Pan-African Congress anniversary.',
                status: 'Completed',
                date: new Date('2025-11-18'),
                impact: 'Medium'
            }
        ]
    },
    // Jane Naana Opoku-Agyemang (Vice President)
    {
        ministerName: 'Jane Naana Opoku-Agyemang',
        items: [
            {
                title: 'African Political Parties Summit Address',
                description: 'Urged African leaders to prioritize policy-driven leadership and national development plans over political rivalries.',
                status: 'Completed',
                date: new Date('2025-08-15'),
                impact: 'Medium'
            },
            {
                title: 'Harvard & MIT Student Engagement',
                description: 'Challenged the perception of foreign aid as charity and advocated for fair economic partnerships during a meeting with students.',
                status: 'Completed',
                date: new Date('2025-03-10'),
                impact: 'Low'
            },
            {
                title: 'Cultural Diplomacy Initiative',
                description: 'Promoted "Grow Ghana, Eat Ghana, Wear Ghana" by consistently wearing locally crafted attire at public engagements.',
                status: 'Active',
                date: new Date('2025-01-07'),
                impact: 'Medium'
            }
        ]
    },
    // Cassiel Ato Forson (Finance)
    {
        ministerName: 'Cassiel Ato Forson (MP)',
        items: [
            {
                title: '2025 Budget Presentation',
                description: 'Presented the 2025 Budget Statement aimed at rationalizing expenditure and resetting the economy for growth.',
                status: 'Completed',
                date: new Date('2025-03-11'),
                impact: 'High'
            },
            {
                title: 'Economic Recovery Announcement',
                description: 'Declared Ghana\'s economic recovery with a 6.3% GDP growth in the first half of 2025 and a significant drop in inflation.',
                status: 'Completed',
                date: new Date('2025-10-15'),
                impact: 'High'
            },
            {
                title: 'Tax Removal on Mineral Exploration',
                description: 'Abolished the 15% VAT on mineral exploration to attract investment and boost the mining sector.',
                status: 'Active',
                date: new Date('2025-11-13'),
                impact: 'High'
            }
        ]
    },
    // Samuel Nartey George (Communications)
    {
        ministerName: 'Samuel Nartey George (MP)',
        items: [
            {
                title: 'Dig Once Policy',
                description: 'Announced the "Dig Once Policy" mandating fiber-optic conduits in all new road projects to reduce costs and fiber cuts.',
                status: 'Active',
                date: new Date('2025-11-05'),
                impact: 'High'
            },
            {
                title: 'Service Quality Ultimatum',
                description: 'Issued an ultimatum to mobile network operators to improve service quality by Dec 2025 or face penalties.',
                status: 'Active',
                date: new Date('2025-05-20'),
                impact: 'High'
            },
            {
                title: 'Student Tech Initiative',
                description: 'Partnered with Google to provide Ghanaian students free access to Gemini AI and certification training.',
                status: 'Active',
                date: new Date('2025-11-10'),
                impact: 'Medium'
            }
        ]
    },
    // Haruna Iddrisu (Education)
    {
        ministerName: 'Haruna Iddrisu (MP)',
        items: [
            {
                title: 'Mother Tongue Instruction Directive',
                description: 'Directed strict enforcement of local language instruction in Kindergarten to Primary 3 to improve learning outcomes.',
                status: 'Active',
                date: new Date('2025-10-24'),
                impact: 'High'
            },
            {
                title: 'Special Needs Education Policy',
                description: 'Proposed free education for all special needs schools and allocated funds for their support starting 2026.',
                status: 'Proposed',
                date: new Date('2025-11-01'),
                impact: 'High'
            },
            {
                title: 'No-Fee-Stress Platform Update',
                description: 'Announced that 129,000 students had successfully used the digital platform for tertiary applications and financial support.',
                status: 'Completed',
                date: new Date('2025-06-15'),
                impact: 'Medium'
            }
        ]
    },
    // John Abdulai Jinapor (Energy)
    {
        ministerName: 'John Abdulai Jinapor (MP)',
        items: [
            {
                title: 'Power Sector Stabilization',
                description: 'Announced the stabilization of the power sector with no load shedding for months, following initial challenges.',
                status: 'Completed',
                date: new Date('2025-08-01'),
                impact: 'High'
            },
            {
                title: 'Renewable Energy Fund Proposal',
                description: 'Advocated for a Renewable Energy and Green Transition Fund to support local green tech and solar initiatives.',
                status: 'Proposed',
                date: new Date('2025-03-05'),
                impact: 'High'
            },
            {
                title: 'Nuclear Power Board Inauguration',
                description: 'Inaugurated the Nuclear Power Ghana Board to accelerate the country\'s nuclear power ambitions for energy security.',
                status: 'Completed',
                date: new Date('2025-11-15'),
                impact: 'High'
            }
        ]
    },
    // Kwame Governs Agbodza (Roads)
    {
        ministerName: 'Kwame Governs Agbodza (MP)',
        items: [
            {
                title: 'Big Push Road Projects',
                description: 'Authorized 32 major road projects under the "Big Push" initiative, with strict timelines and penalties for delays.',
                status: 'Active',
                date: new Date('2025-08-25'),
                impact: 'High'
            },
            {
                title: 'National Roads Dashboard',
                description: 'Announced plans for a public dashboard to track road contracts, payments, and progress for transparency.',
                status: 'Proposed',
                date: new Date('2025-09-10'),
                impact: 'Medium'
            },
            {
                title: 'Cement Pricing Warning',
                description: 'Warned cement producers to align prices with economic realities or face exclusion from government contracts.',
                status: 'Active',
                date: new Date('2025-07-15'),
                impact: 'Medium'
            }
        ]
    },
    // Mohammed Mubarak Muntaka (Interior)
    {
        ministerName: 'Mohammed Mubarak Muntaka (MP)',
        items: [
            {
                title: 'Gun Amnesty Initiative',
                description: 'Launched a six-week gun amnesty period for surrendering illegal firearms to curb rising crime rates.',
                status: 'Active',
                date: new Date('2025-12-01'),
                impact: 'High'
            },
            {
                title: 'Firearms Ban at Festivals',
                description: 'Imposed a ban on the use of all firearms during traditional festivals to ensure public safety.',
                status: 'Active',
                date: new Date('2025-12-01'),
                impact: 'Medium'
            },
            {
                title: 'Marine Police Boats Commissioning',
                description: 'Commissioned four new patrol boats to strengthen maritime security and combat piracy.',
                status: 'Completed',
                date: new Date('2025-11-20'),
                impact: 'Medium'
            }
        ]
    },
    // Dominic Ayine (Justice)
    {
        ministerName: 'Dr Dominic Akuritinga Ayine (MP)',
        items: [
            {
                title: 'Corruption Case Conclusions',
                description: 'Concluded investigations into 20 high-profile corruption cases, clearing some and preparing charges for others.',
                status: 'Completed',
                date: new Date('2025-10-10'),
                impact: 'High'
            },
            {
                title: 'Discontinuation of Cases',
                description: 'Discontinued several high-profile cases citing ethical reasons and insufficient evidence.',
                status: 'Completed',
                date: new Date('2025-02-15'),
                impact: 'High'
            },
            {
                title: 'Defense of Bail Conditions',
                description: 'Defended stringent bail conditions for former appointees as necessary safeguards for justice.',
                status: 'Active',
                date: new Date('2025-11-05'),
                impact: 'Medium'
            }
        ]
    },
    // Emelia Arthur (Fisheries)
    {
        ministerName: 'Emelia Arthur (MP)',
        items: [
            {
                title: 'EU Yellow Card Action',
                description: 'Pledged to work towards lifting the EU\'s "Yellow Card" on Ghana by tackling illegal fishing practices.',
                status: 'Active',
                date: new Date('2025-02-01'),
                impact: 'High'
            },
            {
                title: 'Blue Economy Strategy',
                description: 'Driving the development of a national Blue Economy Strategy for sustainable marine resource management.',
                status: 'Active',
                date: new Date('2025-04-15'),
                impact: 'High'
            },
            {
                title: 'ATLAFCO Vice Chair Election',
                description: 'Elected as Vice Chair of the Ministerial Conference on Fisheries Cooperation Among African States Bordering the Atlantic Ocean.',
                status: 'Completed',
                date: new Date('2025-04-20'),
                impact: 'Medium'
            }
        ]
    }
]

async function main() {
    console.log('🌱 Seeding minister actions...')

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

    console.log('✅ Minister actions seeding completed.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
