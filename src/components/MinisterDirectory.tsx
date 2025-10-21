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
      <motion.div className="mb-8 sm:mb-10">
        <motion.h2 
          className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-blue-600 via-teal-600 to-cyan-600 dark:from-blue-400 dark:via-teal-400 dark:to-cyan-400 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          All Ministers
        </motion.h2>
        <motion.p
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Browse and rate all cabinet ministers
        </motion.p>
      </motion.div>

      {/* Search and Filter Controls - Enhanced */}
      <motion.div 
        className="mb-8 max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ministers by name or portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 sm:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 transition-all touch-manipulation text-base"
            />
          </div>
          <div className="relative sm:w-56">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'portfolio')}
              className="w-full pl-12 pr-10 py-3.5 sm:py-4 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-green-500 dark:focus:border-green-400 appearance-none bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 cursor-pointer transition-all touch-manipulation text-base font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="portfolio">Sort by Portfolio</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      {searchTerm && (
        <motion.div 
          className="mb-6 text-base text-gray-600 dark:text-gray-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Found {filteredMinisters.length} minister{filteredMinisters.length !== 1 ? 's' : ''}
          {searchTerm && ` matching "${searchTerm}"`}
        </motion.div>
      )}
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {filteredMinisters.map((minister, index) => (
          <motion.div
            key={minister.id}
            variants={cardVariants}
            whileHover={{ 
              y: -8,
              transition: { duration: 0.3, type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <motion.div 
              className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden group border border-gray-200 dark:border-gray-700"
            >
              {/* Background decoration on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-teal-500/5 dark:from-blue-500/10 dark:to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Favorite Button */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full p-1.5 shadow-lg">
                  <FavoriteButton ministerId={parseInt(minister.id)} />
                </div>
              </div>

              <div className="relative">
                {/* Profile Image */}
                <Link href={`/minister/${minister.id}`} className="block touch-manipulation">
                  <motion.div 
                    className="relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 3 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 blur-md opacity-40" />
                    <img
                      src={minister.photoUrl}
                      alt={minister.fullName}
                      className="relative object-cover w-full h-full rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
                    />
                  </motion.div>
                </Link>

                {/* Minister Info */}
                <Link href={`/minister/${minister.id}`} className="block touch-manipulation">
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold mb-2 text-gray-900 dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400 transition-colors line-clamp-2 min-h-[3.5rem]"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {minister.fullName}
                  </motion.h3>
                </Link>

                <div className="mb-3 px-3 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-xl inline-block">
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    {minister.portfolio}
                  </p>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 min-h-[4rem]">
                  {minister.bio}
                </p>

                {/* View Profile Button */}
                <Link href={`/minister/${minister.id}`} className="block touch-manipulation">
                  <motion.button
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/30"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    View Profile
                  </motion.button>
                </Link>
              </div>
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
          <div className="text-gray-400 dark:text-gray-600 text-lg">
            No ministers found matching your search
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}