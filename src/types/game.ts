export interface Answer {
  text: string;
  correct: boolean;
}

export interface Question {
  id: number;
  npcText: string;
  answers: Answer[];
  feedbackCorrect: string;
  feedbackWrong: string;
  xpReward: number;
}

export type AnswerState = 'idle' | 'correct' | 'wrong';

export interface GameState {
  lives: number;
  xp: number;
  questionIndex: number;
  answered: boolean;
  answerState: AnswerState;
}

export type ChapterId = 'docker' | 'k8s' | 'ci-cd';

export interface ChapterProgress {
  completed: boolean;
  xp: number;
  bestLives: number | null;
}

export type ProgressMap = Record<ChapterId, ChapterProgress>;
