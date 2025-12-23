"use client";

import { useEffect, useState } from "react";

function badgeForAmount(amount) {
  if (amount >= 299) return "Ultimate Flex";
  if (amount >= 149) return "Elite Flexer";
  if (amount >= 99) return "Unlocked + Flex";
  if (amount >= 49) return "Supporter";
  return "Chaos Ally";
}

export default function Leaderboard() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/payment", { cache: "no-store" });
      const data = await res.json();
      if (res.ok && Array.isArray(data.leaderboard)) {
        setEntries(data.leaderboard);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="glass-card p-4 sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-pink-300/70">
            Today&apos;s top flexers
          </p>
          <p className="mt-1 text-xs text-white/60">
            Sorted by who dropped the most chaos fuel today.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="pill-button-ghost text-[0.7rem]"
        >
          Refresh
        </button>
      </div>

      {loading && !entries.length ? (
        <p className="mt-4 text-xs text-white/60">Loading leaderboard...</p>
      ) : null}

      {entries.length === 0 && !loading ? (
        <p className="mt-4 text-xs text-white/60">
          Leaderboard is clean for now. Be the first to flex on everyone. 🏆
        </p>
      ) : null}

      {entries.length > 0 ? (
        <ol className="mt-4 space-y-2 text-xs">
          {entries.map((entry, index) => (
            <li
              key={entry.id}
              className="flex items-center justify-between gap-2 rounded-2xl bg-black/40 px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-pink-500/20 text-[0.7rem] font-semibold text-pink-200">
                  #{index + 1}
                </span>
                <div>
                  <p className="text-[0.8rem] font-semibold">
                    {entry.name || "Anonymous"}
                  </p>
                  <p className="text-[0.7rem] text-white/50">
                    {badgeForAmount(entry.amount)}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[0.75rem] font-semibold text-pink-200">
                  ₹{entry.amount}
                </p>
                <p className="text-[0.6rem] text-white/40">
                  {new Date(entry.timestamp).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </p>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </div>
  );
}


