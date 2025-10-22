'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Shield, 
  Download, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Database,
  Clock,
  Users,
  TrendingUp,
  RefreshCw,
  Trash2
} from 'lucide-react'

interface VoteIntegrity {
  isValid: boolean
  totalVotes: number
  corruptedVotes: number
  lastCheck: string
}

interface BackupInfo {
  filename: string
  size: string
  date: string
  votesBackedUp: number
}

interface VoteStatistics {
  totalVotes: number
  votesToday: number
  lastBackup: string | null
}

export default function AdminVotePreservationClient() {
  const [integrity, setIntegrity] = useState<VoteIntegrity | null>(null)
  const [backups, setBackups] = useState<BackupInfo[]>([])
  const [statistics, setStatistics] = useState<VoteStatistics | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchData = async () => {
    setLoading(true)
    try {
      const [integrityRes, backupsRes, statsRes] = await Promise.all([
        fetch('/api/admin/vote-preservation?action=status'),
        fetch('/api/admin/vote-preservation?action=backups'),
        fetch('/api/admin/vote-preservation')
      ])

      if (integrityRes.ok) {
        const integrityData = await integrityRes.json()
        setIntegrity(integrityData.integrity)
      }

      if (backupsRes.ok) {
        const backupsData = await backupsRes.json()
        setBackups(backupsData.backups || [])
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStatistics(statsData.statistics)
      }
    } catch (error) {
      console.error('Error fetching vote preservation data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleCreateBackup = async () => {
    setActionLoading('create-backup')
    try {
      const response = await fetch('/api/admin/vote-preservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-backup' })
      })

      if (response.ok) {
        await fetchData()
        alert('Backup created successfully!')
      } else {
        alert('Failed to create backup')
      }
    } catch (error) {
      console.error('Error creating backup:', error)
      alert('Error creating backup')
    } finally {
      setActionLoading(null)
    }
  }

  const handleRestoreBackup = async (backupFile: string) => {
    if (!confirm(`Are you sure you want to restore backup "${backupFile}"? This will overwrite current data.`)) {
      return
    }

    setActionLoading(`restore-${backupFile}`)
    try {
      const response = await fetch('/api/admin/vote-preservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore-backup', filename: backupFile })
      })

      if (response.ok) {
        await fetchData()
        alert('Backup restored successfully!')
      } else {
        alert('Failed to restore backup')
      }
    } catch (error) {
      console.error('Error restoring backup:', error)
      alert('Error restoring backup')
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteBackup = async (backupFile: string) => {
    if (!confirm(`Are you sure you want to delete backup "${backupFile}"?`)) {
      return
    }

    setActionLoading(`delete-${backupFile}`)
    try {
      const response = await fetch('/api/admin/vote-preservation', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: backupFile })
      })

      if (response.ok) {
        await fetchData()
        alert('Backup deleted successfully!')
      } else {
        alert('Failed to delete backup')
      }
    } catch (error) {
      console.error('Error deleting backup:', error)
      alert('Error deleting backup')
    } finally {
      setActionLoading(null)
    }
  }

  const handleVerifyIntegrity = async () => {
    setActionLoading('verify-integrity')
    try {
      const response = await fetch('/api/admin/vote-preservation?action=verify', {
        method: 'POST'
      })

      if (response.ok) {
        await fetchData()
        alert('Integrity verification completed!')
      } else {
        alert('Failed to verify integrity')
      }
    } catch (error) {
      console.error('Error verifying integrity:', error)
      alert('Error verifying integrity')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-cocoa-green mb-2">
            Vote Preservation
          </h1>
          <p className="text-gray-600">
            Manage vote backups, verify data integrity, and ensure vote preservation
          </p>
        </header>

        {/* Statistics Overview */}
        {statistics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Database className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Total Votes</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.totalVotes.toLocaleString()}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Users className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Votes Today</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistics.votesToday}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-md p-6"
            >
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Clock className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-500">Last Backup</p>
                  <p className="text-lg font-bold text-gray-900">
                    {statistics.lastBackup 
                      ? new Date(statistics.lastBackup).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Vote Integrity Status */}
        {integrity && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-md p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Vote Integrity Status
              </h3>
              <button
                onClick={handleVerifyIntegrity}
                disabled={actionLoading === 'verify-integrity'}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {actionLoading === 'verify-integrity' ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Verify Integrity
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-2 ${
                  integrity.isValid ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  {integrity.isValid ? (
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-red-600" />
                  )}
                </div>
                <p className="font-medium text-gray-900">
                  {integrity.isValid ? 'Integrity Valid' : 'Integrity Issues'}
                </p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  {integrity.totalVotes.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">Total Votes</p>
              </div>

              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {integrity.corruptedVotes}
                </p>
                <p className="text-sm text-gray-500">Corrupted Votes</p>
              </div>
            </div>

            <div className="mt-4 text-center text-sm text-gray-500">
              Last checked: {new Date(integrity.lastCheck).toLocaleString()}
            </div>
          </motion.div>
        )}

        {/* Backup Management */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Create Backup */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Download className="w-5 h-5 mr-2" />
              Create Backup
            </h3>
            <p className="text-gray-600 mb-4">
              Create a backup of all current vote data to ensure data preservation.
            </p>
            <button
              onClick={handleCreateBackup}
              disabled={actionLoading === 'create-backup'}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center"
            >
              {actionLoading === 'create-backup' ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              Create New Backup
            </button>
          </motion.div>

          {/* Backup List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Upload className="w-5 h-5 mr-2" />
              Available Backups
            </h3>
            
            <div className="space-y-3">
              {backups.map((backup) => (
                <div key={backup.filename} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{backup.filename}</p>
                    <p className="text-sm text-gray-500">
                      {backup.size} • {backup.votesBackedUp} votes • {new Date(backup.date).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleRestoreBackup(backup.filename)}
                      disabled={actionLoading === `restore-${backup.filename}`}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded disabled:opacity-50"
                      title="Restore backup"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteBackup(backup.filename)}
                      disabled={actionLoading === `delete-${backup.filename}`}
                      className="p-2 text-red-600 hover:bg-red-100 rounded disabled:opacity-50"
                      title="Delete backup"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {backups.length === 0 && (
              <p className="text-gray-500 text-center py-8">No backups available</p>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
