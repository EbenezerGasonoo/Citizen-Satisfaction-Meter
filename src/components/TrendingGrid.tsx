'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { TrendingUp, TrendingDown, ArrowRight, Calendar } from 'lucide-react'

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
              y: -5,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`/minister/${minister.id}`} className="block h-full touch-manipulation">
              <motion.div
                className="relative bg-white dark:bg-slate-900 rounded-xl shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 border border-slate-200 dark:border-slate-800 h-full overflow-hidden group"
              >
                {/* Image Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  <Image
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  {/* Subtle Gradient Overlay - Only at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-90" />

                  {/* Date Badge - Floating Top Left */}
                  {minister.latestAction && (
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-lg px-3 py-2 flex flex-col items-center justify-center text-white shadow-lg">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">
                        {new Date(minister.latestAction.date).toLocaleString('default', { month: 'short' })}
                      </span>
                      <span className="text-lg font-bold leading-none">
                        {new Date(minister.latestAction.date).getDate()}
                      </span>
                    </div>
                  )}

                  {/* Content at Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      {/* Portfolio */}
                      <div className="text-[10px] font-bold tracking-[0.15em] text-amber-400 uppercase mb-1.5">
                        {minister.portfolio}
                      </div>

                      {/* Name */}
                      <h3 className="text-xl font-bold text-white leading-tight mb-3 drop-shadow-md">
                        {minister.fullName}
                      </h3>

                      {/* Latest Action - Minimalist */}
                      {minister.latestAction && (
                        <div className="flex flex-col gap-1.5 text-xs text-gray-200 bg-white/10 rounded-lg p-3 border border-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                            <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">Latest Action/Policy</span>
                          </div>
                          <span className="font-medium line-clamp-2 leading-relaxed opacity-95">
                            {minister.latestAction.title}
                          </span>
                        </div>
                      )}
                    </motion.div>
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