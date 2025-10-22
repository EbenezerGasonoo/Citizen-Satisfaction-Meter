'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Trash2, 
  AlertTriangle, 
  X, 
  CheckCircle, 
  Loader2,
  Users,
  MessageCircle,
  Heart,
  FileText,
  Activity
} from 'lucide-react'

interface Minister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  totalVotes: number
}

interface RemoveMinisterDialogProps {
  minister: Minister | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function RemoveMinisterDialog({ 
  minister, 
  isOpen, 
  onClose, 
  onSuccess 
}: RemoveMinisterDialogProps) {
  const [isRemoving, setIsRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleRemove = async () => {
    if (!minister) return

    if (confirmText !== minister.fullName) {
      setError('Please type the minister\'s full name to confirm')
      return
    }

    setIsRemoving(true)
    setError(null)

    try {
      const response = await fetch(`/api/admin/ministers/remove?id=${minister.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const data = await response.json()
        console.log('Minister removed:', data)
        onSuccess()
        onClose()
        setConfirmText('')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to remove minister')
      }
    } catch (error) {
      console.error('Error removing minister:', error)
      setError('Network error. Please try again.')
    } finally {
      setIsRemoving(false)
    }
  }

  const handleClose = () => {
    if (!isRemoving) {
      setConfirmText('')
      setError(null)
      onClose()
    }
  }

  if (!minister) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    Remove Minister
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This action cannot be undone
                  </p>
                </div>
              </div>
              <button
                onClick={handleClose}
                disabled={isRemoving}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Minister Info */}
              <div className="flex items-center space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <img
                  src={minister.photoUrl}
                  alt={minister.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    {minister.fullName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {minister.portfolio}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {minister.satisfactionRate}% satisfaction ({minister.totalVotes} votes)
                  </p>
                </div>
              </div>

              {/* Warning */}
              <div className="flex items-start space-x-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800 dark:text-red-300">
                  <p className="font-medium mb-1">Warning: This will permanently delete:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• All votes for this minister</li>
                    <li>• All comments about this minister</li>
                    <li>• All favorites of this minister</li>
                    <li>• All policies by this minister</li>
                    <li>• All actions by this minister</li>
                    <li>• The minister's profile and data</li>
                  </ul>
                </div>
              </div>

              {/* Confirmation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  To confirm, type the minister's full name:
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={minister.fullName}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  disabled={isRemoving}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-800 dark:text-red-300 rounded-lg"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Actions */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={handleClose}
                  disabled={isRemoving}
                  className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRemove}
                  disabled={isRemoving || confirmText !== minister.fullName}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {isRemoving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Removing...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Remove Minister</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
