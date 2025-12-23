"use client";

export const dynamic = "force-dynamic";

import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import RoastCard from "../../components/RoastCard";
import FlexSupport from "../../components/FlexSupport";

export default function RoastPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [verifying, setVerifying] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const payRef = useRef(null);
  const text = searchParams.get("text") || "";
  const mode = searchParams.get("mode") || "soft";
  const access = searchParams.get("access");
  const previewParam = searchParams.get("preview") === "1";

  useEffect(() => {
    const token =
      access ||
      (typeof window !== "undefined" ? localStorage.getItem("roastme_access_order") : "");
    if (!text.trim()) {
      router.replace("/");
      return;
    }
    const verifyAndRun = async () => {
      const shouldPreview = previewParam || !token;
      try {
        setVerifying(!shouldPreview);
        if (!shouldPreview) {
          const res = await fetch("/api/payment", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ orderId: token, name: "Returning user" })
          });
          if (!res.ok) {
            throw new Error("Payment not verified");
          }
          setAccessToken(token);
        }
        await generate(shouldPreview ? "" : token, shouldPreview);
      } catch (err) {
        setError("Payment verification failed. Please unlock again.");
        setLoading(false);
      } finally {
        setVerifying(false);
      }
    };
    const generate = async (verifiedToken, previewMode) => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/roast", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text, mode, accessToken: verifiedToken, preview: previewMode })
        });
        const data = await res.json();
        if (!res.ok) {
          const detail = data?.detail ? ` (${data.detail})` : "";
          console.error("Roast generation failed:", data);
          setError((data.error || "Could not generate roast.") + detail);
        } else {
          setResponse(data.message);
          setIsPreview(Boolean(data.preview));
        }
      } catch (err) {
        console.error("Roast fetch error:", err);
        setError(err?.message || "Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    verifyAndRun();
  }, [text, mode, router, access, previewParam]);

  const unlockAndRefresh = async () => {
    await payRef.current?.startPayment?.();
  };

  const handleUnlocked = async (orderId) => {
    setAccessToken(orderId);
    await fetch("/api/payment", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, name: "Returning user" })
    });
    setIsPreview(false);
    const res = await fetch("/api/roast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, mode, accessToken: orderId, preview: false })
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "Could not generate roast.");
    } else {
      setResponse(data.message);
    }
  };

  const goBack = () => router.push("/");

  return (
    <main className="flex flex-1 flex-col">
      <header className="mb-4 space-y-1">
        <p className="tagline text-pink-300/80">Your roast report</p>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          Here&apos;s the verdict 🔥
        </h1>
        <p className="text-xs text-white/60">
          Keep it fun, don&apos;t weaponize it. Screenshots are allowed, bullying is not.
        </p>
      </header>

      {(loading || verifying) && !error && (
        <p className="mt-6 text-sm text-white/70">
          {verifying ? "Verifying payment..." : "Cooking the perfect line... ⏳"}
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-sm text-red-100">
          {error}
        </div>
      )}

      {!loading && !error && response && (
        <>
          <RoastCard mode={mode} text={text} response={response} />
          {isPreview ? (
            <div className="mt-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-100">
              This is a preview. Unlock to reveal the full roast and save it.
              <div className="mt-3 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={unlockAndRefresh}
                  className="pill-button-primary text-xs sm:text-sm"
                >
                  Unlock full roast
                </button>
                <button
                  type="button"
                  onClick={goBack}
                  className="pill-button-ghost text-xs sm:text-sm"
                >
                  Edit input
                </button>
              </div>
            </div>
          ) : null}
          <FlexSupport ref={payRef} existingOrderId={accessToken} onUnlocked={handleUnlocked} />
        </>
      )}

      <div className="mt-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={goBack}
          className="pill-button-ghost text-xs sm:text-sm"
        >
          Roast something else ↩️
        </button>
        <p className="text-[0.7rem] text-white/40">
          Built to be fun, not harmful. If it feels too real, don&apos;t send it.
        </p>
      </div>
    </main>
  );
}


