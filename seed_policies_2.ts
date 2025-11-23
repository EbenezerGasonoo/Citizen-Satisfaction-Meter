import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const policies = [
    // John Dramani Mahama (President)
    {
        ministerName: 'John Dramani Mahama',
        items: [
            {
                title: 'Community Day Senior High Schools (E-Blocks)',
                description: 'A massive infrastructure drive to construct 200 Community Day Senior High Schools to improve access to secondary education in underserved areas.',
                category: 'Education',
                status: 'Completed',
                impact: 'High',
                budget: 900000000,
                startDate: new Date('2014-03-01'),
                endDate: new Date('2016-12-01')
            },
            {
                title: 'University of Ghana Medical Centre (UGMC)',
                description: 'Construction of a world-class quaternary medical center to reduce the need for Ghanaians to travel abroad for medical treatment.',
                category: 'Health',
                status: 'Completed',
                impact: 'High',
                budget: 217000000,
                startDate: new Date('2013-01-01'),
                endDate: new Date('2016-11-01')
            },
            {
                title: 'Circle Interchange (Dubai)',
                description: 'Transformation of the Kwame Nkrumah Circle into a three-tier interchange to decongest traffic and improve urban mobility in Accra.',
                category: 'Infrastructure',
                status: 'Completed',
                impact: 'High',
                budget: 74000000,
                startDate: new Date('2013-10-01'),
                endDate: new Date('2016-11-14')
            },
            {
                title: 'Atuabo Gas Processing Plant',
                description: 'Establishment of Ghana\'s first gas processing infrastructure to utilize natural gas for power generation, saving millions in fuel imports.',
                category: 'Energy',
                status: 'Completed',
                impact: 'High',
                budget: 1000000000,
                startDate: new Date('2012-04-01'),
                endDate: new Date('2015-09-16')
            }
        ]
    },
    // Samuel Okudzeto Ablakwa (Foreign Affairs - using MP/Education track record)
    {
        ministerName: 'Samuel Okudzeto Ablakwa (MP)',
        items: [
            {
                title: 'North Tongu Scholarship Scheme',
                description: 'A comprehensive scholarship program supporting hundreds of tertiary students in the North Tongu constituency to access higher education.',
                category: 'Education',
                status: 'Active',
                impact: 'High',
                budget: 500000,
                startDate: new Date('2013-01-01')
            },
            {
                title: 'Emergency Health Fund',
                description: 'A dedicated fund to support constituents with critical medical emergencies, ensuring financial constraints do not prevent access to life-saving care.',
                category: 'Health',
                status: 'Active',
                impact: 'High',
                budget: 200000,
                startDate: new Date('2014-01-01')
            },
            {
                title: 'Zongo Community Support Initiative',
                description: 'Targeted support for Zongo communities including educational scholarships and infrastructure improvements to enhance social inclusion.',
                category: 'Social',
                status: 'Active',
                impact: 'Medium',
                budget: 150000,
                startDate: new Date('2015-06-01')
            }
        ]
    },
    // Mohammed Mubarak Muntaka (Interior)
    {
        ministerName: 'Mohammed Mubarak Muntaka (MP)',
        items: [
            {
                title: 'Marine Police Unit Expansion',
                description: 'Procurement and commissioning of new patrol boats to strengthen the Marine Police Unit\'s capacity to combat maritime crimes.',
                category: 'Security',
                status: 'Active',
                impact: 'Medium',
                budget: 5000000,
                startDate: new Date('2025-03-01')
            },
            {
                title: 'Prison Industrialization Program',
                description: 'An initiative to equip prisons with industrial workshops to train inmates in employable skills and generate revenue for the service.',
                category: 'Security',
                status: 'Proposed',
                impact: 'Medium',
                budget: 2000000,
                startDate: new Date('2025-06-01')
            },
            {
                title: 'Parole Bill Advocacy',
                description: 'Championing the passage of a Parole Bill to decongest prisons and facilitate the reintegration of reformed inmates into society.',
                category: 'Law',
                status: 'Proposed',
                impact: 'High',
                budget: 100000,
                startDate: new Date('2025-02-01')
            }
        ]
    },
    // Dr Dominic Akuritinga Ayine (Justice)
    {
        ministerName: 'Dr Dominic Akuritinga Ayine (MP)',
        items: [
            {
                title: 'Legal Aid Reform',
                description: 'Restructuring the Legal Aid Scheme to improve access to justice for the poor and vulnerable, ensuring fair representation for all citizens.',
                category: 'Law',
                status: 'Active',
                impact: 'High',
                budget: 3000000,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Adwumawura Initiative',
                description: 'A youth entrepreneurship program aimed at equipping young people with digital skills and business support to reduce unemployment.',
                category: 'Economy',
                status: 'Active',
                impact: 'Medium',
                budget: 1500000,
                startDate: new Date('2025-05-01')
            },
            {
                title: 'Anti-Corruption Framework Strengthening',
                description: 'Enhancing the legal framework and institutional capacity to combat corruption and ensure accountability in public office.',
                category: 'Law',
                status: 'Active',
                impact: 'High',
                budget: 1000000,
                startDate: new Date('2025-02-15')
            }
        ]
    },
    // Eric Opoku (Food & Agriculture)
    {
        ministerName: 'Eric Opoku (MP)',
        items: [
            {
                title: 'Cocoa Price Enhancement',
                description: 'Policy ensuring cocoa farmers receive at least 70% of the world market price (FOB) to improve their livelihoods and sustain the industry.',
                category: 'Agriculture',
                status: 'Active',
                impact: 'High',
                budget: 0,
                startDate: new Date('2025-10-01')
            },
            {
                title: 'Feed Ghana Programme',
                description: 'A national food security initiative promoting community-led farming in schools, churches, and institutions to boost local food production.',
                category: 'Agriculture',
                status: 'Active',
                impact: 'High',
                budget: 10000000,
                startDate: new Date('2025-03-01')
            },
            {
                title: 'Irrigation Development Project',
                description: 'Rehabilitation of irrigation facilities and development of new schemes funded by the EU to promote all-year-round farming.',
                category: 'Agriculture',
                status: 'Active',
                impact: 'High',
                budget: 47000000,
                startDate: new Date('2025-06-01')
            }
        ]
    },
    // Emelia Arthur (Fisheries)
    {
        ministerName: 'Emelia Arthur (MP)',
        items: [
            {
                title: 'Blue Economy Initiative',
                description: 'A strategic framework to sustainably harness Ghana\'s marine and freshwater resources for economic growth while preserving the ecosystem.',
                category: 'Economy',
                status: 'Proposed',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Premix Fuel Distribution Reform',
                description: 'Direct delivery of premix fuel to landing beaches to eliminate diversion, reduce corruption, and ensure availability for fisherfolk.',
                category: 'Energy',
                status: 'Active',
                impact: 'High',
                budget: 2000000,
                startDate: new Date('2025-02-01')
            },
            {
                title: 'Aquaculture Development Fund',
                description: 'Establishment of a fund to support fish farmers with credit, feed, and technical assistance to bridge the fish supply deficit.',
                category: 'Agriculture',
                status: 'Proposed',
                impact: 'Medium',
                budget: 8000000,
                startDate: new Date('2025-07-01')
            }
        ]
    },
    // Elizabeth Ofosu-Adjare (Trade - using Tourism track record)
    {
        ministerName: 'Elizabeth Ofosu-Adjare (MP)',
        items: [
            {
                title: 'ExploreGhana Project',
                description: 'A domestic tourism drive to encourage Ghanaians to visit local attractions, boosting the local economy and fostering national pride.',
                category: 'Tourism',
                status: 'Completed',
                impact: 'Medium',
                budget: 1000000,
                startDate: new Date('2014-01-01'),
                endDate: new Date('2016-12-31')
            },
            {
                title: 'Tourism Levy Secretariat',
                description: 'Establishment of a dedicated secretariat to manage the 1% Tourism Levy, ensuring funds are effectively used for sector development.',
                category: 'Economy',
                status: 'Completed',
                impact: 'High',
                budget: 500000,
                startDate: new Date('2013-06-01'),
                endDate: new Date('2016-12-31')
            },
            {
                title: 'Film Bill (Creative Arts)',
                description: 'Passage of the Film Bill to provide a modern legal framework for the film industry, replacing the outdated 1961 Act.',
                category: 'Arts',
                status: 'Completed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2016-01-01'),
                endDate: new Date('2016-12-01')
            }
        ]
    },
    // Kwabena Mintah Akandoh (Health)
    {
        ministerName: 'Kwabena Mintah Akandoh (MP)',
        items: [
            {
                title: 'Agenda 111 Completion Oversight',
                description: 'Accelerated completion of the Agenda 111 hospital projects to ensure every district has a modern district hospital.',
                category: 'Health',
                status: 'Active',
                impact: 'High',
                budget: 500000000,
                startDate: new Date('2025-02-01')
            },
            {
                title: '24-Hour Health Training Call Center',
                description: 'Establishment of a dedicated call center to address inquiries and issues from health training institutions and students.',
                category: 'Health',
                status: 'Active',
                impact: 'Low',
                budget: 500000,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Pharmaceutical Hub Strategy',
                description: 'Policies to promote local pharmaceutical manufacturing and position Ghana as a hub for medicine production in West Africa.',
                category: 'Health',
                status: 'Proposed',
                impact: 'High',
                budget: 20000000,
                startDate: new Date('2025-06-01')
            }
        ]
    },
    // Joseph Bukari Nikpe (Transport)
    {
        ministerName: 'Joseph Bukari Nikpe (MP)',
        items: [
            {
                title: 'Transport Sector Stabilization',
                description: 'Emergency measures to clear outstanding debts to contractors and resume stalled transport infrastructure projects.',
                category: 'Infrastructure',
                status: 'Active',
                impact: 'High',
                budget: 50000000,
                startDate: new Date('2025-02-15')
            },
            {
                title: 'Accra-Toronto Direct Flight',
                description: 'Facilitating the launch of direct flights between Accra and Toronto to improve connectivity for the diaspora and boost tourism.',
                category: 'Transport',
                status: 'Proposed',
                impact: 'Medium',
                budget: 0,
                startDate: new Date('2025-05-01')
            },
            {
                title: 'Railway Revitalization Plan',
                description: 'A comprehensive plan to revive the railway sector, addressing worker salaries and rehabilitating key rail lines.',
                category: 'Transport',
                status: 'Proposed',
                impact: 'High',
                budget: 100000000,
                startDate: new Date('2025-08-01')
            }
        ]
    },
    // Kwame Governs Agbodza (Roads)
    {
        ministerName: 'Kwame Governs Agbodza (MP)',
        items: [
            {
                title: 'The Big Push (Roads)',
                description: 'A massive GH¢13.85 billion investment program to construct and rehabilitate critical road networks across all regions.',
                category: 'Infrastructure',
                status: 'Active',
                impact: 'High',
                budget: 13850000000,
                startDate: new Date('2025-01-15')
            },
            {
                title: 'Road Fund Reform',
                description: 'Restructuring the Road Fund to ensure sustainable financing for road maintenance and prevent accumulation of arrears.',
                category: 'Infrastructure',
                status: 'Proposed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Automated Toll Collection',
                description: 'Reintroduction of road tolls with a fully automated digital collection system to reduce congestion and leakage.',
                category: 'Infrastructure',
                status: 'Proposed',
                impact: 'Medium',
                budget: 15000000,
                startDate: new Date('2025-07-01')
            }
        ]
    },
    // Emmanuel Armah Kofi Buah (Lands - using Energy track record)
    {
        ministerName: 'Emmanuel Armah Kofi Buah (MP)',
        items: [
            {
                title: 'Local Content Regulations (L.I. 2204)',
                description: 'Legislation mandating local participation in the oil and gas sector, ensuring Ghanaians benefit from the nation\'s resources.',
                category: 'Energy',
                status: 'Completed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2013-11-01'),
                endDate: new Date('2016-12-01')
            },
            {
                title: 'Petroleum Revenue Management Act',
                description: 'A robust legal framework to manage oil revenues transparently and accountably for the benefit of current and future generations.',
                category: 'Energy',
                status: 'Completed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2011-01-01'),
                endDate: new Date('2016-12-01')
            },
            {
                title: 'Ghana Gas Establishment',
                description: 'Founding of the Ghana National Gas Company to develop the nation\'s gas infrastructure and monetize natural gas resources.',
                category: 'Energy',
                status: 'Completed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2011-07-01'),
                endDate: new Date('2016-12-01')
            }
        ]
    },
    // Ahmed Ibrahim (Local Gov)
    {
        ministerName: 'Ahmed Ibrahim (MP)',
        items: [
            {
                title: 'Bandaman Fish Market Project',
                description: 'Construction of a modern fish market in Banda to boost local economic activity and provide better facilities for traders.',
                category: 'Economy',
                status: 'Active',
                impact: 'Medium',
                budget: 1000000,
                startDate: new Date('2024-01-01')
            },
            {
                title: 'District Economic Empowerment',
                description: 'Policy to empower District Assemblies to leverage local resources for economic development and job creation.',
                category: 'Economy',
                status: 'Proposed',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2025-05-01')
            },
            {
                title: 'MP-DCE Coordination Framework',
                description: 'A framework to improve collaboration between MPs and District Chief Executives to enhance grassroots governance and development.',
                category: 'Politics',
                status: 'Active',
                impact: 'Medium',
                budget: 0,
                startDate: new Date('2025-02-01')
            }
        ]
    },
    // Dzifa Gomashie (Tourism)
    {
        ministerName: 'Dzifa Gomashie (MP)',
        items: [
            {
                title: 'Creative Arts Industry Bill',
                description: 'Laying the legislative groundwork for the establishment of the Creative Arts Agency to regulate and support the industry.',
                category: 'Arts',
                status: 'Completed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2014-01-01'),
                endDate: new Date('2016-12-01')
            },
            {
                title: 'Ghana Culture Policy',
                description: 'Development of a comprehensive national culture policy to preserve heritage and promote cultural industries.',
                category: 'Culture',
                status: 'Completed',
                impact: 'Medium',
                budget: 0,
                startDate: new Date('2013-06-01'),
                endDate: new Date('2016-12-01')
            },
            {
                title: 'Values for Life Initiative',
                description: 'A community-based program promoting tourism, arts, and culture among youth to preserve traditional heritage.',
                category: 'Culture',
                status: 'Active',
                impact: 'Medium',
                budget: 500000,
                startDate: new Date('2010-01-01')
            }
        ]
    },
    // Abdul-Rashid Pelpuo (Labour)
    {
        ministerName: 'Abdul-Rashid Pelpuo (MP)',
        items: [
            {
                title: 'Labour Market Information System',
                description: 'Development of a digital database to provide real-time information on job openings and labor market trends.',
                category: 'Economy',
                status: 'Proposed',
                impact: 'High',
                budget: 2000000,
                startDate: new Date('2025-06-01')
            },
            {
                title: 'Graduate Placement Programme',
                description: 'A structured program to facilitate the placement of graduates into internships and permanent jobs in the public and private sectors.',
                category: 'Economy',
                status: 'Proposed',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2025-07-01')
            },
            {
                title: 'FIFA U-20 World Cup Victory (Sports)',
                description: 'Oversaw the historic victory of the Black Satellites at the 2009 FIFA U-20 World Cup as Minister for Youth and Sports.',
                category: 'Sports',
                status: 'Completed',
                impact: 'High',
                budget: 0,
                startDate: new Date('2009-09-01'),
                endDate: new Date('2009-10-16')
            }
        ]
    },
    // Kenneth Gilbert Adjei (Works & Housing)
    {
        ministerName: 'Kenneth Gilbert Adjei',
        items: [
            {
                title: 'District Housing Policy',
                description: 'Initiative to construct affordable housing units in districts to encourage professionals to accept rural postings.',
                category: 'Infrastructure',
                status: 'Proposed',
                impact: 'High',
                budget: 50000000,
                startDate: new Date('2025-05-01')
            },
            {
                title: 'Saglemi Housing Completion Plan',
                description: 'A roadmap to complete the stalled Saglemi Housing Project through private sector partnership to reduce the housing deficit.',
                category: 'Infrastructure',
                status: 'Active',
                impact: 'High',
                budget: 100000000,
                startDate: new Date('2025-03-01')
            },
            {
                title: 'National Homeownership Fund Scale-up',
                description: 'Expansion of the Homeownership Fund to provide low-interest mortgages and rent-to-own schemes for public servants.',
                category: 'Economy',
                status: 'Active',
                impact: 'High',
                budget: 20000000,
                startDate: new Date('2025-04-01')
            }
        ]
    },
    // George Opare Addo (Youth)
    {
        ministerName: 'George Opare Addo',
        items: [
            {
                title: 'National Apprenticeship Programme',
                description: 'A nationwide program to provide vocational skills training and startup kits to unemployed youth.',
                category: 'Education',
                status: 'Active',
                impact: 'High',
                budget: 15000000,
                startDate: new Date('2025-03-01')
            },
            {
                title: 'Digital Skills for Youth',
                description: 'Training program to equip 100,000 youth with digital skills in coding, marketing, and design to enhance employability.',
                category: 'Technology',
                status: 'Active',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Youth in Agriculture Support',
                description: 'Providing incentives, land, and inputs to encourage youth participation in modern agriculture.',
                category: 'Agriculture',
                status: 'Proposed',
                impact: 'Medium',
                budget: 8000000,
                startDate: new Date('2025-06-01')
            }
        ]
    },
    // Kofi Iddie Adams (Sports)
    {
        ministerName: 'Kofi Iddie Adams (MP)',
        items: [
            {
                title: 'Sports Infrastructure Development',
                description: 'Plan to upgrade regional sports stadiums and build community sports complexes to nurture talent.',
                category: 'Sports',
                status: 'Proposed',
                impact: 'High',
                budget: 25000000,
                startDate: new Date('2025-07-01')
            },
            {
                title: 'WASH for Sports Initiative',
                description: 'Project ensuring all sports facilities have adequate Water, Sanitation, and Hygiene (WASH) infrastructure.',
                category: 'Health',
                status: 'Active',
                impact: 'Medium',
                budget: 2000000,
                startDate: new Date('2025-05-01')
            },
            {
                title: 'Buem Community Sports Complex',
                description: 'Construction of a multi-purpose sports complex in the Buem constituency to serve as a model for community sports development.',
                category: 'Sports',
                status: 'Proposed',
                impact: 'Medium',
                budget: 1500000,
                startDate: new Date('2025-08-01')
            }
        ]
    },
    // Agnes Naa Momo Lartey (Gender)
    {
        ministerName: 'Agnes Naa Momo Lartey (MP)',
        items: [
            {
                title: 'Women\'s Economic Empowerment Fund',
                description: 'Provision of seed capital and interest-free loans to women-owned small businesses and market traders.',
                category: 'Economy',
                status: 'Active',
                impact: 'High',
                budget: 5000000,
                startDate: new Date('2025-03-01')
            },
            {
                title: 'Vulnerable Groups Support Programme',
                description: 'Social protection initiative providing food, healthcare, and educational support to orphans, widows, and persons with disabilities.',
                category: 'Social',
                status: 'Active',
                impact: 'High',
                budget: 3000000,
                startDate: new Date('2025-04-01')
            },
            {
                title: 'Coastal Community Development',
                description: 'Targeted interventions to improve livelihoods and infrastructure in coastal fishing communities.',
                category: 'Social',
                status: 'Proposed',
                impact: 'Medium',
                budget: 4000000,
                startDate: new Date('2025-06-01')
            }
        ]
    }
]

async function main() {
    console.log('🌱 Seeding remaining real-world policies...')

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

    console.log('✅ Remaining policy seeding completed.')
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
