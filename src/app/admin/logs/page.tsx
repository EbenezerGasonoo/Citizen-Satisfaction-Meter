'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  FileText, 
  Activity, 
  Users, 
  TrendingUp, 
  Database,
  RefreshCw,
  Filter,
  Download,
  Search,
  Clock,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react'

interface LogEntry {
  id: string
  type: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  timestamp: string
  data?: any
}

interface SystemStatistics {
  totalVotes: number
  totalMinisters: number
  totalUsers: number
  votesLast24h: number
  trendingMinisters: number
  lastUpdated: string
}

export default function SystemLogs() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [statistics, setStatistics] = useState<SystemStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [limit, setLimit] = useState(100)

  const fetchLogs = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/logs?type=${filter}&limit=${limit}`)
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
        setStatistics(data.statistics)
      } else {
        console.error('Failed to fetch logs')
      }
    } catch (error) {
      console.error('Error fetching logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
  }, [filter, limit])

  const filteredLogs = logs.filter(log => {
    if (searchTerm) {
      return log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
             log.type.toLowerCase().includes(searchTerm.toLowerCase())
    }
    return true
  })

  const getLevelIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />
      case 'warn':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />
      case 'debug':
        return <Activity className="w-4 h-4 text-gray-500" />
      default:
        return <Info className="w-4 h-4 text-gray-500" />
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'error':
        return 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
      case 'warn':
        return 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300'
      case 'info':
        return 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-300'
      case 'debug':
        return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300'
      default:
        return 'bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-300'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'vote':
        return <Users className="w-4 h-4" />
      case 'vote-stats':
        return <TrendingUp className="w-4 h-4" />
      case 'admin':
        return <Database className="w-4 h-4" />
      case 'system':
        return <Activity className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString()
  }

  const exportLogs = () => {
    const dataStr = JSON.stringify(logs, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `system-logs-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
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
            System Logs
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor system activity and performance
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-cocoa-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={exportLogs}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.totalVotes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ministers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.totalMinisters}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Activity className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Users</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.totalUsers}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">24h Votes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.votesLast24h}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-red-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Trending</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.trendingMinisters}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
            >
              <option value="all">All Logs</option>
              <option value="app">Application</option>
              <option value="votes">Votes</option>
              <option value="admin">Admin</option>
              <option value="system">System</option>
            </select>
            <select
              value={limit}
              onChange={(e) => setLimit(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
            >
              <option value="50">50 logs</option>
              <option value="100">100 logs</option>
              <option value="200">200 logs</option>
              <option value="500">500 logs</option>
            </select>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Log Entries ({filteredLogs.length})
          </h3>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No logs found
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log, index) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getLevelIcon(log.level)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {getTypeIcon(log.type)}
                          <span>{log.type}</span>
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(log.level)}`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatTimestamp(log.timestamp)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-900 dark:text-gray-100 mb-2">
                        {log.message}
                      </p>
                      {log.data && (
                        <details className="text-xs">
                          <summary className="cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            View Details
                          </summary>
                          <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-700 rounded text-gray-800 dark:text-gray-300 overflow-x-auto">
                            {JSON.stringify(log.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
