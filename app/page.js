"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ModeSelector from "../components/ModeSelector";
import InputBox from "../components/InputBox";
import Leaderboard from "../components/Leaderboard";
import FlexSupport from "../components/FlexSupport";

export default function HomePage() {
  const router = useRouter();
  const [mode, setMode] = useState("soft");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [verifyingAccess, setVerifyingAccess] = useState(true);
  const [accessOrderId, setAccessOrderId] = useState("");
  const payRef = useRef(null);
  const [formError, setFormError] = useState("");

  const verifyAccess = async (orderId) => {
    try {
      setVerifyingAccess(true);
      const res = await fetch("/api/payment", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, name: "Returning user" })
      });
      if (!res.ok) {
        throw new Error("Payment not verified");
      }
      setHasAccess(true);
      setAccessOrderId(orderId);
      localStorage.setItem("roastme_access_order", orderId);
    } catch (err) {
      localStorage.removeItem("roastme_access_order");
      setHasAccess(false);
      setAccessOrderId("");
    } finally {
      setVerifyingAccess(false);
    }
  };

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("roastme_access_order") : null;
    if (stored) {
      verifyAccess(stored);
    } else {
      setVerifyingAccess(false);
    }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setFormError("Drop some text first. We can’t roast the void.");
      return;
    }

    setFormError("");
    setLoading(true);
    const params = new URLSearchParams({
      text: text.trim(),
      mode,
      access: accessOrderId,
      preview: hasAccess ? "" : "1"
    });
    router.push(`/roast?${params.toString()}`);
  };

  const handleUnlocked = (orderId) => {
    setHasAccess(true);
    setAccessOrderId(orderId);
    if (typeof window !== "undefined") {
      localStorage.setItem("roastme_access_order", orderId);
    }
  };

  return (
    <main className="flex flex-1 flex-col">
      <header className="mb-6 space-y-3">
        <p className="tagline text-pink-300/80">Gen-Z friendly roast generator</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          RoastMe <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-sky-400 bg-clip-text text-transparent">AI</span>
        </h1>
        <p className="max-w-2xl text-sm text-white/80 sm:text-base">
          Safe, punchy roasts, compliments, and flag checks. Preview for free, then unlock the full punchline with server-verified Cashfree payments.
        </p>
        <div className="flex flex-wrap gap-2 text-xs text-white/60">
          <span className="rounded-full bg-white/5 px-3 py-1">No bullying</span>
          <span className="rounded-full bg-white/5 px-3 py-1">Identity-safe</span>
          <span className="rounded-full bg-white/5 px-3 py-1">Server-verified payments</span>
        </div>
      </header>

      <section className="glass-card p-4 sm:p-5">
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <InputBox text={text} setText={setText} disabled={loading || verifyingAccess} />
          <ModeSelector mode={mode} setMode={setMode} />

          {formError ? (
            <p className="text-sm text-red-300">{formError}</p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-[0.7rem] font-semibold ${
                hasAccess ? "bg-green-500/20 text-green-200" : "bg-white/10 text-white/60"
              }`}
            >
              {verifyingAccess ? "Verifying payment..." : hasAccess ? "Full access unlocked" : "Preview mode"}
            </span>
            <p className="text-[0.7rem] text-white/60">
              Generate a preview first. Unlock the full roast anytime with Cashfree (server-verified).
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="submit"
              disabled={loading || verifyingAccess}
              className="pill-button-primary text-sm sm:text-base disabled:opacity-60 transition-all duration-200 hover:translate-y-[-1px]"
            >
              {loading
                ? "Summoning chaos..."
                : hasAccess
                ? "Generate full roast ⚡"
                : "Generate preview"}
            </button>
            <p className="text-[0.7rem] text-white/50">
              No hate speech. No attacks on looks, identity, or real-life trauma. Ever.
            </p>
          </div>
        </form>
      </section>

      <section className="mt-8 grid gap-4 sm:grid-cols-2">
        <article className="glass-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">How it works</h2>
          <ol className="mt-3 space-y-2 text-sm text-white/70">
            <li>1) Paste your text and pick a vibe.</li>
            <li>2) Get a free preview instantly.</li>
            <li>3) Unlock the full punchline via Cashfree (server-verified).</li>
          </ol>
        </article>
        <article className="glass-card p-4 sm:p-5">
          <h2 className="text-lg font-semibold">Trust & Safety</h2>
          <ul className="mt-3 space-y-2 text-sm text-white/70">
            <li>• No bullying or appearance attacks. Ever.</li>
            <li>• Payment secured by Cashfree; verified on our server.</li>
            <li>• For entertainment only—share responsibly.</li>
          </ul>
        </article>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Support & unlock</h2>
        <FlexSupport ref={payRef} onUnlocked={handleUnlocked} existingOrderId={accessOrderId} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Today’s top flexers</h2>
        <Leaderboard />
      </section>

      <footer className="mt-8 border-t border-white/10 pt-4 text-[0.8rem] text-white/50">
        <div className="flex flex-wrap gap-4">
          <a className="hover:text-white" href="#" aria-label="About RoastMe AI">About</a>
          <a className="hover:text-white" href="#" aria-label="Privacy policy">Privacy</a>
          <a className="hover:text-white" href="#" aria-label="Terms of service">Terms</a>
          <a className="hover:text-white" href="#" aria-label="Contact support">Contact</a>
        </div>
        <p className="mt-2 text-[0.7rem] text-white/40">
          Disclaimer: This app is for entertainment only and should not be used to bully, harass, or harm anyone.
        </p>
      </footer>
    </main>
  );
}


