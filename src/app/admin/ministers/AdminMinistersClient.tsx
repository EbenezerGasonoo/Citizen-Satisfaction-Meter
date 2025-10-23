'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Edit, TrendingUp, TrendingDown, Eye, Trash2 } from 'lucide-react'
import ActionSection from '@/components/ActionSection'
import RemoveMinisterDialog from '@/components/RemoveMinisterDialog'

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

export default function AdminMinistersClient() {
  const [ministers, setMinisters] = useState<Minister[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [removeDialog, setRemoveDialog] = useState<{ isOpen: boolean; minister: Minister | null }>({
    isOpen: false,
    minister: null
  })

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

  const handleRemoveMinister = (minister: Minister) => {
    setRemoveDialog({ isOpen: true, minister })
  }

  const handleConfirmRemove = async () => {
    if (!removeDialog.minister) return

    try {
      const response = await fetch('/api/admin/ministers/remove', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ministerId: removeDialog.minister.id })
      })

      if (response.ok) {
        setMinisters(ministers.filter(m => m.id !== removeDialog.minister!.id))
        setRemoveDialog({ isOpen: false, minister: null })
      } else {
        alert('Failed to remove minister')
      }
    } catch (error) {
      console.error('Error removing minister:', error)
      alert('Error removing minister')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg" />
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
          <h1 className="text-3xl font-bold text-cocoa-green mb-2">
            Ministers Management
          </h1>
          <p className="text-gray-600">
            Manage ministers, view their performance, and handle actions
          </p>
        </header>

        {/* Search and Actions */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search ministers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
            />
          </div>
          <Link
            href="/admin/ministers/new"
            className="bg-cocoa-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Add New Minister
          </Link>
        </div>

        {/* Ministers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMinisters.map((minister, index) => (
            <motion.div
              key={minister.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200"
            >
              <div className="relative">
                <Image
                  src={minister.photoUrl}
                  alt={minister.fullName}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                {minister.isTrending && (
                  <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Trending
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {minister.fullName}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {minister.portfolio}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {minister.satisfactionRate}%
                    </p>
                    <p className="text-xs text-gray-500">Satisfaction</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-600">
                      {minister.totalVotes}
                    </p>
                    <p className="text-xs text-gray-500">Total Votes</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/admin/ministers/${minister.id}/edit`}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors text-center text-sm flex items-center justify-center"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Link>
                  <Link
                    href={`/minister/${minister.id}`}
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-center text-sm flex items-center justify-center"
                  >
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Link>
                  <button
                    onClick={() => handleRemoveMinister(minister)}
                    className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center justify-center"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
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

      {/* Remove Minister Dialog */}
      <RemoveMinisterDialog
        isOpen={removeDialog.isOpen}
        minister={removeDialog.minister}
        onClose={() => setRemoveDialog({ isOpen: false, minister: null })}
        onSuccess={handleConfirmRemove}
      />
    </div>
  )
}
