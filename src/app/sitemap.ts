import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://citizensatisfactionmeter.com'
  
  // Fetch all ministers for dynamic routes
  let ministers: { id: number; updatedAt: Date }[] = []
  try {
    ministers = await prisma.minister.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    })
  } catch (error) {
    console.error('Error fetching ministers for sitemap:', error)
  }

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1,
    },
    {
      url: `${baseUrl}/suggest`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Dynamic minister routes
  const ministerRoutes: MetadataRoute.Sitemap = ministers.map((minister) => ({
    url: `${baseUrl}/minister/${minister.id}`,
    lastModified: minister.updatedAt,
    changeFrequency: 'daily',
    priority: 0.9,
  }))

  return [...staticRoutes, ...ministerRoutes]
}

