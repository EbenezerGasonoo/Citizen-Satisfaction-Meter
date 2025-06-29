'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts'
import { TrendingUp, TrendingDown, Users, Vote, Target, Calendar } from 'lucide-react'
import PolicyAnalytics from '@/components/PolicyAnalytics'

interface AnalyticsData {
  nationalScore: {
    satisfactionPercentage: number
    totalVotes: number
    positiveVotes: number
  }
  topMinisters: Array<{
    id: number
    fullName: string
    portfolio: string
    satisfactionRate: number
    totalVotes: number
  }>
  bottomMinisters: Array<{
    id: number
    fullName: string
    portfolio: string
    satisfactionRate: number
    totalVotes: number
  }>
  dailyVotes: Array<{
    date: string
    votes: number
    positiveVotes: number
  }>
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [nationalScoreRes, ministersRes] = await Promise.all([
          fetch('/api/analytics/nationalScore'),
          fetch('/api/ministers')
        ])

        if (nationalScoreRes.ok && ministersRes.ok) {
          const nationalScore = await nationalScoreRes.json()
          const ministers = await ministersRes.json()

          // Sort ministers by satisfaction rate
          const sortedMinisters = ministers.sort((a: any, b: any) => b.satisfactionRate - a.satisfactionRate)
          const topMinisters = sortedMinisters.slice(0, 5)
          const bottomMinisters = sortedMinisters.slice(-5).reverse()

          // Mock daily votes data (in real app, this would come from API)
          const dailyVotes = Array.from({ length: 7 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (6 - i))
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              votes: Math.floor(Math.random() * 100) + 50,
              positiveVotes: Math.floor(Math.random() * 60) + 30
            }
          })

          setData({
            nationalScore,
            topMinisters,
            bottomMinisters,
            dailyVotes
          })
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
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
              ))}
            </div>
            <div className="h-96 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-500 text-lg">Failed to load analytics data</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-cocoa-green mb-2">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into citizen satisfaction and voting patterns
          </p>
        </header>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">National Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.nationalScore.satisfactionPercentage}%
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
                <Vote className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Total Votes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.nationalScore.totalVotes.toLocaleString()}
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
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Positive Votes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.nationalScore.positiveVotes.toLocaleString()}
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
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Today's Votes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.dailyVotes[data.dailyVotes.length - 1]?.votes || 0}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Votes Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Voting Activity</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.dailyVotes}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="votes" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="positiveVotes" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Top Ministers Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Ministers</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.topMinisters}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fullName" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="satisfactionRate" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Minister Rankings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Ministers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
              Top Performing Ministers
            </h3>
            <div className="space-y-3">
              {data.topMinisters.map((minister, index) => (
                <div key={minister.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{minister.fullName}</p>
                      <p className="text-sm text-gray-600">{minister.portfolio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">{minister.satisfactionRate}%</p>
                    <p className="text-sm text-gray-500">{minister.totalVotes} votes</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Bottom Ministers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-lg shadow-md p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingDown className="w-5 h-5 text-red-600 mr-2" />
              Ministers Needing Attention
            </h3>
            <div className="space-y-3">
              {data.bottomMinisters.map((minister, index) => (
                <div key={minister.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                      {data.bottomMinisters.length - index}
                    </span>
                    <div>
                      <p className="font-medium text-gray-900">{minister.fullName}</p>
                      <p className="text-sm text-gray-600">{minister.portfolio}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-red-600">{minister.satisfactionRate}%</p>
                    <p className="text-sm text-gray-500">{minister.totalVotes} votes</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Policy Analytics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="bg-white rounded-lg shadow-md p-6"
        >
          <PolicyAnalytics />
        </motion.div>
      </div>
    </div>
  )
} 