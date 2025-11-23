'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  Target,
  RefreshCw,
  Settings,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'

interface TrendingCandidate {
  ministerId: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  voteChange24h: number
  voteVelocity: number
  satisfactionChange: number
  trendingScore: number
  reason: string
}

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

interface TrendingAnalytics {
  totalVotes24h: number
  totalVotesWeek: number
  trendingMinisters: number
  voteVelocity: number
  weeklyVelocity: number
}

interface TrendingCriteria {
  minVoteChange: number
  minSatisfactionChange: number
  timeWindow: number
  enableAutoTrending: boolean
}

export default function AdminTrendingClient() {
  const [trendingCandidates, setTrendingCandidates] = useState<TrendingCandidate[]>([])
  const [trendingMinisters, setTrendingMinisters] = useState<TrendingMinister[]>([])
  const [analytics, setAnalytics] = useState<TrendingAnalytics | null>(null)
  const [criteria, setCriteria] = useState<TrendingCriteria>({
    minVoteChange: 10,
    minSatisfactionChange: 5,
    timeWindow: 24,
    enableAutoTrending: true
  })
  const [loading, setLoading] = useState(true)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    fetchTrendingData()
  }, [])

  const fetchTrendingData = async () => {
    setLoading(true)
    try {
      const [candidatesRes, ministersRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/trending'),
        fetch('/api/ministers/trending'),
        fetch('/api/admin/trending?action=analytics')
      ])

      if (candidatesRes.ok) {
        const candidatesData = await candidatesRes.json()
        setTrendingCandidates(candidatesData.candidates || [])
      }

      if (ministersRes.ok) {
        const ministersData = await ministersRes.json()
        setTrendingMinisters(ministersData || [])
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData.analytics)
      }
    } catch (error) {
      console.error('Failed to fetch trending data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateCriteria = async () => {
    try {
      const response = await fetch('/api/admin/trending', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(criteria)
      })

      if (response.ok) {
        setShowSettings(false)
        fetchTrendingData()
      } else {
        alert('Failed to update trending criteria')
      }
    } catch (error) {
      console.error('Error updating criteria:', error)
      alert('Failed to update trending criteria')
    }
  }

  const handleRefreshTrending = async () => {
    try {
      const response = await fetch('/api/cron/trending', {
        method: 'POST'
      })

      if (response.ok) {
        fetchTrendingData()
        alert('Trending data refreshed successfully!')
      } else {
        alert('Failed to refresh trending data')
      }
    } catch (error) {
      console.error('Error refreshing trending:', error)
      alert('Failed to refresh trending data')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-200 rounded" />
              <div className="h-96 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-cocoa-green mb-2">
                Trending Management
              </h1>
              <p className="text-gray-600">
                Monitor and manage trending ministers and voting patterns
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRefreshTrending}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </button>
            </div>
          </div>
        </header>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">24h Votes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalVotes24h.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Weekly Votes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.totalVotesWeek.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Trending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.trendingMinisters}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <Target className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Velocity</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {analytics.voteVelocity.toFixed(1)}%
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Trending Candidates */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              Trending Candidates
            </h3>
            <div className="space-y-4">
              {trendingCandidates.slice(0, 5).map((candidate, index) => (
                <div key={candidate.ministerId} className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{candidate.fullName}</p>
                      <p className="text-sm text-gray-600">{candidate.portfolio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">+{candidate.voteChange24h}</p>
                    <p className="text-sm text-gray-500">{candidate.satisfactionRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              Trending Down
            </h3>
            <div className="space-y-4">
              {trendingMinisters
                .filter(minister => minister.trend === 'down')
                .slice(0, 5)
                .map((minister, index) => (
                  <div key={minister.id} className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                        {index + 1}
                      </span>
                      <div>
                        <p className="font-medium text-gray-900">{minister.fullName}</p>
                        <p className="text-sm text-gray-600">{minister.portfolio}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-red-600">{minister.voteChange}</p>
                      <p className="text-sm text-gray-500">{minister.satisfactionRate}%</p>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>

        {/* All Trending Ministers */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">All Trending Ministers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingMinisters.map((minister) => (
              <div key={minister.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center mb-2">
                  <img
                    src={minister.photoUrl}
                    alt={minister.fullName}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{minister.fullName}</p>
                    <p className="text-sm text-gray-600">{minister.portfolio}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${minister.trend === 'up'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                    }`}>
                    {minister.trend === 'up' ? '↗' : '↘'} {minister.voteChange}
                  </span>
                  <span className="text-sm text-gray-500">{minister.satisfactionRate}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Trending Settings</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Vote Change (24h)
                </label>
                <input
                  type="number"
                  value={criteria.minVoteChange}
                  onChange={(e) => setCriteria({ ...criteria, minVoteChange: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray- Eigen mb-1">
                  Minimum Satisfaction Change
                </label>
                <input
                  type="number"
                  value={criteria.minSatisfactionChange}
                  onChange={(e) => setCriteria({ ...criteria, minSatisfactionChange: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Window (hours)
                </label>
                <input
                  type="number"
                  value={criteria.timeWindow}
                  onChange={(e) => setCriteria({ ...criteria, timeWindow: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={criteria.enableAutoTrending}
                  onChange={(e) => setCriteria({ ...criteria, enableAutoTrending: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Enable Auto Trending
                </label>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={handleUpdateCriteria}
                className="flex-1 bg-cocoa-green text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
              >
                Save Settings
              </button>
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
