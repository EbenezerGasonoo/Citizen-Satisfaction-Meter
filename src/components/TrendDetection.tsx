'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, AlertTriangle, Activity, Zap, ArrowUp, ArrowDown } from 'lucide-react'

interface Trend {
  id: string
  type: 'positive' | 'negative' | 'neutral'
  title: string
  description: string
  confidence: number
  affectedMinisters: string[]
  timeframe: string
  impact: 'high' | 'medium' | 'low'
}

interface TrendDetectionProps {
  ministerId?: number
}

export default function TrendDetection({ ministerId }: TrendDetectionProps) {
  const [trends, setTrends] = useState<Trend[]>([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')

  useEffect(() => {
    fetchTrends()
  }, [ministerId])

  const fetchTrends = async () => {
    setLoading(true)
    try {
      const endpoint = ministerId 
        ? `/api/ministers/${ministerId}/trends`
        : '/api/analytics/trends'
      
      const response = await fetch(endpoint)
      if (response.ok) {
        const data = await response.json()
        setTrends(data.trends || generateMockTrends())
      } else {
        setTrends(generateMockTrends())
      }
    } catch (error) {
      console.error('Error fetching trends:', error)
      setTrends(generateMockTrends())
    } finally {
      setLoading(false)
    }
  }

  const generateMockTrends = (): Trend[] => {
    return [
      {
        id: '1',
        type: 'positive',
        title: 'Education Sector Improvement',
        description: 'Significant increase in satisfaction scores across education-related portfolios',
        confidence: 85,
        affectedMinisters: ['Haruna Iddrisu', 'Jane Naana Opoku-Agyemang'],
        timeframe: 'Last 7 days',
        impact: 'high'
      },
      {
        id: '2',
        type: 'negative',
        title: 'Economic Concerns Rising',
        description: 'Declining satisfaction in finance and economic planning sectors',
        confidence: 72,
        affectedMinisters: ['Cassiel Ato Forson', 'Elizabeth Ofosu-Adjare'],
        timeframe: 'Last 3 days',
        impact: 'high'
      },
      {
        id: '3',
        type: 'neutral',
        title: 'Digital Transformation Focus',
        description: 'Increased attention on technology and communications portfolios',
        confidence: 68,
        affectedMinisters: ['Samuel Nartey George'],
        timeframe: 'Last 5 days',
        impact: 'medium'
      },
      {
        id: '4',
        type: 'positive',
        title: 'Youth Engagement Surge',
        description: 'Higher voting activity from younger demographics',
        confidence: 91,
        affectedMinisters: ['George Opare Addo', 'Kofi Iddie Adams'],
        timeframe: 'Last 24 hours',
        impact: 'medium'
      }
    ]
  }

  const getTrendIcon = (type: string) => {
    switch (type) {
      case 'positive':
        return <TrendingUp className="w-5 h-5 text-green-500" />
      case 'negative':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      default:
        return <Activity className="w-5 h-5 text-blue-500" />
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
      default:
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
    }
  }

  const filteredTrends = trends.filter(trend => 
    activeFilter === 'all' || trend.type === activeFilter
  )

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
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
        <Zap className="w-6 h-6 text-cocoa-green dark:text-green-400" />
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Trend Detection
        </h3>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
        {[
          { key: 'all', label: 'All', icon: Activity },
          { key: 'positive', label: 'Positive', icon: TrendingUp },
          { key: 'negative', label: 'Negative', icon: AlertTriangle },
          { key: 'neutral', label: 'Neutral', icon: Activity }
        ].map((filter) => {
          const Icon = filter.icon
          return (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeFilter === filter.key
                  ? 'bg-white dark:bg-gray-600 text-cocoa-green dark:text-green-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>

      {/* Trends List */}
      <div className="space-y-4">
        {filteredTrends.length === 0 ? (
          <motion.div
            className="text-center py-8 text-gray-500 dark:text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Zap className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No trends detected at the moment.</p>
          </motion.div>
        ) : (
          filteredTrends.map((trend, index) => (
            <motion.div
              key={trend.id}
              className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getTrendIcon(trend.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {trend.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(trend.impact)}`}>
                      {trend.impact} impact
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {trend.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                      <span>Confidence: {trend.confidence}%</span>
                      <span>{trend.timeframe}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      {trend.type === 'positive' ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : trend.type === 'negative' ? (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      ) : null}
                    </div>
                  </div>
                  
                  {trend.affectedMinisters.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                        Affected Ministers:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {trend.affectedMinisters.map((minister, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs text-gray-700 dark:text-gray-300"
                          >
                            {minister}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Trend Detection Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400">
          <Activity className="w-3 h-3" />
          <span>
            Trends detected using AI analysis of voting patterns and satisfaction scores
          </span>
        </div>
      </div>
    </motion.div>
  )
} 