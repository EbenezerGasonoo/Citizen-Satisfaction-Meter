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
        className="text-2xl font-semibold mb-8 text-gray-800 dark:text-gray-200"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        National Satisfaction Meter
      </motion.h2>
      
      <motion.div 
        className="flex justify-center"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="relative w-64 h-64">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
            <circle
              cx="128"
              cy="128"
              r="120"
              stroke="#e5e7eb"
              className="dark:stroke-gray-700"
              strokeWidth="16"
              fill="none"
            />
            {/* Progress circle */}
            <motion.circle
              cx="128"
              cy="128"
              r="120"
              stroke={score.satisfactionPercentage >= 70 ? "#10b981" : score.satisfactionPercentage >= 50 ? "#f59e0b" : "#ef4444"}
              strokeWidth="16"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={strokeDasharray}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 2, ease: "easeOut", delay: 0.5 }}
            />
          </svg>
          
          {/* Center content */}
          <motion.div 
            className="absolute inset-0 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div 
              className="text-4xl font-bold text-gray-800 dark:text-gray-200"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              {score.satisfactionPercentage}%
            </motion.div>
            <motion.div 
              className="text-sm text-gray-600 dark:text-gray-400 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              Satisfied
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
      
      <motion.div 
        className="mt-6 text-gray-600 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8 }}
      >
        Based on {score.totalVotes.toLocaleString()} votes
      </motion.div>
    </motion.div>
  )
} 