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

    console.log('VoteButtons: Starting vote for minister', ministerId, 'type:', voteType)
    setIsVoting(true)
    setError(null)

    try {
      const voteData = { positive: voteType === 'satisfied' }
      console.log('VoteButtons: Sending vote data:', voteData)
      
      const response = await fetch(`/api/ministers/${ministerId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(voteData),
      })

      console.log('VoteButtons: Response status:', response.status)
      console.log('VoteButtons: Response ok:', response.ok)

      if (response.ok) {
        const responseData = await response.json()
        console.log('VoteButtons: Vote successful, response:', responseData)
        
        setVoted(voteType)
        onVoteSuccess?.()
        
        console.log('VoteButtons: Dispatching voteSubmitted event')
        setTimeout(() => {
          console.log('VoteButtons: Dispatching voteSubmitted event after delay')
          window.dispatchEvent(new CustomEvent('voteSubmitted'))
        }, 500)
      } else {
        const errorData = await response.json()
        console.error('VoteButtons: Vote failed:', errorData)
        setError(errorData.error || 'Failed to submit vote')
      }
    } catch (error) {
      console.error('VoteButtons: Network error:', error)
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
      <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-3xl mx-auto">
        <motion.button
          onClick={() => handleVote('satisfied')}
          disabled={voted !== null || isVoting}
          className={`group relative flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-2xl font-bold text-lg transition-all touch-manipulation overflow-hidden ${
            voted === 'satisfied'
              ? 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 text-white shadow-2xl shadow-green-500/50'
              : voted === 'not-satisfied'
              ? 'bg-white/50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600 hover:from-green-600 hover:via-emerald-600 hover:to-green-700 text-white shadow-xl shadow-green-500/30 hover:shadow-2xl hover:shadow-green-500/50'
          }`}
          variants={buttonVariants}
          initial="initial"
          whileHover={voted === null && !isVoting ? "hover" : "initial"}
          whileTap={voted === null && !isVoting ? "tap" : "initial"}
          animate={voted === 'satisfied' ? "voted" : "initial"}
        >
          {voted !== 'not-satisfied' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={voted === null && !isVoting ? {
                x: ['-200%', '200%'],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          )}
          
          <motion.div
            animate={isVoting ? { rotate: 360 } : voted === 'satisfied' ? { scale: [1, 1.2, 1] } : {}}
            transition={isVoting ? { duration: 1, repeat: Infinity } : { duration: 0.5 }}
          >
            {voted === 'satisfied' ? (
              <CheckCircle className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg" />
            ) : (
              <ThumbsUp className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg" />
            )}
          </motion.div>
          <span className="relative z-10 drop-shadow-md">
            {isVoting ? 'Voting...' : voted === 'satisfied' ? '✓ Satisfied' : '🇬🇭 Satisfied'}
          </span>
        </motion.button>

        <motion.button
          onClick={() => handleVote('not-satisfied')}
          disabled={voted !== null || isVoting}
          className={`group relative flex-1 flex items-center justify-center gap-3 px-8 py-6 rounded-2xl font-bold text-lg transition-all touch-manipulation overflow-hidden ${
            voted === 'not-satisfied'
              ? 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 text-white shadow-2xl shadow-red-500/50'
              : voted === 'satisfied'
              ? 'bg-white/50 dark:bg-slate-800/50 text-gray-400 dark:text-gray-500 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-700/50 cursor-not-allowed opacity-60'
              : 'bg-gradient-to-br from-red-500 via-rose-500 to-pink-600 hover:from-red-600 hover:via-rose-600 hover:to-pink-700 text-white shadow-xl shadow-red-500/30 hover:shadow-2xl hover:shadow-red-500/50'
          }`}
          variants={buttonVariants}
          initial="initial"
          whileHover={voted === null && !isVoting ? "hover" : "initial"}
          whileTap={voted === null && !isVoting ? "tap" : "initial"}
          animate={voted === 'not-satisfied' ? "voted" : "initial"}
        >
          {voted !== 'satisfied' && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
              animate={voted === null && !isVoting ? {
                x: ['-200%', '200%'],
              } : {}}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                delay: 1.5
              }}
            />
          )}
          
          <motion.div
            animate={isVoting ? { rotate: 360 } : voted === 'not-satisfied' ? { scale: [1, 1.2, 1] } : {}}
            transition={isVoting ? { duration: 1, repeat: Infinity } : { duration: 0.5 }}
          >
            {voted === 'not-satisfied' ? (
              <XCircle className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg" />
            ) : (
              <ThumbsDown className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-lg" />
            )}
          </motion.div>
          <span className="relative z-10 drop-shadow-md">
            {isVoting ? 'Voting...' : voted === 'not-satisfied' ? '✓ Not Satisfied' : '🇬🇭 Not Satisfied'}
          </span>
        </motion.button>
      </div>

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
              className={`inline-flex items-center gap-3 px-8 py-5 rounded-2xl shadow-2xl backdrop-blur-lg ${
                voted === 'satisfied' 
                  ? 'bg-gradient-to-r from-green-50/95 via-emerald-50/95 to-green-50/95 dark:from-green-900/80 dark:via-emerald-900/80 dark:to-green-900/80 text-green-700 dark:text-green-100 border-2 border-green-200/50 dark:border-green-700/50' 
                  : 'bg-gradient-to-r from-red-50/95 via-rose-50/95 to-pink-50/95 dark:from-red-900/80 dark:via-rose-900/80 dark:to-pink-900/80 text-red-700 dark:text-red-100 border-2 border-red-200/50 dark:border-red-700/50'
              }`}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              >
                {voted === 'satisfied' ? (
                  <CheckCircle className="w-7 h-7 drop-shadow" />
                ) : (
                  <XCircle className="w-7 h-7 drop-shadow" />
                )}
              </motion.div>
              <span className="font-bold text-base sm:text-lg drop-shadow-sm">
                🎉 Vote recorded! You can vote again tomorrow.
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              className="inline-flex items-center gap-3 px-8 py-5 rounded-2xl shadow-2xl backdrop-blur-lg bg-gradient-to-r from-red-50/95 via-orange-50/95 to-red-50/95 dark:from-red-900/80 dark:via-orange-900/80 dark:to-red-900/80 text-red-700 dark:text-red-100 border-2 border-red-200/50 dark:border-red-700/50"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
              >
                <XCircle className="w-7 h-7 drop-shadow" />
              </motion.div>
              <span className="font-bold text-base sm:text-lg drop-shadow-sm">{error}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 