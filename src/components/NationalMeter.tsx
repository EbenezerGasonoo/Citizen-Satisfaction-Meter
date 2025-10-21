'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface NationalScore {
  satisfactionPercentage: number
  totalVotes: number
}

export default function NationalMeter() {
  const [score, setScore] = useState<NationalScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await fetch('/api/analytics/nationalScore')
        if (response.ok) {
          const data = await response.json()
          setScore(data)
        }
      } catch (error) {
        console.error('Failed to fetch national score:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchScore()
  }, [])

  if (loading) {
    return (
      <motion.div 
        className="flex justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-64 h-64 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
      </motion.div>
    )
  }

  if (!score) {
    return (
      <motion.div 
        className="text-center text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        Unable to load national satisfaction data
      </motion.div>
    )
  }

  const circumference = 2 * Math.PI * 120 // radius = 120
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score.satisfactionPercentage / 100) * circumference

  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <motion.h2 
        className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 dark:from-green-400 dark:via-emerald-400 dark:to-teal-400 bg-clip-text text-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        National Satisfaction Meter
      </motion.h2>
      <motion.p
        className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mb-8 sm:mb-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Real-time satisfaction ratings from citizens across Ghana
      </motion.p>
      
      <motion.div 
        className="flex flex-col sm:flex-row justify-center items-center gap-8 sm:gap-12"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        {/* Circular Meter */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72">
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-full blur-2xl opacity-30"
            style={{
              background: score.satisfactionPercentage >= 70 
                ? 'radial-gradient(circle, #10b981 0%, transparent 70%)' 
                : score.satisfactionPercentage >= 50 
                ? 'radial-gradient(circle, #f59e0b 0%, transparent 70%)'
                : 'radial-gradient(circle, #ef4444 0%, transparent 70%)'
            }}
          />
          
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={score.satisfactionPercentage >= 70 ? "#10b981" : score.satisfactionPercentage >= 50 ? "#f59e0b" : "#ef4444"} />
                <stop offset="100%" stopColor={score.satisfactionPercentage >= 70 ? "#06b6d4" : score.satisfactionPercentage >= 50 ? "#ef4444" : "#dc2626"} />
              </linearGradient>
            </defs>
            <circle
              cx="128"
              cy="128"
              r="110"
              stroke="currentColor"
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="20"
              fill="none"
            />
            {/* Progress circle with gradient */}
            <motion.circle
              cx="128"
              cy="128"
              r="110"
              stroke="url(#progressGradient)"
              strokeWidth="20"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
              filter="drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))"
            />
          </svg>
          
          {/* Center content with enhanced styling */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="text-6xl sm:text-7xl font-extrabold bg-gradient-to-br from-gray-800 to-gray-600 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2, type: "spring" }}
            >
              {score.satisfactionPercentage}%
            </motion.div>
            <motion.div 
              className="text-base sm:text-lg font-semibold text-gray-600 dark:text-gray-400 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Satisfied
            </motion.div>
          </motion.div>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-col gap-4 w-full max-w-xs sm:max-w-none">
          <motion.div
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-800"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <div className="text-sm font-medium text-green-700 dark:text-green-400 mb-1">Total Votes</div>
            <div className="text-3xl font-bold text-green-900 dark:text-green-300">
              {score.totalVotes.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 dark:text-green-500 mt-1">
              Citizens participated
            </div>
          </motion.div>

          <motion.div
            className={`rounded-2xl p-6 border ${
              score.satisfactionPercentage >= 70
                ? 'bg-gradient-to-br from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-200 dark:border-green-800'
                : score.satisfactionPercentage >= 50
                ? 'bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800'
                : 'bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/20 dark:to-pink-900/20 border-red-200 dark:border-red-800'
            }`}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2 }}
          >
            <div className={`text-sm font-medium mb-1 ${
              score.satisfactionPercentage >= 70
                ? 'text-green-700 dark:text-green-400'
                : score.satisfactionPercentage >= 50
                ? 'text-yellow-700 dark:text-yellow-400'
                : 'text-red-700 dark:text-red-400'
            }`}>
              Status
            </div>
            <div className={`text-2xl font-bold ${
              score.satisfactionPercentage >= 70
                ? 'text-green-900 dark:text-green-300'
                : score.satisfactionPercentage >= 50
                ? 'text-yellow-900 dark:text-yellow-300'
                : 'text-red-900 dark:text-red-300'
            }`}>
              {score.satisfactionPercentage >= 70 ? '🎉 Excellent' : score.satisfactionPercentage >= 50 ? '⚡ Moderate' : '⚠️ Needs Work'}
            </div>
            <div className={`text-xs mt-1 ${
              score.satisfactionPercentage >= 70
                ? 'text-green-600 dark:text-green-500'
                : score.satisfactionPercentage >= 50
                ? 'text-yellow-600 dark:text-yellow-500'
                : 'text-red-600 dark:text-red-500'
            }`}>
              {score.satisfactionPercentage >= 70 
                ? 'Ministers are performing well' 
                : score.satisfactionPercentage >= 50
                ? 'Room for improvement'
                : 'Significant improvements needed'}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
} 