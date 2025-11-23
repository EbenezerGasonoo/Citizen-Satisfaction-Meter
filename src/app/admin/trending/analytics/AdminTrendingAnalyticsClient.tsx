'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    TrendingUp,
    Users,
    Clock,
    Target,
    ArrowLeft,
    BarChart2,
    Activity
} from 'lucide-react'
import Link from 'next/link'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

interface TrendingAnalytics {
    totalVotes24h: number
    totalVotesWeek: number
    trendingMinisters: number
    voteVelocity: number
    weeklyVelocity: number
    hourlyVotes: { hour: string; count: number }[]
    topTrending: { name: string; score: number }[]
}

export default function AdminTrendingAnalyticsClient() {
    const [analytics, setAnalytics] = useState<TrendingAnalytics | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await fetch('/api/admin/trending?action=analytics')
                if (response.ok) {
                    const data = await response.json()
                    setAnalytics(data.analytics)
                }
            } catch (error) {
                console.error('Failed to fetch analytics:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchAnalytics()
    }, [])

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-8" />
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-32 bg-gray-200 rounded" />
                        ))}
                    </div>
                    <div className="h-96 bg-gray-200 rounded" />
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <Link
                        href="/admin/trending"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Trending Management
                    </Link>
                    <h1 className="text-3xl font-bold text-cocoa-green mb-2">
                        Trending Analytics
                    </h1>
                    <p className="text-gray-600">
                        Deep dive into trending metrics and voting patterns
                    </p>
                </header>

                {analytics && (
                    <>
                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <Users className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">24h Votes</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analytics.totalVotes24h.toLocaleString()}
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
                                        <Clock className="w-6 h-6 text-green-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Weekly Votes</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analytics.totalVotesWeek.toLocaleString()}
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
                                        <TrendingUp className="w-6 h-6 text-purple-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Trending Count</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analytics.trendingMinisters}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <div className="flex items-center">
                                    <div className="p-3 bg-orange-100 rounded-lg">
                                        <Target className="w-6 h-6 text-orange-600" />
                                    </div>
                                    <div className="ml-4">
                                        <p className="text-sm text-gray-500">Vote Velocity</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            {analytics.voteVelocity.toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>

                        {/* Charts Section */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            {/* Hourly Activity */}
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-blue-600" />
                                    Hourly Activity (24h)
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={analytics.hourlyVotes}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                            <XAxis dataKey="hour" />
                                            <YAxis />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="count"
                                                stroke="#2563eb"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>

                            {/* Top Trending */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                                className="bg-white rounded-lg shadow-md p-6"
                            >
                                <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                                    <BarChart2 className="w-5 h-5 mr-2 text-purple-600" />
                                    Top Trending Scores
                                </h3>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analytics.topTrending} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={150} />
                                            <Tooltip />
                                            <Bar dataKey="score" fill="#9333ea" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </motion.div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
