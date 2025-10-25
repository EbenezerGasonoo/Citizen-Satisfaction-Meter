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

    let interval: NodeJS.Timeout | null = null

    const fetchRecentVotes = async () => {
      try {
        // Get recent votes from the last 30 seconds
        const response = await fetch('/api/analytics/recent-votes')
        if (response.ok) {
          const recentVotes = await response.json()
          
          // Add new votes as notifications
          recentVotes.forEach((vote: any) => {
            const notification: VoteNotification = {
              id: `vote-${vote.id}`,
              ministerName: vote.ministerName,
              portfolio: vote.portfolio,
              positive: vote.positive,
              timestamp: new Date(vote.createdAt)
            }
            
            setNotifications(prev => {
              // Avoid duplicates
              if (prev.some(n => n.id === notification.id)) {
                return prev
              }
              return [notification, ...prev.slice(0, 4)]
            })
          })
        }
      } catch (error) {
        console.error('Error fetching recent votes:', error)
      }
    }

    const checkVoteCount = async () => {
      try {
        const response = await fetch('/api/analytics/nationalScore')
        if (response.ok) {
          const data = await response.json()
          setTotalVotes(data.totalVotes || 0)
        }
      } catch (error) {
        console.error('Error fetching vote count:', error)
      }
    }

    // Listen for vote submissions
    const handleVoteSubmitted = () => {
      // Check for new votes immediately when a vote is submitted
      fetchRecentVotes()
      checkVoteCount()
    }

    window.addEventListener('voteSubmitted', handleVoteSubmitted)

    // Start real-time monitoring
    interval = setInterval(async () => {
      await fetchRecentVotes()
      await checkVoteCount()
    }, 3000) // Check every 3 seconds for new votes

    setIsConnected(true)

    // Initial check
    fetchRecentVotes()
    checkVoteCount()

    return () => {
      if (interval) clearInterval(interval)
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
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-xl border-l-4 p-4 max-w-sm border ${
              notification.positive 
                ? 'border-l-green-500 border-green-100 dark:border-green-800' 
                : 'border-l-red-500 border-red-100 dark:border-red-800'
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                notification.positive 
                  ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800' 
                  : 'bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900 dark:to-red-800'
              }`}>
                {notification.positive ? (
                  <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {notification.ministerName}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  {notification.portfolio}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {notification.timestamp.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
            <div className="mt-2 flex items-center space-x-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                notification.positive 
                  ? 'text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30' 
                  : 'text-red-700 dark:text-red-300 bg-red-100 dark:bg-red-900/30'
              }`}>
                {notification.positive ? '✓ Satisfied' : '✗ Not Satisfied'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
              <span className="text-xs text-yellow-600 dark:text-yellow-400 font-bold">🇬🇭 Live Vote</span>
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
        <div className={`w-2 h-2 rounded-full ${
          isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
        }`} />
        <span className="text-xs font-medium">
          {isConnected ? `🇬🇭 Live Updates (${totalVotes} votes)` : 'Connecting...'}
        </span>
      </motion.div>
    </div>
  )
} 