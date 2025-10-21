'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface Submission {
  id: number
  type: string
  message: string
  email: string | null
  status: string
  createdAt: string
  updatedAt: string
}

const typeConfig = {
  suggestion: { emoji: '💡', color: 'green', label: 'Suggestion' },
  bug: { emoji: '🐛', color: 'red', label: 'Bug Report' },
  nominate: { emoji: '🎯', color: 'blue', label: 'Nomination' }
}

const statusConfig = {
  pending: { emoji: '⏳', color: 'yellow', label: 'Pending' },
  reviewed: { emoji: '👀', color: 'blue', label: 'Reviewed' },
  resolved: { emoji: '✅', color: 'green', label: 'Resolved' },
  rejected: { emoji: '❌', color: 'red', label: 'Rejected' }
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const fetchSubmissions = async () => {
    try {
      const response = await fetch('/api/submissions')
      const data = await response.json()
      if (data.success) {
        setSubmissions(data.submissions)
      }
    } catch (error) {
      console.error('Error fetching submissions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSubmissions = submissions.filter(sub => {
    const typeMatch = filter === 'all' || sub.type === filter
    const statusMatch = statusFilter === 'all' || sub.status === statusFilter
    return typeMatch && statusMatch
  })

  const stats = {
    total: submissions.length,
    suggestion: submissions.filter(s => s.type === 'suggestion').length,
    bug: submissions.filter(s => s.type === 'bug').length,
    nominate: submissions.filter(s => s.type === 'nominate').length,
    pending: submissions.filter(s => s.status === 'pending').length
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading submissions...</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl transition-all shadow-md hover:shadow-lg mb-6"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Admin</span>
          </Link>

          <h1 className="text-4xl font-extrabold mb-3 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
            📥 User Submissions
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Manage suggestions, bug reports, and minister nominations
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total', value: stats.total, color: 'purple' },
            { label: 'Suggestions', value: stats.suggestion, color: 'green' },
            { label: 'Bugs', value: stats.bug, color: 'red' },
            { label: 'Nominations', value: stats.nominate, color: 'blue' },
            { label: 'Pending', value: stats.pending, color: 'yellow' }
          ].map((stat) => (
            <motion.div
              key={stat.label}
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-4 shadow-lg border border-gray-200 dark:border-gray-700"
              whileHover={{ y: -4 }}
            >
              <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Filter by Type
              </label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 transition-all"
              >
                <option value="all">All Types</option>
                <option value="suggestion">💡 Suggestions</option>
                <option value="bug">🐛 Bug Reports</option>
                <option value="nominate">🎯 Nominations</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 transition-all"
              >
                <option value="all">All Statuses</option>
                <option value="pending">⏳ Pending</option>
                <option value="reviewed">👀 Reviewed</option>
                <option value="resolved">✅ Resolved</option>
                <option value="rejected">❌ Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-4">
          {filteredSubmissions.length === 0 ? (
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-12 shadow-lg border border-gray-200 dark:border-gray-700 text-center">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 dark:text-gray-400 text-lg">
                No submissions found matching your filters.
              </p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => {
              const typeInfo = typeConfig[submission.type as keyof typeof typeConfig]
              const statusInfo = statusConfig[submission.status as keyof typeof statusConfig]
              
              return (
                <motion.div
                  key={submission.id}
                  className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -2 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="text-2xl">{typeInfo?.emoji}</span>
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                          {typeInfo?.label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                          submission.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400' :
                          submission.status === 'reviewed' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                          submission.status === 'resolved' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' :
                          'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                        }`}>
                          {statusInfo?.emoji} {statusInfo?.label}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          #{submission.id}
                        </span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 mb-3 whitespace-pre-wrap">
                        {submission.message}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                        {submission.email && (
                          <div className="flex items-center gap-1">
                            <span>📧</span>
                            <span>{submission.email}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{new Date(submission.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>🕐</span>
                          <span>{new Date(submission.createdAt).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}


