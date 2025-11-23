import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const policies = [
    // Cassiel Ato Forson (Finance)
    {
        ministerName: 'Cassiel Ato Forson (MP)',
        items: [
            {
                title: 'Public Financial Management Act (Act 921)',
                description: 'A comprehensive law to regulate the financial management of the public sector, ensuring transparency, accountability, and sound fiscal discipline in government spending.',
                category: 'Economy',
                status: 'Completed',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2016-08-01'),
                endDate: new Date('2016-12-31')
            },
            {
                title: 'GIFMIS Reforms',
                description: 'Implementation of the Ghana Integrated Financial Management Information System (GIFMIS) to improve budget execution and financial reporting across all government agencies.',
                category: 'Economy',
                status: 'Active',
                impact: 'High',
                budget: 12000000,
                startDate: new Date('2015-01-01')
            },
            {
                title: 'Mineral Exploration Tax Reform',
                description: 'Abolishment of VAT on mineral exploration and reconnaissance activities to attract foreign investment and stimulate growth in the mining sector.',
                category: 'Economy',
                status: 'Proposed',
                impact: 'Medium',
                budget: 0,
                startDate: new Date('2025-03-01')
            },
            {
                title: '2026 Budget: Resetting for Growth',
                description: 'A fiscal policy framework aiming for 4.8% GDP growth, focusing on job creation, economic transformation, and reducing the fiscal deficit to 4.0%.',
                category: 'Economy',
                status: 'Proposed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2025-11-13')
            }
        ]
    },
    // Samuel Nartey George (Communications)
    {
        ministerName: 'Samuel Nartey George (MP)',
        items: [
            {
                title: 'Dig Once Policy',
                description: 'A policy mandating the installation of fiber-optic conduits in all new road constructions to reduce fiber cuts, lower broadband costs, and accelerate 5G rollout.',
                category: 'Technology',
                status: 'Active',
                impact: 'High',
                budget: 25000000,
                startDate: new Date('2025-02-15')
            },
            {
                title: 'National Misinformation Bill',
                description: 'Legislation to combat the spread of false information and safeguard national security while protecting freedom of expression in the digital space.',
                category: 'Law',
                status: 'Proposed',
                impact: 'Medium',
                budget: 100000,
                startDate: new Date('2025-06-01')
            },
            {
                title: 'Broadcasting Policy Review',
                description: 'Modernizing Ghana\'s broadcasting legal framework to address digital convergence and regulate internet-based broadcasting alongside traditional media.',
                category: 'Technology',
                status: 'Active',
                impact: 'Medium',
                budget: 500000,
                startDate: new Date('2025-01-20')
            },
            {
                title: 'Promotion of Proper Human Sexual Rights Bill',
                description: 'A private member\'s bill advocating for the protection of traditional Ghanaian family values and the regulation of sexual rights.',
                category: 'Social',
                status: 'Active',
                impact: 'High',
                budget: 0,
                startDate: new Date('2021-08-02')
            }
        ]
    },
    // Haruna Iddrisu (Education)
    {
        ministerName: 'Haruna Iddrisu (MP)',
        items: [
            {
                title: 'No-Fees-Stress Policy',
                description: 'A policy providing free tuition for all first-year tertiary students to improve access to higher education and reduce the financial burden on families.',
                category: 'Education',
                status: 'Active',
                impact: 'High',
                budget: 45000000,
                startDate: new Date('2025-09-01')
            },
            {
                title: 'Free SHS Review & Reform',
                description: 'A comprehensive review of the Free Senior High School program to phase out the double-track system and improve infrastructure and food quality.',
                category: 'Education',
                status: 'Active',
                impact: 'High',
                budget: 15000000,
                startDate: new Date('2025-02-01')
            },
            {
                title: 'Legal Recognition for Colleges of Education',
                description: 'Legislation to grant full tertiary status and autonomy to Colleges of Education, enhancing their academic standards and governance.',
                category: 'Education',
                status: 'Proposed',
                impact: 'Medium',
                budget: 200000,
                startDate: new Date('2025-05-10')
            }
        ]
    },
    // John Abdulai Jinapor (Energy)
    {
        ministerName: 'John Abdulai Jinapor (MP)',
        items: [
            {
                title: 'Green Transition Framework',
                description: 'A strategic roadmap for decarbonizing Ghana\'s power and petroleum sectors, promoting energy efficiency and the adoption of alternative fuels.',
                category: 'Energy',
                status: 'Active',
                impact: 'High',
                budget: 8000000,
                startDate: new Date('2025-03-15')
            },
            {
                title: 'Renewable Energy Fund',
                description: 'Establishment of a dedicated fund to finance low-carbon infrastructure, solar projects for hospitals/schools, and local green technology innovation.',
                category: 'Energy',
                status: 'Active',
                impact: 'Medium',
                budget: 30000000,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Petroleum Hub Project',
                description: 'Development of a $60 billion petroleum hub in Jomoro, including refineries and petrochemical plants, to transform Ghana into a regional energy powerhouse.',
                category: 'Energy',
                status: 'Active',
                impact: 'High',
                budget: 60000000000,
                startDate: new Date('2025-01-10')
            }
        ]
    },
    // Jane Naana Opoku-Agyemang (Vice President)
    {
        ministerName: 'Jane Naana Opoku-Agyemang',
        items: [
            {
                title: 'Community Day Senior High Schools (E-Blocks)',
                description: 'Construction of 123 Community Day Senior High Schools across the country to expand access to secondary education in underserved areas.',
                category: 'Education',
                status: 'Completed',
                impact: 'High',
                budget: 200000000,
                startDate: new Date('2014-03-01'),
                endDate: new Date('2016-12-07')
            },
            {
                title: 'Conversion of Polytechnics to Technical Universities',
                description: 'Policy upgrading Polytechnics to Technical Universities to enhance technical and vocational education and training (TVET) in Ghana.',
                category: 'Education',
                status: 'Completed',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2013-06-01'),
                endDate: new Date('2016-09-01')
            }
        ]
    }
]

async function main() {
    console.log('🌱 Seeding real-world policies...')

    for (const group of policies) {
        const minister = await prisma.minister.findFirst({
            where: { fullName: group.ministerName }
        })

        if (!minister) {
            console.warn(`⚠️ Minister not found: ${group.ministerName}`)
            continue
        }

        console.log(`Processing policies for ${minister.fullName}...`)

        for (const item of group.items) {
            const existing = await prisma.policy.findFirst({
                where: {
                    title: item.title,
                    ministerId: minister.id
                }
            })

            if (!existing) {
                await prisma.policy.create({
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

    console.log('✅ Policy seeding completed.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
