"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewMinisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    portfolio: "",
    photoUrl: "",
    bio: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError("");
    const form = new FormData();
    form.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setFormData((prev) => ({ ...prev, photoUrl: data.url }));
      } else {
        setUploadError(data.error || "Failed to upload image.");
      }
    } catch (err) {
      setUploadError("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/ministers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        router.push("/admin/ministers");
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create minister.");
      }
    } catch (err) {
      setError("An error occurred while creating minister.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-green-700 dark:text-green-400">Create New Minister</h1>
      <form onSubmit={handleSubmit} className="space-y-4 bg-white dark:bg-gray-800 rounded shadow p-6 border border-green-200 dark:border-green-700">
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Portfolio</label>
          <input
            type="text"
            name="portfolio"
            value={formData.portfolio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo</label>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="w-full border rounded px-3 py-2"
            disabled={uploading}
          />
          {uploading && <div className="text-sm text-blue-600 mt-1">Uploading...</div>}
          {uploadError && <div className="text-sm text-red-600 mt-1">{uploadError}</div>}
          {formData.photoUrl && (
            <img src={formData.photoUrl} alt="Minister" className="mt-2 w-24 h-24 object-cover rounded-full border" />
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
            onClick={() => router.push("/admin/ministers")}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 transition-colors"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Minister"}
          </button>
        </div>
      </form>
      <div className="mt-4 text-center">
        <Link href="/admin/ministers" className="text-green-600 hover:underline">Back to Ministers</Link>
      </div>
    </main>
  );
} 