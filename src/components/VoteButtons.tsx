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
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to submit vote')
      }
    } catch (err) {
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
    <div className="space-y-4">
      <div className="flex gap-4 justify-center">
        {/* Satisfied Button */}
        <motion.button
          onClick={() => handleVote('satisfied')}
          disabled={voted !== null || isVoting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            voted === 'satisfied'
              ? 'bg-green-100 text-green-800 border-2 border-green-300'
              : voted === 'not-satisfied'
              ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
              : 'bg-green-500 text-white hover:bg-green-600 border-2 border-green-500'
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
              <CheckCircle className="w-5 h-5" />
            ) : (
              <ThumbsUp className="w-5 h-5" />
            )}
          </motion.div>
          {isVoting ? 'Voting...' : 'Satisfied'}
        </motion.button>

        {/* Not Satisfied Button */}
        <motion.button
          onClick={() => handleVote('not-satisfied')}
          disabled={voted !== null || isVoting}
          className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
            voted === 'not-satisfied'
              ? 'bg-red-100 text-red-800 border-2 border-red-300'
              : voted === 'satisfied'
              ? 'bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed'
              : 'bg-red-500 text-white hover:bg-red-600 border-2 border-red-500'
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
              <XCircle className="w-5 h-5" />
            ) : (
              <ThumbsDown className="w-5 h-5" />
            )}
          </motion.div>
          {isVoting ? 'Voting...' : 'Not Satisfied'}
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
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
                voted === 'satisfied' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {voted === 'satisfied' ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <XCircle className="w-4 h-4" />
              )}
              <span className="font-medium">
                Vote recorded! You can vote again tomorrow.
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 text-red-800"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <XCircle className="w-4 h-4" />
              <span className="font-medium">{error}</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 