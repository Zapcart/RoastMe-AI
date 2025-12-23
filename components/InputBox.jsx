"use client";

export default function InputBox({ text, setText, disabled }) {
  return (
    <div className="glass-card mt-4 p-3 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-pink-300/70">
          Drop your context
        </p>
        <span className="text-[0.65rem] text-white/50">
          No screenshots, no @s, just vibes.
        </span>
      </div>
      <textarea
        className="mt-3 h-32 w-full resize-none rounded-2xl border border-white/10 bg-black/40 p-3 text-sm text-white outline-none ring-pink-400/40 placeholder:text-white/30 focus:border-pink-400 focus:ring-2"
        placeholder="Paste a message, bio, text, or situation you want roasted / rated..."
        value={text}
        disabled={disabled}
        onChange={(e) => setText(e.target.value.slice(0, 600))}
      />
      <div className="mt-1 flex justify-end text-[0.65rem] text-white/40">
        {text.length}/600
      </div>
    </div>
  );
}


