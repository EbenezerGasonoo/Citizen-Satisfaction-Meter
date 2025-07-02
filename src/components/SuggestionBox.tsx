"use client";
import { useState } from 'react';

export default function SuggestionBox() {
  const [value, setValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setValue('');
    // In a real app, send the suggestion to the backend here
  };

  if (submitted) {
    return <div className="text-green-600 dark:text-green-400 font-medium">Thank you for your suggestion!</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full border border-blue-200 dark:border-gray-700 rounded p-2 mb-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-400"
        rows={3}
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
  );
} 