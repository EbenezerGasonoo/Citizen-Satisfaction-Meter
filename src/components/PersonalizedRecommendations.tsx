'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Clock, Star } from 'lucide-react'

interface Minister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionPercentage: number
  totalVotes: number
  isTrending: boolean
}

interface PersonalizedRecommendationsProps {
  currentMinisterId?: number
}

export default function PersonalizedRecommendations({ currentMinisterId }: PersonalizedRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Minister[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'trending' | 'similar' | 'popular'>('trending')

  useEffect(() => {
    fetchRecommendations()
  }, [currentMinisterId, activeTab])

  const fetchRecommendations = async () => {
    setLoading(true)
    try {
      let endpoint = '/api/ministers/trending'
      
      if (activeTab === 'similar' && currentMinisterId) {
        endpoint = `/api/ministers/${currentMinisterId}/similar`
      } else if (activeTab === 'popular') {
        endpoint = '/api/ministers?sort=satisfaction&limit=5'
      }

      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setRecommendations(data.ministers || data.slice(0, 5))
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRecommendationReason = (minister: Minister, index: number) => {
    if (activeTab === 'trending') {
      return minister.isTrending ? 'Trending now' : 'High engagement'
    } else if (activeTab === 'similar') {
      return 'Similar portfolio'
    } else {
      return `#${index + 1} in satisfaction`
    }
  }

  const getRecommendationIcon = (minister: Minister) => {
    if (activeTab === 'trending') {
      return <TrendingUp className="w-4 h-4 text-orange-500" />
    } else if (activeTab === 'similar') {
      return <Sparkles className="w-4 h-4 text-blue-500" />
    } else {
      return <Star className="w-4 h-4 text-yellow-500" />
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
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="flex items-center space-x-3 mb-6">
        <Sparkles className="w-6 h-6 text-cocoa-green dark:text-green-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Recommended for You
        </h3>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { key: 'trending', label: 'Trending', icon: TrendingUp },
          { key: 'similar', label: 'Similar', icon: Sparkles },
          { key: 'popular', label: 'Popular', icon: Star }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-white dark:bg-gray-600 text-cocoa-green dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* Recommendations List */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <motion.div
            className="text-center py-8 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No recommendations available at the moment.</p>
          </motion.div>
        ) : (
          recommendations.map((minister, index) => (
            <motion.div
              key={minister.id}
              className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => window.location.href = `/minister/${minister.id}`}
            >
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
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
              </div>

              {/* Minister Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-3">
                  <img
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {minister.fullName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {minister.portfolio}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      {getRecommendationIcon(minister)}
                      <span className="text-xs text-gray-600 dark:text-gray-400">
                        {getRecommendationReason(minister, index)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Satisfaction Score */}
              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {minister.satisfactionPercentage}%
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {minister.totalVotes} votes
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Personalization Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
          <Clock className="w-3 h-3" />
          <span>
            Recommendations based on your voting patterns and trending activity
          </span>
        </div>
      </div>
    </motion.div>
  )
} 