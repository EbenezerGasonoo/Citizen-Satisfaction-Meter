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
        <h2 
          className="text-2xl font-bold mb-8 text-slate-900 dark:text-slate-50"
        >
          Minister Directory
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div 
              key={i} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 animate-pulse"
            >
              <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-lg mx-auto mb-4" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mx-auto" />
            </div>
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
        <h2 
          className="text-3xl font-bold mb-3 text-slate-900 dark:text-slate-50"
        >
          All Ministers
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Browse and evaluate all cabinet ministers
        </p>
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
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="Search ministers by name or portfolio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all touch-manipulation text-sm"
            />
          </div>
          <div className="relative sm:w-56">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 w-5 h-5 pointer-events-none" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'name' | 'portfolio')}
              className="w-full pl-12 pr-10 py-3 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary appearance-none bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-50 cursor-pointer transition-all touch-manipulation text-sm font-medium"
            >
              <option value="name">Sort by Name</option>
              <option value="portfolio">Sort by Portfolio</option>
            </select>
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      {searchTerm && (
        <motion.div 
          className="mb-6 text-sm text-slate-600 dark:text-slate-400 font-medium"
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
              className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col group"
              variants={cardVariants}
              whileHover={{ y: -2 }}
            >
              {/* Favorite Button */}
              <div className="absolute top-4 right-4 z-10">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1.5 shadow-sm">
                  <FavoriteButton ministerId={parseInt(minister.id)} />
                </div>
              </div>

              <div className="relative flex flex-col flex-1">
                {/* Profile Image */}
                <Link href={`/minister/${minister.id}`} className="block touch-manipulation mb-4">
                  <div className="relative w-20 h-20 mx-auto">
                    <img
                      src={minister.photoUrl}
                      alt={minister.fullName}
                      className="object-cover w-full h-full rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                  </div>
                </Link>

                {/* Minister Info */}
                <Link href={`/minister/${minister.id}`} className="block touch-manipulation mb-2">
                  <h3 
                    className="text-lg font-semibold text-slate-900 dark:text-slate-50 hover:text-primary transition-colors line-clamp-2 text-center"
                  >
                    {minister.fullName}
                  </h3>
                </Link>

                <div className="mb-3 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-md border border-slate-200 dark:border-slate-700">
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300 text-center">
                    {minister.portfolio}
                  </p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4 flex-1 text-center">
                  {minister.bio}
                </p>

                {/* View Profile Button */}
                <Link href={`/minister/${minister.id}`} className="block touch-manipulation mt-auto">
                  <button
                    className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                  >
                    View Profile
                  </button>
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
          <div className="text-slate-500 dark:text-slate-400 text-base">
            No ministers found matching your search
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}