"use client"

import { useEffect, useState } from "react";

interface Action {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
  impact: string;
}

export default function ActionSection({ ministerId }: { ministerId: number }) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActions = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/ministers/${ministerId}/actions`);
        const data = await res.json();
        setActions(data.actions || []);
      } catch (e) {
        setError("Failed to load actions");
      } finally {
        setLoading(false);
      }
    };
    fetchActions();
  }, [ministerId]);

  if (loading) return <div className="my-8">Loading actions...</div>;
  if (error) return <div className="my-8 text-red-500">{error}</div>;
  if (!actions.length) return <div className="my-8 text-gray-500">No actions found for this minister.</div>;

  return (
    <section className="my-8">
      <h2 className="text-xl font-bold mb-4 text-blue-700 dark:text-blue-400">Key Actions</h2>
      <div className="space-y-6">
        {actions.map((action) => (
          <div key={action.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{action.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{action.status} | Impact: {action.impact}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{action.description}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Date: {action.date.slice(0,10)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
} 