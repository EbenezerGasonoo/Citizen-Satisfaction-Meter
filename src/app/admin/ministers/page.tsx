'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, TrendingUp, TrendingDown, Eye } from 'lucide-react'
import ActionSection from '@/components/ActionSection'

interface Minister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  bio: string
  satisfactionRate: number
  totalVotes: number
  positiveVotes: number
  isTrending: boolean
}

export default function AdminMinistersPage() {
  const [ministers, setMinisters] = useState<Minister[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await fetch('/api/ministers')
        if (response.ok) {
          const data = await response.json()
          setMinisters(data)
        }
      } catch (error) {
        console.error('Failed to fetch ministers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMinisters()
  }, [])

  const filteredMinisters = ministers.filter(minister =>
    minister.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    minister.portfolio.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-3/4" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-cocoa-green mb-2">
                Minister Management
              </h1>
              <p className="text-gray-600">
                View and manage all ministers in the system
              </p>
            </div>
            <Link
              href="/admin/ministers/new"
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Add New Minister
            </Link>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search ministers by name or portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
            />
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinisters.map((minister, index) => (
            <motion.div
              key={minister.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-16 h-16 relative rounded-full overflow-hidden">
                  <Image
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex space-x-2">
                  <Link
                    href={`/minister/${minister.id}`}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    href={`/admin/ministers/${minister.id}/edit`}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Edit Minister"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <h3 className="font-semibold text-gray-800 mb-2">
                {minister.fullName}
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {minister.portfolio}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Satisfaction Rate:</span>
                  <span className={`font-semibold ${
                    minister.satisfactionRate >= 70 ? 'text-green-600' :
                    minister.satisfactionRate >= 50 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {minister.satisfactionRate}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Votes:</span>
                  <span className="font-semibold text-gray-700">
                    {minister.totalVotes.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Positive Votes:</span>
                  <span className="font-semibold text-green-600">
                    {minister.positiveVotes.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions Section */}
              <ActionSection ministerId={minister.id} />

              {minister.isTrending && (
                <div className="mt-4 flex items-center justify-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm font-medium">Trending</span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {filteredMinisters.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchTerm ? 'No ministers found matching your search.' : 'No ministers found.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
} 