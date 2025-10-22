'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CheckCircle, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react'

interface VoteButtonsProps {
  ministerId: number
  onVoteSuccess?: () => void
}

export default function VoteButtons({ ministerId, onVoteSuccess }: VoteButtonsProps) {
  const [voted, setVoted] = useState<'satisfied' | 'not-satisfied' | null>(null)
  const [isVoting, setIsVoting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVote = async (voteType: 'satisfied' | 'not-satisfied') => {
    if (voted || isVoting) return

    setIsVoting(true)
    setError(null)

    try {
      const response = await fetch(`/api/ministers/${ministerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          positive: voteType === 'satisfied' 
        }),
      })

      if (response.ok) {
        setVoted(voteType)
        onVoteSuccess?.()
        
        // Dispatch custom event to update meter
        window.dispatchEvent(new CustomEvent('voteSubmitted'))
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit vote')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setIsVoting(false)
    }
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    },
    voted: { 
      scale: 1.02,
      transition: { duration: 0.2 }
    }
  }

  const successVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: { duration: 0.2 }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-2xl mx-auto">
        {/* Satisfied Button */}
        <motion.button
          onClick={() => handleVote('satisfied')}
          disabled={voted !== null || isVoting}
          className={`flex-1 flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all touch-manipulation ${
            voted === 'satisfied'
              ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-xl shadow-green-500/30 ring-4 ring-green-200 dark:ring-green-900/50'
              : voted === 'not-satisfied'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg shadow-green-500/20 hover:shadow-xl hover:shadow-green-500/40 border-2 border-transparent'
          }`}
          variants={buttonVariants}
          initial="initial"
          whileHover={voted === null && !isVoting ? "hover" : "initial"}
          whileTap={voted === null && !isVoting ? "tap" : "initial"}
          animate={voted === 'satisfied' ? "voted" : "initial"}
        >
          <motion.div
            animate={isVoting ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isVoting ? Infinity : 0 }}
          >
            {voted === 'satisfied' ? (
              <CheckCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <ThumbsUp className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </motion.div>
          <span>{isVoting ? 'Voting...' : 'Satisfied'}</span>
        </motion.button>

        {/* Not Satisfied Button */}
        <motion.button
          onClick={() => handleVote('not-satisfied')}
          disabled={voted !== null || isVoting}
          className={`flex-1 flex items-center justify-center gap-3 px-6 sm:px-8 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-lg transition-all touch-manipulation ${
            voted === 'not-satisfied'
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-xl shadow-red-500/30 ring-4 ring-red-200 dark:ring-red-900/50'
              : voted === 'satisfied'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 border-2 border-gray-200 dark:border-gray-700 cursor-not-allowed opacity-50'
              : 'bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white shadow-lg shadow-red-500/20 hover:shadow-xl hover:shadow-red-500/40 border-2 border-transparent'
          }`}
          variants={buttonVariants}
          initial="initial"
          whileHover={voted === null && !isVoting ? "hover" : "initial"}
          whileTap={voted === null && !isVoting ? "tap" : "initial"}
          animate={voted === 'not-satisfied' ? "voted" : "initial"}
        >
          <motion.div
            animate={isVoting ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isVoting ? Infinity : 0 }}
          >
            {voted === 'not-satisfied' ? (
              <XCircle className="w-6 h-6 sm:w-7 sm:h-7" />
            ) : (
              <ThumbsDown className="w-6 h-6 sm:w-7 sm:h-7" />
            )}
          </motion.div>
          <span>{isVoting ? 'Voting...' : 'Not Satisfied'}</span>
        </motion.button>
      </div>

      {/* Success Message */}
      <AnimatePresence>
        {voted && (
          <motion.div
            className="text-center"
            variants={successVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className={`inline-flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg ${
                voted === 'satisfied' 
                  ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 text-green-800 dark:text-green-200 border-2 border-green-300 dark:border-green-700' 
                  : 'bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-700'
              }`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              {voted === 'satisfied' ? (
                <CheckCircle className="w-6 h-6" />
              ) : (
                <XCircle className="w-6 h-6" />
              )}
              <span className="font-bold text-base sm:text-lg">
                🎉 Vote recorded! You can vote again tomorrow.
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="text-center"
            variants={successVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-6 py-4 rounded-2xl shadow-lg bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/50 dark:to-pink-900/50 text-red-800 dark:text-red-200 border-2 border-red-300 dark:border-red-700"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring" }}
            >
              <XCircle className="w-6 h-6" />
              <span className="font-bold text-base sm:text-lg">{error}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 