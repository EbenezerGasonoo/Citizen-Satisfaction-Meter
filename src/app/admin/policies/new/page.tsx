"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Minister {
  id: number;
  fullName: string;
  portfolio: string;
}

export default function NewPolicyPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Economic",
    status: "Active",
    startDate: "",
    endDate: "",
    budget: "",
    impact: "Medium",
    ministerId: ""
  });
  const [ministers, setMinisters] = useState<Minister[]>([]);
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const policyData = {
      ...formData,
      budget: formData.budget ? parseFloat(formData.budget) : null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      ministerId: parseInt(formData.ministerId)
    };
    try {
      const response = await fetch("/api/admin/policies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policyData)
      });
      if (response.ok) {
        router.push("/admin/policies");
      } else {
        const err = await response.json();
        setError(err.error || "Failed to create policy");
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
      <h1 className="text-2xl font-bold mb-6 text-indigo-700 dark:text-indigo-400">Create New Policy</h1>
      <form onSubmit={e => { e.preventDefault(); setShowPreview(true); }} className="space-y-4 bg-white dark:bg-gray-800 rounded shadow p-6 border border-gray-200 dark:border-gray-700">
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Title</label>
          <input type="text" className="w-full border rounded px-3 py-2" value={formData.title} onChange={e => setFormData(f => ({ ...f, title: e.target.value }))} required />
        </div>
        <div>
          <label className="block mb-1 font-medium">Description</label>
          <textarea className="w-full border rounded px-3 py-2" value={formData.description} onChange={e => setFormData(f => ({ ...f, description: e.target.value }))} rows={3} required />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Category</label>
            <select className="w-full border rounded px-3 py-2" value={formData.category} onChange={e => setFormData(f => ({ ...f, category: e.target.value }))}>
              <option value="Economic">Economic</option>
              <option value="Social">Social</option>
              <option value="Infrastructure">Infrastructure</option>
              <option value="Security">Security</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Status</label>
            <select className="w-full border rounded px-3 py-2" value={formData.status} onChange={e => setFormData(f => ({ ...f, status: e.target.value }))}>
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
              <option value="Planned">Planned</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Start Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={formData.startDate} onChange={e => setFormData(f => ({ ...f, startDate: e.target.value }))} />
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">End Date</label>
            <input type="date" className="w-full border rounded px-3 py-2" value={formData.endDate} onChange={e => setFormData(f => ({ ...f, endDate: e.target.value }))} />
          </div>
        </div>
        <div>
          <label className="block mb-1 font-medium">Budget (GHS)</label>
          <input type="number" className="w-full border rounded px-3 py-2" value={formData.budget} onChange={e => setFormData(f => ({ ...f, budget: e.target.value }))} min="0" step="0.01" />
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block mb-1 font-medium">Impact</label>
            <select className="w-full border rounded px-3 py-2" value={formData.impact} onChange={e => setFormData(f => ({ ...f, impact: e.target.value }))}>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-1 font-medium">Minister</label>
            <select className="w-full border rounded px-3 py-2" value={formData.ministerId} onChange={e => setFormData(f => ({ ...f, ministerId: e.target.value }))} required>
              <option value="">Select Minister</option>
              {ministers.map(m => (
                <option key={m.id} value={m.id}>{m.fullName} ({m.portfolio})</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button type="button" className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600" onClick={() => router.push("/admin/policies")}>Cancel</button>
          <button type="submit" className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors" disabled={loading}>{loading ? "Creating..." : "Preview"}</button>
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
            <h2 className="text-xl font-bold mb-4 text-indigo-700 dark:text-indigo-400">Preview Policy</h2>
            <div className="space-y-2">
              <div><strong>Title:</strong> {formData.title}</div>
              <div><strong>Description:</strong> {formData.description}</div>
              <div><strong>Category:</strong> {formData.category}</div>
              <div><strong>Status:</strong> {formData.status}</div>
              <div><strong>Start Date:</strong> {formData.startDate}</div>
              <div><strong>End Date:</strong> {formData.endDate}</div>
              <div><strong>Budget:</strong> {formData.budget}</div>
              <div><strong>Impact:</strong> {formData.impact}</div>
              <div><strong>Minister:</strong> {selectedMinister ? `${selectedMinister.fullName} (${selectedMinister.portfolio})` : ''}</div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <button
                className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={() => setShowPreview(false)}
              >
                Edit
              </button>
              <button
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
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
        <Link href="/admin/policies" className="text-indigo-600 hover:underline">Back to Policies</Link>
      </div>
    </main>
  );
} 