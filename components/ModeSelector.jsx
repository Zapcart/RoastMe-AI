"use client";

const MODES = [
  { id: "soft", label: "Soft Roast", vibe: "Playful, kind of nice about it" },
  { id: "savage", label: "Savage Roast", vibe: "Brutal but still safe & kind of wholesome" },
  { id: "compliment", label: "Compliment", vibe: "Hype them up, main character energy" },
  { id: "flag", label: "Green / Red Flag", vibe: "Judge the vibes only" }
];

export default function ModeSelector({ mode, setMode }) {
  return (
    <div className="glass-card mt-4 p-3 sm:p-4">
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.25em] text-pink-300/70">
        Pick your chaos level
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {MODES.map((m) => {
          const isActive = mode === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`flex flex-col rounded-2xl border px-3 py-2 text-left text-xs transition sm:text-sm ${
                isActive
                  ? "border-pink-400 bg-pink-500/20 shadow-neon"
                  : "border-white/10 bg-white/5 hover:border-pink-400/60 hover:bg-pink-500/10"
              }`}
            >
              <span className="text-[0.75rem] font-semibold sm:text-sm">{m.label}</span>
              <span className="mt-1 text-[0.65rem] text-white/60 sm:text-xs">{m.vibe}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


