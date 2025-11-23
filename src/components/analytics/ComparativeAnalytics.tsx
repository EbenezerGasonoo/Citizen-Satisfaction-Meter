'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { GitCompare } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface Minister {
    id: number
    fullName: string
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function ComparativeAnalytics() {
    const [ministers, setMinisters] = useState<Minister[]>([])
    const [selectedIds, setSelectedIds] = useState<number[]>([])
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        // Fetch list of ministers for selection
        const fetchMinisters = async () => {
            try {
                const response = await fetch('/api/ministers')
                if (response.ok) {
                    const result = await response.json()
                    setMinisters(result)
                    // Select top 2 by default if available
                    if (result.length >= 2) {
                        setSelectedIds([result[0].id, result[1].id])
                    }
                }
            } catch (error) {
                console.error('Failed to fetch ministers:', error)
            }
        }
        fetchMinisters()
    }, [])

    useEffect(() => {
        if (selectedIds.length === 0) return

        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await fetch(`/api/admin/analytics/compare?ids=${selectedIds.join(',')}`)
                if (response.ok) {
                    const result = await response.json()
                    setData(result)
                }
            } catch (error) {
                console.error('Failed to fetch comparison data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [selectedIds])

    const toggleMinister = (id: number) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter(sid => sid !== id))
        } else {
            if (selectedIds.length < 5) {
                setSelectedIds([...selectedIds, id])
            }
        }
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <GitCompare className="w-5 h-5 text-purple-600 mr-2" />
                Minister Comparison (Satisfaction %)
            </h3>

            <div className="mb-6 flex flex-wrap gap-2">
                {ministers.map(minister => (
                    <button
                        key={minister.id}
                        onClick={() => toggleMinister(minister.id)}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedIds.includes(minister.id)
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {minister.fullName}
                    </button>
                ))}
            </div>

            <div className="h-[300px]">
                {loading ? (
                    <div className="h-full flex items-center justify-center text-gray-400">Loading...</div>
                ) : data.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, 100]} />
                            <Tooltip />
                            <Legend />
                            {selectedIds.map((id, index) => {
                                const minister = ministers.find(m => m.id === id)
                                if (!minister) return null
                                return (
                                    <Line
                                        key={id}
                                        type="monotone"
                                        dataKey={minister.fullName}
                                        stroke={COLORS[index % COLORS.length]}
                                        strokeWidth={2}
                                        dot={{ r: 4 }}
                                    />
                                )
                            })}
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Select ministers to compare
                    </div>
                )}
            </div>
        </div>
    )
}
