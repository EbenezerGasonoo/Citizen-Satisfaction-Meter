import { Suspense } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VoteButtons from '@/components/VoteButtons'
import { notFound } from 'next/navigation'

interface MinisterDetail {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  bio: string
  satisfactionRate: number
  totalVotes: number
  positiveVotes: number
}

async function getMinister(id: string): Promise<MinisterDetail | null> {
  try {
    const baseUrl =
      typeof window === 'undefined'
        ? process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        : '';
    const response = await fetch(`${baseUrl}/api/ministers/${id}`, {
      cache: 'no-store'
    });

    if (!response.ok) {
      return null;
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching minister:', error);
    return null;
  }
}

export default async function MinisterPage({ params }: { params: { id: string } }) {
  const minister = await getMinister(params.id)

  if (!minister) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-cocoa-green hover:text-cocoa-green/80 mb-8"
        >
          ← Back to Home
        </Link>

        {/* Minister Profile */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 relative">
                <Image
                  src={minister.photoUrl}
                  alt={minister.fullName}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {minister.fullName}
              </h1>
              
              <p className="text-xl text-cocoa-green font-semibold mb-4">
                {minister.portfolio}
              </p>

              {minister.bio && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {minister.bio}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cocoa-green">
                    {minister.satisfactionRate}%
                  </div>
                  <div className="text-sm text-gray-500">Satisfaction Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700">
                    {minister.totalVotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Total Votes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {minister.positiveVotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Positive Votes</div>
                </div>
              </div>

              {/* Vote Buttons */}
              <Suspense fallback={<div className="flex gap-4">
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
                <div className="flex-1 h-12 bg-gray-200 rounded-lg animate-pulse" />
              </div>}>
                <VoteButtons ministerId={minister.id} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
} 