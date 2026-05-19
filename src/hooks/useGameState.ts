import { useState, useCallback, useRef } from 'react';
import type { GameState, AnswerState } from '../types/game';
import dockerQuestions from '../data/questions-docker';
import k8sQuestions from '../data/questions-k8s';
import cicdQuestions from '../data/questions-cicd';

export type GamePhase = 'intro' | 'playing' | 'win' | 'gameover';

const INITIAL_STATE: GameState = {
  lives: 3,
  xp: 0,
  questionIndex: 0,
  answered: false,
  answerState: 'idle',
};

function getQuestions(chapter: string) {
  if (chapter === 'docker') return dockerQuestions;
  if (chapter === 'k8s')    return k8sQuestions;
  if (chapter === 'ci-cd')  return cicdQuestions;
  return [];
}

export function useGameState(
  chapter: string,
  onComplete: (xp: number, lives: number) => void,
) {
  const questions = getQuestions(chapter);
  const [state, setState] = useState<GameState>(INITIAL_STATE);
  const [phase, setPhase] = useState<GamePhase>('intro');
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  const currentQuestion = questions[state.questionIndex];

  const pick = useCallback((answerIndex: number) => {
    if (phaseRef.current !== 'playing') return;
    setState((prev) => {
      if (prev.answered) return prev;
      const qs = getQuestions(chapter);
      const question = qs[prev.questionIndex];
      const isCorrect = question.answers[answerIndex].correct;
      const answerState: AnswerState = isCorrect ? 'correct' : 'wrong';
      const newLives = isCorrect ? prev.lives : prev.lives - 1;
      if (!isCorrect && newLives === 0) {
        setTimeout(() => setPhase('gameover'), 1800);
      }
      return {
        ...prev,
        xp: isCorrect ? prev.xp + question.xpReward : prev.xp,
        lives: newLives,
        answered: true,
        answerState,
      };
    });
  }, [chapter]);

  const nextQuestion = useCallback(() => {
    setState((prev) => {
      const qs = getQuestions(chapter);
      const nextIndex = prev.questionIndex + 1;
      if (nextIndex >= qs.length) {
        setPhase('win');
        // Call onComplete after the render cycle to avoid side-effect inside updater
        const { xp, lives } = prev;
        setTimeout(() => onComplete(xp, lives), 0);
        return prev;
      }
      return { ...prev, questionIndex: nextIndex, answered: false, answerState: 'idle' };
    });
  }, [chapter, onComplete]);

  const start   = useCallback(() => setPhase('playing'), []);
  const restart = useCallback(() => { setState(INITIAL_STATE); setPhase('intro'); }, []);

  return { state, phase, currentQuestion, pick, nextQuestion, start, restart };
}
