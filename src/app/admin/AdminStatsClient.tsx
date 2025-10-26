'use client'

import { useEffect, useState } from 'react'

interface AdminStats {
  totalVotes: number
  totalMinisters: number
  votesLast24h: number
  trendingMinisters: number
  totalUsers: number
  lastUpdated: Date
}

interface NationalScore {
  satisfactionPercentage: number
  totalVotes: number
}

export default function AdminStatsClient() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [satisfactionRate, setSatisfactionRate] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [logsResponse, scoreResponse] = await Promise.all([
          fetch('/api/admin/logs'),
          fetch('/api/analytics/nationalScore')
        ])

        if (logsResponse.ok) {
          const data = await logsResponse.json()
          if (data.statistics) {
            setStats(data.statistics)
          }
        } else {
          console.error('Failed to fetch admin logs:', logsResponse.status)
        }
        
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json()
          setSatisfactionRate(scoreData?.satisfactionPercentage || 0)
        } else {
          console.error('Failed to fetch national score:', scoreResponse.status)
        }
      } catch (error) {
        console.error('Error fetching admin stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.totalMinisters}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Ministers</div>
      </div>
      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.totalVotes.toLocaleString()}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
      </div>
      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{satisfactionRate}%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Satisfaction Rate</div>
      </div>
      <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.votesLast24h}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Today's Votes</div>
      </div>
    </div>
  )
}

