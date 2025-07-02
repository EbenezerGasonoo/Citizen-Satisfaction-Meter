"use client";
import { useState } from "react";
import Link from "next/link";

export default function SuggestPage() {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setValue("");
    // In a real app, send the suggestion to the backend here
  };

  return (
    <main className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-blue-700 dark:text-blue-400">Got a suggestion?</h1>
      <div className="bg-white dark:bg-gray-800 rounded shadow p-6 border border-blue-200 dark:border-gray-700">
        {submitted ? (
          <div className="text-green-600 dark:text-green-400 font-medium text-center py-8">
            Thank you for your suggestion!
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <textarea
              className="w-full border border-blue-200 dark:border-gray-700 rounded p-2 mb-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Share your idea or feedback..."
              value={value}
              onChange={e => setValue(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
              disabled={!value.trim()}
            >
              Submit
            </button>
          </form>
        )}
      </div>
      <div className="mt-6 text-center">
        <Link href="/" className="text-blue-600 hover:underline">Back to Home</Link>
      </div>
    </main>
  );
} 