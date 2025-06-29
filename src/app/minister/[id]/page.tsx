'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VoteButtons from '@/components/VoteButtons'
import FavoriteButton from '@/components/FavoriteButton'
import { notFound } from 'next/navigation'
import PolicySection from '@/components/PolicySection'

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

export default function MinisterPage({ params }: { params: { id: string } }) {
  const [minister, setMinister] = useState<MinisterDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMinister = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/ministers/${params.id}`)

        if (!response.ok) {
          setMinister(null)
          return
        }

        const data = await response.json()
        setMinister(data)
      } catch (error) {
        console.error('Error fetching minister:', error)
        setMinister(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMinister()
  }, [params.id])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-8" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!minister) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-cocoa-green dark:text-green-400 hover:text-cocoa-green/80 dark:hover:text-green-300 transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        {/* Minister Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 relative">
              <div className="w-48 h-48 relative">
                <Image
                  src={minister.photoUrl}
                  alt={minister.fullName}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              {/* Favorite Button */}
              <div className="absolute top-2 right-2">
                <FavoriteButton ministerId={minister.id} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {minister.fullName}
              </h1>
              
              <p className="text-xl text-cocoa-green dark:text-green-400 font-semibold mb-4">
                {minister.portfolio}
              </p>

              {minister.bio && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {minister.bio}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cocoa-green dark:text-green-400">
                    {minister.satisfactionRate}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {minister.totalVotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Votes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {minister.positiveVotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Positive Votes</div>
                </div>
              </div>

              {/* Vote Buttons */}
              <VoteButtons ministerId={minister.id} />
            </div>
          </div>
        </div>

        {/* Policy Section */}
        <PolicySection ministerId={minister.id} />
      </div>
    </main>
  )
} 