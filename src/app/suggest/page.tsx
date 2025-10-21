"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

type SubmissionType = 'suggestion' | 'bug' | 'nominate';

const typeConfig = {
  suggestion: {
    emoji: '💡',
    title: 'Got a suggestion?',
    description: 'Share your ideas to help us improve the platform',
    placeholder: 'Share your idea or feedback...',
    gradient: 'from-green-600 to-emerald-600',
    darkGradient: 'dark:from-green-500 dark:to-emerald-500',
    buttonColor: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'
  },
  bug: {
    emoji: '🐛',
    title: 'Found a bug?',
    description: 'Help us fix issues by reporting bugs',
    placeholder: 'Describe the bug you encountered...',
    gradient: 'from-red-600 to-pink-600',
    darkGradient: 'dark:from-red-500 dark:to-pink-500',
    buttonColor: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700'
  },
  nominate: {
    emoji: '🎯',
    title: 'Nominate a minister',
    description: 'Suggest a minister to be added to the platform',
    placeholder: 'Minister name, portfolio, and why they should be added...',
    gradient: 'from-blue-600 to-purple-600',
    darkGradient: 'dark:from-blue-500 dark:to-purple-500',
    buttonColor: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
  }
};

export default function SuggestPage() {
  const searchParams = useSearchParams();
  const [value, setValue] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [type, setType] = useState<SubmissionType>('suggestion');

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'bug' || typeParam === 'nominate') {
      setType(typeParam);
    }
  }, [searchParams]);

  const config = typeConfig[type];

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          message: value,
          email: email || null
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
        setValue("");
        setEmail("");
      } else {
        setError(data.error || 'Failed to submit. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again.');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl transition-all shadow-md hover:shadow-lg touch-manipulation group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Home</span>
          </Link>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md rounded-3xl shadow-2xl p-6 sm:p-10 border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="text-6xl mb-4"
            >
              {config.emoji}
            </motion.div>
            <h1 className={`text-4xl font-extrabold mb-3 bg-gradient-to-r ${config.gradient} ${config.darkGradient} bg-clip-text text-transparent`}>
              {config.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {config.description}
            </p>
          </div>

          {/* Type Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {Object.entries(typeConfig).map(([key, val]) => (
              <button
                key={key}
                onClick={() => {
                  setType(key as SubmissionType);
                  setSubmitted(false);
                }}
                className={`px-4 py-2 rounded-xl font-semibold transition-all touch-manipulation ${
                  type === key
                    ? `${val.buttonColor} text-white shadow-lg`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="mr-2">{val.emoji}</span>
                {key === 'suggestion' ? 'Suggestion' : key === 'bug' ? 'Bug Report' : 'Nominate'}
              </button>
            ))}
          </div>

          {/* Form or Success Message */}
          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12"
            >
              <div className="text-6xl mb-4">✅</div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Thank you!
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your {type === 'bug' ? 'bug report' : type === 'nominate' ? 'nomination' : 'suggestion'} has been received.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className={`${config.buttonColor} text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all touch-manipulation`}
              >
                Submit another
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Message Textarea */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {type === 'bug' ? 'Bug Description *' : type === 'nominate' ? 'Minister Details *' : 'Your Message *'}
                </label>
                <textarea
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all"
                  rows={6}
                  placeholder={config.placeholder}
                  value={value}
                  onChange={e => setValue(e.target.value)}
                  required
                  style={{
                    focusRingColor: type === 'bug' ? '#dc2626' : type === 'nominate' ? '#2563eb' : '#059669'
                  }}
                />
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Email (Optional - for follow-up)
                </label>
                <input
                  type="email"
                  className="w-full border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-offset-2 focus:border-transparent transition-all"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-2xl"
                >
                  <p className="text-red-800 dark:text-red-300 font-semibold text-center">
                    ⚠️ {error}
                  </p>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                className={`w-full ${config.buttonColor} text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation flex items-center justify-center gap-2`}
                disabled={!value.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>Submit {type === 'bug' ? 'Bug Report' : type === 'nominate' ? 'Nomination' : 'Suggestion'}</>
                )}
              </button>
            </form>
          )}
        </motion.div>

        {/* Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
        >
          <h3 className="font-bold text-blue-900 dark:text-blue-300 mb-2">📢 Your voice matters!</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            We review all submissions carefully. Your feedback helps us build a better platform for all Ghanaian citizens.
          </p>
        </motion.div>
      </div>
    </main>
  );
} 