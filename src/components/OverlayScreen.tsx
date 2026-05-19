import type { ChapterId } from '../types/game';

interface OverlayScreenProps {
  type: 'intro' | 'win' | 'gameover';
  chapter: ChapterId;
  xp: number;
  onStart: () => void;
  onRestart: () => void;
  onMenu: () => void;
  onNextChapter?: () => void;
}

const CHAPTER_META: Record<ChapterId, { rune: string; introSubtitle: string; introBody: string; winBody: string }> = {
  'docker': {
    rune: 'ᚠ',
    introSubtitle: 'Chapter I — The Docker Forge',
    introBody: "Mimer, the Keeper of Knowledge, awaits at his forge. Answer 6 trials to earn your runes and prove yourself worthy of the container arts.",
    winBody: "You have answered all of Mimer's trials. The runes of Docker are yours to command.",
  },
  'k8s': {
    rune: 'ᚢ',
    introSubtitle: 'Chapter II — The Nine Kingdoms',
    introBody: "The cluster stirs. Mimer points to the horizon — nine realms of Kubernetes await. Answer 6 trials to prove you can rule the container kingdoms.",
    winBody: "The cluster bows to your will. The runes of Kubernetes are etched upon your shield.",
  },
  'ci-cd': {
    rune: 'ᚱ',
    introSubtitle: 'Chapter III — The Eternal Pipeline',
    introBody: "The war-machine never sleeps. Mimer reveals the Eternal Pipeline — where code flows from forge to battlefield without pause. Answer 6 trials to master the automation arts.",
    winBody: "The pipeline roars to life. Every commit now rides the Bifrost from forge to battle, unbroken.",
  },
};

const SHARED_CONTENT = {
  win: {
    title: 'Victory!',
    subtitle: 'The Forge Acknowledges You',
    buttonLabel: 'Play Again',
  },
  gameover: {
    title: 'Fallen',
    subtitle: 'Your Flame Has Been Extinguished',
    body: 'Even the mightiest warriors fall before mastering the forge. Rise again and reclaim your honor.',
    buttonLabel: 'Try Again',
  },
};

export default function OverlayScreen({ type, chapter, xp, onStart, onRestart, onMenu, onNextChapter }: OverlayScreenProps) {
  const meta = CHAPTER_META[chapter];
  const handlePrimary = type === 'intro' ? onStart : onRestart;

  let rune: string;
  let title: string;
  let subtitle: string;
  let body: string;
  let buttonLabel: string;

  if (type === 'intro') {
    rune = meta.rune;
    title = 'ContainerLore';
    subtitle = meta.introSubtitle;
    body = meta.introBody;
    buttonLabel = 'Start Training';
  } else if (type === 'win') {
    rune = meta.rune;
    title = SHARED_CONTENT.win.title;
    subtitle = SHARED_CONTENT.win.subtitle;
    body = meta.winBody;
    buttonLabel = SHARED_CONTENT.win.buttonLabel;
  } else {
    rune = 'ᚦ';
    title = SHARED_CONTENT.gameover.title;
    subtitle = SHARED_CONTENT.gameover.subtitle;
    body = SHARED_CONTENT.gameover.body;
    buttonLabel = SHARED_CONTENT.gameover.buttonLabel;
  }

  return (
    <div className="absolute inset-0 bg-black/95 flex items-center justify-center z-10 px-4">
      <div className="flex flex-col items-center gap-3 sm:gap-4 w-full max-w-sm text-center">
        <span className="text-5xl sm:text-6xl text-amber-500 font-serif">{rune}</span>
        <h1 className="text-2xl sm:text-3xl font-bold text-amber-200 tracking-wider">{title}</h1>
        <p className="text-xs sm:text-sm text-amber-600 font-mono uppercase tracking-widest">{subtitle}</p>
        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">{body}</p>

        {type !== 'intro' && (
          <p className="text-yellow-400 font-mono text-xs sm:text-sm border border-yellow-800 rounded px-3 py-1 bg-yellow-950/30">
            ⚡ {xp} XP earned
          </p>
        )}

        {type === 'win' && onNextChapter && (
          <button
            onClick={onNextChapter}
            className="mt-1 sm:mt-2 w-full px-5 sm:px-6 py-2.5 sm:py-3 rounded border border-green-600 bg-green-950/60 text-green-300 font-mono text-xs sm:text-sm hover:bg-green-900/70 hover:text-green-100 transition-colors tracking-wide"
          >
            Continue to next chapter →
          </button>
        )}

        <button
          onClick={handlePrimary}
          className={`${type === 'win' && onNextChapter ? '' : 'mt-1 sm:mt-2'} px-5 sm:px-6 py-2.5 sm:py-3 rounded border border-amber-600 bg-amber-950/50 text-amber-300 font-mono text-xs sm:text-sm hover:bg-amber-900/60 hover:text-amber-100 transition-colors tracking-wide`}
        >
          {buttonLabel}
        </button>

        <button
          onClick={onMenu}
          className="text-xs text-stone-600 hover:text-stone-400 font-mono transition-colors"
        >
          ← Back to menu
        </button>
      </div>
    </div>
  );
}
