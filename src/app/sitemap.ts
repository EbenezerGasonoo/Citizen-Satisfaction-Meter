import { MetadataRoute } from 'next'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://citizenmeter.vercel.app'

  // Static routes (always available)
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

  // Fetch all ministers for dynamic routes
  let ministerRoutes: MetadataRoute.Sitemap = []

  try {
    const ministers = await prisma.minister.findMany({
      select: {
        id: true,
        updatedAt: true,
      },
    })

    ministerRoutes = ministers.map((minister) => ({
      url: `${baseUrl}/minister/${minister.id}`,
      lastModified: minister.updatedAt,
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Error fetching ministers for sitemap:', error)
    // Return static routes even if database fails
  } finally {
    await prisma.$disconnect()
  }

  return [...staticRoutes, ...ministerRoutes]
}
