"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Minister {
  id: number;
  fullName: string;
  portfolio: string;
}

export default function NewActionPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Active",
    date: "",
    impact: "Medium",
    ministerId: "",
    sourceUrl: "",
    sourcePublisher: "",
    civicContext: ""
  });
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingAI, setFetchingAI] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [error, setError] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchMinisters = async () => {
      try {
        const response = await fetch("/api/ministers");
        if (response.ok) {
          const data = await response.json();
          setMinisters(data);
        }
      } catch (err) {
        setError("Failed to load ministers");
      }
    };
    fetchMinisters();
  }, []);

  const handleFetchAINews = async () => {
    if (!formData.ministerId) {
      setError("Please select a minister first to fetch their live news.");
      return;
    }
    setFetchingAI(true);
    setError("");
    setAiMessage("");
    try {
      const res = await fetch("/api/admin/actions/fetch-news", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ministerId: Number(formData.ministerId) })
      });
      const data = await res.json();
      if (data.success && data.synthesized) {
        const s = data.synthesized;
        setFormData(prev => ({
          ...prev,
          title: s.title || prev.title,
          description: s.description || prev.description,
          civicContext: s.civicContext || prev.civicContext,
          sourcePublisher: s.sourcePublisher || prev.sourcePublisher,
          sourceUrl: s.sourceUrl || prev.sourceUrl,
          impact: s.impact || prev.impact,
          date: s.date ? new Date(s.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)
        }));
        setAiMessage(`✅ Found ${data.articlesFound || 1} live news article(s). Synthesized headline and civic context!`);
      } else {
        setError(data.message || data.error || "No recent news found for this minister.");
      }
    } catch (e: any) {
      setError("Failed to fetch news via AI: " + e.message);
    } finally {
      setFetchingAI(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const actionData = {
      ...formData,
      ministerId: parseInt(formData.ministerId)
    };
    try {
      const response = await fetch("/api/admin/actions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(actionData)
      });
      if (response.ok) {
        router.push("/admin/actions");
      } else {
        const err = await response.json();
        setError(err.error || "Failed to create action");
      }
    } catch (err) {
      setError("Network error");
    } finally {
      setLoading(false);
      setShowPreview(false);
    }
  };

  const selectedMinister = ministers.find(m => m.id === parseInt(formData.ministerId));

  return (
    <main className="max-w-2xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">Create New Action & News Story</h1>
      <form onSubmit={e => { e.preventDefault(); setShowPreview(true); }} className="space-y-4 bg-white dark:bg-gray-800 rounded shadow p-6 border border-gray-200 dark:border-gray-700">
        {error && <div className="text-red-600 mb-2 text-sm bg-red-50 dark:bg-red-900/20 p-2 rounded">{error}</div>}
        {aiMessage && <div className="text-emerald-600 dark:text-emerald-400 mb-2 text-sm bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded">{aiMessage}</div>}
        
        {/* Minister Selection + AI Fetcher Button */}
        <div>
          <label className="block mb-1 font-medium">Minister</label>
          <div className="flex gap-2">
            <select
              className="flex-1 border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={formData.ministerId}
              onChange={e => {
                setFormData(f => ({ ...f, ministerId: e.target.value }));
                setAiMessage("");
              }}
              required
            >
              <option value="">Select Minister</option>
              {ministers.map(m => (
                <option key={m.id} value={m.id}>{m.fullName} ({m.portfolio})</option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleFetchAINews}
              disabled={fetchingAI || !formData.ministerId}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-medium rounded transition-colors flex items-center gap-1.5 shrink-0"
            >
              {fetchingAI ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Searching AI...</span>
                </>
              ) : (
                <>
                  <span>⚡ Auto-Fetch News via AI</span>
                </>
              )}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">Select a minister to automatically fetch their latest Ghanaian news via Google News RSS & AI synthesis.</p>
        </div>

        <div>
          <label className="block mb-1 font-medium">Headline / Title</label>
          <input type="text" className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} rows={3} required />
        </div>

        <div>
          <label className="block mb-1 font-medium">Civic Context (Why This Matters)</label>
          <input
            type="text"
            placeholder="e.g. Why this matters: Affects electricity tariffs starting next month."
            className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
            value={formData.civicContext}
            onChange={e => setFormData(f => ({ ...f, civicContext: e.target.value }))}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block mb-1 font-medium">Source Publisher</label>
            <input
              type="text"
              placeholder="e.g. Modern Ghana, Citi Newsroom"
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={formData.sourcePublisher}
              onChange={e => setFormData(f => ({ ...f, sourcePublisher: e.target.value }))}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Source URL</label>
            <input
              type="url"
              placeholder="https://..."
              className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              value={formData.sourceUrl}
              onChange={e => setFormData(f => ({ ...f, sourceUrl: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Status</label>
            <select className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Impact</label>
            <select className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={formData.impact} onChange={e => setFormData(f => ({ ...f, impact: e.target.value }))}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Date</label>
          <input type="date" className="w-full border rounded px-3 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100" value={formData.date} onChange={e => setFormData(f => ({ ...f, date: e.target.value }))} required />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => router.push("/admin/actions")}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors" disabled={loading}>{loading ? "Creating..." : "Preview"}</button>
        </div>
      </form>
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => setShowPreview(false)}
            >
              ×
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Preview Action</h2>
            <div className="space-y-2 text-sm">
              <div><strong>Minister:</strong> {selectedMinister ? `${selectedMinister.fullName} (${selectedMinister.portfolio})` : ''}</div>
              <div><strong>Headline:</strong> {formData.title}</div>
              <div><strong>Description:</strong> {formData.description}</div>
              {formData.civicContext && <div><strong>Civic Context:</strong> {formData.civicContext}</div>}
              {formData.sourcePublisher && <div><strong>Publisher:</strong> {formData.sourcePublisher}</div>}
              {formData.sourceUrl && <div className="truncate"><strong>URL:</strong> {formData.sourceUrl}</div>}
              <div><strong>Status:</strong> {formData.status} | <strong>Impact:</strong> {formData.impact}</div>
              <div><strong>Date:</strong> {formData.date}</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowPreview(false)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Creating..." : "Confirm & Create"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="mt-4">
        <Link href="/admin/actions" className="text-blue-600 hover:underline">Back to Actions</Link>
      </div>
    </main>
  );
} 