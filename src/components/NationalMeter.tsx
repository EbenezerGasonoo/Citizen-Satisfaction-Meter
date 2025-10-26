'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Users, TrendingUp, Award } from 'lucide-react'

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
      console.log('NationalMeter: Fetching national score...')
      const response = await fetch('/api/analytics/nationalScore')
      if (response.ok) {
        const data = await response.json()
        console.log('NationalMeter: Received data:', data) // Debug log
        setScore(data)
      } else {
        console.error('NationalMeter: Failed to fetch national score:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('NationalMeter: Error fetching national score:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScore()
  }, [])

  // Listen for vote updates
  useEffect(() => {
    const handleVoteUpdate = () => {
      console.log('NationalMeter: Received voteSubmitted event, refreshing score')
      fetchScore()
    }

    // Listen for custom vote events
    window.addEventListener('voteSubmitted', handleVoteUpdate)
    
    // Also poll every 30 seconds for updates
    const interval = setInterval(fetchScore, 30000)

    return () => {
      window.removeEventListener('voteSubmitted', handleVoteUpdate)
      clearInterval(interval)
    }
  }, [])

  // Animate vote count
  useEffect(() => {
    if (score) {
      // Set initial display count immediately
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
        <motion.div 
          className="relative w-64 h-64"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="absolute inset-0 border-8 border-gray-200 dark:border-gray-700 rounded-full" />
          <motion.div
            className="absolute inset-0 border-8 border-transparent border-t-blue-500 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      </div>
    )
  }

  if (!score) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 py-12">
        Unable to load national satisfaction data
      </div>
    )
  }

  const circumference = 2 * Math.PI * 110
  const strokeDashoffset = circumference - ((score?.satisfactionPercentage || 0) / 100) * circumference

  // Ghanaian flag color scheme based on score
  const getColors = () => {
    if ((score?.satisfactionPercentage || 0) >= 70) {
      return {
        primary: '#10b981', // Green
        secondary: '#34d399',
        gradient: 'from-green-500 via-green-400 to-green-500',
        bg: 'from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950',
        border: 'border-green-200 dark:border-green-800',
        text: 'text-green-700 dark:text-green-300',
        icon: 'text-green-600 dark:text-green-400',
        badgeBg: 'bg-green-100 dark:bg-green-900/40',
        shadow: 'shadow-green-500/20'
      }
    } else if ((score?.satisfactionPercentage || 0) >= 50) {
      return {
        primary: '#f59e0b', // Yellow
        secondary: '#fbbf24',
        gradient: 'from-yellow-500 via-yellow-400 to-yellow-500',
        bg: 'from-yellow-50 to-amber-50 dark:from-yellow-950 dark:to-amber-950',
        border: 'border-yellow-200 dark:border-yellow-800',
        text: 'text-yellow-700 dark:text-yellow-300',
        icon: 'text-yellow-600 dark:text-yellow-400',
        badgeBg: 'bg-yellow-100 dark:bg-yellow-900/40',
        shadow: 'shadow-yellow-500/20'
      }
    } else {
      return {
        primary: '#ef4444', // Red
        secondary: '#f87171',
        gradient: 'from-red-500 via-red-400 to-red-500',
        bg: 'from-red-50 to-rose-50 dark:from-red-950 dark:to-rose-950',
        border: 'border-red-200 dark:border-red-800',
        text: 'text-red-700 dark:text-red-300',
        icon: 'text-red-600 dark:text-red-400',
        badgeBg: 'bg-red-100 dark:bg-red-900/40',
        shadow: 'shadow-red-500/20'
      }
    }
  }

  const colors = getColors()

  const getStatusText = () => {
    if ((score?.satisfactionPercentage || 0) >= 70) return 'Excellent Performance'
    if ((score?.satisfactionPercentage || 0) >= 50) return 'Moderate Performance'
    return 'Needs Improvement'
  }

  const getStatusDescription = () => {
    if ((score?.satisfactionPercentage || 0) >= 70) return 'Ministers are performing exceptionally well'
    if ((score?.satisfactionPercentage || 0) >= 50) return 'Performance shows room for improvement'
    return 'Significant improvements needed in multiple areas'
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-3">
          National Satisfaction Meter
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Real-time performance ratings from citizens across Ghana
        </p>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Stats Cards - Left */}
          <div className="order-2 lg:order-1 space-y-4">
            {/* Total Votes Card */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-3xl p-6 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group h-full"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex flex-col justify-between h-full">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                      Total Votes
                    </span>
                  </div>
                  <motion.div 
                    className="text-4xl font-black text-blue-900 dark:text-blue-100 mb-2"
                    key={displayCount}
                  >
                    {(displayCount || score?.totalVotes || 0).toLocaleString()}
                  </motion.div>
                  <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                    Citizens participated
                  </div>
                </div>
                
                <div className="mt-4 flex items-center gap-2">
                  <motion.div
                    className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-md group-hover:shadow-blue-500/50 transition-shadow"
                    whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <TrendingUp className="w-4 h-4 text-white" />
                  </motion.div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                      <motion.div 
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <span className="font-semibold">Live</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Performance Status Card */}
            <motion.div
              className={`bg-gradient-to-br ${colors.bg} rounded-3xl p-6 border ${colors.border} shadow-lg ${colors.shadow} hover:shadow-2xl transition-all duration-300 cursor-pointer group h-full`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Performance
                  </span>
                  <motion.div
                    className={`px-2 py-1 ${colors.badgeBg} rounded-full`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 1, type: "spring" }}
                  >
                    <span className={`text-xs font-bold ${colors.icon}`}>
                      {score.satisfactionPercentage >= 70 ? '🎉' : score.satisfactionPercentage >= 50 ? '⚡' : '⚠️'}
                    </span>
                  </motion.div>
                </div>

                <motion.div 
                  className={`text-2xl font-black ${colors.text}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {getStatusText()}
                </motion.div>
                
                <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {getStatusDescription()}
                </div>
                
                {/* Animated Progress Bar */}
                <div className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">Score</span>
                    <motion.span 
                      className={colors.icon}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.2 }}
                    >
                      {score.satisfactionPercentage}%
                    </motion.span>
                  </div>
                  <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                      className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors.gradient} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${score.satisfactionPercentage}%` }}
                      transition={{ 
                        duration: 2,
                        ease: [0.43, 0.13, 0.23, 0.96],
                        delay: 0.8
                      }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Circular Meter - Center */}
          <motion.div 
            className="flex justify-center order-1 lg:order-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="relative">
              {/* Animated glow effect */}
              <motion.div
                className="absolute inset-0 rounded-full blur-2xl opacity-30"
                style={{
                  background: `radial-gradient(circle, ${colors.primary}, transparent 70%)`
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [0.2, 0.4, 0.2]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

            <div className="relative w-72 h-72 sm:w-80 sm:h-80">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 256 256">
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={colors.primary} />
                    <stop offset="50%" stopColor={colors.secondary} />
                    <stop offset="100%" stopColor={colors.primary} />
                  </linearGradient>
                  <filter id="shadow">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={colors.primary} floodOpacity="0.5"/>
                  </filter>
                </defs>
                
                {/* Background circle */}
                <circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700/50"
                  strokeWidth="20"
                  fill="none"
                />
                
                {/* Animated progress circle */}
                <motion.circle
                  cx="128"
                  cy="128"
                  r="110"
                  stroke="url(#progressGradient)"
                  strokeWidth="20"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ 
                    duration: 2,
                    ease: [0.43, 0.13, 0.23, 0.96],
                    delay: 0.5
                  }}
                  filter="url(#shadow)"
                />

                {/* Decorative dots along the circle */}
                {[...Array(12)].map((_, i) => {
                  const angle = (i / 12) * 2 * Math.PI
                  const x = 128 + 110 * Math.cos(angle)
                  const y = 128 + 110 * Math.sin(angle)
                  const isActive = (i / 12) <= ((score?.satisfactionPercentage || 0) / 100)
                  
                  return (
                    <motion.circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="3"
                      fill={isActive ? colors.primary : 'currentColor'}
                      className={isActive ? '' : 'text-gray-300 dark:text-gray-600'}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.5 + (i * 0.05),
                        type: "spring",
                        stiffness: 200
                      }}
                    />
                  )
                })}
              </svg>
              
              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.div 
                  className={`text-7xl sm:text-8xl font-black ${colors.text}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    duration: 0.8,
                    delay: 1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  {score.satisfactionPercentage}%
                </motion.div>
                <motion.div 
                  className="text-gray-600 dark:text-gray-400 mt-2 text-lg font-semibold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                >
                  Satisfaction Rate
                </motion.div>

                {/* Award badge for high scores */}
                {(score?.satisfactionPercentage || 0) >= 70 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: 1.5, type: "spring" }}
                    className={`mt-4 flex items-center gap-2 px-4 py-2 ${colors.badgeBg} rounded-full`}
                  >
                    <Award className={`w-5 h-5 ${colors.icon}`} />
                    <span className={`text-sm font-bold ${colors.text}`}>Top Rated</span>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

          {/* Right side - empty for balance or future cards */}
          <div className="order-3 hidden lg:block">
            {/* Reserved for potential future stats or balance */}
          </div>
        </div>
      </div>
    </div>
  )
}
