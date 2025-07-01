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

export default function AdminActionsPage() {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'Completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
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

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Action Management</h1>
          <button
            onClick={() => { setShowForm(true); setEditingAction(null); resetForm(); }}
            className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" /> Create New Action
          </button>
        </div>

        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {actions.map(action => (
              <div key={action.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700 flex flex-col justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">{action.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{action.description}</p>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(action.status)}`}>{action.status}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getImpactColor(action.impact)}`}>{action.impact} Impact</span>
                    <span className="px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-900 dark:text-gray-200 text-gray-800">{action.date.slice(0,10)}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleEdit(action)}
                    className="flex items-center px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(action.id)}
                    className="flex items-center px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal Form */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                onClick={() => { setShowForm(false); setEditingAction(null); }}
              >
                ×
              </button>
              <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">{editingAction ? 'Edit Action' : 'Create New Action'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-1 font-medium">Title</label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={formData.title}
                    onChange={e => setFormData(f => ({ ...f, title: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea
                    className="w-full border rounded px-3 py-2"
                    value={formData.description}
                    onChange={e => setFormData(f => ({ ...f, description: e.target.value }))}
                    rows={3}
                    required
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Status</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={formData.status}
                      onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}
                    >
                      <option value="Active">Active</option>
                      <option value="Completed">Completed</option>
                      <option value="Planned">Planned</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block mb-1 font-medium">Impact</label>
                    <select
                      className="w-full border rounded px-3 py-2"
                      value={formData.impact}
                      onChange={e => setFormData(f => ({ ...f, impact: e.target.value }))}
                    >
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Date</label>
                  <input
                    type="date"
                    className="w-full border rounded px-3 py-2"
                    value={formData.date}
                    onChange={e => setFormData(f => ({ ...f, date: e.target.value }))}
                    required
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                    onClick={() => { setShowForm(false); setEditingAction(null); }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    {editingAction ? 'Update Action' : 'Create Action'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </main>
  )
} 