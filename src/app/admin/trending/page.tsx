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
  minVotes24h: number
  minVoteVelocity: number
  minSatisfactionChange: number
  maxTrendingCount: number
}

export default function TrendingManagement() {
  const [candidates, setCandidates] = useState<TrendingCandidate[]>([])
  const [trendingMinisters, setTrendingMinisters] = useState<TrendingMinister[]>([])
  const [analytics, setAnalytics] = useState<TrendingAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [criteria, setCriteria] = useState<TrendingCriteria>({
    minVotes24h: 10,
    minVoteVelocity: 2,
    minSatisfactionChange: 5,
    maxTrendingCount: 8
  })
  const [showSettings, setShowSettings] = useState(false)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [candidatesRes, trendingRes, analyticsRes] = await Promise.all([
        fetch('/api/admin/trending?action=candidates'),
        fetch('/api/admin/trending'),
        fetch('/api/admin/trending?action=analytics')
      ])

      if (candidatesRes.ok) {
        const candidatesData = await candidatesRes.json()
        setCandidates(candidatesData.candidates || [])
      }

      if (trendingRes.ok) {
        const trendingData = await trendingRes.json()
        setTrendingMinisters(trendingData.ministers || [])
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData.analytics)
      }
    } catch (error) {
      console.error('Error fetching trending data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAutoUpdate = async () => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auto-update', criteria })
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error auto-updating trending:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleManualUpdate = async (ministerIds: number[]) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', ministerIds })
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error updating trending:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleReset = async () => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/trending', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' })
      })

      if (response.ok) {
        await fetchData()
      }
    } catch (error) {
      console.error('Error resetting trending:', error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocoa-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Trending Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage trending ministers and configure automatic detection
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={handleAutoUpdate}
            disabled={updating}
            className="flex items-center space-x-2 px-4 py-2 bg-cocoa-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} />
            <span>Auto Update</span>
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold mb-4">Trending Criteria</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Votes (24h)
              </label>
              <input
                type="number"
                value={criteria.minVotes24h}
                onChange={(e) => setCriteria({...criteria, minVotes24h: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Vote Velocity (votes/hr)
              </label>
              <input
                type="number"
                step="0.1"
                value={criteria.minVoteVelocity}
                onChange={(e) => setCriteria({...criteria, minVoteVelocity: parseFloat(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Min Satisfaction Change (%)
              </label>
              <input
                type="number"
                value={criteria.minSatisfactionChange}
                onChange={(e) => setCriteria({...criteria, minSatisfactionChange: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Max Trending Count
              </label>
              <input
                type="number"
                value={criteria.maxTrendingCount}
                onChange={(e) => setCriteria({...criteria, maxTrendingCount: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Analytics */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Votes (24h)</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.totalVotes24h}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Vote Velocity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.voteVelocity.toFixed(1)}/hr
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.trendingMinisters}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Target className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Velocity</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {analytics.weeklyVelocity.toFixed(1)}/hr
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Current Trending Ministers */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Current Trending Ministers
          </h3>
          <button
            onClick={handleReset}
            disabled={updating}
            className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
          >
            Reset All
          </button>
        </div>
        
        {trendingMinisters.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No trending ministers currently
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trendingMinisters.map((minister) => (
              <div key={minister.id} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={minister.photoUrl}
                  alt={minister.fullName}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {minister.fullName}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {minister.portfolio}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      minister.trend === 'up' 
                        ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
                    }`}>
                      {minister.satisfactionRate}%
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {minister.voteChange} votes
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Trending Candidates */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Trending Candidates
        </h3>
        
        {candidates.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No trending candidates found
          </div>
        ) : (
          <div className="space-y-4">
            {candidates.map((candidate, index) => (
              <div key={candidate.ministerId} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-cocoa-green text-white rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <img
                    src={candidate.photoUrl}
                    alt={candidate.fullName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {candidate.fullName}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {candidate.portfolio}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                      {candidate.reason}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      Score: {candidate.trendingScore}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
                      <span>{candidate.satisfactionRate}%</span>
                      <span>•</span>
                      <span>{candidate.voteChange24h} votes</span>
                      <span>•</span>
                      <span>{candidate.voteVelocity}/hr</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleManualUpdate([candidate.ministerId])}
                    disabled={updating}
                    className="px-3 py-1 text-sm bg-cocoa-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                  >
                    Promote
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
