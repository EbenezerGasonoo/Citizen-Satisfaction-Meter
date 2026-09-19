import { prisma } from '../src/lib/prisma';

interface NewsAction {
  ministerId: number;
  title: string;
  description: string;
  impact: 'High' | 'Medium';
  date: Date;
  status: string;
}

const newsActions: NewsAction[] = [
  {
    ministerId: 1, // John Dramani Mahama
    title: '24-Hour Economy & Administrative Cost Rationalization',
    description: 'Directed government-wide implementation of the 24-hour economy framework, reducing non-essential expenditure and fast-tracking industrial incentives.',
    impact: 'High',
    date: new Date('2026-09-15T09:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 2, // Jane Naana Opoku-Agyemang
    title: "National Women's Development Bank Rollout",
    description: 'Unveiled the operational roadmap for the dedicated Women’s Development Bank to provide low-interest credit to women-led enterprises and smallholder farmers.',
    impact: 'High',
    date: new Date('2026-09-14T10:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 3, // Cassiel Ato Forson
    title: 'Fiscal Reset, Debt Restructuring & Currency Stabilization',
    description: 'Announced quarterly macroeconomic reset performance, holding budget deficit targets and engaging multilateral partners for sustainable debt reduction.',
    impact: 'High',
    date: new Date('2026-09-18T14:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 4, // Samuel Okudzeto Ablakwa
    title: '24-Hour Passport Processing & Clearing 40,000 Backlog',
    description: 'Cleared over 40,000 passport backlogs with new biometric chip-embedded booklets and launched a digital portal for consular support for Ghanaians abroad.',
    impact: 'High',
    date: new Date('2026-09-16T11:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 5, // Mohammed Mubarak Muntaka
    title: 'Nationwide Police Patrol Boost & Firearm Amnesty Enforcement',
    description: 'Dealt heavily with armed robbery hot-spots through reinforced highway patrols and extended the surrender period for unregistered firearms.',
    impact: 'High',
    date: new Date('2026-09-12T08:30:00Z'),
    status: 'Active'
  },
  {
    ministerId: 6, // Dr Dominic Akuritinga Ayine
    title: 'Criminal Procedure Code Amendments & Bail Reform Bill',
    description: 'Laid reform bills in Parliament to prevent excessive pre-trial detention, expand the Legal Aid Commission, and strengthen public anti-graft prosecutions.',
    impact: 'High',
    date: new Date('2026-09-10T12:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 7, // Haruna Iddrisu
    title: 'Over 130,000 Enrolled on "No-Fee-Stress" Tertiary Portal',
    description: 'Reported milestone uptake on the government fee waiver platform, while commencing the infrastructural upgrade of Category B and C Senior High Schools.',
    impact: 'High',
    date: new Date('2026-09-17T10:30:00Z'),
    status: 'Active'
  },
  {
    ministerId: 8, // Eric Opoku
    title: 'National Strategic Grain Reserve & Fertilizer Price Cap',
    description: 'Released strategic grain reserves to stabilize staple food prices and rolled out subsidized fertilizer vouchers to commercial and smallholder farmers.',
    impact: 'High',
    date: new Date('2026-09-11T09:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 9, // Emelia Arthur
    title: 'EU Yellow Card Lifting Roadmap & Closed Season Support',
    description: 'Enforced strict automated vessel monitoring against illegal trawler fishing and distributed relief packages to coastal fishing communities during the breeding pause.',
    impact: 'High',
    date: new Date('2026-09-08T15:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 10, // Elizabeth Ofosu-Adjare
    title: 'AfCFTA Export Facilitation Hubs & SME Credit Guarantee',
    description: 'Opened regional trade assistance centres to assist Ghanaian manufacturers in exporting duty-free under AfCFTA and expanded local agro-processing grants.',
    impact: 'High',
    date: new Date('2026-09-09T13:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 11, // Kwabena Mintah Akandoh
    title: 'NHIS Drug Arrears Clearance & Hospital Diagnostic Modernization',
    description: 'Cleared legacy health insurance debts owed to pharmaceutical providers and oversaw the delivery of state-of-the-art diagnostic machinery to regional hospitals.',
    impact: 'High',
    date: new Date('2026-09-16T16:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 12, // Samuel Nartey George
    title: 'Telco Service Quality Ultimatum & Data Bundle Price Review',
    description: 'Mandated Mobile Network Operators to compensate consumers for network outages and high tariffs, while expanding nationwide 4G/5G rural digital access.',
    impact: 'High',
    date: new Date('2026-09-19T09:30:00Z'),
    status: 'Active'
  },
  {
    ministerId: 13, // John Abdulai Jinapor
    title: 'Grid Power Stabilization & $250M Solar Clean Energy Fund',
    description: 'Successfully maintained continuous power supply nationwide, renegotiated costly power purchase agreements, and launched a $250M green energy solar fund.',
    impact: 'High',
    date: new Date('2026-09-18T11:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 14, // Joseph Bukari Nikpe
    title: 'First Fleet of 100 Electric City Buses Deployed',
    description: 'Rolled out zero-emission electric buses for public transit in Greater Accra and Kumasi metropolitan areas, curbing commuter transport costs.',
    impact: 'High',
    date: new Date('2026-09-07T10:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 15, // Kwame Governs Agbodza
    title: 'Accra-Kumasi Highway Dualization & National Road Rescue',
    description: 'Mobilized nationwide emergency road crews to patch rain-damaged arterial roads and accelerated construction works on the Accra-Kumasi dual-carriage corridor.',
    impact: 'High',
    date: new Date('2026-09-17T15:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 16, // Emmanuel Armah Kofi Buah
    title: 'Responsible Community Mining Zones & River Basin Protection',
    description: 'Re-demarcated environmentally sustainable community mining zones and enforced an outright ban on mechanized excavation within 100m of all major river basins.',
    impact: 'High',
    date: new Date('2026-09-13T14:30:00Z'),
    status: 'Active'
  },
  {
    ministerId: 17, // Ahmed Ibrahim
    title: 'Saglemi & Pokuase Affordable Housing Project Resumption',
    description: 'Signed public-private partnership agreements to complete over 4,000 stalled affordable housing units and expand urban pipe-borne water mains.',
    impact: 'High',
    date: new Date('2026-09-16T12:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 18, // Dzifa Gomashie
    title: 'Digital Copyright Royalty Platform & Heritage Tourism Drive',
    description: 'Launched an automated digital tracking platform for creative arts royalties and kicked off the Destination Ghana diaspora cultural tourism campaign.',
    impact: 'High',
    date: new Date('2026-09-06T11:30:00Z'),
    status: 'Active'
  },
  {
    ministerId: 19, // Abdul-Rashid Pelpuo
    title: 'National Tripartite Minimum Wage Consensus & Pension Overhaul',
    description: 'Concluded negotiations with organized labour for an upward adjustment of the daily minimum wage and resolved pending Tier-2 pension fund remittances.',
    impact: 'High',
    date: new Date('2026-09-14T14:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 20, // Kenneth Gilbert Adjei
    title: 'Sworn In as Defence Minister & Northern Border Counter-Threat Readiness',
    description: 'Assumed substantive leadership of the Defence Ministry following vetting, conducting high-level troop inspections along northern frontier border posts.',
    impact: 'High',
    date: new Date('2026-08-30T10:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 21, // George Opare Addo
    title: 'National Youth Apprenticeship & Tech Startup Grant Rollout',
    description: 'Disbursed capital seed funding to 1,200 young Ghanaian tech founders and launched nationwide technical apprenticeship training centers.',
    impact: 'High',
    date: new Date('2026-09-10T15:30:00Z'),
    status: 'Active'
  },
  {
    ministerId: 22, // Kofi Iddie Adams
    title: 'National Stadium Upgrades & Regional Sports Academies',
    description: 'Initiated comprehensive refurbishment of national stadiums in Accra and Kumasi to meet CAF standards and established regional youth sports talent hubs.',
    impact: 'High',
    date: new Date('2026-09-05T09:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 23, // Agnes Naa Momo Lartey
    title: 'Affirmative Action Act Enforcement & LEAP Grant Expansion',
    description: 'Inaugurated the implementation committee for the 30% gender quota in public appointments and scaled cash transfer payouts to over 350,000 vulnerable families.',
    impact: 'High',
    date: new Date('2026-09-12T11:00:00Z'),
    status: 'Active'
  },
  {
    ministerId: 27, // Dr Zanetor Agyeman-Rawlings
    title: 'Sworn In as Environment Minister & Launch of River Basin Taskforce',
    description: 'Took office with presidential mandate to coordinate a multi-sectoral scientific taskforce to restore heavily silted water bodies and enforce strict industrial waste standards.',
    impact: 'High',
    date: new Date('2026-08-29T10:00:00Z'),
    status: 'Active'
  }
];

// Top newsmakers to highlight as trending
const trendingMinisterIds = [12, 3, 7, 13, 27, 20];

async function main() {
  console.log('🚀 Updating "Why They Are In The News" for all 24 ministers...\n');

  for (const item of newsActions) {
    // Check if minister exists
    const minister = await prisma.minister.findUnique({
      where: { id: item.ministerId }
    });

    if (!minister) {
      console.warn(`⚠️ Minister with ID #${item.ministerId} not found. Skipping.`);
      continue;
    }

    // Insert the new headline action
    const action = await prisma.action.create({
      data: {
        ministerId: item.ministerId,
        title: item.title,
        description: item.description,
        impact: item.impact,
        date: item.date,
        status: item.status
      }
    });

    console.log(`✅ [#${minister.id}] ${minister.fullName}`);
    console.log(`   Headline: "${action.title}"`);
    console.log(`   Date: ${action.date.toISOString().slice(0, 10)}`);
  }

  // Set isTrending flag on top newsmakers
  await prisma.minister.updateMany({
    data: { isTrending: false }
  });

  for (const tid of trendingMinisterIds) {
    await prisma.minister.update({
      where: { id: tid },
      data: { isTrending: true }
    });
  }

  console.log(`\n🔥 Set ${trendingMinisterIds.length} top newsmakers as Trending (IDs: ${trendingMinisterIds.join(', ')})`);

  await prisma.$disconnect();
}

main().catch(console.error);
