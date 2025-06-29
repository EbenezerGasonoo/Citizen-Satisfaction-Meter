'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, TrendingDown, Users } from 'lucide-react'

interface Minister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionPercentage: number
  totalVotes: number
}

interface ComparativeAnalysisProps {
  currentMinister: Minister
}

export default function ComparativeAnalysis({ currentMinister }: ComparativeAnalysisProps) {
  const [portfolioMinisters, setPortfolioMinisters] = useState<Minister[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPortfolioMinisters()
  }, [currentMinister.portfolio])

  const fetchPortfolioMinisters = async () => {
    try {
      const response = await fetch(`/api/ministers?portfolio=${encodeURIComponent(currentMinister.portfolio)}`)
      if (response.ok) {
        const data = await response.json()
        setPortfolioMinisters(data.ministers)
      }
    } catch (error) {
      console.error('Error fetching portfolio ministers:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <motion.div 
        className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  const sortedMinisters = [...portfolioMinisters].sort((a, b) => b.satisfactionPercentage - a.satisfactionPercentage)
  const currentMinisterRank = sortedMinisters.findIndex(m => m.id === currentMinister.id) + 1
  const totalMinisters = sortedMinisters.length

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <BarChart3 className="w-6 h-6 text-cocoa-green dark:text-green-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Portfolio Comparison
        </h3>
      </div>

      {/* Current Minister Rank */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Current Rank</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              #{currentMinisterRank} of {totalMinisters}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Satisfaction</p>
            <p className="text-2xl font-bold text-cocoa-green dark:text-green-400">
              {currentMinister.satisfactionPercentage}%
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Rankings */}
      <div>
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">
          {currentMinister.portfolio} Rankings
        </h4>
        <div className="space-y-3">
          {sortedMinisters.map((minister, index) => (
            <motion.div
              key={minister.id}
              className={`flex items-center space-x-4 p-3 rounded-lg border transition-colors ${
                minister.id === currentMinister.id
                  ? 'bg-cocoa-green/10 dark:bg-green-900/20 border-cocoa-green dark:border-green-600'
                  : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Rank */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                index === 0
                  ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
                  : index === 1
                  ? 'bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-300'
                  : index === 2
                  ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-800 dark:text-orange-400'
                  : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
              }`}>
                {index + 1}
              </div>

              {/* Minister Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <img
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium truncate ${
                      minister.id === currentMinister.id
                        ? 'text-cocoa-green dark:text-green-400'
                        : 'text-gray-900 dark:text-gray-100'
                    }`}>
                      {minister.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {minister.totalVotes} votes
                    </p>
                  </div>
                </div>
              </div>

              {/* Satisfaction Score */}
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {minister.satisfactionPercentage}%
                  </p>
                </div>
                {index < sortedMinisters.length - 1 && (
                  <div className="flex items-center">
                    {minister.satisfactionPercentage > sortedMinisters[index + 1].satisfactionPercentage ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Portfolio Average</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {Math.round(sortedMinisters.reduce((sum, m) => sum + m.satisfactionPercentage, 0) / sortedMinisters.length)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
            <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {sortedMinisters.reduce((sum, m) => sum + m.totalVotes, 0).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
} 