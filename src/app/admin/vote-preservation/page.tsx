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
  issues: string[]
  statistics: {
    totalVotes: number
    totalMinisters: number
    votesPerMinister: Record<number, number>
    dateRange: { earliest: Date | null, latest: Date | null }
  }
}

interface BackupInfo {
  file: string
  metadata: {
    timestamp: string
    totalVotes: number
    totalMinisters: number
    backupVersion: string
    platformVersion: string
  } | null
}

interface VoteStatistics {
  totalVotes: number
  totalMinisters: number
  votesToday: number
  lastBackup: string | null
}

export default function VotePreservation() {
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
    if (!confirm('Are you sure you want to restore this backup? This will replace all current votes.')) {
      return
    }

    setActionLoading('restore-backup')
    try {
      const response = await fetch('/api/admin/vote-preservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'restore-backup', backupFile })
      })

      if (response.ok) {
        await fetchData()
        alert('Votes restored successfully!')
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

  const handleVerifyIntegrity = async () => {
    setActionLoading('verify-integrity')
    try {
      const response = await fetch('/api/admin/vote-preservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify-integrity' })
      })

      if (response.ok) {
        await fetchData()
        alert('Vote integrity verified!')
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

  const handleCleanupBackups = async () => {
    if (!confirm('Are you sure you want to clean up old backups? This will delete all but the 10 most recent backups.')) {
      return
    }

    setActionLoading('cleanup-backups')
    try {
      const response = await fetch('/api/admin/vote-preservation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cleanup-backups' })
      })

      if (response.ok) {
        await fetchData()
        alert('Old backups cleaned up successfully!')
      } else {
        alert('Failed to cleanup backups')
      }
    } catch (error) {
      console.error('Error cleaning up backups:', error)
      alert('Error cleaning up backups')
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cocoa-green"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Vote Preservation
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Protect and manage vote data integrity during platform updates
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={handleCreateBackup}
            disabled={actionLoading === 'create-backup'}
            className="flex items-center space-x-2 px-4 py-2 bg-cocoa-green text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            <Download className={`w-4 h-4 ${actionLoading === 'create-backup' ? 'animate-spin' : ''}`} />
            <span>Create Backup</span>
          </button>
          <button
            onClick={handleVerifyIntegrity}
            disabled={actionLoading === 'verify-integrity'}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <CheckCircle className={`w-4 h-4 ${actionLoading === 'verify-integrity' ? 'animate-spin' : ''}`} />
            <span>Verify Integrity</span>
          </button>
        </div>
      </div>

      {/* Vote Integrity Status */}
      {integrity && (
        <div className={`rounded-lg p-6 border ${
          integrity.isValid 
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
        }`}>
          <div className="flex items-center space-x-3 mb-4">
            {integrity.isValid ? (
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            ) : (
              <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
            )}
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Vote Integrity Status
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {integrity.statistics.totalVotes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Total Votes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {integrity.statistics.totalMinisters}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Ministers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {integrity.statistics.dateRange.earliest ? 
                  new Date(integrity.statistics.dateRange.earliest).toLocaleDateString() : 
                  'N/A'
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Earliest Vote</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {integrity.statistics.dateRange.latest ? 
                  new Date(integrity.statistics.dateRange.latest).toLocaleDateString() : 
                  'N/A'
                }
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Latest Vote</div>
            </div>
          </div>

          {integrity.issues.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-red-600 dark:text-red-400 mb-2">Issues Found:</h4>
              <ul className="list-disc list-inside space-y-1">
                {integrity.issues.map((issue, index) => (
                  <li key={index} className="text-sm text-red-600 dark:text-red-400">
                    {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Current Statistics */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Database className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.totalVotes.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Ministers</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.totalMinisters}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Today's Votes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {statistics.votesToday}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Last Backup</p>
                <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                  {statistics.lastBackup ? 
                    new Date(statistics.lastBackup).toLocaleDateString() : 
                    'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Available Backups */}
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Available Backups
          </h3>
          <button
            onClick={handleCleanupBackups}
            disabled={actionLoading === 'cleanup-backups'}
            className="flex items-center space-x-2 px-3 py-1 text-sm bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
          >
            <Trash2 className={`w-4 h-4 ${actionLoading === 'cleanup-backups' ? 'animate-spin' : ''}`} />
            <span>Cleanup Old</span>
          </button>
        </div>
        
        {backups.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            No backups available
          </div>
        ) : (
          <div className="space-y-4">
            {backups.map((backup, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {backup.metadata ? 
                        new Date(backup.metadata.timestamp).toLocaleString() : 
                        'Unknown Date'
                      }
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {backup.metadata ? 
                        `${backup.metadata.totalVotes} votes • ${backup.metadata.totalMinisters} ministers` : 
                        'No metadata available'
                      }
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">
                      Version: {backup.metadata?.platformVersion || 'Unknown'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleRestoreBackup(backup.file)}
                    disabled={actionLoading === 'restore-backup'}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    Restore
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Important Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-yellow-600 dark:text-yellow-400 mt-1" />
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              Important: Vote Preservation During Updates
            </h3>
            <div className="text-sm text-yellow-700 dark:text-yellow-300 space-y-2">
              <p>• <strong>Always create a backup</strong> before any platform updates</p>
              <p>• <strong>Verify vote integrity</strong> after updates to ensure no data loss</p>
              <p>• <strong>Restore from backup</strong> if any issues are detected</p>
              <p>• <strong>Test in staging</strong> environment before production updates</p>
              <p>• <strong>Monitor vote counts</strong> before and after updates</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
