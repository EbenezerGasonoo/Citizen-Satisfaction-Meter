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
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
        const response = await fetch(`${baseUrl}/api/ministers/${params.id}`)

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
    <main className="container mx-auto px-4 py-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-gray-900 dark:to-gray-950 min-h-screen">
      <div className="max-w-5xl mx-auto">
        {/* Back button */}
        <Link
          href="/"
          className="inline-flex items-center text-cocoa-green dark:text-green-400 hover:text-cocoa-green/80 dark:hover:text-green-300 transition-colors mb-8"
        >
          ← Back to Home
        </Link>

        {/* Minister Profile */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="flex-shrink-0 relative">
              <div className="w-48 h-48 relative">
                <Image
                  src={minister.photoUrl}
                  alt={minister.fullName}
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
              {/* Favorite Button */}
              <div className="absolute top-2 right-2">
                <FavoriteButton ministerId={minister.id} />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                {minister.fullName}
              </h1>
              
              <p className="text-xl text-cocoa-green dark:text-green-400 font-semibold mb-4">
                {minister.portfolio}
              </p>

              {minister.bio && (
                <div className="prose max-w-none mb-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {minister.bio}
                  </p>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-cocoa-green dark:text-green-400">
                    {minister.satisfactionRate}%
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Satisfaction Rate</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    {minister.totalVotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Total Votes</div>
                </div>
                
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {minister.positiveVotes.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Positive Votes</div>
                </div>
              </div>

              {/* Vote Buttons */}
              <VoteButtons ministerId={minister.id} />
            </div>
          </div>
        </div>

        {/* Enhanced two-column layout for Actions and Policies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8 md:divide-x md:divide-blue-200 dark:md:divide-blue-900">
          <div className="pr-0 md:pr-8">
            <h2 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 mb-6 text-center md:text-left tracking-tight">Key Actions</h2>
            <ActionSection ministerId={minister.id} />
            {/* Show History for Actions */}
            <ShowHistoryTimeline type="actions" ministerId={minister.id} />
          </div>
          <div className="pl-0 md:pl-8">
            <h2 className="text-2xl font-extrabold text-green-700 dark:text-green-400 mb-6 text-center md:text-left tracking-tight">Key Policies & Impact</h2>
            <PolicySection ministerId={minister.id} />
            {/* Show History for Policies */}
            <ShowHistoryTimeline type="policies" ministerId={minister.id} />
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
      <button
        className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold mb-2"
        onClick={handleToggle}
      >
        {show ? 'Hide History' : 'Show History'}
      </button>
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