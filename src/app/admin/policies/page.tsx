'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Eye, TrendingUp, Calendar, DollarSign } from 'lucide-react'

interface Policy {
  id: number
  title: string
  description: string
  category: string
  status: string
  startDate?: string
  endDate?: string
  budget?: number
  impact: string
  ministerId: number
  minister: {
    fullName: string
    portfolio: string
  }
  totalVotes: number
  positiveVotes: number
  satisfactionRate: number
}

interface Minister {
  id: number
  fullName: string
  portfolio: string
}

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([])
  const [ministers, setMinisters] = useState<Minister[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingPolicy, setEditingPolicy] = useState<Policy | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Economic',
    status: 'Active',
    startDate: '',
    endDate: '',
    budget: '',
    impact: 'Medium',
    ministerId: ''
  })

  useEffect(() => {
    fetchPolicies()
    fetchMinisters()
  }, [])

  const fetchPolicies = async () => {
    try {
      const response = await fetch('/api/admin/policies')
      if (response.ok) {
        const data = await response.json()
        setPolicies(data.policies)
      }
    } catch (error) {
      console.error('Failed to fetch policies:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMinisters = async () => {
    try {
      const response = await fetch('/api/ministers')
      if (response.ok) {
        const data = await response.json()
        setMinisters(data)
      }
    } catch (error) {
      console.error('Failed to fetch ministers:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const policyData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      ministerId: parseInt(formData.ministerId)
    }

    try {
      const url = editingPolicy 
        ? `/api/admin/policies/${editingPolicy.id}`
        : '/api/admin/policies'
      
      const method = editingPolicy ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policyData)
      })

      if (response.ok) {
        setShowForm(false)
        setEditingPolicy(null)
        resetForm()
        fetchPolicies()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save policy')
      }
    } catch (error) {
      console.error('Error saving policy:', error)
      alert('Failed to save policy')
    }
  }

  const handleEdit = (policy: Policy) => {
    setEditingPolicy(policy)
    setFormData({
      title: policy.title,
      description: policy.description,
      category: policy.category,
      status: policy.status,
      startDate: policy.startDate || '',
      endDate: policy.endDate || '',
      budget: policy.budget?.toString() || '',
      impact: policy.impact,
      ministerId: policy.ministerId.toString()
    })
    setShowForm(true)
  }

  const handleDelete = async (policyId: number) => {
    if (!confirm('Are you sure you want to delete this policy?')) return

    try {
      const response = await fetch(`/api/admin/policies/${policyId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPolicies()
      } else {
        alert('Failed to delete policy')
      }
    } catch (error) {
      console.error('Error deleting policy:', error)
      alert('Failed to delete policy')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Economic',
      status: 'Active',
      startDate: '',
      endDate: '',
      budget: '',
      impact: 'Medium',
      ministerId: ''
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'Completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Planned': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Suspended': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-cocoa-green dark:text-green-400">
            Policy Management
          </h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingPolicy(null)
              resetForm()
            }}
            className="flex items-center gap-2 bg-cocoa-green dark:bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Policy
          </button>
        </div>

        {/* Policy Form Modal */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="Economic">Economic</option>
                      <option value="Social">Social</option>
                      <option value="Infrastructure">Infrastructure</option>
                      <option value="Security">Security</option>
                      <option value="Education">Education</option>
                      <option value="Health">Health</option>
                      <option value="Environment">Environment</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Planned">Planned</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Budget (GH₵)
                    </label>
                    <input
                      type="number"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Impact
                    </label>
                    <select
                      value={formData.impact}
                      onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Minister
                  </label>
                  <select
                    required
                    value={formData.ministerId}
                    onChange={(e) => setFormData({ ...formData, ministerId: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cocoa-green dark:focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Select a minister</option>
                    {ministers.map(minister => (
                      <option key={minister.id} value={minister.id}>
                        {minister.fullName} - {minister.portfolio}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-cocoa-green dark:bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 dark:hover:bg-green-700 transition-colors"
                  >
                    {editingPolicy ? 'Update Policy' : 'Create Policy'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                    {policy.title}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(policy)}
                      className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(policy.id)}
                      className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                  {policy.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Minister:</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">{policy.minister.fullName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Category:</span>
                    <span className="text-xs text-gray-700 dark:text-gray-300">{policy.category}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Status:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(policy.status)}`}>
                      {policy.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Impact:</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getImpactColor(policy.impact)}`}>
                      {policy.impact}
                    </span>
                  </div>

                  {policy.budget && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-700 dark:text-gray-300">
                        GH₵{policy.budget.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center justify-between">
                    <div className="text-center">
                      <div className="text-lg font-bold text-cocoa-green dark:text-green-400">
                        {policy.satisfactionRate}%
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-700 dark:text-gray-300">
                        {policy.totalVotes}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Votes</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {policy.positiveVotes}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Positive</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {policies.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <TrendingUp className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400">No policies found</p>
            <p className="text-sm text-gray-500 dark:text-gray-500">Create your first policy to get started</p>
          </div>
        )}
      </div>
    </div>
  )
} 