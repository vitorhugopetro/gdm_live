import { useState } from 'react';

interface ReactionItem {
  id: number;
  emoji: string;
  label: string;
  left: number; // percentage 10–90%
}

const REACTIONS = [
  { emoji: '🙏', label: 'Glória a Deus' },
  { emoji: '❤️', label: 'Amém' },
  { emoji: '✨', label: 'Aleluia' },
  { emoji: '🔥', label: 'Avivamento' },
];

export function FloatingReactions() {
  const [particles, setParticles] = useState<ReactionItem[]>([]);

  const triggerReaction = (emoji: string, label: string) => {
    const id = Date.now() + Math.random();
    const left = Math.floor(Math.random() * 70) + 15; // 15% - 85%

    setParticles((prev) => [...prev, { id, emoji, label, left }]);

    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 2400);
  };

  return (
    <div className="relative w-full">
      {/* Floating Animated Layer */}
      <div className="pointer-events-none absolute inset-x-0 bottom-12 h-64 overflow-hidden z-30">
        {particles.map((p) => (
          <div
            key={p.id}
            style={{ left: `${p.left}%` }}
            className="absolute bottom-0 flex flex-col items-center animate-float-up opacity-0"
          >
            <span className="text-3xl drop-shadow-md select-none">{p.emoji}</span>
            <span className="text-[10px] font-bold tracking-wider text-gdm-emerald bg-black/60 px-2 py-0.5 rounded-full border border-white/10 mt-1">
              {p.label}
            </span>
          </div>
        ))}
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <span className="text-xs text-gdm-text-muted mr-1 font-medium hidden sm:inline">
          Reagir:
        </span>
        {REACTIONS.map((r) => (
          <button
            key={r.label}
            onClick={() => triggerReaction(r.emoji, r.label)}
            className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 hover:border-gdm-purple/40 text-xs font-medium text-white transition-all transform active:scale-95 shadow-sm"
            title={r.label}
          >
            <span className="text-base group-hover:scale-125 transition-transform">
              {r.emoji}
            </span>
            <span className="text-gdm-text-muted group-hover:text-white transition-colors">
              {r.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

