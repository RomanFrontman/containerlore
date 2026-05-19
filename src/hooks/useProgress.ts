import { useState, useCallback } from 'react';
import type { ChapterId, ProgressMap } from '../types/game';

const STORAGE_KEY = 'containerlore_progress';

const DEFAULT_PROGRESS: ProgressMap = {
  'docker': { completed: false, xp: 0, bestLives: null },
  'k8s':    { completed: false, xp: 0, bestLives: null },
  'ci-cd':  { completed: false, xp: 0, bestLives: null },
};

function loadProgress(): ProgressMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch {
    return DEFAULT_PROGRESS;
  }
}

function saveProgress(progress: ProgressMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    console.warn('ContainerLore: could not save progress to localStorage');
  }
}

// Derive unlock status from completion flags — never store separately
export function isUnlocked(chapterId: ChapterId, progress: ProgressMap): boolean {
  switch (chapterId) {
    case 'docker': return true;
    case 'k8s':    return progress['docker'].completed;
    case 'ci-cd':  return progress['k8s'].completed;
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<ProgressMap>(loadProgress);

  const completeChapter = useCallback((
    chapterId: ChapterId,
    xpEarned: number,
    livesRemaining: number,
  ) => {
    setProgress(prev => {
      const existing = prev[chapterId];
      const updated: ProgressMap = {
        ...prev,
        [chapterId]: {
          completed: true,
          xp: Math.max(existing.xp, xpEarned),
          bestLives: existing.bestLives === null
            ? livesRemaining
            : Math.max(existing.bestLives, livesRemaining),
        },
      };
      saveProgress(updated);
      return updated;
    });
  }, []);

  const resetProgress = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
  }, []);

  return { progress, completeChapter, resetProgress, isUnlocked };
}
