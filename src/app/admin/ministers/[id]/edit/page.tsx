"use client"

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditMinisterPage() {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === 'string' ? params.id : Array.isArray(params?.id) ? params.id[0] : '';
  const [minister, setMinister] = useState({
    fullName: "",
    portfolio: "",
    photoUrl: "",
    bio: ""
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMinister = async () => {
      try {
        const res = await fetch(`/api/ministers/${id}`);
        if (res.ok) {
          const data = await res.json();
          setMinister({
            fullName: data.fullName || "",
            portfolio: data.portfolio || "",
            photoUrl: data.photoUrl || "",
            bio: data.bio || ""
          });
        } else {
          setError("Failed to fetch minister data.");
        }
      } catch (err) {
        setError("An error occurred while fetching minister data.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMinister();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMinister({ ...minister, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/ministers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(minister),
      });
      if (res.ok) {
        setSuccess("Minister updated successfully.");
        setTimeout(() => router.push("/admin/ministers"), 1200);
      } else {
        setError("Failed to update minister.");
      }
    } catch (err) {
      setError("An error occurred while updating minister.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Minister</h1>
      {error && <div className="mb-4 text-red-600">{error}</div>}
      {success && <div className="mb-4 text-green-600">{success}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={minister.fullName}
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
            value={minister.portfolio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Photo URL</label>
          <input
            type="text"
            name="photoUrl"
            value={minister.photoUrl}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Bio</label>
          <textarea
            name="bio"
            value={minister.bio}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            rows={4}
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
          disabled={submitting}
        >
          {submitting ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
} 