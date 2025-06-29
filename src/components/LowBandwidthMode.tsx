'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Wifi, WifiOff, Settings, Download } from 'lucide-react'

interface LowBandwidthModeProps {
  onToggle: (enabled: boolean) => void
  isEnabled: boolean
}

export default function LowBandwidthMode({ onToggle, isEnabled }: LowBandwidthModeProps) {
  const [connectionSpeed, setConnectionSpeed] = useState<'fast' | 'slow' | 'unknown'>('unknown')
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    checkConnectionSpeed()
  }, [])

  const checkConnectionSpeed = async () => {
    try {
      const startTime = performance.now()
      const response = await fetch('/api/ministers?limit=1')
      const endTime = performance.now()
      
      const duration = endTime - startTime
      setConnectionSpeed(duration < 1000 ? 'fast' : 'slow')
    } catch (error) {
      setConnectionSpeed('slow')
    }
  }

  const handleToggle = () => {
    const newState = !isEnabled
    onToggle(newState)
    localStorage.setItem('lowBandwidthMode', newState.toString())
  }

  const getOptimizationTips = () => {
    return [
      'Reduced image quality for faster loading',
      'Minimal animations and transitions',
      'Simplified UI components',
      'Cached data for offline access',
      'Compressed API responses'
    ]
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
          isEnabled
            ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isEnabled ? (
          <WifiOff className="w-4 h-4" />
        ) : (
          <Wifi className="w-4 h-4" />
        )}
        <span className="text-sm font-medium">
          {isEnabled ? 'Low-Bandwidth' : 'Performance'}
        </span>
        <Settings className="w-4 h-4" />
      </motion.button>

      {/* Settings Panel */}
      <motion.div
        className={`absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${
          showSettings ? 'block' : 'hidden'
        }`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: showSettings ? 1 : 0, y: showSettings ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Performance Settings
            </h3>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Connection Status */}
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              {connectionSpeed === 'fast' ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-orange-500" />
              )}
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Connection: {connectionSpeed === 'fast' ? 'Good' : 'Slow'}
              </span>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {connectionSpeed === 'slow' 
                ? 'Consider enabling low-bandwidth mode for better performance'
                : 'Your connection is performing well'
              }
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Low-Bandwidth Mode
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Optimize for slower connections
              </p>
            </div>
            <button
              onClick={handleToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                isEnabled
                  ? 'bg-orange-500'
                  : 'bg-gray-300 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Optimization Tips */}
          {isEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                  Active Optimizations:
                </h4>
                <ul className="space-y-1">
                  {getOptimizationTips().map((tip, index) => (
                    <motion.li
                      key={index}
                      className="flex items-center space-x-2 text-xs text-gray-600 dark:text-gray-400"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Download className="w-3 h-3 text-green-500" />
                      <span>{tip}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          {/* Performance Metrics */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Performance Metrics
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-gray-600 dark:text-gray-400">Data Usage</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {isEnabled ? 'Reduced' : 'Standard'}
                </p>
              </div>
              <div className="text-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="text-gray-600 dark:text-gray-400">Load Time</p>
                <p className="font-semibold text-gray-900 dark:text-gray-100">
                  {isEnabled ? 'Faster' : 'Normal'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Backdrop */}
      {showSettings && (
        <motion.div
          className="fixed inset-0 z-40"
          onClick={() => setShowSettings(false)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </div>
  )
} 