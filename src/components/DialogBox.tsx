import { useState } from 'react';
import type { Question, GameState, AnswerState } from '../types/game';
import ProgressDots from './ProgressDots';
import ChoiceButton from './ChoiceButton';
import FeedbackText from './FeedbackText';

const LABELS = ['A', 'B', 'C', 'D'];
const TOTAL_QUESTIONS = 6;

interface DialogBoxProps {
  question: Question;
  gameState: GameState;
  onPick: (index: number) => void;
  onNext: () => void;
}

export default function DialogBox({ question, gameState, onPick, onNext }: DialogBoxProps) {
  const [chosenIndex, setChosenIndex] = useState<number | null>(null);
  const { answered, answerState, questionIndex } = gameState;

  const feedback = answered
    ? answerState === 'correct'
      ? question.feedbackCorrect
      : question.feedbackWrong
    : '';

  function handlePick(i: number) {
    setChosenIndex(i);
    onPick(i);
  }

  function getButtonState(i: number): AnswerState {
    if (!answered) return 'idle';
    if (question.answers[i].correct) return 'correct';
    if (i === chosenIndex) return 'wrong';
    return 'idle';
  }

  return (
    <div className="flex flex-col flex-1 bg-stone-900 p-3 sm:p-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] sm:text-xs text-stone-500 font-mono">
          Question {questionIndex + 1} of {TOTAL_QUESTIONS}
        </span>
        <span className="text-[10px] sm:text-xs text-amber-700 font-mono">Mimer speaks:</span>
      </div>

      <ProgressDots total={TOTAL_QUESTIONS} current={questionIndex} />

      <p className="italic text-amber-100 text-xs sm:text-sm mb-3 sm:mb-4 mt-2 leading-relaxed border-l-2 border-amber-800 pl-3">
        {question.npcText}
      </p>

      <div className="flex flex-col gap-2">
        {question.answers.map((answer, i) => (
          <ChoiceButton
            key={i}
            label={LABELS[i]}
            text={answer.text}
            state={getButtonState(i)}
            onClick={() => handlePick(i)}
            disabled={answered}
          />
        ))}
      </div>

      <FeedbackText text={feedback} state={answered ? answerState : 'idle'} />

      {answered && (
        <button
          onClick={() => { setChosenIndex(null); onNext(); }}
          className="mt-3 sm:mt-4 self-end px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-mono rounded border border-amber-700 bg-amber-950/40 text-amber-400 hover:bg-amber-900/50 hover:text-amber-200 transition-colors"
        >
          Next →
        </button>
      )}
    </div>
  );
}
