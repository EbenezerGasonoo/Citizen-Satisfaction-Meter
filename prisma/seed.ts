import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

const ministers = [
  // Example template for local images:
  // {
  //   fullName: 'John Dramani Mahama',
  //   portfolio: 'President',
  //   photoUrl: '/uploads/john_mahama.jpg',
  //   bio: 'Bio here...',
  //   isTrending: false,
  // },
  {
    fullName: 'John Dramani Mahama',
    portfolio: 'President',
    photoUrl: '/uploads/john_mahama.jpg',
    bio: 'John Dramani Mahama is the President of Ghana since January 7, 2025. He previously served as President from 2012 to 2017 and has extensive experience in governance and international relations.',
    isTrending: false,
  },
  {
    fullName: 'Jane Naana Opoku-Agyemang',
    portfolio: 'Vice President',
    photoUrl: '/uploads/jane_naana_opoku_agyemang.jpg',
    bio: 'Professor Naana Jane Opoku-Agyemang is a distinguished academic, administrator, and public servant. She served as Chancellor of the Women\'s University in Africa (2018–2024) and was Ghana\'s first female Vice Chancellor, leading the University of Cape Coast (2008–2012). As Minister for Education (2013–2017), she implemented reforms to improve access and quality in Ghana\'s education sector.',
    isTrending: false,
  },
  
  // Sector Ministers
  {
    fullName: 'Cassiel Ato Forson (MP)',
    portfolio: 'Minister for Finance & Economic Planning',
    photoUrl: '/uploads/cassiel_ato_forson.jpg',
    bio: 'Born on August 5, 1978, in Ajumako Bisease, Ghana, Dr. Forson is a prominent Ghanaian politician affiliated with the National Democratic Congress (NDC). He has represented the Ajumako-Enyan-Esiam constituency in Parliament since 2009. He holds a PhD in Business and Management (Finance) from Kwame Nkrumah University of Science and Technology.',
    isTrending: true,
  },
  {
    fullName: 'Samuel Okudzeto Ablakwa (MP)',
    portfolio: 'Minister for Foreign Affairs',
    photoUrl: '/uploads/samuel_okudzeto_ablakwa.jpg',
    bio: 'Samuel Okudzeto Ablakwa is a Ghanaian politician and Member of Parliament for North Tongu constituency. He has served in various ministerial positions and is known for his advocacy work and parliamentary oversight.',
    isTrending: false,
  },
  {
    fullName: 'Mohammed Mubarak Muntaka (MP)',
    portfolio: 'Minister for Interior',
    photoUrl: '/uploads/mohammed_mubarak_muntaka.jpg',
    bio: 'Mohammed Mubarak Muntaka is a Ghanaian politician and Member of Parliament for Asawase constituency. He has served in various leadership positions in Parliament and government.',
    isTrending: false,
  },
  {
    fullName: 'Edward Omane Boamah',
    portfolio: 'Minister for Defence',
    photoUrl: '/uploads/edward_omane_boamah.jpg',
    bio: 'Edward Omane Boamah is a Ghanaian politician and former Minister for Communications. He has extensive experience in government communications and public administration.',
    isTrending: false,
  },
  {
    fullName: 'Dr Dominic Akuritinga Ayine (MP)',
    portfolio: 'Minister for Justice & Attorney General',
    photoUrl: '/uploads/dr_dominic_akuritinga_ayine.jpg',
    bio: 'Born on January 6, 1966, in Zuarungu, Upper East Region of Ghana, Dr. Ayine is a distinguished Ghanaian politician and legal expert. He represents the Bolgatanga East Constituency in Parliament under the National Democratic Congress (NDC) and has been serving since 2012. He holds a Doctor of the Science of Law (JSD) from Stanford University Law School.',
    isTrending: false,
  },
  {
    fullName: 'Haruna Iddrisu (MP)',
    portfolio: 'Minister for Education',
    photoUrl: '/uploads/haruna_iddrisu.jpg',
    bio: 'Born on September 8, 1970, in Tamale, Ghana, Iddrisu is a prominent Ghanaian lawyer and politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Tamale South constituency since January 2005. He earned a Bachelor of Arts (Honors) degree in Sociology from the University of Ghana.',
    isTrending: true,
  },
  {
    fullName: 'Eric Opoku (MP)',
    portfolio: 'Minister for Food & Agriculture',
    photoUrl: '/uploads/eric_opoku.jpg',
    bio: 'Born on June 5, 1970, in Sankore, Ahafo Region, Ghana, Opoku is a Ghanaian politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Asunafo South Constituency since 2004. He earned a Bachelor of Arts degree in Social Science from Kwame Nkrumah University of Science and Technology (KNUST).',
    isTrending: false,
  },
  {
    fullName: 'Emelia Arthur (MP)',
    portfolio: 'Minister for Fisheries & Aquaculture',
    photoUrl: '/uploads/emelia_arthur.jpg',
    bio: 'Emelia Arthur is a Ghanaian politician and development specialist with extensive experience in local governance, natural resource management, and gender inclusion. She has served as a Presidential Staffer, Deputy Western Regional Minister, and District Chief Executive. She has expressed concern over the decline of Ghana\'s marine and inland fisheries resources.',
    isTrending: false,
  },
  {
    fullName: 'Elizabeth Ofosu-Adjare (MP)',
    portfolio: 'Minister for Trade & Industry',
    photoUrl: '/uploads/elizabeth_ofosu_adjare.jpg',
    bio: 'Born on March 1, 1974, in Berekum, Ghana, Ofosu-Adjare is a distinguished Ghanaian lawyer, international relations expert, business executive, and politician. She is a member of the National Democratic Congress (NDC) and has served as the Member of Parliament for the Techiman North Constituency. In 2013, she was appointed as the Minister for Tourism, Culture, and Creative Arts.',
    isTrending: false,
  },
  {
    fullName: 'Kwabena Mintah Akandoh (MP)',
    portfolio: 'Minister for Health',
    photoUrl: '/uploads/kwabena_mintah_akandoh.jpg',
    bio: 'Kwabena Mintah Akandoh is a Ghanaian politician and Member of Parliament for Juaboso constituency. He has been actively involved in healthcare policy and parliamentary oversight of the health sector.',
    isTrending: false,
  },
  {
    fullName: 'Samuel Nartey George (MP)',
    portfolio: 'Minister for Communications, Digitisation & Innovations',
    photoUrl: '/uploads/samuel_nartey_george.jpg',
    bio: 'Samuel Nartey George is a Ghanaian politician and Member of Parliament for Ningo-Prampram constituency. He is known for his advocacy work on digital rights and technology policy.',
    isTrending: true,
  },
  {
    fullName: 'John Abdulai Jinapor (MP)',
    portfolio: 'Minister for Energy',
    photoUrl: '/uploads/john_abdulai_jinapor.jpg',
    bio: 'Born on June 8, 1979, in Buipe, Ghana, Jinapor is a prominent Ghanaian politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Yapei-Kusawgu constituency since 2017. He holds multiple degrees including an MBA in Marketing and a Master of Science in Energy Economics.',
    isTrending: true,
  },
  {
    fullName: 'Joseph Bukari Nikpe (MP)',
    portfolio: 'Minister for Transport',
    photoUrl: '/uploads/joseph_bukari_nikpe.jpg',
    bio: 'Joseph Bukari Nikpe is a Ghanaian politician and Member of Parliament. He has experience in transportation policy and infrastructure development.',
    isTrending: false,
  },
  {
    fullName: 'Kwame Governs Agbodza (MP)',
    portfolio: 'Minister for Roads & Highways',
    photoUrl: '/uploads/kwame_governs_agbodza.jpg',
    bio: 'Born on September 22, 1973, Agbodza is a Ghanaian architect and politician affiliated with the National Democratic Congress (NDC). Since 2013, he has represented the Adaklu Constituency in the Volta Region as a Member of Parliament. He is a Chartered Architect, holding memberships with both the Royal Institute of British Architects (RIBA) and the Ghana Institute of Architects (GIA).',
    isTrending: false,
  },
  {
    fullName: 'Emmanuel Armah Kofi Buah (MP)',
    portfolio: 'Minister for Lands & Natural Resources',
    photoUrl: '/uploads/emmanuel_armah_kofi_buah.jpg',
    bio: 'Emmanuel Armah Kofi Buah is a Ghanaian politician and Member of Parliament for Ellembelle constituency. He has served in various ministerial positions including Petroleum and Energy.',
    isTrending: false,
  },
  {
    fullName: 'Ibrahim Murtala Muhammed (MP)',
    portfolio: 'Minister for Environment, Science & Technology',
    photoUrl: '/uploads/ibrahim_murtala_muhammed.jpg',
    bio: 'Ibrahim Murtala Muhammed is a Ghanaian politician and Member of Parliament for Tamale Central constituency. He has been involved in environmental and technology policy development.',
    isTrending: false,
  },
  {
    fullName: 'Ahmed Ibrahim (MP)',
    portfolio: 'Minister for Local Government, Chieftaincy & Religious Affairs',
    photoUrl: '/uploads/ahmed_ibrahim.jpg',
    bio: 'Born on May 6, 1974, in Banda Ahenkro, Bono Region, Ghana, Ibrahim is a seasoned Ghanaian politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Banda Constituency since 2009. He holds a Bachelor of Arts degree in Political Science and Philosophy from the University of Ghana and an MBA in Finance from GIMPA.',
    isTrending: false,
  },
  {
    fullName: 'Dzifa Gomashie (MP)',
    portfolio: 'Minister for Tourism, Culture & Creative Arts',
    photoUrl: '/uploads/dzifa_gomashie.jpg',
    bio: 'Born on July 25, 1965, in Aflao, Volta Region, Ghana, Gomashie is a distinguished Ghanaian actress, producer, screenwriter, and politician. She pursued her education at St. Louis Senior High School in Kumasi and later obtained a diploma in Theatre Arts from the University of Ghana\'s Institute of African Studies. She served as the Deputy Minister of Tourism, Culture, and Creative Arts from 2013 to 2017.',
    isTrending: false,
  },
  {
    fullName: 'Abdul-Rashid Pelpuo (MP)',
    portfolio: 'Minister for Labour, Jobs & Employment',
    photoUrl: '/uploads/abdul_rashid_pelpuo.jpg',
    bio: 'Abdul-Rashid Pelpuo is a Ghanaian politician and Member of Parliament for Wa Central constituency. He has served in various ministerial positions and has experience in labor and employment policy.',
    isTrending: false,
  },
  {
    fullName: 'Kenneth Gilbert Adjei',
    portfolio: 'Minister for Works, Housing & Water Resources',
    photoUrl: '/uploads/kenneth_gilbert_adjei.jpg',
    bio: 'Kenneth Gilbert Adjei is a Ghanaian politician and public servant with experience in infrastructure development and housing policy.',
    isTrending: false,
  },
  {
    fullName: 'George Opare Addo',
    portfolio: 'Minister for Youth Development & Empowerment',
    photoUrl: '/uploads/george_opare_addo.jpg',
    bio: 'Born on October 27, 1975, in Akuapem North, Ghana, Opare Addo is a prominent Ghanaian lawyer, politician, and youth advocate. He began his education at Adisadel College and later earned a degree in Psychology and Philosophy from the University of Ghana. He served as the Municipal Chief Executive (MCE) for the Akuapem North Municipal Assembly from 2009 to 2017.',
    isTrending: false,
  },
  {
    fullName: 'Kofi Iddie Adams (MP)',
    portfolio: 'Minister for Sports & Recreation',
    photoUrl: '/uploads/kofi_iddie_adams.jpg',
    bio: 'Kofi Iddie Adams is a Ghanaian politician and Member of Parliament for Buem constituency. He has been involved in sports development and youth empowerment initiatives.',
    isTrending: false,
  },
  {
    fullName: 'Agnes Naa Momo Lartey (MP)',
    portfolio: 'Minister for Gender, Children & Social Protection',
    photoUrl: '/uploads/agnes_naa_momo_lartey.jpg',
    bio: 'Agnes Naa Momo Lartey is a Ghanaian politician and Member of Parliament. She has been involved in gender equality and social protection policy development.',
    isTrending: false,
  },
]

export async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data (order matters due to foreign key constraints)
  await prisma.actionVote.deleteMany();
  await prisma.policyVote.deleteMany();
  await prisma.vote.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.policy.deleteMany();
  await prisma.action.deleteMany();
  await prisma.minister.deleteMany();

  // Create ministers
  const createdMinisters = []
  for (const minister of ministers) {
    const created = await prisma.minister.create({ data: minister })
    createdMinisters.push(created)
  }

  console.log(`✅ Seeded ${ministers.length} ministers`)

  // Add sample policies for demonstration
  const samplePolicies = [
    // Cassiel Ato Forson (Finance)
    {
      ministerId: createdMinisters[2].id,
      title: 'Ghana Economic Recovery Plan',
      description: 'A comprehensive plan to stabilize the economy, reduce inflation, and create jobs.',
      category: 'Economic',
      status: 'Active',
      startDate: new Date('2025-01-15'),
      endDate: null,
      budget: 2000000000,
      impact: 'High',
    },
    {
      ministerId: createdMinisters[2].id,
      title: 'Public Sector Wage Reform',
      description: 'Restructuring public sector wages to ensure equity and fiscal sustainability.',
      category: 'Economic',
      status: 'Planned',
      startDate: new Date('2025-06-01'),
      endDate: null,
      budget: 500000000,
      impact: 'Medium',
    },
    // Haruna Iddrisu (Education)
    {
      ministerId: createdMinisters[7].id,
      title: 'Free Senior High School Expansion',
      description: 'Expanding the Free SHS program to cover more students and improve infrastructure.',
      category: 'Social',
      status: 'Active',
      startDate: new Date('2025-02-01'),
      endDate: null,
      budget: 800000000,
      impact: 'High',
    },
    {
      ministerId: createdMinisters[7].id,
      title: 'STEM Education Initiative',
      description: 'Promoting Science, Technology, Engineering, and Mathematics education nationwide.',
      category: 'Education',
      status: 'Planned',
      startDate: new Date('2025-09-01'),
      endDate: null,
      budget: 300000000,
      impact: 'Medium',
    },
  ]

  for (const policy of samplePolicies) {
    await prisma.policy.create({ data: policy })
  }

  console.log(`✅ Seeded ${samplePolicies.length} sample policies`)

  // Remove vote seeding so all ministers start with 0 votes
  // (Commented out)
  // for (const vote of sampleVotes) {
  //   await prisma.vote.create({ data: vote })
  // }

  // Create default admin user
  const adminEmail = 'admin@example.com'
  const adminPassword = 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      role: 'ADMIN',
      name: 'Admin User',
    },
  })

  // Seed sample actions if ministers exist
  if (createdMinisters.length > 0) {
    await prisma.action.createMany({
      data: [
        {
          title: 'Launch Free SHS',
          description: 'Implemented free Senior High School education nationwide.',
          status: 'Completed',
          date: new Date('2017-09-01'),
          impact: 'High',
          ministerId: createdMinisters[0].id,
        },
        {
          title: 'COVID-19 Response',
          description: 'Coordinated national COVID-19 response and relief.',
          status: 'Completed',
          date: new Date('2020-04-01'),
          impact: 'High',
          ministerId: createdMinisters[0].id,
        },
        {
          title: 'Planting for Food and Jobs',
          description: 'Rolled out agricultural support for farmers.',
          status: 'Active',
          date: new Date('2023-01-15'),
          impact: 'Medium',
          ministerId: createdMinisters[0].id,
        },
      ],
    });
    console.log('Seeded sample actions.');
  }

  console.log('🎉 Database seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 