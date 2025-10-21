'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import VoteButtons from '@/components/VoteButtons'
import FavoriteButton from '@/components/FavoriteButton'
import { notFound } from 'next/navigation'
import PolicySection from '@/components/PolicySection'
import ActionSection from '@/components/ActionSection'
import { motion, AnimatePresence } from 'framer-motion'

interface MinisterDetail {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  bio: string
  satisfactionRate: number
  totalVotes: number
  positiveVotes: number
}

export default function MinisterPage({ params }: { params: { id: string } }) {
  const [minister, setMinister] = useState<MinisterDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMinister = async () => {
      try {
        const response = await fetch(`/api/ministers/${params.id}`)

        if (!response.ok) {
          setMinister(null)
          return
        }

        const data = await response.json()
        setMinister(data)
      } catch (error) {
        console.error('Error fetching minister:', error)
        setMinister(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMinister()
  }, [params.id])

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse mb-8" />
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-48 h-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
              <div className="flex-1 space-y-4">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (!minister) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Back button - Enhanced */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-green-600 dark:text-green-400 rounded-xl transition-all mb-8 shadow-md hover:shadow-lg touch-manipulation group"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back to Home</span>
            </Link>
          </motion.div>

          {/* Minister Profile - Modern Card */}
          <motion.div 
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Photo - Enhanced with gradient ring */}
              <motion.div 
                className="flex-shrink-0 relative mx-auto lg:mx-0"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="relative w-56 h-56 sm:w-64 sm:h-64">
                  {/* Gradient ring */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 p-1">
                    <div className="w-full h-full rounded-3xl overflow-hidden bg-white dark:bg-gray-900">
                      <Image
                        src={minister.photoUrl}
                        alt={minister.fullName}
                        fill
                        className="rounded-3xl object-cover"
                      />
                    </div>
                  </div>
                  {/* Glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-green-500/20 to-purple-500/20 blur-2xl -z-10" />
                </div>
                {/* Favorite Button - Enhanced */}
                <div className="absolute -top-2 -right-2">
                  <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-xl">
                    <FavoriteButton ministerId={minister.id} />
                  </div>
                </div>
              </motion.div>

              {/* Info - Enhanced */}
              <div className="flex-1 space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-3 leading-tight">
                    {minister.fullName}
                  </h1>
                  
                  <div className="inline-block px-5 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-2xl border-2 border-green-200 dark:border-green-800">
                    <p className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
                      {minister.portfolio}
                    </p>
                  </div>
                </motion.div>

                {minister.bio && (
                  <motion.div 
                    className="prose max-w-none"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                  >
                    <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {minister.bio}
                    </p>
                  </motion.div>
                )}

                {/* Stats - Modern Cards */}
                <motion.div 
                  className="grid grid-cols-3 gap-3 sm:gap-4"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl p-4 sm:p-6 text-center border-2 border-green-200 dark:border-green-800">
                    <div className="text-3xl sm:text-4xl font-extrabold text-green-600 dark:text-green-400">
                      {minister.satisfactionRate}%
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-green-700 dark:text-green-500 mt-1">Satisfaction</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-2xl p-4 sm:p-6 text-center border-2 border-blue-200 dark:border-blue-800">
                    <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                      {minister.totalVotes.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-500 mt-1">Total Votes</div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-4 sm:p-6 text-center border-2 border-purple-200 dark:border-purple-800">
                    <div className="text-3xl sm:text-4xl font-extrabold text-purple-600 dark:text-purple-400">
                      {minister.positiveVotes.toLocaleString()}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-500 mt-1">Positive</div>
                  </div>
                </motion.div>

                {/* Vote Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <VoteButtons ministerId={minister.id} />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Enhanced two-column layout for Actions and Policies */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Actions Section */}
            <motion.div 
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent mb-2">
                  ⚡ Key Actions
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Track major initiatives and activities</p>
              </div>
              <ActionSection ministerId={minister.id} />
              {/* Show History for Actions */}
              <ShowHistoryTimeline type="actions" ministerId={minister.id} />
            </motion.div>

            {/* Policies Section */}
            <motion.div 
              className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-200 dark:border-gray-700"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent mb-2">
                  📊 Key Policies
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Policies and their impact on citizens</p>
              </div>
              <PolicySection ministerId={minister.id} />
              {/* Show History for Policies */}
              <ShowHistoryTimeline type="policies" ministerId={minister.id} />
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

function ShowHistoryTimeline({ type, ministerId }: { type: 'actions' | 'policies', ministerId: number }) {
  const [show, setShow] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/ministers/${ministerId}/${type}`);
      const data = await res.json();
      setItems(type === 'actions' ? data.actions : data.policies);
    } catch (e) {
      setError('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!show && items.length === 0) fetchHistory();
    setShow((s) => !s);
  };

  const getStatusColor = (status: string) => {
    switch ((status || '').toLowerCase()) {
      case 'active': return 'bg-green-400';
      case 'completed': return 'bg-blue-400';
      case 'planned': return 'bg-yellow-400';
      case 'suspended': return 'bg-red-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="mt-6">
      <motion.button
        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-800 dark:text-gray-200 hover:from-gray-200 hover:to-gray-300 dark:hover:from-gray-600 dark:hover:to-gray-500 font-bold shadow-lg hover:shadow-xl transition-all touch-manipulation border-2 border-gray-300 dark:border-gray-500"
        onClick={handleToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {show ? '🔼 Hide History' : '🔽 Show History'}
      </motion.button>
      <AnimatePresence>
        {show && (
          <motion.div
            className="mt-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="text-gray-500">Loading...</div>
            ) : error ? (
              <div className="text-red-500">{error}</div>
            ) : items.length === 0 ? (
              <div className="text-gray-500">No history found.</div>
            ) : (
              <ol className="relative border-l-2 border-blue-200 dark:border-blue-700 ml-4">
                {items.sort((a, b) => new Date(b.date || b.startDate).getTime() - new Date(a.date || a.startDate).getTime()).map((item, idx) => (
                  <motion.li
                    key={item.id}
                    className="mb-8 ml-4"
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.07, duration: 0.4, type: 'spring' }}
                  >
                    <div className={`absolute -left-5 top-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${getStatusColor(item.status)}`} />
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">
                        {type === 'actions' ? '⚡' : '📊'}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{type === 'actions' ? (item.date ? item.date.slice(0,10) : '') : (item.startDate ? item.startDate.slice(0,10) : '')}</span>
                    </div>
                    <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 border border-gray-100 dark:border-gray-800 mb-2">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900 dark:text-gray-100 text-base">{item.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ml-2 ${getStatusColor(item.status)} text-white`}>{item.status}</span>
                        {item.impact && <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 ml-2">Impact: {item.impact}</span>}
                      </div>
                      <div className="text-gray-700 dark:text-gray-300 text-sm mb-1 whitespace-pre-line">{item.description}</div>
                      {typeof item.satisfactionRate === 'number' && (
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-block px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs font-bold">{item.satisfactionRate}% Satisfaction</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">({item.positiveVotes}/{item.totalVotes} positive)</span>
                        </div>
                      )}
                      <a
                        href={type === 'actions' ? `#` : `#`}
                        className="inline-flex items-center mt-2 text-blue-600 dark:text-blue-300 hover:underline text-xs font-semibold"
                        tabIndex={0}
                      >
                        View Details
                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                      </a>
                    </div>
                  </motion.li>
                ))}
              </ol>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 