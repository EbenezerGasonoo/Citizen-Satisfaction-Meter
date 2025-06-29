'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

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

  useEffect(() => {
    // Mock real-time notifications for demo purposes
    // In production, this would use Ably or similar real-time service
    const mockNotifications = [
      {
        id: '1',
        ministerName: 'Cassiel Ato Forson',
        portfolio: 'Finance & Economic Planning',
        positive: true,
        timestamp: new Date()
      },
      {
        id: '2',
        ministerName: 'Haruna Iddrisu',
        portfolio: 'Education',
        positive: false,
        timestamp: new Date()
      },
      {
        id: '3',
        ministerName: 'Samuel Nartey George',
        portfolio: 'Communications',
        positive: true,
        timestamp: new Date()
      }
    ]

    // Simulate real-time updates
    const interval = setInterval(() => {
      const randomMinister = mockNotifications[Math.floor(Math.random() * mockNotifications.length)]
      const newNotification: VoteNotification = {
        ...randomMinister,
        id: Date.now().toString(),
        timestamp: new Date()
      }

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)])
    }, 5000) // New notification every 5 seconds

    setIsConnected(true)

    return () => clearInterval(interval)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
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
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border-l-4 border-cocoa-green dark:border-green-500 p-4 max-w-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${
                notification.positive ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
              }`}>
                {notification.positive ? (
                  <ThumbsUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                  <ThumbsDown className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {notification.ministerName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {notification.portfolio}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
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
              <span className={`text-xs font-medium ${
                notification.positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              }`}>
                {notification.positive ? 'Satisfied' : 'Not Satisfied'}
              </span>
              <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
              <span className="text-xs text-gray-400 dark:text-gray-500">Live Vote</span>
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
          isConnected ? 'bg-green-500' : 'bg-red-500'
        }`} />
        <span>{isConnected ? 'Live Updates Active' : 'Connecting...'}</span>
      </motion.div>
    </div>
  )
} 