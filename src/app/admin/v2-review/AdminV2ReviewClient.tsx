'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  ExternalLink,
  Edit2,
  Check,
  X,
  Trash2,
  Search,
  Filter,
  AlertCircle
} from 'lucide-react';

interface StagedMinister {
  id: number;
  fullName: string;
  portfolio: string;
  bio: string | null;
  photoUrl: string | null;
  sourceUrl: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  createdAt: string;
}

interface Stats {
  total: number;
  PENDING: number;
  APPROVED: number;
  REJECTED: number;
  PUBLISHED: number;
}

export default function AdminV2ReviewClient() {
  const [staged, setStaged] = useState<StagedMinister[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    PENDING: 0,
    APPROVED: 0,
    REJECTED: 0,
    PUBLISHED: 0
  });
  const [loading, setLoading] = useState(true);
  const [harvesting, setHarvesting] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<{ fullName: string; portfolio: string; bio: string; photoUrl: string }>({
    fullName: '',
    portfolio: '',
    bio: '',
    photoUrl: ''
  });
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const fetchStaged = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/v2/stage?status=${statusFilter}`);
      const data = await res.json();
      if (data.success) {
        setStaged(data.staged);
        setStats(data.stats);
      } else {
        showToast('error', data.error || 'Failed to fetch staged data');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Network error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaged();
  }, [statusFilter]);

  const handleHarvest = async () => {
    if (!confirm('Run Wikipedia harvester to scrape Ghana cabinet ministers?')) return;
    setHarvesting(true);
    try {
      const res = await fetch('/api/admin/v2/stage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'harvest' })
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', data.message || 'Harvest completed successfully');
        fetchStaged();
      } else {
        showToast('error', data.error || 'Harvest failed');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Error executing harvester');
    } finally {
      setHarvesting(false);
    }
  };

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED' | 'PENDING') => {
    try {
      const res = await fetch('/api/admin/v2/stage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setStaged(prev => prev.map(item => (item.id === id ? { ...item, status } : item)));
        // Update stats
        setStats(prev => {
          const oldItem = staged.find(s => s.id === id);
          if (!oldItem) return prev;
          const oldStatus = oldItem.status;
          return {
            ...prev,
            [oldStatus]: Math.max(0, (prev as any)[oldStatus] - 1),
            [status]: (prev as any)[status] + 1
          };
        });
        showToast('success', `Status updated to ${status}`);
      }
    } catch (err: any) {
      showToast('error', 'Failed to update status');
    }
  };

  const handleApproveAll = async () => {
    const pendingItems = staged.filter(s => s.status === 'PENDING');
    if (pendingItems.length === 0) {
      showToast('info', 'No pending ministers to approve');
      return;
    }

    if (!confirm(`Approve all ${pendingItems.length} pending ministers?`)) return;

    for (const item of pendingItems) {
      await handleUpdateStatus(item.id, 'APPROVED');
    }
    showToast('success', `Approved ${pendingItems.length} ministers`);
  };

  const handlePublish = async () => {
    const approvedCount = stats.APPROVED;
    if (approvedCount === 0) {
      showToast('info', 'No approved ministers ready for publishing. Please approve ministers first.');
      return;
    }

    if (!confirm(`Publish all ${approvedCount} approved ministers to the live production database? This will safely update portfolios/bios and create new ministers while preserving existing votes.`)) {
      return;
    }

    setPublishing(true);
    try {
      const res = await fetch('/api/admin/v2/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (data.success) {
        showToast('success', `Successfully published ${data.publishedCount} ministers (${data.createdCount} new, ${data.updatedCount} updated)!`);
        fetchStaged();
      } else {
        showToast('error', data.error || 'Failed to publish to live database');
      }
    } catch (err: any) {
      showToast('error', err.message || 'Network error publishing ministers');
    } finally {
      setPublishing(false);
    }
  };

  const startEdit = (item: StagedMinister) => {
    setEditingId(item.id);
    setEditForm({
      fullName: item.fullName,
      portfolio: item.portfolio,
      bio: item.bio || '',
      photoUrl: item.photoUrl || ''
    });
  };

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch('/api/admin/v2/stage', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          fullName: editForm.fullName,
          portfolio: editForm.portfolio,
          bio: editForm.bio,
          photoUrl: editForm.photoUrl
        })
      });
      const data = await res.json();
      if (data.success) {
        setStaged(prev =>
          prev.map(item =>
            item.id === id
              ? {
                  ...item,
                  fullName: editForm.fullName,
                  portfolio: editForm.portfolio,
                  bio: editForm.bio,
                  photoUrl: editForm.photoUrl
                }
              : item
          )
        );
        setEditingId(null);
        showToast('success', 'Changes saved successfully');
      }
    } catch {
      showToast('error', 'Failed to save changes');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete "${name}" from staging?`)) return;
    try {
      const res = await fetch(`/api/admin/v2/stage?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setStaged(prev => prev.filter(s => s.id !== id));
        fetchStaged();
        showToast('success', 'Record removed from staging');
      }
    } catch {
      showToast('error', 'Failed to delete record');
    }
  };

  const filteredMinisters = staged.filter(item => {
    const matchesSearch =
      item.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.portfolio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Admin Dashboard
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-tr from-green-600 to-emerald-500 text-white rounded-xl shadow-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  V2 Automated Harvester & Admin Review
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Inspect Wikipedia-scraped data, verify bios and photos, and publish to the live database.
                </p>
              </div>
            </div>
          </div>

          {/* Top Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleHarvest}
              disabled={harvesting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-medium transition-all shadow-sm disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${harvesting ? 'animate-spin text-green-600' : ''}`} />
              {harvesting ? 'Harvesting...' : 'Run Wikipedia Harvester'}
            </button>

            <button
              onClick={handleApproveAll}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Approve All Pending
            </button>

            <button
              onClick={handlePublish}
              disabled={publishing || stats.APPROVED === 0}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md disabled:opacity-40"
            >
              <Send className={`w-4 h-4 ${publishing ? 'animate-bounce' : ''}`} />
              {publishing ? 'Publishing...' : `Publish Approved to Live (${stats.APPROVED})`}
            </button>
          </div>
        </div>

        {/* Notifications Toast */}
        <AnimatePresence>
          {notification && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`p-4 rounded-xl border flex items-center gap-3 shadow-sm ${
                notification.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300'
                  : notification.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-950/40 dark:border-rose-800 dark:text-rose-300'
                  : 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-950/40 dark:border-blue-800 dark:text-blue-300'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600" />
              )}
              <span className="text-sm font-medium">{notification.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
          {[
            { label: 'Total In Staging', value: stats.total, color: 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300' },
            { label: 'Pending Review', value: stats.PENDING, color: 'border-amber-200 dark:border-amber-900 text-amber-600 dark:text-amber-400 bg-amber-50/50 dark:bg-amber-950/20' },
            { label: 'Approved', value: stats.APPROVED, color: 'border-emerald-200 dark:border-emerald-900 text-emerald-600 dark:text-emerald-400 bg-emerald-50/50 dark:bg-emerald-950/20' },
            { label: 'Published', value: stats.PUBLISHED, color: 'border-blue-200 dark:border-blue-900 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20' },
            { label: 'Rejected', value: stats.REJECTED, color: 'border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20' }
          ].map(stat => (
            <div
              key={stat.label}
              className={`p-4 rounded-xl border bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-center ${stat.color}`}
            >
              <span className="text-xs uppercase font-semibold tracking-wider text-slate-500 dark:text-slate-400">{stat.label}</span>
              <span className="text-2xl font-bold mt-1">{stat.value}</span>
            </div>
          ))}
        </div>

        {/* Filters & Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {['ALL', 'PENDING', 'APPROVED', 'PUBLISHED', 'REJECTED'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search ministers or portfolios..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-sm bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>
        </div>

        {/* Ministers Review Cards */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 animate-pulse p-4 space-y-4" />
            ))}
          </div>
        ) : filteredMinisters.length === 0 ? (
          <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            <Filter className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold">No staged ministers match your filter</h3>
            <p className="text-sm text-slate-500 mt-1">Try changing your search query, or click "Run Wikipedia Harvester".</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMinisters.map(item => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  {/* Card Header & Photo */}
                  <div className="p-5 flex gap-4 items-start border-b border-slate-100 dark:border-slate-800/80">
                    <div className="relative w-20 h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0 border border-slate-200 dark:border-slate-700">
                      {item.photoUrl ? (
                        <Image
                          src={item.photoUrl}
                          alt={item.fullName}
                          fill
                          className="object-cover"
                          unoptimized={item.photoUrl.startsWith('http')}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs text-center p-1">
                          No Photo
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        {/* Status Badge */}
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                            item.status === 'APPROVED'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                              : item.status === 'PUBLISHED'
                              ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                              : item.status === 'REJECTED'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {item.status}
                        </span>

                        {item.sourceUrl && (
                          <a
                            href={item.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                            title="View on Wikipedia"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                      </div>

                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.fullName}
                          onChange={e => setEditForm({ ...editForm, fullName: e.target.value })}
                          className="w-full text-base font-semibold px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded"
                        />
                      ) : (
                        <h3 className="text-base font-bold truncate" title={item.fullName}>
                          {item.fullName}
                        </h3>
                      )}

                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.portfolio}
                          onChange={e => setEditForm({ ...editForm, portfolio: e.target.value })}
                          className="w-full text-xs px-2 py-1 bg-slate-50 dark:bg-slate-800 border rounded"
                        />
                      ) : (
                        <p className="text-xs text-green-700 dark:text-green-400 font-medium line-clamp-2" title={item.portfolio}>
                          {item.portfolio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Bio & Details */}
                  <div className="p-5 flex-1 space-y-3">
                    {isEditing ? (
                      <textarea
                        rows={4}
                        value={editForm.bio}
                        onChange={e => setEditForm({ ...editForm, bio: e.target.value })}
                        className="w-full text-xs p-2 bg-slate-50 dark:bg-slate-800 border rounded resize-none"
                        placeholder="Minister bio..."
                      />
                    ) : (
                      <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed">
                        {item.bio || 'No biography extracted yet.'}
                      </p>
                    )}
                  </div>

                  {/* Card Actions Footer */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-2 w-full justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 text-xs border rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(item.id)}
                          className="px-3 py-1 text-xs bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Save
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.fullName)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUpdateStatus(item.id, 'REJECTED')}
                            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                              item.status === 'REJECTED'
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-200 dark:bg-slate-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>

                          <button
                            onClick={() => handleUpdateStatus(item.id, 'APPROVED')}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1 ${
                              item.status === 'APPROVED'
                                ? 'bg-emerald-600 text-white shadow-sm'
                                : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200 dark:bg-emerald-950 dark:text-emerald-300'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
