'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2 } from 'lucide-react'

interface Action {
  id: number
  title: string
  description: string
  status: string
  date: string
  impact: string
}

export default function AdminActionsClient() {
  const [actions, setActions] = useState<Action[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingAction, setEditingAction] = useState<Action | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'Active',
    date: '',
    impact: 'Medium',
  })

  useEffect(() => {
    fetchActions()
  }, [])

  const fetchActions = async () => {
    try {
      const response = await fetch('/api/admin/actions')
      if (response.ok) {
        const data = await response.json()
        setActions(data.actions)
      }
    } catch (error) {
      console.error('Failed to fetch actions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingAction
        ? `/api/admin/actions/${editingAction.id}`
        : '/api/admin/actions'
      const method = editingAction ? 'PUT' : 'POST'
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        setShowForm(false)
        setEditingAction(null)
        resetForm()
        fetchActions()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save action')
      }
    } catch (error) {
      console.error('Error saving action:', error)
      alert('Failed to save action')
    }
  }

  const handleEdit = (action: Action) => {
    setEditingAction(action)
    setFormData({
      title: action.title,
      description: action.description,
      status: action.status,
      date: action.date,
      impact: action.impact,
    })
    setShowForm(true)
  }

  const handleDelete = async (actionId: number) => {
    if (!confirm('Are you sure you want to delete this action?')) return

    try {
      const response = await fetch(`/api/admin/actions/${actionId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchActions()
      } else {
        alert('Failed to delete action')
      }
    } catch (error) {
      console.error('Error deleting action:', error)
      alert('Failed to delete action')
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      status: 'Active',
      date: '',
      impact: 'Medium',
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded" />
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
            Actions Management
          </h1>
          <p className="text-gray-600">
            Manage government actions and track their progress
          </p>
        </header>

        <div className="mb-8">
          <button
            onClick={() => setShowForm(true)}
            className="bg-cocoa-green text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Action
          </button>
        </div>

        <div className="space-y-4">
          {actions.map((action) => (
            <div key={action.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {action.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{action.description}</p>
                  
                  <div className="flex gap-4 text-sm">
                    <span className={`px-2 py-1 rounded-full ${
                      action.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : action.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {action.status}
                    </span>
                    <span className={`px-2 py-1 rounded-full ${
                      action.impact === 'High' 
                        ? 'bg-red-100 text-red-800' 
                        : action.impact === 'Medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {action.impact} Impact
                    </span>
                    <span className="text-gray-500">
                      Date: {new Date(action.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleEdit(action)}
                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(action.id)}
                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {actions.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No actions found.</p>
          </div>
        )}
      </div>

      {/* Action Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h2 className="text-xl font-semibold mb-4">
              {editingAction ? 'Edit Action' : 'Add New Action'}
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
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cocoa-green focus:border-transparent"
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-cocoa-green text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {editingAction ? 'Update Action' : 'Create Action'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingAction(null)
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
