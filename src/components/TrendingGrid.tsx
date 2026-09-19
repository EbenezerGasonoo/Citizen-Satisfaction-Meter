'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Flame,
  Award,
  Users,
  Activity,
  CheckCircle2
} from 'lucide-react'

interface TrendingMinister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  satisfactionRate: number
  totalVotes: number
  positiveVotes: number
  votes24h: number
  trend: 'up' | 'down'
  trendingRank: number
  trendingScore: number
  trendingReason: string
  badgeType: 'top_voted' | 'high_approval' | 'recent_action' | 'surging' | 'admin_pick'
  isTrending: boolean
  latestAction?: {
    title: string
    description: string
    date: string
  } | null
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: 'easeOut'
    }
  }
}

export default function TrendingGrid() {
  const [trendingMinisters, setTrendingMinisters] = useState<TrendingMinister[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTrendingMinisters = async () => {
      try {
        const response = await fetch('/api/ministers/trending')
        if (response.ok) {
          const data = await response.json()
          setTrendingMinisters(data)
        }
      } catch (error) {
        console.error('Failed to fetch trending ministers:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMinisters()

    // Listen for real-time vote updates
    const handleVoteUpdate = () => {
      fetchTrendingMinisters()
    }

    window.addEventListener('voteSubmitted', handleVoteUpdate)
    const interval = setInterval(fetchTrendingMinisters, 30000)

    return () => {
      window.removeEventListener('voteSubmitted', handleVoteUpdate)
      clearInterval(interval)
    }
  }, [])

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center justify-between mb-8">
          <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-48 animate-pulse" />
          <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-28 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[1, 2, 3].map(i => (
            <div
              key={i}
              className="aspect-[4/5] bg-slate-100 dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 animate-pulse p-5 flex flex-col justify-end gap-3"
            >
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3" />
              <div className="h-12 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {trendingMinisters.map((minister) => {
          const isRank1 = minister.trendingRank === 1
          const isRank2 = minister.trendingRank === 2
          const isRank3 = minister.trendingRank === 3

          return (
            <motion.div
              key={minister.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                transition: { duration: 0.22, ease: 'easeOut' }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <Link href={`/minister/${minister.id}`} className="block h-full touch-manipulation group">
                <div
                  className={`relative bg-slate-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border overflow-hidden h-full ${
                    isRank1
                      ? 'border-amber-400/50 dark:border-amber-400/40 shadow-amber-500/10'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {/* Portrait Container */}
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <Image
                      src={minister.photoUrl || '/uploads/default-minister.jpg'}
                      alt={minister.fullName}
                      fill
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />

                    {/* Gradient Overlay for Text Legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/20" />

                    {/* Top Header Floating Badges */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10 gap-2">
                      {/* Left: Date Badge if latestAction exists */}
                      {minister.latestAction ? (
                        <div className="bg-black/50 backdrop-blur-md border border-white/15 rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center text-white shadow-md">
                          <span className="text-[9px] font-extrabold uppercase tracking-widest text-white/70">
                            {new Date(minister.latestAction.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-base font-black leading-none text-white">
                            {new Date(minister.latestAction.date).getDate()}
                          </span>
                        </div>
                      ) : (
                        <div />
                      )}

                      {/* Right: Trending Rank Pill */}
                      <div
                        className={`backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg border ${
                          isRank1
                            ? 'bg-gradient-to-r from-amber-500/90 to-yellow-500/90 text-slate-950 border-amber-300 shadow-amber-500/20'
                            : isRank2
                            ? 'bg-slate-200/90 text-slate-900 border-white/40'
                            : isRank3
                            ? 'bg-amber-800/80 text-amber-100 border-amber-600/40'
                            : 'bg-black/60 text-white/90 border-white/10'
                        }`}
                      >
                        {isRank1 ? (
                          <>
                            <Award className="w-3.5 h-3.5 fill-current" />
                            <span>#1 Trending</span>
                          </>
                        ) : (
                          <>
                            <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
                            <span>#{minister.trendingRank} Trending</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Content Section at Bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3 z-10">
                      {/* Reason Pill & Satisfaction Rate Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* Satisfaction Pill */}
                        <div
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold backdrop-blur-md border ${
                            minister.satisfactionRate >= 75
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                              : minister.satisfactionRate >= 50
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                          }`}
                        >
                          {minister.satisfactionRate >= 50 ? (
                            <TrendingUp className="w-3.5 h-3.5" />
                          ) : (
                            <TrendingDown className="w-3.5 h-3.5" />
                          )}
                          <span>{minister.satisfactionRate}% Satisfaction</span>
                        </div>

                        {/* Total Votes Count */}
                        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium bg-white/10 text-white/80 backdrop-blur-sm border border-white/10">
                          <Users className="w-3 h-3 text-white/60" />
                          <span>{minister.totalVotes} {minister.totalVotes === 1 ? 'vote' : 'votes'}</span>
                        </div>
                      </div>

                      {/* Portfolio */}
                      <div>
                        <div className="text-[11px] font-bold tracking-wider text-amber-400 uppercase line-clamp-1">
                          {minister.portfolio}
                        </div>

                        {/* Full Name */}
                        <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow-sm mt-0.5">
                          {minister.fullName}
                        </h3>
                      </div>

                      {/* Trending Context / Reason */}
                      {minister.trendingReason && (
                        <p className="text-[11px] text-emerald-300/90 font-medium line-clamp-1 flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{minister.trendingReason}</span>
                        </p>
                      )}

                      {/* Latest Action / Policy Box */}
                      {minister.latestAction && (
                        <div className="flex flex-col gap-1 text-xs text-slate-200 bg-white/10 rounded-xl p-3 border border-white/15 backdrop-blur-md group-hover:bg-white/15 transition-colors">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="text-[10px] uppercase font-bold text-white/70 tracking-wider">
                              Latest Action
                            </span>
                          </div>
                          <span className="font-semibold line-clamp-2 leading-relaxed text-white">
                            {minister.latestAction.title}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </motion.div>

      {trendingMinisters.length === 0 && !loading && (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <Activity className="w-10 h-10 text-slate-400 mx-auto mb-3 animate-pulse" />
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">No trending ministers at this time</h3>
          <p className="text-sm text-slate-500 mt-1">Check back as citizens cast new ratings and voice feedback.</p>
        </div>
      )}
    </motion.div>
  )
}