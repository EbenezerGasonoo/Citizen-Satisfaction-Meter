"use client"

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';

interface Policy {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  startDate?: string;
  endDate?: string;
  budget?: number;
  impact: string;
  createdAt: string;
  updatedAt: string;
  totalVotes: number;
  positiveVotes: number;
  satisfactionRate: number;
}

function InfoTooltip({ text }: { text: string }) {
  const [show, setShow] = useState(false);
  return (
    <span className="relative inline-block align-middle ml-1">
      <span
        className="cursor-pointer text-gray-400 hover:text-green-600 dark:hover:text-green-300"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        tabIndex={0}
        onFocus={() => setShow(true)}
        onBlur={() => setShow(false)}
        aria-label="Info"
      >
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><text x="12" y="17" textAnchor="middle" fontSize="14" fill="currentColor" fontFamily="Arial" dy="-2">i</text></svg>
      </span>
      {show && (
        <span className="absolute z-10 left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-xs rounded shadow-lg px-3 py-2 border border-gray-200 dark:border-gray-700 whitespace-pre-line">
          {text}
        </span>
      )}
    </span>
  );
}

export default function PolicySection({ ministerId }: { ministerId: number }) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState<{ [policyId: number]: boolean }>({});
  const [voted, setVoted] = useState<{ [policyId: number]: boolean }>({});

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ministers/${ministerId}/policies`);
        const data = await res.json();
        setPolicies(data.policies || []);
      } catch (e) {
        setError("Failed to load policies");
      } finally {
        setLoading(false);
      }
    };
    fetchPolicies();
  }, [ministerId]);

  const handleVote = async (policyId: number, positive: boolean) => {
    setVoting((v) => ({ ...v, [policyId]: true }));
    setError(null);
    try {
      const res = await fetch(`/api/policies/${policyId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positive }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to vote");
      } else {
        setVoted((v) => ({ ...v, [policyId]: true }));
        // Optionally, refresh policies
        const updated = await res.json();
        setPolicies((prev) =>
          prev.map((p) =>
            p.id === policyId
              ? { ...p, ...updated.stats }
              : p
          )
        );
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setVoting((v) => ({ ...v, [policyId]: false }));
    }
  };

  if (loading) return (
    <div className="my-8 space-y-6">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse bg-green-100/60 dark:bg-green-900/30 rounded-2xl shadow-md p-6 border border-green-100 dark:border-green-800">
          <div className="h-6 w-1/3 bg-green-200 dark:bg-green-700 rounded mb-3" />
          <div className="h-4 w-2/3 bg-green-100 dark:bg-green-800 rounded mb-2" />
          <div className="h-4 w-full bg-green-100 dark:bg-green-800 rounded mb-2" />
          <div className="h-4 w-1/2 bg-green-100 dark:bg-green-800 rounded mb-4" />
          <div className="flex gap-4 mt-2">
            <div className="h-10 w-24 bg-green-200 dark:bg-green-700 rounded" />
            <div className="h-10 w-24 bg-green-200 dark:bg-green-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return <div className="my-8 text-red-500">{error}</div>;
  if (!policies.length) return <div className="my-8 text-gray-500">No policies found for this minister.</div>;

  return (
    <section className="my-8">
      <div className="space-y-6">
        {policies.map((policy) => (
          <div key={policy.id} className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 border-l-8 border-green-400 dark:border-green-600 flex flex-col transition-all hover:shadow-2xl">
            {/* Top: Icon and Title */}
            <div className="flex items-center gap-4 mb-2">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 dark:bg-green-800 text-green-600 dark:text-green-200 text-2xl shadow-sm">
                📊
              </span>
              <h3 className="text-xl font-extrabold text-gray-900 dark:text-gray-100 mb-0 leading-tight flex-1">{policy.title}</h3>
            </div>
            {/* Meta info as badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="px-3 py-1 rounded-full bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-200 text-xs font-semibold border border-green-200 dark:border-green-700 flex items-center">{policy.category}<InfoTooltip text="Thematic area of the policy (e.g., Economic, Social, etc.)" /></span>
              <span className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs font-semibold border border-blue-200 dark:border-blue-700 flex items-center">{policy.status}<InfoTooltip text="Current stage of the policy (e.g., Active, Planned, Completed, Suspended)" /></span>
              <span className="px-3 py-1 rounded-full bg-yellow-50 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 text-xs font-semibold border border-yellow-200 dark:border-yellow-700 flex items-center">Impact: {policy.impact}<InfoTooltip text="Expected or achieved impact level (High, Medium, Low)" /></span>
              {policy.budget && <span className="px-3 py-1 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-xs font-semibold border border-gray-200 dark:border-gray-700 flex items-center">Budget: GH₵{policy.budget.toLocaleString()}<InfoTooltip text="Allocated or estimated budget for this policy." /></span>}
              {policy.startDate && <span className="px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-900 text-purple-700 dark:text-purple-200 text-xs font-semibold border border-purple-200 dark:border-purple-700 flex items-center">Start: {policy.startDate.slice(0,10)}<InfoTooltip text="Policy start date." /></span>}
              {policy.endDate && <span className="px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-900 text-pink-700 dark:text-pink-200 text-xs font-semibold border border-pink-200 dark:border-pink-700 flex items-center">End: {policy.endDate.slice(0,10)}<InfoTooltip text="Policy end date (if applicable)." /></span>}
            </div>
            {/* Description */}
            <div className="text-gray-700 dark:text-gray-300 text-sm mb-4 whitespace-pre-line">{policy.description}</div>
            {/* Stats & Voting */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mt-2 pt-4 border-t border-gray-100 dark:border-gray-800">
              <div className="flex flex-col items-center md:items-start">
                <span className="inline-block px-4 py-1 rounded-full bg-green-100 dark:bg-green-800 text-cocoa-green dark:text-green-300 text-lg font-bold mb-1 shadow-sm">{policy.satisfactionRate}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-1">Satisfaction</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">({policy.positiveVotes}/{policy.totalVotes} positive)</span>
              </div>
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
                <AnimatePresence>
                  {voted[policy.id] && (
                    <motion.span
                      key="vote-success"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="ml-2 text-green-600 dark:text-green-400 font-semibold flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Vote recorded!
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: voting[policy.id] ? 1 : 1.05 }}
                  className={`w-full md:w-auto px-6 py-2 rounded-lg bg-green-500 text-white font-semibold text-base shadow hover:bg-green-600 transition disabled:opacity-50`}
                  disabled={voting[policy.id] || voted[policy.id]}
                  onClick={() => handleVote(policy.id, true)}
                >
                  Satisfied
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: voting[policy.id] ? 1 : 1.05 }}
                  className={`w-full md:w-auto px-6 py-2 rounded-lg bg-red-500 text-white font-semibold text-base shadow hover:bg-red-600 transition disabled:opacity-50`}
                  disabled={voting[policy.id] || voted[policy.id]}
                  onClick={() => handleVote(policy.id, false)}
                >
                  Not Satisfied
                </motion.button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 