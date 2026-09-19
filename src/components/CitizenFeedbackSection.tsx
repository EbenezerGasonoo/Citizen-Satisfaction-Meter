'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Send,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  ShieldCheck,
  Tag
} from 'lucide-react'

interface Comment {
  id: number
  ministerId: number
  content: string
  sentiment?: 'positive' | 'negative' | 'neutral' | null
  sentimentScore?: number | null
  topics?: string | null
  createdAt: string
}

interface SentimentAnalytics {
  totalComments: number
  positiveCount: number
  negativeCount: number
  neutralCount: number
  positivePercent: number
  negativePercent: number
  neutralPercent: number
  netSentimentScore: number
  topTopics: { topic: string; count: number }[]
}

interface CitizenFeedbackSectionProps {
  ministerId: number
  ministerName: string
}

export default function CitizenFeedbackSection({
  ministerId,
  ministerName
}: CitizenFeedbackSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [analytics, setAnalytics] = useState<SentimentAnalytics | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const fetchComments = async () => {
    try {
      const res = await fetch(`/api/ministers/${ministerId}/comments`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
        setAnalytics(data.analytics || null)
      }
    } catch (err) {
      console.error('Error fetching comments:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComments()
  }, [ministerId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    setSubmitting(true)
    try {
      const res = await fetch(`/api/ministers/${ministerId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newComment })
      })

      if (res.ok) {
        setNewComment('')
        setNotification({
          type: 'success',
          message: 'Thank you! Your civic feedback was analyzed and posted.'
        })
        fetchComments()
        setTimeout(() => setNotification(null), 4000)
      } else {
        const err = await res.json()
        setNotification({
          type: 'error',
          message: err.error || 'Failed to submit comment'
        })
      }
    } catch {
      setNotification({
        type: 'error',
        message: 'Network error submitting comment'
      })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredComments = comments.filter(c => {
    const matchesSentiment =
      selectedSentimentFilter === 'all' || (c.sentiment || 'neutral') === selectedSentimentFilter

    let matchesTopic = true
    if (selectedTopic && c.topics) {
      try {
        const parsed = JSON.parse(c.topics)
        matchesTopic = Array.isArray(parsed) && parsed.includes(selectedTopic)
      } catch {
        matchesTopic = false
      }
    } else if (selectedTopic && !c.topics) {
      matchesTopic = false
    }

    return matchesSentiment && matchesTopic
  })

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sm:p-8 space-y-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-full text-xs font-semibold text-emerald-800 dark:text-emerald-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            AI Citizen Sentiment Pulse
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Citizen Voice & Public Feedback
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Real-time sentiment and key topics analyzed from verified citizen reviews for {ministerName}.
          </p>
        </div>

        {analytics && analytics.totalComments > 0 && (
          <div className="flex items-center gap-3">
            <div
              className={`px-4 py-2 rounded-xl border flex items-center gap-2 font-bold text-sm shadow-sm ${
                analytics.netSentimentScore >= 20
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                  : analytics.netSentimentScore <= -20
                  ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                  : 'bg-slate-50 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
              }`}
            >
              {analytics.netSentimentScore >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span>
                {analytics.netSentimentScore > 0 ? `+${analytics.netSentimentScore}` : analytics.netSentimentScore} Net Sentiment
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sentiment Meter Bar */}
      {analytics && analytics.totalComments > 0 ? (
        <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500" /> Positive: {analytics.positivePercent}%
            </span>
            <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-slate-400" /> Neutral: {analytics.neutralPercent}%
            </span>
            <span className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400">
              <span className="w-2 h-2 rounded-full bg-rose-500" /> Critical: {analytics.negativePercent}%
            </span>
          </div>

          {/* Progress Stack Bar */}
          <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden flex">
            <div
              style={{ width: `${analytics.positivePercent}%` }}
              className="h-full bg-emerald-500 transition-all duration-500"
              title={`Positive: ${analytics.positivePercent}%`}
            />
            <div
              style={{ width: `${analytics.neutralPercent}%` }}
              className="h-full bg-slate-400 dark:bg-slate-500 transition-all duration-500"
              title={`Neutral: ${analytics.neutralPercent}%`}
            />
            <div
              style={{ width: `${analytics.negativePercent}%` }}
              className="h-full bg-rose-500 transition-all duration-500"
              title={`Critical: ${analytics.negativePercent}%`}
            />
          </div>

          {/* Detected Topics Tags */}
          {analytics.topTopics.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Key Issues:
              </span>
              {analytics.topTopics.map(t => (
                <button
                  key={t.topic}
                  onClick={() => setSelectedTopic(selectedTopic === t.topic ? null : t.topic)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                    selectedTopic === t.topic
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-400'
                  }`}
                >
                  #{t.topic} ({t.count})
                </button>
              ))}
              {selectedTopic && (
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-xs text-rose-500 hover:underline ml-1"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>
      ) : null}

      {/* Comment Submission Form */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <label className="block text-sm font-semibold text-slate-800 dark:text-slate-200">
          Leave Citizen Feedback
        </label>
        <div className="relative">
          <textarea
            rows={3}
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
            placeholder={`Share constructive feedback or concerns regarding ${ministerName}'s performance or sector policies...`}
            maxLength={500}
            className="w-full text-sm p-4 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-slate-100 placeholder-slate-400 resize-none transition-all"
          />
          <div className="absolute bottom-3 right-3 text-xs text-slate-400">
            {newComment.length}/500
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" /> Anonymous civic feedback with automatic AI sentiment scoring.
          </span>
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-cocoa-green dark:bg-green-600 hover:bg-cocoa-green/90 dark:hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Post Civic Review'}
          </button>
        </div>
      </form>

      {/* Notification banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-3 rounded-xl border flex items-center gap-2 text-sm ${
              notification.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600" />
            )}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs & Feed */}
      <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {[
              { id: 'all', label: 'All Reviews', count: comments.length },
              { id: 'positive', label: 'Positive', count: analytics?.positiveCount || 0 },
              { id: 'negative', label: 'Critical', count: analytics?.negativeCount || 0 },
              { id: 'neutral', label: 'Neutral', count: analytics?.neutralCount || 0 }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setSelectedSentimentFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedSentimentFilter === tab.id
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>

          <span className="text-xs text-slate-400">
            Showing {filteredComments.length} of {comments.length}
          </span>
        </div>

        {/* Comments Feed */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-slate-50 dark:bg-slate-800/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-800">
            <MessageSquare className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
              No citizen reviews found for this filter.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Be the first to share feedback above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredComments.map(comment => {
              const sentiment = comment.sentiment || 'neutral'
              let topics: string[] = []
              if (comment.topics) {
                try {
                  topics = JSON.parse(comment.topics)
                } catch {
                  // ignore
                }
              }

              return (
                <div
                  key={comment.id}
                  className="p-4 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/90 shadow-sm space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                          sentiment === 'positive'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : sentiment === 'negative'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {sentiment === 'positive' ? '👍 Positive' : sentiment === 'negative' ? '⚠️ Critical' : '💬 Neutral'}
                      </span>

                      {topics.map(t => (
                        <span
                          key={t}
                          className="hidden sm:inline-flex items-center text-[10px] font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded"
                        >
                          #{t}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(comment.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
