'use client'

import { useEffect, useState } from 'react'
import { Clock } from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface TimeData {
    hour: string
    count: number
}

export default function PeakVotingTimes() {
    const [data, setData] = useState<TimeData[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('/api/admin/analytics/time')
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                }
            } catch (error) {
                console.error('Failed to fetch time data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return <div className="h-64 bg-gray-100 rounded-lg animate-pulse" />
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 text-orange-600 mr-2" />
                Peak Voting Times (UTC)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" interval={3} />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="count" stroke="#ff7300" fill="#ff7300" fillOpacity={0.2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    )
}
