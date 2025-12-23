"use client";

import { useRef, useState } from "react";
import * as htmlToImage from "html-to-image";

export default function RoastCard({ mode, text, response }) {
  const cardRef = useRef(null);
  const [downloadNote, setDownloadNote] = useState("");

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      setDownloadNote("");
      const dataUrl = await htmlToImage.toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#020617",
        pixelRatio: 2
      });

      const link = document.createElement("a");
      link.download = "roastme-ai.png";
      link.href = dataUrl;
      link.click();
      setDownloadNote("Saved! Share away.");
    } catch (err) {
      setDownloadNote("Could not generate image. Try again in a second.");
    }
  };

  const modeLabel =
    mode === "soft"
      ? "Soft Roast"
      : mode === "savage"
      ? "Savage Roast"
      : mode === "compliment"
      ? "Compliment"
      : "Green / Red Flag";

  return (
    <div className="mt-6 space-y-3">
      <div
        ref={cardRef}
        className="glass-card relative overflow-hidden border-pink-400/30 bg-gradient-to-br from-slate-900 via-brand-dark to-black p-4 sm:p-6"
      >
        <div className="pointer-events-none absolute inset-x-0 -top-40 h-40 bg-[radial-gradient(circle_at_top,_#fb7185_0,_transparent_60%)] opacity-40" />
        <div className="relative space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <p className="tagline text-xs text-pink-200/80">RoastMe AI</p>
              <p className="mt-1 text-xs font-medium text-white/60">
                Mode: <span className="font-semibold text-pink-300">{modeLabel}</span>
              </p>
            </div>
            <span className="rounded-full bg-white/10 px-3 py-1 text-[0.65rem] font-semibold text-pink-200">
              For entertainment only 💖
            </span>
          </div>

          {text ? (
            <div className="mt-2 rounded-2xl bg-black/40 p-3 text-xs text-white/70">
              <p className="mb-1 text-[0.65rem] uppercase tracking-[0.2em] text-white/40">
                Input
              </p>
              <p className="whitespace-pre-wrap">{text}</p>
            </div>
          ) : null}

          <div className="mt-3 rounded-2xl bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-sky-500/10 p-3 sm:p-4">
            <p className="mb-2 text-[0.7rem] uppercase tracking-[0.25em] text-pink-200/80">
              RoastMe says
            </p>
            <p className="text-base font-semibold leading-relaxed text-white sm:text-lg">
              {response}
            </p>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="watermark">Roasted by RoastMe AI</p>
            <p className="text-[0.65rem] text-white/40">
              No bullying. No hate. Just internet-level clowning.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={handleDownload}
          className="pill-button-primary text-xs sm:text-sm"
        >
          Download as image 📸
        </button>
        <p className="text-[0.65rem] text-white/40">
          Share it on stories, tag your friends, but keep it kind.
        </p>
      </div>
      {downloadNote ? (
        <p className="text-[0.7rem] text-white/70">{downloadNote}</p>
      ) : null}
    </div>
  );
}


