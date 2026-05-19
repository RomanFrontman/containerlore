import { useState, useRef } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useFireBackground } from '../hooks/useFireBackground';
import type { ChapterId } from '../types/game';
import HUD from '../components/HUD';
import SmithCanvas from '../components/SmithCanvas';
import DialogBox from '../components/DialogBox';
import OverlayScreen from '../components/OverlayScreen';
import vikingLeft  from '../assets/viking_PNG42.png';
import vikingRight from '../assets/png-clipart-viking-viking.png';

interface GamePageProps {
  chapter: ChapterId;
  onComplete: (xp: number, lives: number) => void;
  isChapterUnlocked: boolean;
}

const NEXT_CHAPTER: Partial<Record<ChapterId, string>> = {
  'docker': '/chapter/k8s',
  'k8s':    '/chapter/ci-cd',
};

export default function GamePage({ chapter, onComplete, isChapterUnlocked }: GamePageProps) {
  const navigate = useNavigate();
  const { state, phase, currentQuestion, pick, nextQuestion, start, restart } = useGameState(chapter, onComplete);
  const [strikeCount, setStrikeCount] = useState(0);
  const fireRef = useRef<HTMLCanvasElement>(null);
  useFireBackground(fireRef);

  const nextChapterRoute = NEXT_CHAPTER[chapter] ?? null;

  // Synchronous guard — <Navigate> renders before any effects, avoiding
  // the timing window where a useEffect redirect fires on a fresh mount.
  if (!isChapterUnlocked) {
    return <Navigate to="/" replace />;
  }

  function handlePick(i: number) {
    pick(i);
    setStrikeCount(c => c + 1);
  }

  const chapterLabel = chapter === 'docker' ? 'Ch. I — Docker'
    : chapter === 'k8s'   ? 'Ch. II — Kubernetes'
    : chapter === 'ci-cd' ? 'Ch. III — CI/CD'
    : 'Chapter';

  // Outer shell fills the screen; fire + vikings live in the letterbox.
  // Inner game container is capped at 680px — compact, PC-game-window feel.
  return (
    <div className="relative bg-[#04030c] flex justify-center overflow-hidden" style={{ height: '100dvh' }}>

      {/* Fire background — same algorithm as the menu */}
      <canvas
        ref={fireRef}
        className="fixed inset-0 z-0 pointer-events-none w-full h-full"
        style={{ opacity: 0.45 }}
      />

      {/* Vikings — outside the game wrapper, in the letterbox areas */}
      <img
        src={vikingLeft}
        alt=""
        aria-hidden="true"
        className="absolute left-0 bottom-0 z-[1] pointer-events-none select-none
                   hidden sm:block
                   h-48 md:h-72 lg:h-[380px]
                   object-contain object-bottom"
        style={{ filter: 'drop-shadow(0 0 20px rgba(200,80,0,0.4)) brightness(0.75)' }}
      />
      <img
        src={vikingRight}
        alt=""
        aria-hidden="true"
        className="absolute right-0 bottom-0 z-[1] pointer-events-none select-none
                   hidden sm:block
                   h-48 md:h-72 lg:h-[380px]
                   object-contain object-bottom"
        style={{ filter: 'drop-shadow(0 0 20px rgba(200,80,0,0.4)) brightness(0.75)' }}
      />
      <div
        className="relative z-[2] flex flex-col bg-stone-950 text-stone-200 overflow-hidden w-full border-x border-stone-800/60"
        style={{ maxWidth: '680px' }}
      >
        <HUD chapterLabel={chapterLabel} xp={state.xp} lives={state.lives} />

        {/* Dialog on top, canvas centered below filling remaining space */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          {currentQuestion && (
            <DialogBox
              question={currentQuestion}
              gameState={state}
              onPick={handlePick}
              onNext={nextQuestion}
            />
          )}
          <div className="flex-1 flex items-center justify-center min-h-0 p-2">
            <SmithCanvas strike={strikeCount} />
          </div>
        </div>

        {(phase === 'intro' || phase === 'win' || phase === 'gameover') && (
          <OverlayScreen
            type={phase}
            chapter={chapter}
            xp={state.xp}
            onStart={start}
            onRestart={restart}
            onMenu={() => navigate('/')}
            onNextChapter={nextChapterRoute ? () => navigate(nextChapterRoute) : undefined}
          />
        )}
      </div>
    </div>
  );
}
