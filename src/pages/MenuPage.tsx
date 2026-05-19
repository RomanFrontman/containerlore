import { useRef } from 'react';
import { useFireBackground } from '../hooks/useFireBackground';
import ChapterCard from '../components/ChapterCard';
import type { ProgressMap, ChapterId } from '../types/game';
import vikingLeft  from '../assets/viking_PNG42.png';
import vikingRight from '../assets/png-clipart-viking-viking.png';

interface MenuPageProps {
  progress: ProgressMap;
  isUnlocked: (id: ChapterId, progress: ProgressMap) => boolean;
  onReset: () => void;
}

const anim = (name: 'fadeIn' | 'slideUp', delay: string): React.CSSProperties => ({
  animation: `${name} 0.5s ease forwards`,
  animationDelay: delay,
  opacity: 0,
});

export default function MenuPage({ progress, isUnlocked, onReset }: MenuPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useFireBackground(canvasRef);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#04030c]">

      {/* Fire background */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none w-full h-full"
        style={{ opacity: 0.55 }}
      />

      {/* Left viking */}
      <img
        src={vikingLeft}
        alt=""
        aria-hidden="true"
        className="absolute left-0 bottom-0 z-[5] pointer-events-none select-none
                   h-44 sm:h-64 md:h-96 lg:h-[540px]
                   object-contain object-bottom"
        style={{ filter: 'drop-shadow(0 0 24px rgba(200,80,0,0.45)) brightness(0.82)' }}
      />

      {/* Right viking */}
      <img
        src={vikingRight}
        alt=""
        aria-hidden="true"
        className="absolute right-0 bottom-0 z-[5] pointer-events-none select-none
                   h-44 sm:h-64 md:h-96 lg:h-[540px]
                   object-contain object-bottom"
        style={{ filter: 'drop-shadow(0 0 24px rgba(200,80,0,0.45)) brightness(0.82)' }}
      />

      {/* Content layer */}
      <div className="relative z-10 flex flex-col items-center gap-6 sm:gap-8
                      px-4 sm:px-6 py-10 sm:py-12
                      w-full max-w-sm sm:max-w-md lg:max-w-lg">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2 text-center">
          <span
            style={anim('fadeIn', '0.3s')}
            className="text-3xl sm:text-4xl leading-none text-amber-400"
          >
            ᚠ
          </span>
          <h1
            style={anim('fadeIn', '0.6s')}
            className="text-2xl sm:text-3xl font-semibold tracking-wider text-stone-100"
          >
            ContainerLore
          </h1>
          <p
            style={anim('fadeIn', '0.9s')}
            className="text-xs sm:text-sm tracking-widest text-amber-500/60 uppercase"
          >
            The Nine Realms of DevOps
          </p>
        </div>

        {/* Chapter cards */}
        <div className="flex flex-col gap-3 w-full">
          <ChapterCard
            number="I"
            title="The Iron Vessel"
            subtitle="Docker — forge your first container"
            route="/chapter/docker"
            unlocked={isUnlocked('docker', progress)}
            completed={progress['docker'].completed}
            bestXp={progress['docker'].xp}
            bestLives={progress['docker'].bestLives}
            animationDelay="1.2s"
          />
          <ChapterCard
            number="II"
            title="The Nine Kingdoms"
            subtitle="Kubernetes — rule the cluster"
            route="/chapter/k8s"
            unlocked={isUnlocked('k8s', progress)}
            completed={progress['k8s'].completed}
            bestXp={progress['k8s'].xp}
            bestLives={progress['k8s'].bestLives}
            animationDelay="1.5s"
          />
          <ChapterCard
            number="III"
            title="The Eternal Pipeline"
            subtitle="CI/CD — automate the war machine"
            route="/chapter/ci-cd"
            unlocked={isUnlocked('ci-cd', progress)}
            completed={progress['ci-cd'].completed}
            bestXp={progress['ci-cd'].xp}
            bestLives={progress['ci-cd'].bestLives}
            animationDelay="1.8s"
          />
        </div>

        {/* Flavor text */}
        <p
          style={anim('fadeIn', '2.1s')}
          className="text-xs text-stone-500 italic text-center"
        >
          Mimer awaits in the forge. Choose your path, warrior.
        </p>

        {/* Reset progress (dev / start-over) */}
        <button
          onClick={onReset}
          className="text-xs text-stone-700 hover:text-stone-500 transition-colors"
        >
          reset progress
        </button>

      </div>
    </div>
  );
}
