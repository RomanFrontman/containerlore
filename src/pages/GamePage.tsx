import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import type { ChapterId } from '../types/game';
import HUD from '../components/HUD';
import SmithCanvas from '../components/SmithCanvas';
import DialogBox from '../components/DialogBox';
import OverlayScreen from '../components/OverlayScreen';

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

  return (
    <div
      className="relative flex flex-col bg-stone-950 text-stone-200 overflow-hidden"
      style={{ height: '100dvh' }}
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
        <div className="flex-1 flex items-center justify-center min-h-0">
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
  );
}
