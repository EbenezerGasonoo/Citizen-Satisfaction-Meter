'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Users, TrendingUp, Activity, Award } from 'lucide-react'

interface NationalScore {
  satisfactionPercentage: number
  totalVotes: number
  positiveVotes: number
  last24h: {
    satisfactionPercentage: number
    totalVotes: number
    positiveVotes: number
  }
  last7d: {
    satisfactionPercentage: number
    totalVotes: number
    positiveVotes: number
  }
  last30d: {
    satisfactionPercentage: number
    totalVotes: number
    positiveVotes: number
  }
  trends: {
    satisfactionChange24h: number
    voteChange24h: number
  }
}

export default function NationalMeter() {
  const [score, setScore] = useState<NationalScore | null>(null)
  const [loading, setLoading] = useState(true)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest))
  const [displayCount, setDisplayCount] = useState(0)

  const fetchScore = async () => {
    try {
      const response = await fetch('/api/analytics/nationalScore')
      if (response.ok) {
        const data = await response.json()
        setScore(data)
      }
    } catch (error) {
      console.error('Error fetching national score:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScore()
  }, [])

  useEffect(() => {
    const handleVoteUpdate = () => {
      console.log('NationalMeter: Vote submitted event received, refreshing score...')
      fetchScore()
    }

    window.addEventListener('voteSubmitted', handleVoteUpdate)
    // Poll every 10 seconds for real-time updates (reduced from 30s for better responsiveness)
    const interval = setInterval(() => {
      console.log('NationalMeter: Polling for vote updates...')
      fetchScore()
    }, 10000)

    return () => {
      window.removeEventListener('voteSubmitted', handleVoteUpdate)
      clearInterval(interval)
    }
  }, [])

  useEffect(() => {
    if (score) {
      setDisplayCount(score.totalVotes)
      
      const controls = animate(count, score.totalVotes, { 
        duration: 2,
        ease: "easeOut"
      })
      
      const unsubscribe = rounded.on('change', (latest) => {
        setDisplayCount(latest)
      })

      return () => {
        controls.stop()
        unsubscribe()
      }
    }
  }, [score, count, rounded])

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-600 dark:text-slate-400">Loading national metrics...</p>
        </div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className="text-center text-slate-500 dark:text-slate-400 py-12">
        Unable to load national satisfaction data
      </div>
    )
  }

  const getStatusConfig = () => {
    const percentage = score?.satisfactionPercentage || 0
    if (percentage >= 70) {
      return {
        label: 'Excellent',
        description: 'Strong citizen satisfaction across cabinet',
        color: 'text-green-600 dark:text-green-400',
        bg: 'bg-green-50 dark:bg-green-900/20',
        border: 'border-green-200 dark:border-green-800',
        progress: 'bg-green-600',
        badge: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
      }
    } else if (percentage >= 50) {
      return {
        label: 'Moderate',
        description: 'Room for improvement in some areas',
        color: 'text-yellow-600 dark:text-yellow-400',
        bg: 'bg-yellow-50 dark:bg-yellow-900/20',
        border: 'border-yellow-200 dark:border-yellow-800',
        progress: 'bg-yellow-600',
        badge: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
      }
    } else {
      return {
        label: 'Needs Improvement',
        description: 'Significant improvements required',
        color: 'text-red-600 dark:text-red-400',
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-200 dark:border-red-800',
        progress: 'bg-red-600',
        badge: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
      }
    }
  }

  const status = getStatusConfig()

  return (
    <div className="space-y-8 lg:space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-50">
          National Satisfaction Index
        </h2>
        <p className="text-base text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Aggregate performance metrics across all cabinet ministers
        </p>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Left Stats Column */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-5">
            {/* Total Votes Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Total Votes
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {(displayCount || score?.totalVotes || 0).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <span>Live updates</span>
              </div>
            </div>

            {/* Positive Votes Card */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Satisfied Votes
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                    {score.positiveVotes.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {score.totalVotes > 0 
                  ? `${Math.round((score.positiveVotes / score.totalVotes) * 100)}% of total`
                  : 'No votes yet'
                }
              </div>
            </div>

            {/* Status Card */}
            <div className={`bg-slate-50 dark:bg-slate-800/50 border ${status.border} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 ${status.bg} rounded-lg flex items-center justify-center`}>
                  <Activity className={`w-5 h-5 ${status.color}`} />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
                    Status
                  </div>
                  <div className={`text-lg font-bold ${status.color}`}>
                    {status.label}
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {status.description}
              </p>
            </div>
          </div>

          {/* Center Semi-Circular Gradient Meter */}
          <div className="lg:col-span-4 flex items-center justify-center">
            <motion.div 
              className="w-full max-w-lg"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 lg:p-10 shadow-lg border border-slate-200 dark:border-slate-800 h-full flex flex-col">
                {/* Title */}
                <motion.h3 
                  className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-widest mb-8 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  National Satisfaction Meter
                </motion.h3>
                
                {/* Semi-Circular Gradient Meter */}
                <div className="relative w-full max-w-lg mx-auto flex-1 flex flex-col" style={{ minHeight: '240px', height: '100%' }}>
                  <svg viewBox="0 0 200 110" className="w-full h-full flex-1">
                    <defs>
                      {/* Gradient from red to orange to yellow */}
                      <linearGradient id="satisfactionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="40%" stopColor="#f97316" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                    </defs>
                    
                    {/* Background arc (unfilled) - light gray */}
                    <path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="#e2e8f0"
                      strokeWidth="24"
                      strokeLinecap="round"
                      className="dark:stroke-slate-800"
                    />
                    
                    {/* Filled gradient arc - red to orange to yellow */}
                    <motion.path
                      d="M 20 100 A 80 80 0 0 1 180 100"
                      fill="none"
                      stroke="url(#satisfactionGradient)"
                      strokeWidth="24"
                      strokeLinecap="round"
                      strokeDasharray={251.33}
                      initial={{ strokeDashoffset: 251.33 }}
                      animate={{ 
                        strokeDashoffset: 251.33 - (251.33 * score.satisfactionPercentage / 100)
                      }}
                      transition={{ 
                        duration: 2, 
                        delay: 0.5,
                        ease: [0.43, 0.13, 0.23, 0.96]
                      }}
                    />
                  </svg>
                  
                  {/* Center Percentage Display */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ top: '32px' }}>
                    <motion.div 
                      className="flex items-baseline gap-1.5"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                    >
                      <span className="text-5xl lg:text-6xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                        {score.satisfactionPercentage}
                      </span>
                      <span className="text-3xl lg:text-4xl font-semibold text-slate-500 dark:text-slate-400">
                        %
                      </span>
                    </motion.div>
                  </div>
                </div>
                
                {/* Descriptive Text */}
                <motion.p 
                  className="text-sm text-slate-700 dark:text-slate-300 mt-3 text-center max-w-md mx-auto leading-relaxed"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2 }}
                >
                  The amount of satisfaction across all cabinet ministers
                </motion.p>
                
                {/* Status Badge */}
                <motion.div 
                  className={`mt-3 px-5 py-2.5 rounded-lg text-xs font-bold text-white text-center uppercase tracking-wider w-full max-w-xs mx-auto ${
                    score.satisfactionPercentage >= 70 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg shadow-green-500/30'
                      : score.satisfactionPercentage >= 50 
                      ? 'bg-gradient-to-r from-yellow-500 to-amber-500 shadow-lg shadow-yellow-500/30'
                      : 'bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/30'
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.5 }}
                >
                  {score.satisfactionPercentage >= 70 
                    ? 'EXCELLENT PERFORMANCE!' 
                    : score.satisfactionPercentage >= 50 
                    ? 'GOOD START!' 
                    : 'NEEDS IMPROVEMENT'}
                </motion.div>
              </div>
            </motion.div>
          </div>

          {/* Right Stats Column */}
          <div className="lg:col-span-4 space-y-4 lg:space-y-5">
            {/* 24h Change */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Last 24 Hours
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Satisfaction</span>
                  <span className={`text-sm font-semibold ${
                    score.trends.satisfactionChange24h >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {score.trends.satisfactionChange24h >= 0 ? '+' : ''}
                    {score.trends.satisfactionChange24h.toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">New Votes</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {score.last24h.totalVotes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 7 Day Stats */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Last 7 Days
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Satisfaction</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {score.last7d.satisfactionPercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Votes</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {score.last7d.totalVotes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* 30 Day Stats */}
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2">
                Last 30 Days
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Satisfaction</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {score.last30d.satisfactionPercentage}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600 dark:text-slate-400">Total Votes</span>
                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-50">
                    {score.last30d.totalVotes.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
