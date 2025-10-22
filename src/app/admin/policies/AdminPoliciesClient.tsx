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

export default function AdminPoliciesClient() {
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
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [policiesRes, ministersRes] = await Promise.all([
        fetch('/api/admin/policies'),
        fetch('/api/ministers')
      ])

      if (policiesRes.ok) {
        const policiesData = await policiesRes.json()
        setPolicies(policiesData.policies || [])
      }

      if (ministersRes.ok) {
        const ministersData = await ministersRes.json()
        setMinisters(ministersData || [])
      }
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPolicy
        ? `/api/admin/policies/${editingPolicy.id}`
        : '/api/admin/policies'
      const method = editingPolicy ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          budget: formData.budget ? parseFloat(formData.budget) : null
        })
      })

      if (response.ok) {
        setShowForm(false)
        setEditingPolicy(null)
        resetForm()
        fetchData()
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
        fetchData()
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

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'High': return 'text-red-600 bg-red-100'
      case 'Medium': return 'text-yellow-600 bg-yellow-100'
      case 'Low': return 'text-green-600 bg-green-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'text-green-600 bg-green-100'
      case 'Inactive': return 'text-red-600 bg-red-100'
      case 'Pending': return 'text-yellow-600 bg-yellow-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 rounded-lg" />
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
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-cocoa-green mb-2">
            Policies Management
          </h1>
          <p className="text-gray-600">
            Manage government policies and track their performance
          </p>
        </header>

        {/* Actions */}
        <div className="mb-8 flex justify-between items-center">
          <button
            onClick={() => setShowForm(true)}
            className="bg-cocoa-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Policy
          </button>
        </div>

        {/* Policies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {policies.map((policy, index) => (
            <motion.div
              key={policy.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-md p-6 border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                  {policy.title}
                </h3>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEdit(policy)}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(policy.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {policy.description}
              </p>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Minister:</span>
                  <span className="font-medium">{policy.minister.fullName}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Category:</span>
                  <span className="font-medium">{policy.category}</span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(policy.status)}`}>
                    {policy.status}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <span className="text-gray-500 w-20">Impact:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(policy.impact)}`}>
                    {policy.impact}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-green-600">
                    {policy.satisfactionRate}%
                  </p>
                  <p className="text-xs text-gray-500">Satisfaction</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-blue-600">
                    {policy.totalVotes}
                  </p>
                  <p className="text-xs text-gray-500">Votes</p>
                </div>
              </div>

              {policy.budget && (
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span>Budget: ${policy.budget.toLocaleString()}</span>
                </div>
              )}

              {(policy.startDate || policy.endDate) && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>
                    {policy.startDate && new Date(policy.startDate).toLocaleDateString()}
                    {policy.startDate && policy.endDate && ' - '}
                    {policy.endDate && new Date(policy.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {policies.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No policies found.</p>
          </div>
        )}
      </div>

      {/* Policy Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingPolicy ? 'Edit Policy' : 'Add New Policy'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  >
                    <option value="Economic">Economic</option>
                    <option value="Social">Social</option>
                    <option value="Infrastructure">Infrastructure</option>
                    <option value="Health">Health</option>
                    <option value="Education">Education</option>
                    <option value="Security">Security</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minister
                </label>
                <select
                  required
                  value={formData.ministerId}
                  onChange={(e) => setFormData({ ...formData, ministerId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                >
                  <option value="">Select a minister</option>
                  {ministers.map((minister) => (
                    <option key={minister.id} value={minister.id}>
                      {minister.fullName} - {minister.portfolio}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Budget
                  </label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Impact
                  </label>
                  <select
                    value={formData.impact}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cocoa-green text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingPolicy ? 'Update Policy' : 'Create Policy'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingPolicy(null)
                    resetForm()
                  }}
                  className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
