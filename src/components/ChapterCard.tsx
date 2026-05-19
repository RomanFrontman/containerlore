import { useNavigate } from 'react-router-dom';

interface ChapterCardProps {
  number: 'I' | 'II' | 'III';
  title: string;
  subtitle: string;
  route: string;
  unlocked: boolean;
  completed: boolean;
  bestXp: number;
  bestLives: number | null;
  animationDelay: string;
}

export default function ChapterCard({
  number, title, subtitle, route, unlocked, completed, bestXp, bestLives, animationDelay,
}: ChapterCardProps) {
  const navigate = useNavigate();

  const baseStyle: React.CSSProperties = {
    animation: 'slideUp 0.5s ease forwards',
    animationDelay,
    opacity: 0,
  };

  // Locked
  if (!unlocked) {
    return (
      <div
        style={baseStyle}
        title="Complete the previous chapter to unlock"
        className="
          relative flex flex-col gap-1 px-5 py-4 rounded-lg
          border border-white/10 bg-black/40 backdrop-blur-sm
          opacity-40 cursor-not-allowed pointer-events-none select-none
        "
      >
        <span className="text-xs font-mono tracking-widest text-stone-500 mb-1">
          ᛚ &nbsp; Ch. {number}
        </span>
        <span className="text-base font-semibold text-stone-400 tracking-wide">{title}</span>
        <span className="text-sm text-stone-600 italic">Complete the previous chapter to unlock</span>
      </div>
    );
  }

  // Completed
  if (completed) {
    return (
      <button
        style={baseStyle}
        onClick={() => navigate(route)}
        className="
          relative flex flex-col gap-1 px-5 py-4 rounded-lg text-left w-full
          border border-green-900/40 bg-black/40 backdrop-blur-sm
          transition-all duration-200 cursor-pointer
          hover:bg-black/60 hover:border-green-700/50
          hover:ring-1 hover:ring-green-500/30
          focus:outline-none focus:ring-1 focus:ring-green-500/50
        "
      >
        <span className="text-xs font-mono tracking-widest text-green-400 mb-1">
          ✓ FORGED &nbsp;·&nbsp; Ch. {number}
        </span>
        <span className="text-base font-semibold text-stone-100 tracking-wide">{title}</span>
        <span className="text-sm text-stone-400 italic">{subtitle}</span>
        <span className="text-xs text-amber-500/60 mt-1">
          Best: {bestXp} XP · {bestLives} ♥ remaining
        </span>
      </button>
    );
  }

  // Unlocked, not yet completed
  return (
    <button
      style={baseStyle}
      onClick={() => navigate(route)}
      className="
        relative flex flex-col gap-1 px-5 py-4 rounded-lg text-left w-full
        border border-white/10 bg-black/40 backdrop-blur-sm
        transition-all duration-200 cursor-pointer
        hover:bg-black/60 hover:border-white/20
        hover:ring-1 hover:ring-amber-500/40
        focus:outline-none focus:ring-1 focus:ring-amber-500/60
      "
    >
      <span className="text-xs font-mono tracking-widest text-amber-500/70 mb-1">
        Ch. {number}
      </span>
      <span className="text-base font-semibold text-stone-100 tracking-wide">{title}</span>
      <span className="text-sm text-stone-400 italic">{subtitle}</span>
    </button>
  );
}
