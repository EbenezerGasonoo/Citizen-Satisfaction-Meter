import { Metadata } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Props = {
  params: { id: string }
  children: React.ReactNode
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const minister = await prisma.minister.findUnique({
      where: { id: parseInt(params.id) },
      select: {
        id: true,
        fullName: true,
        portfolio: true,
        bio: true,
        photoUrl: true,
        votes: {
          select: {
            isPositive: true,
          },
        },
      },
    })

    if (!minister) {
      return {
        title: 'Minister Not Found',
        description: 'The requested minister could not be found.',
      }
    }

    const totalVotes = minister.votes.length
    const positiveVotes = minister.votes.filter((v) => v.isPositive).length
    const satisfactionRate = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 0

    const description = minister.bio 
      ? `${minister.fullName}, ${minister.portfolio}. ${minister.bio.substring(0, 150)}... | Current satisfaction: ${satisfactionRate}% from ${totalVotes} votes.`
      : `Rate and track the performance of ${minister.fullName}, ${minister.portfolio}. Current satisfaction: ${satisfactionRate}% from ${totalVotes} votes.`

    return {
      title: `${minister.fullName} - ${minister.portfolio}`,
      description,
      keywords: [
        minister.fullName,
        minister.portfolio,
        'Ghana minister',
        'performance rating',
        'satisfaction',
        'government accountability',
        'ministerial performance',
        'Ghana cabinet',
      ],
      openGraph: {
        title: `${minister.fullName} - ${minister.portfolio}`,
        description,
        url: `https://citizensatisfactionmeter.com/minister/${minister.id}`,
        siteName: 'Citizen Satisfaction Meter',
        locale: 'en_GH',
        type: 'profile',
        images: [
          {
            url: minister.photoUrl,
            width: 800,
            height: 800,
            alt: `${minister.fullName} - ${minister.portfolio}`,
          },
        ],
      },
      twitter: {
        card: 'summary',
        title: `${minister.fullName} - ${minister.portfolio}`,
        description: `${satisfactionRate}% satisfaction from ${totalVotes} votes`,
        images: [minister.photoUrl],
      },
      alternates: {
        canonical: `/minister/${minister.id}`,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Minister Profile',
      description: 'View and rate minister performance on Citizen Satisfaction Meter',
    }
  }
}

export default function MinisterLayout({ children }: Props) {
  return <>{children}</>
}

