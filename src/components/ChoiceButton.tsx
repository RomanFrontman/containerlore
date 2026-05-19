import type { AnswerState } from '../types/game';

interface ChoiceButtonProps {
  label: string;
  text: string;
  state: AnswerState;
  onClick: () => void;
  disabled: boolean;
}

const stateClasses: Record<AnswerState, string> = {
  idle: 'border-stone-700 bg-stone-900 hover:border-amber-600 hover:bg-stone-800 text-stone-200',
  correct: 'border-green-500 bg-green-500/10 text-green-400',
  wrong: 'border-red-500 bg-red-500/10 text-red-400',
};

export default function ChoiceButton({ label, text, state, onClick, disabled }: ChoiceButtonProps) {
  const letterColor =
    state === 'correct'
      ? 'text-green-400'
      : state === 'wrong'
      ? 'text-red-400'
      : 'text-amber-500';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full text-left px-3 py-2 rounded border text-sm transition-colors duration-150 flex gap-2 items-start
        ${stateClasses[state]}
        ${disabled && state === 'idle' ? 'cursor-not-allowed opacity-50' : ''}
        ${!disabled ? 'cursor-pointer' : ''}`}
    >
      <span className={`font-mono font-bold shrink-0 ${letterColor}`}>{label}.</span>
      <span>{text}</span>
    </button>
  );
}
