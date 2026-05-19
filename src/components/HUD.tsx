interface HUDProps {
  chapterLabel: string;
  xp: number;
  lives: number;
}

export default function HUD({ chapterLabel, xp, lives }: HUDProps) {
  return (
    <div className="flex items-center justify-between px-3 sm:px-4 py-2 bg-stone-950 border-b border-stone-800 shrink-0">
      <span className="text-[10px] sm:text-xs font-mono text-amber-500 border border-amber-800 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 bg-amber-950/40 truncate max-w-[120px] sm:max-w-none">
        {chapterLabel}
      </span>
      <span className="text-[10px] sm:text-xs font-mono text-yellow-400 border border-yellow-800 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 bg-yellow-950/40">
        ⚡ {xp} XP
      </span>
      <div className="flex gap-0.5 sm:gap-1">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`text-base sm:text-lg transition-opacity duration-300 ${i < lives ? 'opacity-100' : 'opacity-20'}`}
          >
            ❤️
          </span>
        ))}
      </div>
    </div>
  );
}
