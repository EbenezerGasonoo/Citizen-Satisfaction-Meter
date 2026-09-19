'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  ExternalLink,
  MessageCircle,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Activity,
  Share2,
  CheckCircle2,
  RefreshCw
} from 'lucide-react'
import { MinisterSocialPulse } from '@/lib/v2/social-media-reader'

interface SocialMediaPulseProps {
  ministerId: number
  ministerName: string
  portfolio: string
  satisfactionRate?: number
}

// Crisp X Logo SVG
export function XLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

// Crisp Facebook Logo SVG
export function FacebookLogo({ className = 'w-4 h-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

export default function SocialMediaPulse({
  ministerId,
  ministerName,
  portfolio,
  satisfactionRate = 65
}: SocialMediaPulseProps) {
  const [pulse, setPulse] = useState<MinisterSocialPulse | null>(null)
  const [loading, setLoading] = useState(true)
  const [activePlatformFilter, setActivePlatformFilter] = useState<'all' | 'x' | 'facebook'>('all')

  useEffect(() => {
    const fetchSocialPulse = async () => {
      try {
        const res = await fetch(`/api/social/readings?ministerId=${ministerId}`)
        if (res.ok) {
          const json = await res.json()
          if (json.data) {
            setPulse(json.data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch social pulse:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchSocialPulse()
  }, [ministerId])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-44 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
          <div className="h-44 bg-slate-100 dark:bg-slate-800/60 rounded-2xl" />
        </div>
      </div>
    )
  }

  if (!pulse) return null

  const filteredPosts = pulse.recentPosts.filter(
    (p) => activePlatformFilter === 'all' || p.platform === activePlatformFilter
  )

  return (
    <div className="space-y-6">
      {/* Platform Summary Cards: X.com & Facebook */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* X.com (Twitter) Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                <XLogo className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>X.com (Twitter)</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    Live Pulse
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pulse.xStats.dailyVelocity}
                </p>
              </div>
            </div>

            <a
              href={pulse.xSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-white hover:bg-slate-800 transition-colors"
            >
              <span>Search on 𝕏</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pulse.xStats.totalMentions.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Total Mentions & Quotes
            </span>
          </div>

          {/* Sentiment Progress Bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-600 dark:text-emerald-400">
                {pulse.xStats.positivePercent}% Positive
              </span>
              <span className="text-slate-400">
                {pulse.xStats.neutralPercent}% Neutral
              </span>
              <span className="text-red-500">
                {pulse.xStats.negativePercent}% Critical
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${pulse.xStats.positivePercent}%` }}
              />
              <div
                className="bg-slate-400 h-full transition-all duration-500"
                style={{ width: `${pulse.xStats.neutralPercent}%` }}
              />
              <div
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${pulse.xStats.negativePercent}%` }}
              />
            </div>
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {pulse.xStats.topHashtags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Facebook Card */}
        <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-sm">
                <FacebookLogo className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>Facebook</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300">
                    Media Threads
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {pulse.facebookStats.dailyVelocity}
                </p>
              </div>
            </div>

            <a
              href={pulse.facebookSearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#1877F2] text-white hover:bg-blue-700 transition-colors"
            >
              <span>Explore on FB</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {pulse.facebookStats.totalMentions.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Discussions & Comments
            </span>
          </div>

          {/* Sentiment Progress Bar */}
          <div className="space-y-1.5 mb-4">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-emerald-600 dark:text-emerald-400">
                {pulse.facebookStats.positivePercent}% Favorable
              </span>
              <span className="text-slate-400">
                {pulse.facebookStats.neutralPercent}% Inquiring
              </span>
              <span className="text-red-500">
                {pulse.facebookStats.negativePercent}% Critical
              </span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-500 h-full transition-all duration-500"
                style={{ width: `${pulse.facebookStats.positivePercent}%` }}
              />
              <div
                className="bg-slate-400 h-full transition-all duration-500"
                style={{ width: `${pulse.facebookStats.neutralPercent}%` }}
              />
              <div
                className="bg-red-500 h-full transition-all duration-500"
                style={{ width: `${pulse.facebookStats.negativePercent}%` }}
              />
            </div>
          </div>

          {/* Hashtags */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            {pulse.facebookStats.topHashtags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Social Discussions Feed */}
      <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span>Public Social Discourse & Readings</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live sample of citizen feedback and journalistic debates regarding {ministerName}
            </p>
          </div>

          {/* Platform Filters */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActivePlatformFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                activePlatformFilter === 'all'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Platforms
            </button>
            <button
              onClick={() => setActivePlatformFilter('x')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activePlatformFilter === 'x'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <XLogo className="w-3.5 h-3.5" />
              <span>X.com</span>
            </button>
            <button
              onClick={() => setActivePlatformFilter('facebook')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                activePlatformFilter === 'facebook'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FacebookLogo className="w-3.5 h-3.5 text-[#1877F2]" />
              <span>Facebook</span>
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-white ${
                      post.platform === 'x' ? 'bg-black' : 'bg-[#1877F2]'
                    }`}
                  >
                    {post.platform === 'x' ? <XLogo className="w-3 h-3" /> : <FacebookLogo className="w-3 h-3" />}
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    {post.authorName}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {post.authorHandle}
                  </span>
                  {post.authorVerified && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      post.sentiment === 'positive'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : post.sentiment === 'negative'
                        ? 'bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-300'
                        : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {post.sentiment.toUpperCase()}
                  </span>
                  <span className="text-[11px] text-slate-400">{post.timestamp}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed mb-3">
                {post.content}
              </p>

              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-700/40">
                <span className="font-semibold text-slate-600 dark:text-slate-300">
                  Topic: {post.topic}
                </span>
                <div className="flex items-center gap-4">
                  <span>❤️ {post.likes}</span>
                  <span>🔄 {post.repostsOrShares}</span>
                  <span>💬 {post.commentsCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
