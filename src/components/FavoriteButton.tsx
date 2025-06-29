'use client'

import { useState, useEffect } from 'react'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface FavoriteButtonProps {
  ministerId: number
  className?: string
}

export default function FavoriteButton({ ministerId, className = '' }: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Check initial favorite status
    const checkFavoriteStatus = async () => {
      try {
        const response = await fetch(`/api/ministers/${ministerId}/favorite`)
        if (response.ok) {
          const data = await response.json()
          setIsFavorited(data.favorited)
        }
      } catch (error) {
        console.error('Error checking favorite status:', error)
      }
    }

    checkFavoriteStatus()
  }, [ministerId])

  const toggleFavorite = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const response = await fetch(`/api/ministers/${ministerId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.ok) {
        const data = await response.json()
        setIsFavorited(data.favorited)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.button
      onClick={toggleFavorite}
      disabled={isLoading}
      className={`p-2 rounded-full transition-colors duration-200 ${
        isFavorited
          ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30'
          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
      } ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <motion.div
        animate={{ scale: isLoading ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <Heart
          className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`}
        />
      </motion.div>
    </motion.button>
  )
} 