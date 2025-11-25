'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { XCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

interface VoteNotification {
  id: string
  ministerName: string
  portfolio: string
  positive: boolean
  timestamp: Date
}

export default function VoteNotification() {
  const [notifications, setNotifications] = useState<VoteNotification[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [totalVotes, setTotalVotes] = useState(0)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768) // 768px is typical tablet breakpoint
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    // Don't start notifications on mobile devices
    if (isMobile) {
      setIsConnected(false)
      return
    }

    const checkVoteCount = async () => {
      try {
        console.log('VoteNotification: Fetching vote count...')
        const response = await fetch(`/api/analytics/nationalScore?t=${Date.now()}`)
        if (response.ok) {
          const data = await response.json()
          console.log('VoteNotification: Received vote count data:', data)
          setTotalVotes(data.totalVotes || 0)
        }
      } catch (error) {
        console.error('VoteNotification: Error fetching vote count:', error)
      }
    }

    // Listen for vote submissions - only show notifications when someone actually votes
    const handleVoteSubmitted = async (event: Event) => {
      try {
        console.log('VoteNotification: Received voteSubmitted event')

        // Get the most recent vote from the event data or fetch it
        const response = await fetch('/api/analytics/recent-votes?limit=1')
        if (response.ok) {
          const recentVotes = await response.json()

          if (recentVotes.length > 0) {
            const vote = recentVotes[0]
            const notification: VoteNotification = {
              id: `vote-${vote.id}-${Date.now()}`, // Add timestamp to ensure uniqueness
              ministerName: vote.ministerName,
              portfolio: vote.portfolio,
              positive: vote.positive,
              timestamp: new Date(vote.createdAt)
            }

            setNotifications(prev => {
              // Avoid duplicates by checking if we already have this vote
              if (prev.some(n => n.id === notification.id)) {
                return prev
              }
              return [notification, ...prev.slice(0, 2)] // Limit to 2 notifications max
            })

            // Auto-dismiss notification after 3 seconds
            setTimeout(() => {
              setNotifications(prev => prev.filter(n => n.id !== notification.id))
            }, 3000)
          }
        }

        // Update vote count
        console.log('VoteNotification: Updating vote count...')
        await checkVoteCount()
      } catch (error) {
        console.error('VoteNotification: Error handling vote submission:', error)
      }
    }

    // Listen for the custom voteSubmitted event
    window.addEventListener('voteSubmitted', handleVoteSubmitted)

    setIsConnected(true)

    // Initial vote count check
    checkVoteCount()

    return () => {
      window.removeEventListener('voteSubmitted', handleVoteSubmitted)
    }
  }, [isMobile])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }

  // Don't render on mobile devices
  if (isMobile) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 300, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 300, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 p-3 max-w-xs border ${notification.positive
                ? 'border-l-green-500 border-green-100 dark:border-green-800'
                : 'border-l-red-500 border-red-100 dark:border-red-800'
              }`}
          >
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-full ${notification.positive
                  ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800'
                  : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'
                }`}>
                {notification.positive ? (
                  <ThumbsUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : (
                  <ThumbsDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 dark:text-gray-100 truncate">
                  {notification.ministerName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 truncate">
                  {notification.portfolio}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XCircle className="w-3 h-3" />
              </button>
            </div>
            <div className="mt-1 flex items-center justify-between">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${notification.positive
                  ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30'
                  : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
                }`}>
                {notification.positive ? '✓' : '✗'}
              </span>
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">🇬🇭 Live</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400"
      >
        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`} />
        <span className="text-xs font-medium">
          {isConnected ? `🇬🇭 Live Updates (${totalVotes} votes)` : 'Connecting...'}
        </span>
      </motion.div>
    </div>
  )
} 