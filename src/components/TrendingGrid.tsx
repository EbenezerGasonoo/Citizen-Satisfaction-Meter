'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface TrendingMinister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  voteChange: number
  trend: 'up' | 'down'
  isTrending: boolean
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
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
      duration: 0.5,
      ease: "easeOut"
    }
  }
}

export default function TrendingGrid() {
  const [trendingMinisters, setTrendingMinisters] = useState<TrendingMinister[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingMinisters = async () => {
      try {
        const response = await fetch('/api/ministers/trending')
        if (response.ok) {
          const data = await response.json()
          setTrendingMinisters(data)
        }
      } catch (error) {
        console.error('Failed to fetch trending ministers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMinisters()
    
    // Listen for vote updates
    const handleVoteUpdate = () => {
      console.log('TrendingGrid: Received voteSubmitted event, refreshing')
      fetchTrendingMinisters()
    }

    window.addEventListener('voteSubmitted', handleVoteUpdate)
    
    // Also poll every 30 seconds for updates
    const interval = setInterval(fetchTrendingMinisters, 30000)

    return () => {
      window.removeEventListener('voteSubmitted', handleVoteUpdate)
      clearInterval(interval)
    }
  }, [])

  console.log('Trending Ministers:', trendingMinisters)

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
          Trending Ministers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i} 
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4" />
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
          className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 dark:from-purple-400 dark:via-pink-400 dark:to-red-400 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Trending Ministers
        </motion.h2>
        <motion.p
          className="text-sm sm:text-base text-gray-600 dark:text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Most discussed ministers in the last 24 hours
        </motion.p>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {trendingMinisters.map((minister, index) => (
          <motion.div
            key={minister.id}
            variants={cardVariants}
            whileHover={{ 
              y: -8, 
              transition: { duration: 0.3, type: "spring", stiffness: 300 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`/minister/${minister.id}`} className="block h-full touch-manipulation">
              <motion.div 
                className="relative bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 h-full overflow-hidden group"
              >
                {/* Trending Badge */}
                {minister.isTrending && (
                  <div className="absolute top-4 right-4 z-10">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-full px-3 py-1 shadow-lg flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-white" />
                      <span className="text-xs font-bold text-white">HOT</span>
                    </div>
                  </div>
                )}

                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-500/10 dark:to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="relative">
                  {/* Profile Image */}
                  <motion.div 
                    className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ duration: 0.3, type: "spring" }}
                  >
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 blur-md opacity-40" />
                    <Image
                      src={minister.photoUrl}
                      alt={minister.fullName}
                      width={96}
                      height={96}
                      className="relative object-cover w-full h-full rounded-full border-4 border-white dark:border-gray-800 shadow-xl"
                    />
                  </motion.div>

                  {/* Minister Info */}
                  <motion.h3 
                    className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 min-h-[3.5rem]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {minister.fullName}
                  </motion.h3>
                  
                  <motion.p 
                    className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 min-h-[2.5rem]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    {minister.portfolio}
                  </motion.p>

                  {/* Stats */}
                  <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${
                      minister.trend === 'up' 
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
                        : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                    }`}>
                      <span className="text-xl">{minister.satisfactionRate}%</span>
                    </div>
                    
                    <div className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-semibold ${
                      minister.trend === 'up' 
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400' 
                        : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                    }`}>
                      {minister.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      <span>{minister.trend === 'up' ? '+' : ''}{minister.voteChange}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {trendingMinisters.length === 0 && !loading && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="text-gray-400 dark:text-gray-600 text-lg">
            No trending ministers at the moment
          </div>
        </motion.div>
      )}
    </motion.div>
  )
} 