interface ProgressDotsProps {
  total: number;
  current: number;
}

export default function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex gap-2 justify-center my-2">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={`w-2 h-2 rounded-full transition-colors duration-300 ${
            i < current
              ? 'bg-amber-500'
              : i === current
              ? 'bg-amber-300 ring-1 ring-amber-400'
              : 'bg-stone-700'
          }`}
        />
      ))}
    </div>
  );
}
