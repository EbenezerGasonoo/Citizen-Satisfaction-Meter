'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

interface TrendingMinister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  voteChange: number
  trend: 'up' | 'down'
  isTrending: boolean
  latestAction?: {
    title: string
    description: string
    date: string
  } | null
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
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
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
                className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-lg cursor-pointer hover:shadow-2xl transition-all duration-300 border border-slate-200 dark:border-slate-800 h-full overflow-hidden group"
              >
                {/* Large Portrait Image - takes up most of the card */}
                <div className="relative w-full h-[280px] lg:h-[320px] overflow-hidden">
                  <Image
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  {/* Dark overlay gradient at bottom for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                {/* Text Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-start gap-4 mb-4">
                    {/* Date on the left - stacked vertically */}
                    {minister.latestAction && (
                      <div className="flex-shrink-0">
                        <motion.div 
                          className="text-5xl font-bold leading-none"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          {new Date(minister.latestAction.date).getDate()}
                        </motion.div>
                        <motion.div 
                          className="text-4xl font-bold leading-none mt-1"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.35 + index * 0.1 }}
                        >
                          {String(new Date(minister.latestAction.date).getMonth() + 1).padStart(2, '0')}
                        </motion.div>
                      </div>
                    )}
                    
                    {/* Description and Time on the right */}
                    <div className="flex-1 min-w-0">
                      {minister.latestAction ? (
                        <>
                          <motion.h3 
                            className="text-sm font-bold uppercase tracking-wide leading-tight mb-2 line-clamp-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {minister.latestAction.title}
                          </motion.h3>
                          <motion.div 
                            className="text-base font-semibold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 + index * 0.1 }}
                          >
                            {new Date(minister.latestAction.date).toLocaleTimeString('en-GB', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              hour12: false 
                            })}
                          </motion.div>
                        </>
                      ) : (
                        <>
                          <motion.h3 
                            className="text-sm font-bold uppercase tracking-wide leading-tight mb-2 line-clamp-2"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {minister.portfolio.toUpperCase()}
                          </motion.h3>
                          <motion.div 
                            className="text-base font-semibold"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.45 + index * 0.1 }}
                          >
                            {minister.fullName}
                          </motion.div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {/* View Profile Button */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                  >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-lg font-semibold text-sm transition-all duration-300 group-hover:bg-white/30 border border-white/30">
                      <span>View Profile</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </div>
                  </motion.div>
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