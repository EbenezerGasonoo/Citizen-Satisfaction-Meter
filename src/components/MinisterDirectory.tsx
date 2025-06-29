'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Filter } from 'lucide-react'
import FavoriteButton from './FavoriteButton'

interface Minister {
  id: string
  fullName: string
  portfolio: string
  photoUrl: string
  bio: string
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
}

export default function MinisterDirectory() {
  const [ministers, setMinisters] = useState<Minister[]>([])
  const [filteredMinisters, setFilteredMinisters] = useState<Minister[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<'name' | 'portfolio'>('name')

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await fetch('/api/ministers')
        if (response.ok) {
          const data = await response.json()
          setMinisters(data)
          setFilteredMinisters(data)
        }
      } catch (error) {
        console.error('Failed to fetch ministers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMinisters()
  }, [])

  useEffect(() => {
    const filtered = ministers.filter(minister =>
      minister.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      minister.portfolio.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === 'name') {
        return a.fullName.localeCompare(b.fullName)
      } else {
        return a.portfolio.localeCompare(b.portfolio)
      }
    })

    setFilteredMinisters(sorted)
  }, [ministers, searchTerm, sortBy])

  if (loading) {
    return (
      <motion.div 
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.h2 
          className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          All Ministers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <motion.div 
              key={i} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
            </motion.div>
          ))}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        All Ministers
      </motion.h2>

      {/* Search and Filter Controls */}
      <motion.div 
        className="mb-8 max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search ministers by name or portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'portfolio')}
              className="pl-10 pr-8 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="name">Sort by Name</option>
              <option value="portfolio">Sort by Portfolio</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      {searchTerm && (
        <motion.div 
          className="mb-6 text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Found {filteredMinisters.length} minister{filteredMinisters.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.div>
      )}
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredMinisters.map((minister, index) => (
          <motion.div
            key={minister.id}
            variants={cardVariants}
            whileHover={{ 
              y: -5, 
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200 h-full relative"
              whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              {/* Favorite Button */}
              <div className="absolute top-4 right-4 z-10">
                <FavoriteButton ministerId={parseInt(minister.id)} />
              </div>

              <Link href={`/minister/${minister.id}`}>
                <motion.div 
                  className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden relative cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </motion.div>
              </Link>

              <Link href={`/minister/${minister.id}`}>
                <motion.h3 
                  className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100 cursor-pointer hover:text-cocoa-green dark:hover:text-green-400 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  {minister.fullName}
                </motion.h3>
              </Link>

              <p className="text-sm text-cocoa-green dark:text-green-400 font-medium mb-3">
                {minister.portfolio}
              </p>

              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {minister.bio}
              </p>

              <Link href={`/minister/${minister.id}`}>
                <motion.button
                  className="mt-4 w-full bg-cocoa-green dark:bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Profile
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>

      {filteredMinisters.length === 0 && !loading && (
        <motion.div 
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p className="text-lg">No ministers found</p>
            <p className="text-sm">Try adjusting your search terms</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 