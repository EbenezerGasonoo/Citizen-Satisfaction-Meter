"use client"

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';

interface Action {
  id: number;
  title: string;
  description: string;
  status: string;
  date: string;
  impact: string;
  totalVotes?: number;
  positiveVotes?: number;
  satisfactionRate?: number;
}

// Confetti component (minimal, uses canvas)
function ConfettiBurst({ trigger }: { trigger: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (trigger && ref.current) {
      const canvas = ref.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const W = canvas.width = 200;
      const H = canvas.height = 100;
      const confetti = Array.from({ length: 24 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H / 2,
        r: 4 + Math.random() * 4,
        d: Math.random() * 100,
        color: `hsl(${Math.random() * 360},90%,60%)`
      }));
      ctx.clearRect(0, 0, W, H);
      confetti.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, 2 * Math.PI);
        ctx.fillStyle = c.color;
        ctx.fill();
      });
      setTimeout(() => ctx.clearRect(0, 0, W, H), 800);
    }
  }, [trigger]);
  return <canvas ref={ref} style={{ pointerEvents: 'none', position: 'absolute', top: 0, left: 0, width: 200, height: 100, zIndex: 20 }} />;
}

export default function ActionSection({ ministerId }: { ministerId: number }) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [voting, setVoting] = useState<{ [actionId: number]: boolean }>({});
  const [voted, setVoted] = useState<{ [actionId: number]: boolean }>({});
  const [confettiAction, setConfettiAction] = useState<number | null>(null);

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

  const handleVote = async (actionId: number, positive: boolean) => {
    setVoting((v) => ({ ...v, [actionId]: true }));
    setError(null);
    try {
      const res = await fetch(`/api/actions/${actionId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positive }),
      });
      if (!res.ok) {
        const err = await res.json();
        setError(err.error || "Failed to vote");
      } else {
        setVoted((v) => ({ ...v, [actionId]: true }));
        setConfettiAction(actionId);
        setTimeout(() => setConfettiAction(null), 1200);
      }
    } catch (e) {
      setError("Network error");
    } finally {
      setVoting((v) => ({ ...v, [actionId]: false }));
    }
  };

  if (loading) return (
    <div className="my-8 space-y-6">
      {[1,2,3].map(i => (
        <div key={i} className="animate-pulse bg-blue-100/60 dark:bg-blue-900/30 rounded-2xl shadow-md p-6 border border-blue-100 dark:border-blue-800">
          <div className="h-6 w-1/3 bg-blue-200 dark:bg-blue-700 rounded mb-3" />
          <div className="h-4 w-2/3 bg-blue-100 dark:bg-blue-800 rounded mb-2" />
          <div className="h-4 w-full bg-blue-100 dark:bg-blue-800 rounded mb-2" />
          <div className="h-4 w-1/2 bg-blue-100 dark:bg-blue-800 rounded mb-4" />
          <div className="flex gap-4 mt-2">
            <div className="h-10 w-24 bg-blue-200 dark:bg-blue-700 rounded" />
            <div className="h-10 w-24 bg-blue-200 dark:bg-blue-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
  if (error) return <div className="my-8 text-red-500">{error}</div>;
  if (!actions.length) return <div className="my-8 text-gray-500">No actions found for this minister.</div>;

  return (
    <section className="my-8">
      <div className="space-y-6">
        {actions.map((action) => {
          const votedPositive = voted[action.id] && voting[action.id] === false; // for color pulse
          return (
            <motion.div
              key={action.id}
              className="relative bg-blue-50 dark:bg-blue-900/30 rounded-2xl shadow-md p-6 border border-blue-100 dark:border-blue-800 transition-all hover:shadow-lg"
              animate={voted[action.id] ? { backgroundColor: '#d1fae5' } : { backgroundColor: '' }}
              transition={{ duration: 0.4 }}
            >
              {/* Confetti */}
              <AnimatePresence>
                {confettiAction === action.id && (
                  <motion.div
                    key="confetti"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute left-1/2 top-0 -translate-x-1/2 z-20"
                  >
                    <ConfettiBurst trigger={true} />
                  </motion.div>
                )}
              </AnimatePresence>
              <div className="flex items-center gap-3 mb-2">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-700 text-blue-700 dark:text-blue-200 mr-2">
                  ⚡
                </span>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0">{action.title}</h3>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{action.status} | Impact: {action.impact}</p>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-line">{action.description}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">Date: {action.date.slice(0,10)}</p>
              {/* Satisfaction Rate and Vote Counts as progress bar */}
              {typeof action.satisfactionRate === 'number' && (
                <div className="flex flex-col items-center mb-4 w-full">
                  <div className="relative w-full max-w-xs h-6 mb-1 flex items-center justify-center">
                    <div className="absolute left-0 top-0 w-full h-6 bg-blue-100 dark:bg-blue-800 rounded-full" style={{ zIndex: 0 }} />
                    <motion.div
                      className="absolute left-0 top-0 h-6 bg-blue-400 dark:bg-blue-600 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${action.satisfactionRate}%` }}
                      transition={{ duration: 0.7, type: 'spring' }}
                      style={{ zIndex: 1 }}
                    />
                    <span className="relative z-10 px-4 py-1 text-blue-900 dark:text-blue-100 text-base font-bold" style={{ background: 'none' }}>{action.satisfactionRate}%</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">Satisfaction</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mb-2">({action.positiveVotes}/{action.totalVotes} positive)</span>
                </div>
              )}
              <div className="flex gap-4 mt-2">
                <AnimatePresence>
                  {voted[action.id] && (
                    <motion.span
                      key="vote-success"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="ml-2 text-green-600 dark:text-green-400 font-semibold flex items-center"
                    >
                      <svg className="w-5 h-5 mr-1 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                      Thank you!
                    </motion.span>
                  )}
                </AnimatePresence>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: voting[action.id] ? 1 : 1.05 }}
                  className={`px-6 py-2 rounded-lg bg-green-500 text-white font-semibold text-base shadow hover:bg-green-600 transition disabled:opacity-50`}
                  disabled={voting[action.id] || voted[action.id]}
                  onClick={() => handleVote(action.id, true)}
                >
                  {voted[action.id] ? <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Thank you!</span> : 'Satisfied'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: voting[action.id] ? 1 : 1.05 }}
                  className={`px-6 py-2 rounded-lg bg-red-500 text-white font-semibold text-base shadow hover:bg-red-600 transition disabled:opacity-50`}
                  disabled={voting[action.id] || voted[action.id]}
                  onClick={() => handleVote(action.id, false)}
                >
                  {voted[action.id] ? <span className="flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>Thank you!</span> : 'Not Satisfied'}
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
} 