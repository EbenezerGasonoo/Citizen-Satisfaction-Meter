"use client"

import { useEffect, useState } from "react";

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

  if (loading) return <div className="my-8">Loading policies...</div>;
  if (error) return <div className="my-8 text-red-500">{error}</div>;
  if (!policies.length) return <div className="my-8 text-gray-500">No policies found for this minister.</div>;

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4 text-cocoa-green dark:text-green-400">Key Policies & Impact</h2>
      <div className="space-y-6">
        {policies.map((policy) => (
          <div key={policy.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{policy.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{policy.category} | {policy.status} | Impact: {policy.impact}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{policy.description}</p>
                {policy.budget && <p className="text-xs text-gray-500 dark:text-gray-400">Budget: GH₵{policy.budget.toLocaleString()}</p>}
                {policy.startDate && <p className="text-xs text-gray-500 dark:text-gray-400">Start: {policy.startDate.slice(0,10)}</p>}
                {policy.endDate && <p className="text-xs text-gray-500 dark:text-gray-400">End: {policy.endDate.slice(0,10)}</p>}
              </div>
              <div className="flex flex-col items-center mt-4 md:mt-0">
                <span className="text-2xl font-bold text-cocoa-green dark:text-green-400">{policy.satisfactionRate}%</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">({policy.positiveVotes}/{policy.totalVotes} positive)</span>
              </div>
            </div>
            <div className="flex gap-4 mt-2">
              <button
                className={`px-4 py-2 rounded bg-green-500 text-white font-medium hover:bg-green-600 disabled:opacity-50`}
                disabled={voting[policy.id] || voted[policy.id]}
                onClick={() => handleVote(policy.id, true)}
              >
                Satisfied
              </button>
              <button
                className={`px-4 py-2 rounded bg-red-500 text-white font-medium hover:bg-red-600 disabled:opacity-50`}
                disabled={voting[policy.id] || voted[policy.id]}
                onClick={() => handleVote(policy.id, false)}
              >
                Not Satisfied
              </button>
              {voted[policy.id] && <span className="ml-2 text-green-600 dark:text-green-400 font-semibold">Vote recorded!</span>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 