import type { AnswerState } from '../types/game';

interface FeedbackTextProps {
  text: string;
  state: AnswerState;
}

export default function FeedbackText({ text, state }: FeedbackTextProps) {
  if (state === 'idle') return null;

  return (
    <p
      className={`text-sm italic mt-3 px-3 py-2 rounded border ${
        state === 'correct'
          ? 'text-green-300 border-green-800 bg-green-950/30'
          : 'text-red-300 border-red-800 bg-red-950/30'
      }`}
    >
      {text}
    </p>
  );
}
