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
          className="text-2xl font-semibold mb-8 text-gray-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Trending Ministers
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i} 
              className="bg-white rounded-lg shadow-md p-6 animate-pulse"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-gray-200 rounded mb-2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
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
        className="text-2xl font-semibold mb-8 text-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Trending Ministers (Last 24 Hours)
      </motion.h2>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
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
              scale: 1.02,
              transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
          >
            <Link href={`/minister/${minister.id}`}>
              <motion.div 
                className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
                whileHover={{ boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
              >
                <motion.div 
                  className="relative w-16 h-16 rounded-full mx-auto mb-4 overflow-visible"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Image
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  {minister.isTrending && (
                    <div className="absolute top-0 right-0 bg-white rounded-full p-1 shadow z-10">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    </div>
                  )}
                </motion.div>
                <motion.h3 
                  className="font-semibold text-gray-800 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {minister.fullName}
                </motion.h3>
                <motion.p 
                  className="text-sm text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {minister.portfolio}
                </motion.p>
                <div className="flex items-center justify-center space-x-2">
                  <span className={`text-lg font-bold ${
                    minister.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {minister.satisfactionRate}%
                  </span>
                  <span className={`text-sm ${
                    minister.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {minister.trend === 'up' ? '+' : ''}{minister.voteChange}
                  </span>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  )
} 