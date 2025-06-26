import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const ministers = [
  // Executive Leadership
  {
    fullName: 'John Dramani Mahama',
    portfolio: 'President',
    photoUrl: 'https://johnmahama.org/photos/shares/news/IMG_0451.jpeg',
    bio: 'John Dramani Mahama is the President of Ghana since January 7, 2025. He previously served as President from 2012 to 2017 and has extensive experience in governance and international relations.',
    isTrending: false,
  },
  {
    fullName: 'Jane Naana Opoku-Agyemang',
    portfolio: 'Vice President',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/1/1f/Jane_Naana_Opoku-Agyemang.jpg',
    bio: 'Professor Naana Jane Opoku-Agyemang is a distinguished academic, administrator, and public servant. She served as Chancellor of the Women\'s University in Africa (2018–2024) and was Ghana\'s first female Vice Chancellor, leading the University of Cape Coast (2008–2012). As Minister for Education (2013–2017), she implemented reforms to improve access and quality in Ghana\'s education sector.',
    isTrending: false,
  },
  
  // Sector Ministers
  {
    fullName: 'Cassiel Ato Forson (MP)',
    portfolio: 'Minister for Finance & Economic Planning',
    photoUrl: 'https://presidency.gov.gh/wp-content/uploads/2025/01/image-medium-4.jpg',
    bio: 'Born on August 5, 1978, in Ajumako Bisease, Ghana, Dr. Forson is a prominent Ghanaian politician affiliated with the National Democratic Congress (NDC). He has represented the Ajumako-Enyan-Esiam constituency in Parliament since 2009. He holds a PhD in Business and Management (Finance) from Kwame Nkrumah University of Science and Technology.',
    isTrending: true,
  },
  {
    fullName: 'Samuel Okudzeto Ablakwa (MP)',
    portfolio: 'Minister for Foreign Affairs',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Samuel Okudzeto Ablakwa is a Ghanaian politician and Member of Parliament for North Tongu constituency. He has served in various ministerial positions and is known for his advocacy work and parliamentary oversight.',
    isTrending: false,
  },
  {
    fullName: 'Mohammed Mubarak Muntaka (MP)',
    portfolio: 'Minister for Interior',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Mohammed Mubarak Muntaka is a Ghanaian politician and Member of Parliament for Asawase constituency. He has served in various leadership positions in Parliament and government.',
    isTrending: false,
  },
  {
    fullName: 'Edward Omane Boamah',
    portfolio: 'Minister for Defence',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Edward Omane Boamah is a Ghanaian politician and former Minister for Communications. He has extensive experience in government communications and public administration.',
    isTrending: false,
  },
  {
    fullName: 'Dr Dominic Akuritinga Ayine (MP)',
    portfolio: 'Minister for Justice & Attorney General',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on January 6, 1966, in Zuarungu, Upper East Region of Ghana, Dr. Ayine is a distinguished Ghanaian politician and legal expert. He represents the Bolgatanga East Constituency in Parliament under the National Democratic Congress (NDC) and has been serving since 2012. He holds a Doctor of the Science of Law (JSD) from Stanford University Law School.',
    isTrending: false,
  },
  {
    fullName: 'Haruna Iddrisu (MP)',
    portfolio: 'Minister for Education',
    photoUrl: 'https://presidency.gov.gh/wp-content/uploads/2025/01/4.-Haruna-Iddrisu.png',
    bio: 'Born on September 8, 1970, in Tamale, Ghana, Iddrisu is a prominent Ghanaian lawyer and politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Tamale South constituency since January 2005. He earned a Bachelor of Arts (Honors) degree in Sociology from the University of Ghana.',
    isTrending: true,
  },
  {
    fullName: 'Eric Opoku (MP)',
    portfolio: 'Minister for Food & Agriculture',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on June 5, 1970, in Sankore, Ahafo Region, Ghana, Opoku is a Ghanaian politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Asunafo South Constituency since 2004. He earned a Bachelor of Arts degree in Social Science from Kwame Nkrumah University of Science and Technology (KNUST).',
    isTrending: false,
  },
  {
    fullName: 'Emelia Arthur (MP)',
    portfolio: 'Minister for Fisheries & Aquaculture',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Emelia Arthur is a Ghanaian politician and development specialist with extensive experience in local governance, natural resource management, and gender inclusion. She has served as a Presidential Staffer, Deputy Western Regional Minister, and District Chief Executive. She has expressed concern over the decline of Ghana\'s marine and inland fisheries resources.',
    isTrending: false,
  },
  {
    fullName: 'Elizabeth Ofosu-Adjare (MP)',
    portfolio: 'Minister for Trade & Industry',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on March 1, 1974, in Berekum, Ghana, Ofosu-Adjare is a distinguished Ghanaian lawyer, international relations expert, business executive, and politician. She is a member of the National Democratic Congress (NDC) and has served as the Member of Parliament for the Techiman North Constituency. In 2013, she was appointed as the Minister for Tourism, Culture, and Creative Arts.',
    isTrending: false,
  },
  {
    fullName: 'Kwabena Mintah Akandoh (MP)',
    portfolio: 'Minister for Health',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Kwabena Mintah Akandoh is a Ghanaian politician and Member of Parliament for Juaboso constituency. He has been actively involved in healthcare policy and parliamentary oversight of the health sector.',
    isTrending: false,
  },
  {
    fullName: 'Samuel Nartey George (MP)',
    portfolio: 'Minister for Communications, Digitisation & Innovations',
    photoUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/SAMUEL_NARTEY_GEORGE.jpg/250px-SAMUEL_NARTEY_GEORGE.jpg',
    bio: 'Samuel Nartey George is a Ghanaian politician and Member of Parliament for Ningo-Prampram constituency. He is known for his advocacy work on digital rights and technology policy.',
    isTrending: true,
  },
  {
    fullName: 'John Abdulai Jinapor (MP)',
    portfolio: 'Minister for Energy',
    photoUrl: 'https://presidency.gov.gh/wp-content/uploads/2025/01/image-medium-5.jpg',
    bio: 'Born on June 8, 1979, in Buipe, Ghana, Jinapor is a prominent Ghanaian politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Yapei-Kusawgu constituency since 2017. He holds multiple degrees including an MBA in Marketing and a Master of Science in Energy Economics.',
    isTrending: true,
  },
  {
    fullName: 'Joseph Bukari Nikpe (MP)',
    portfolio: 'Minister for Transport',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: 'Joseph Bukari Nikpe is a Ghanaian politician and Member of Parliament. He has experience in transportation policy and infrastructure development.',
    isTrending: false,
  },
  {
    fullName: 'Kwame Governs Agbodza (MP)',
    portfolio: 'Minister for Roads & Highways',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on September 22, 1973, Agbodza is a Ghanaian architect and politician affiliated with the National Democratic Congress (NDC). Since 2013, he has represented the Adaklu Constituency in the Volta Region as a Member of Parliament. He is a Chartered Architect, holding memberships with both the Royal Institute of British Architects (RIBA) and the Ghana Institute of Architects (GIA).',
    isTrending: false,
  },
  {
    fullName: 'Emmanuel Armah Kofi Buah (MP)',
    portfolio: 'Minister for Lands & Natural Resources',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Emmanuel Armah Kofi Buah is a Ghanaian politician and Member of Parliament for Ellembelle constituency. He has served in various ministerial positions including Petroleum and Energy.',
    isTrending: false,
  },
  {
    fullName: 'Ibrahim Murtala Muhammed (MP)',
    portfolio: 'Minister for Environment, Science & Technology',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Ibrahim Murtala Muhammed is a Ghanaian politician and Member of Parliament for Tamale Central constituency. He has been involved in environmental and technology policy development.',
    isTrending: false,
  },
  {
    fullName: 'Ahmed Ibrahim (MP)',
    portfolio: 'Minister for Local Government, Chieftaincy & Religious Affairs',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on May 6, 1974, in Banda Ahenkro, Bono Region, Ghana, Ibrahim is a seasoned Ghanaian politician affiliated with the National Democratic Congress (NDC). He has been serving as the Member of Parliament for the Banda Constituency since 2009. He holds a Bachelor of Arts degree in Political Science and Philosophy from the University of Ghana and an MBA in Finance from GIMPA.',
    isTrending: false,
  },
  {
    fullName: 'Dzifa Gomashie (MP)',
    portfolio: 'Minister for Tourism, Culture & Creative Arts',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on July 25, 1965, in Aflao, Volta Region, Ghana, Gomashie is a distinguished Ghanaian actress, producer, screenwriter, and politician. She pursued her education at St. Louis Senior High School in Kumasi and later obtained a diploma in Theatre Arts from the University of Ghana\'s Institute of African Studies. She served as the Deputy Minister of Tourism, Culture, and Creative Arts from 2013 to 2017.',
    isTrending: false,
  },
  {
    fullName: 'Abdul-Rashid Pelpuo (MP)',
    portfolio: 'Minister for Labour, Jobs & Employment',
    photoUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    bio: 'Abdul-Rashid Pelpuo is a Ghanaian politician and Member of Parliament for Wa Central constituency. He has served in various ministerial positions and has experience in labor and employment policy.',
    isTrending: false,
  },
  {
    fullName: 'Kenneth Gilbert Adjei',
    portfolio: 'Minister for Works, Housing & Water Resources',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face',
    bio: 'Kenneth Gilbert Adjei is a Ghanaian politician and public servant with experience in infrastructure development and housing policy.',
    isTrending: false,
  },
  {
    fullName: 'George Opare Addo',
    portfolio: 'Minister for Youth Development & Empowerment',
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
    bio: 'Born on October 27, 1975, in Akuapem North, Ghana, Opare Addo is a prominent Ghanaian lawyer, politician, and youth advocate. He began his education at Adisadel College and later earned a degree in Psychology and Philosophy from the University of Ghana. He served as the Municipal Chief Executive (MCE) for the Akuapem North Municipal Assembly from 2009 to 2017.',
    isTrending: false,
  },
  {
    fullName: 'Kofi Iddie Adams (MP)',
    portfolio: 'Minister for Sports & Recreation',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
    bio: 'Kofi Iddie Adams is a Ghanaian politician and Member of Parliament for Buem constituency. He has been involved in sports development and youth empowerment initiatives.',
    isTrending: false,
  },
  {
    fullName: 'Agnes Naa Momo Lartey (MP)',
    portfolio: 'Minister for Gender, Children & Social Protection',
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
    bio: 'Agnes Naa Momo Lartey is a Ghanaian politician and Member of Parliament. She has been involved in gender equality and social protection policy development.',
    isTrending: false,
  },
]

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.vote.deleteMany()
  await prisma.minister.deleteMany()

  // Create ministers
  for (const minister of ministers) {
    await prisma.minister.create({
      data: minister,
    })
  }

  console.log(`✅ Seeded ${ministers.length} ministers`)
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