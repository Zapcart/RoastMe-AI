"use client";

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";

const UNLOCK_AMOUNT = 99;

const FlexSupport = forwardRef(function FlexSupport({ onUnlocked, existingOrderId }, ref) {
  const [name, setName] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [sdkReady, setSdkReady] = useState(false);
  const [sdkStatus, setSdkStatus] = useState("idle"); // idle | loading | ready | error

  useEffect(() => {
    if (!existingOrderId) return;
    verify(existingOrderId, name || "Returning user");
  }, [existingOrderId]);

  // Load Cashfree v3 SDK on client once
  useEffect(() => {
    let mounted = true;
    if (typeof window === "undefined") return undefined;
    if (window.Cashfree) {
      setSdkReady(true);
      setSdkStatus("ready");
      return undefined;
    }

    setSdkStatus("loading");
    const id = "cashfree-sdk-v3";
    const src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    const existing = document.getElementById(id);

    const handleLoad = () => {
      if (!mounted) return;
      if (window.Cashfree) {
        setSdkReady(true);
        setSdkStatus("ready");
      } else {
        setSdkReady(false);
        setSdkStatus("error");
      }
    };

    const handleError = () => {
      if (!mounted) return;
      setSdkReady(false);
      setSdkStatus("error");
    };

    if (existing) {
      existing.onload = handleLoad;
      existing.onerror = handleError;
      return () => {
        mounted = false;
      };
    }

    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = handleLoad;
    script.onerror = handleError;
    document.head.appendChild(script);

    return () => {
      mounted = false;
    };
  }, []);

  const verify = async (orderId, displayName) => {
    const res = await fetch("/api/payment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, name: displayName || "Anonymous" })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Payment not verified yet.");
    }
    onUnlocked?.(data.accessToken);
    setStatus("Access unlocked");
  };

  const startPayment = async () => {
    setError("");
    if (!name.trim()) {
      setError("Add a name or handle for the leaderboard.");
      return;
    }
    if (!sdkReady) {
      setError("Cashfree SDK not loaded yet. Please wait a second.");
      return;
    }

    setIsPaying(true);
    setStatus("");
    try {
      const res = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: UNLOCK_AMOUNT,
          name: name || "Anonymous"
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || data.detail || "Could not start payment.");
      }

      if (typeof window === "undefined" || !window.Cashfree) {
        throw new Error("Cashfree SDK not loaded yet (window.Cashfree missing). Check ad-blockers or network.");
      }
      const sdkMode = data.mode === "production" ? "production" : "sandbox";
      const cashfree = new window.Cashfree({ mode: sdkMode });

      if (!cashfree?.checkout) {
        throw new Error("Cashfree checkout not available.");
      }

      const result = await cashfree.checkout({
        paymentSessionId: data.paymentSessionId,
        redirectTarget: "_modal"
      });

      const orderId = result?.order?.orderId || data.orderId;
      if (!orderId) {
        throw new Error("Could not capture order id. Please retry.");
      }

      await verify(orderId, name);
    } catch (err) {
      setStatus("");
      setError(err.message || "Payment failed. Please try again.");
    } finally {
      setIsPaying(false);
    }
  };

  useImperativeHandle(ref, () => ({
    startPayment
  }));

  return (
    <div className="glass-card mt-6 p-4 sm:p-5">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-pink-300/70">
            Unlock AI
          </p>
          <p className="mt-1 text-xs text-white/60">
            Pay once, unlock roasts. Payments via Cashfree, verified server-side.
          </p>
        </div>
        <div className="mt-2 flex items-center gap-2 sm:mt-0">
          <span className="text-[0.65rem] text-white/40">Leaderboard name</span>
          <input
            type="text"
            placeholder="eg. @maincharacter"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 40))}
            className="rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs text-white outline-none ring-pink-400/40 placeholder:text-white/30 focus:border-pink-400 focus:ring-2"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-pink-400 bg-pink-500/15 p-3 text-left text-xs shadow-neon">
          <span className="text-[0.9rem] font-semibold text-pink-50">₹{UNLOCK_AMOUNT} Unlock</span>
          <span className="mt-1 text-[0.75rem] text-white/80">
            Full access + leaderboard entry. Single charge, instant unlock after verification.
          </span>
        </div>
        <div className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-3 text-left text-xs">
          <span className="text-[0.8rem] font-semibold text-pink-50">Server-verified</span>
          <span className="mt-1 text-[0.75rem] text-white/70">
            We confirm your payment on the backend before letting AI cook. No client-side hacks.
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={startPayment}
          disabled={isPaying}
          className="pill-button-primary text-xs sm:text-sm disabled:opacity-60"
        >
          {isPaying ? "Processing..." : "Pay & unlock via Cashfree 💳"}
        </button>
        <p className="max-w-xs text-[0.65rem] text-white/40">
          Secure payments. AI access is granted only after backend verification.
        </p>
      </div>

      {!sdkReady ? (
        <p className="mt-2 text-[0.7rem] text-yellow-200">Loading Cashfree SDK...</p>
      ) : null}
      {status ? (
        <p className="mt-3 text-[0.7rem] text-green-200">{status}</p>
      ) : null}
      {error ? (
        <p className="mt-3 text-[0.7rem] text-red-300">{error}</p>
      ) : null}
    </div>
  );
});

export default FlexSupport;


