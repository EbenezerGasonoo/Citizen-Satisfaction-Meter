'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Newspaper,
  FileText,
  Sparkles,
  TrendingUp,
  BarChart3,
  Inbox,
  Shield,
  Activity,
  Settings,
  Search,
  RefreshCw,
  Zap,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ExternalLink,
  ChevronRight,
  Filter,
  Check,
  Share2,
  MessageSquare
} from 'lucide-react'
import { CabinetSocialOverview } from '@/lib/v2/social-media-reader'
import { XLogo, FacebookLogo } from '@/components/SocialMediaPulse'

export interface DashboardMinister {
  id: number
  fullName: string
  portfolio: string
  photoUrl: string
  totalVotes: number
  positiveVotes: number
  satisfactionRate: number
  isTrending: boolean
}

export interface RecentVote {
  id: number
  positive: boolean
  createdAt: string
  minister: {
    id: number
    fullName: string
    portfolio: string
    photoUrl: string
  }
}

export interface RecentSubmission {
  id: number
  type: string
  message: string
  status: string
  createdAt: string
}

export interface DashboardMetrics {
  totalMinisters: number
  totalVotes: number
  votesToday: number
  satisfactionRate: number
  totalActions: number
  actionsWithSource: number
  pendingSubmissions: number
  stagedMinisters: number
  trendingMinisters: number
  activePolicies: number
}

interface AdminDashboardClientProps {
  metrics: DashboardMetrics
  topMinisters: DashboardMinister[]
  scrutinyMinisters: DashboardMinister[]
  recentVotes: RecentVote[]
  recentSubmissions: RecentSubmission[]
  socialOverview: CabinetSocialOverview
  adminEmail?: string | null
}

interface AdminTool {
  id: string
  title: string
  description: string
  category: 'Governance' | 'News & Record' | 'AI & Automation' | 'Intelligence' | 'Security'
  primaryLink: string
  primaryLabel: string
  secondaryLink?: string
  secondaryLabel?: string
  badge?: string
  badgeColor?: string
  icon: any
  gradient: string
}

export default function AdminDashboardClient({
  metrics,
  topMinisters,
  scrutinyMinisters,
  recentVotes,
  recentSubmissions,
  socialOverview,
  adminEmail
}: AdminDashboardClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [runningNewsHarvester, setRunningNewsHarvester] = useState(false)
  const [runningTrendingRecalc, setRunningTrendingRecalc] = useState(false)
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null)

  const showToast = (text: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 5000)
  }

  // Trigger AI News Harvester via cron endpoint
  const handleTriggerNewsHarvester = async () => {
    setRunningNewsHarvester(true)
    try {
      const res = await fetch('/api/cron/news', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        showToast(`⚡ AI News Harvester completed: ${data.processed || 0} ministers scanned for live Ghanaian headlines.`, 'success')
      } else {
        showToast(data.error || 'Failed to run news harvester', 'error')
      }
    } catch (err) {
      showToast('Network error while running AI news harvester', 'error')
    } finally {
      setRunningNewsHarvester(false)
    }
  }

  // Trigger Trending Recalculation
  const handleTriggerTrendingRecalc = async () => {
    setRunningTrendingRecalc(true)
    try {
      const res = await fetch('/api/cron/trending', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        showToast(`🔄 Trending algorithm recalculated: ${data.candidates?.length || 0} trending ministers updated.`, 'success')
      } else {
        showToast(data.error || 'Failed to recalculate trending', 'error')
      }
    } catch (err) {
      showToast('Network error while recalculating trending', 'error')
    } finally {
      setRunningTrendingRecalc(false)
    }
  }

  // Administrative tools directory
  const tools: AdminTool[] = [
    {
      id: 'ministers',
      title: 'Ministers Directory',
      description: 'Manage 24 cabinet appointments, official portraits, biographical dossiers, and portfolios.',
      category: 'Governance',
      primaryLink: '/admin/ministers',
      primaryLabel: 'Manage All Ministers',
      secondaryLink: '/admin/ministers/new',
      secondaryLabel: '+ Add Minister',
      badge: `${metrics.totalMinisters} Active`,
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      icon: Users,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent'
    },
    {
      id: 'actions',
      title: 'In The News & Key Actions',
      description: 'Verified policy actions, national headlines, press citations, and citizen civic impact analyses.',
      category: 'News & Record',
      primaryLink: '/admin/actions',
      primaryLabel: 'View Actions',
      secondaryLink: '/admin/actions/new',
      secondaryLabel: '⚡ AI Auto-Fetch News',
      badge: `${metrics.totalActions} Tracked • ${metrics.actionsWithSource} Verified`,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      icon: Newspaper,
      gradient: 'from-blue-500/10 via-blue-500/5 to-transparent'
    },
    {
      id: 'v2-ai',
      title: 'V2 AI Harvester & Staging',
      description: 'Automated Wikipedia bio harvester, portrait downloader, and quality review pipeline.',
      category: 'AI & Automation',
      primaryLink: '/admin/v2-review',
      primaryLabel: 'Review Staging Pipeline',
      badge: metrics.stagedMinisters > 0 ? `${metrics.stagedMinisters} In Queue` : 'Engine Ready',
      badgeColor: metrics.stagedMinisters > 0
        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300'
        : 'bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300 border-teal-300',
      icon: Sparkles,
      gradient: 'from-teal-500/10 via-teal-500/5 to-transparent'
    },
    {
      id: 'policies',
      title: 'Policies & Initiatives',
      description: 'Track flagship government policies, implementation stages, budgetary targets, and public sentiment.',
      category: 'Governance',
      primaryLink: '/admin/policies',
      primaryLabel: 'View All Policies',
      secondaryLink: '/admin/policies/new',
      secondaryLabel: '+ New Policy',
      badge: `${metrics.activePolicies} Active`,
      badgeColor: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700',
      icon: FileText,
      gradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent'
    },
    {
      id: 'trending',
      title: 'Trending & Momentum',
      description: 'Algorithmic trending engine tracking velocity of votes, media coverage, and citizen scrutiny.',
      category: 'AI & Automation',
      primaryLink: '/admin/trending',
      primaryLabel: 'Manage Trending',
      secondaryLink: '/admin/trending/analytics',
      secondaryLabel: 'Trending Analytics',
      badge: `${metrics.trendingMinisters} Trending Now`,
      badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-300 dark:border-amber-700',
      icon: TrendingUp,
      gradient: 'from-amber-500/10 via-amber-500/5 to-transparent'
    },
    {
      id: 'analytics',
      title: 'Citizen Analytics & Reports',
      description: 'Comprehensive satisfaction curves, hourly traffic, device telemetry, and comparative benchmarking.',
      category: 'Intelligence',
      primaryLink: '/admin/analytics',
      primaryLabel: 'Open Analytics',
      secondaryLink: '/admin/geographic',
      secondaryLabel: 'Geographic Map',
      badge: 'Live Telemetry',
      badgeColor: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300 border-cyan-300 dark:border-cyan-700',
      icon: BarChart3,
      gradient: 'from-cyan-500/10 via-cyan-500/5 to-transparent'
    },
    {
      id: 'submissions',
      title: 'Citizen Submissions & Feedback',
      description: 'Suggestions, bug reports, and cabinet nominations submitted directly by Ghanaians.',
      category: 'Intelligence',
      primaryLink: '/admin/submissions',
      primaryLabel: 'Open Citizen Inbox',
      badge: metrics.pendingSubmissions > 0 ? `${metrics.pendingSubmissions} Pending Review` : 'Inbox Clear',
      badgeColor: metrics.pendingSubmissions > 0
        ? 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-300'
        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300',
      icon: Inbox,
      gradient: 'from-rose-500/10 via-rose-500/5 to-transparent'
    },
    {
      id: 'vote-preservation',
      title: 'Vote Preservation & Integrity',
      description: 'Cryptographic SHA-256 hash preservation, automated backup schedules, and tamper detection.',
      category: 'Security',
      primaryLink: '/admin/vote-preservation',
      primaryLabel: 'Manage Backups',
      secondaryLink: '/admin/vote-preservation?action=verify',
      secondaryLabel: 'Verify Hashes',
      badge: 'SHA-256 Protected',
      badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
      icon: Shield,
      gradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent'
    },
    {
      id: 'logs',
      title: 'System & Security Logs',
      description: 'Real-time audit trail of admin modifications, authentication attempts, and database events.',
      category: 'Security',
      primaryLink: '/admin/logs',
      primaryLabel: 'View Audit Logs',
      badge: 'Live Auditing',
      badgeColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300 border-orange-300 dark:border-orange-700',
      icon: Activity,
      gradient: 'from-orange-500/10 via-orange-500/5 to-transparent'
    },
    {
      id: 'statements',
      title: 'Official Press Statements',
      description: 'Official government statements and cabinet press communications repository.',
      category: 'News & Record',
      primaryLink: '/admin/statements',
      primaryLabel: 'Manage Statements',
      badge: 'Cabinet Press',
      badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-300 dark:border-purple-700',
      icon: FileText,
      gradient: 'from-purple-500/10 via-purple-500/5 to-transparent'
    },
    {
      id: 'settings',
      title: 'System Settings & Config',
      description: 'Configure moderation rules, trending algorithm thresholds, rate limits, and API parameters.',
      category: 'Security',
      primaryLink: '/admin/settings',
      primaryLabel: 'Platform Settings',
      badge: 'Master Config',
      badgeColor: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
      icon: Settings,
      gradient: 'from-slate-500/10 via-slate-500/5 to-transparent'
    },
    {
      id: 'social-media',
      title: 'Social Media Pulse & Velocity',
      description: 'Real-time sentiment monitoring, discussion velocity, and viral civic hashtag tracking across X.com and Facebook.',
      category: 'Intelligence',
      primaryLink: 'https://x.com/search?q=Ghana%20Ministers&f=live',
      primaryLabel: 'Search on 𝕏',
      secondaryLink: 'https://www.facebook.com/search/top?q=Ghana%20Cabinet%20Ministers',
      secondaryLabel: 'Search on Facebook',
      badge: `${socialOverview.totalSocialMentions.toLocaleString()} Mentions`,
      badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 border-blue-300 dark:border-blue-700',
      icon: Share2,
      gradient: 'from-blue-600/10 via-cyan-500/5 to-transparent'
    }
  ]

  const categories = ['All', 'Governance', 'News & Record', 'AI & Automation', 'Intelligence', 'Security']

  const filteredTools = tools.filter(tool => {
    const matchesCategory = selectedCategory === 'All' || tool.category === selectedCategory
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.category.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="space-y-8 pb-16">
      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-xl backdrop-blur-md border text-sm font-medium ${
              toastMessage.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-700/80 shadow-emerald-950/30'
                : toastMessage.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-700/80 shadow-red-950/30'
                : 'bg-blue-950/90 text-blue-200 border-blue-700/80 shadow-blue-950/30'
            }`}
          >
            {toastMessage.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toastMessage.type === 'error' && <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />}
            {toastMessage.type === 'info' && <RefreshCw className="w-5 h-5 text-blue-400 shrink-0 animate-spin" />}
            <span>{toastMessage.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Header & Live Command Bar */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 border border-slate-800 text-white p-6 sm:p-8 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-1/3 -bottom-16 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="w-2 h-2 rounded-full bg-emerald-400 -ml-3.5" />
                System Online
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/10">
                <Shield className="w-3.5 h-3.5 text-emerald-400" />
                Admin: {adminEmail || 'Authorized Administrator'}
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/10">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                Ghana Standard Time
              </span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              Executive Command Center
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
              Real-time civic intelligence, automated AI news harvesting, minister performance tracking, and cryptographic integrity monitoring.
            </p>
          </div>

          {/* 1-Click Operations Trigger Deck */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleTriggerNewsHarvester}
              disabled={runningNewsHarvester}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/30 border border-emerald-400/30 transition-all active:scale-95 disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 text-emerald-200 ${runningNewsHarvester ? 'animate-bounce' : ''}`} />
              <span>{runningNewsHarvester ? 'Scanning News...' : '⚡ Run AI News Harvester'}</span>
            </button>

            <button
              onClick={handleTriggerTrendingRecalc}
              disabled={runningTrendingRecalc}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 text-amber-300 ${runningTrendingRecalc ? 'animate-spin' : ''}`} />
              <span>{runningTrendingRecalc ? 'Recalculating...' : 'Sync Trending'}</span>
            </button>

            <Link
              href="/admin/actions/new"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all"
            >
              <Newspaper className="w-4 h-4 text-blue-300" />
              <span>+ Add Action</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Ribbon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Ministers */}
        <Link
          href="/admin/ministers"
          className="group relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-emerald-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Cabinet Ministers
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalMinisters}
            </span>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Active Portfolios
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{metrics.trendingMinisters} in spotlight</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-500 transition-colors" />
          </div>
        </Link>

        {/* Total Votes */}
        <Link
          href="/admin/analytics"
          className="group relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-blue-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Citizen Votes
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalVotes.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
              +{metrics.votesToday} today
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>{metrics.satisfactionRate}% National Satisfaction</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
          </div>
        </Link>

        {/* Verified Actions & Headlines */}
        <Link
          href="/admin/actions"
          className="group relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-amber-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              News & Actions
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Newspaper className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.totalActions}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
              {metrics.actionsWithSource} Verified
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Real-time news attribution</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-amber-500 transition-colors" />
          </div>
        </Link>

        {/* Citizen Submissions / Feedback Inbox */}
        <Link
          href="/admin/submissions"
          className="group relative overflow-hidden bg-white dark:bg-slate-900/90 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-rose-500/50 transition-all"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Citizen Inbox
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              metrics.pendingSubmissions > 0
                ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {metrics.pendingSubmissions}
            </span>
            <span className={`text-xs font-semibold ${
              metrics.pendingSubmissions > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500'
            }`}>
              {metrics.pendingSubmissions === 1 ? 'Pending Review' : 'Pending Review'}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between">
            <span>Suggestions & Bug Reports</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-rose-500 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Snapshot Leaderboards: Highest Rated vs Under Scrutiny */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Highest Satisfaction */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌟</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Top Performing Portfolios
              </h2>
            </div>
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
              Highest Satisfaction
            </span>
          </div>

          <div className="space-y-3">
            {topMinisters.map((m, idx) => (
              <Link
                key={m.id}
                href={`/minister/${m.id}`}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image
                      src={m.photoUrl}
                      alt={m.fullName}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-400">#{idx + 1}</span>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {m.fullName}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {m.portfolio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                      {m.satisfactionRate}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {m.totalVotes} votes
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Public Scrutiny & Attention */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚖️</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Under Citizen Scrutiny
              </h2>
            </div>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-full border border-amber-200 dark:border-amber-800">
              Needs Attention
            </span>
          </div>

          <div className="space-y-3">
            {scrutinyMinisters.map((m) => (
              <Link
                key={m.id}
                href={`/minister/${m.id}`}
                className="group flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-amber-50/70 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 shrink-0 border border-slate-200 dark:border-slate-700">
                    <Image
                      src={m.photoUrl}
                      alt={m.fullName}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {m.fullName}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {m.portfolio}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                      {m.satisfactionRate}%
                    </div>
                    <div className="text-[10px] text-slate-400">
                      {m.totalVotes} votes
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Readings: X.com & Facebook.com */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🌐</span>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Social Media Readings & Sentiment Pulse
              </h2>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                X.com & Facebook
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Real-time civic discussion velocity, viral hashtags, and citizen sentiment distribution across Ghana.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://x.com/search?q=Ghana%20Ministers&f=live"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-black text-white hover:bg-slate-800 transition-colors shadow-sm"
            >
              <XLogo className="w-3.5 h-3.5" />
              <span>Explore 𝕏 Feed</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <a
              href="https://www.facebook.com/search/top?q=Ghana%20Cabinet%20Ministers"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#1877F2] text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              <FacebookLogo className="w-3.5 h-3.5" />
              <span>Explore FB Feed</span>
              <ExternalLink className="w-3 h-3 text-blue-200" />
            </a>
          </div>
        </div>

        {/* Dual Platform Telemetry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* X.com Platform Pulse */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center shadow-sm">
                  <XLogo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>X.com (Twitter) Pulse</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {socialOverview.xStats.dailyVelocity}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                {socialOverview.xTotalMentions.toLocaleString()} posts
              </span>
            </div>

            {/* Sentiment Bar */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {socialOverview.xStats.positivePercent}% Favorable
                </span>
                <span className="text-slate-400">
                  {socialOverview.xStats.neutralPercent}% Neutral
                </span>
                <span className="text-red-500">
                  {socialOverview.xStats.negativePercent}% Critical
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${socialOverview.xStats.positivePercent}%` }} />
                <div className="bg-slate-400 h-full" style={{ width: `${socialOverview.xStats.neutralPercent}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${socialOverview.xStats.negativePercent}%` }} />
              </div>
            </div>

            {/* Top Hashtags */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              {socialOverview.xStats.topHashtags.map((tag) => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Facebook Platform Pulse */}
          <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#1877F2] text-white flex items-center justify-center shadow-sm">
                  <FacebookLogo className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Facebook Community Pulse</span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {socialOverview.facebookStats.dailyVelocity}
                  </p>
                </div>
              </div>
              <span className="text-xs font-extrabold text-slate-900 dark:text-white px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800">
                {socialOverview.facebookTotalMentions.toLocaleString()} discussions
              </span>
            </div>

            {/* Sentiment Bar */}
            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {socialOverview.facebookStats.positivePercent}% Favorable
                </span>
                <span className="text-slate-400">
                  {socialOverview.facebookStats.neutralPercent}% Inquiring
                </span>
                <span className="text-red-500">
                  {socialOverview.facebookStats.negativePercent}% Critical
                </span>
              </div>
              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                <div className="bg-emerald-500 h-full" style={{ width: `${socialOverview.facebookStats.positivePercent}%` }} />
                <div className="bg-slate-400 h-full" style={{ width: `${socialOverview.facebookStats.neutralPercent}%` }} />
                <div className="bg-red-500 h-full" style={{ width: `${socialOverview.facebookStats.negativePercent}%` }} />
              </div>
            </div>

            {/* Top Hashtags */}
            <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              {socialOverview.facebookStats.topHashtags.map((tag) => (
                <span key={tag} className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Most Discussed Ministers On Social Media */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              <span>Top Discussed Ministers on Social Media (X & Facebook)</span>
            </h3>
            <span className="text-xs text-slate-400">
              Aggregated across 24 Cabinet Portfolios
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {socialOverview.topDiscussedMinisters.map((m) => (
              <Link
                key={m.ministerId}
                href={`/minister/${m.ministerId}`}
                className="group p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-700/60 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 mb-2.5 mx-auto border border-slate-200 dark:border-slate-700">
                    <Image
                      src={m.photoUrl}
                      alt={m.ministerName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="text-center">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-emerald-500 transition-colors">
                      {m.ministerName}
                    </h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {m.portfolio}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
                  <div className="text-xs font-extrabold text-slate-900 dark:text-white">
                    {m.mentions.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                    {m.positiveRate}% Positive
                  </div>
                  <div className="text-[9px] text-slate-400 truncate mt-1">
                    {m.primaryTopic}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Administrative Operations Deck */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Platform Administration Modules
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Access governance directories, AI engines, vote auditing, and system configurations.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search admin tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white dark:bg-emerald-500 dark:text-slate-950 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTools.map((tool) => {
            const Icon = tool.icon
            return (
              <motion.div
                key={tool.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.2 }}
                className={`relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800/80 p-6 shadow-sm hover:shadow-lg transition-all overflow-hidden`}
              >
                {/* Subtle gradient corner */}
                <div className={`absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl ${tool.gradient} rounded-bl-full pointer-events-none`} />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center border border-slate-200/60 dark:border-slate-700/60">
                      <Icon className="w-5 h-5 text-slate-800 dark:text-emerald-400" />
                    </div>
                    {tool.badge && (
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${tool.badgeColor || 'bg-slate-100 text-slate-700 border-slate-200'}`}>
                        {tool.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-1.5">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                    {tool.description}
                  </p>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    href={tool.primaryLink}
                    className="w-full text-center py-2 px-3 rounded-xl text-xs font-semibold bg-slate-900 text-white dark:bg-emerald-600 dark:text-white hover:bg-slate-800 dark:hover:bg-emerald-500 transition-colors shadow-sm"
                  >
                    {tool.primaryLabel}
                  </Link>
                  {tool.secondaryLink && tool.secondaryLabel && (
                    <Link
                      href={tool.secondaryLink}
                      className="w-full text-center py-1.5 px-3 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/70 transition-colors"
                    >
                      {tool.secondaryLabel}
                    </Link>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Real-time Activity Stream: Recent Citizen Votes & Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Live Vote Stream */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Live Citizen Vote Stream
              </h2>
            </div>
            <Link
              href="/admin/analytics"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentVotes.map((vote) => (
              <div key={vote.id} className="py-3 flex items-center justify-between gap-3 first:pt-0 last:pb-0">
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    vote.positive
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400'
                  }`}>
                    {vote.positive ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {vote.minister.fullName}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {vote.minister.portfolio}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    vote.positive
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                  }`}>
                    {vote.positive ? 'Satisfied' : 'Not Satisfied'}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Citizen Feedback / Submissions */}
        <div className="bg-white dark:bg-slate-900/90 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Inbox className="w-5 h-5 text-rose-500" />
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Citizen Submissions
              </h2>
            </div>
            <Link
              href="/admin/submissions"
              className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
            >
              <span>Manage Submissions</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub) => (
                <div key={sub.id} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      {sub.type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      sub.status === 'pending'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300'
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300'
                    }`}>
                      {sub.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300 line-clamp-2 leading-relaxed">
                    {sub.message}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {new Date(sub.createdAt).toLocaleDateString()} at {new Date(sub.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-xs text-slate-400">
                No submissions received yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
