// components/diagnosis/QuizCard.tsx
'use client'

import { ANSWER_OPTIONS } from '@/lib/diagnosis/questions'
import type { Question } from '@/lib/diagnosis/questions'

type Props = {
  question: Question
  onAnswer: (score: number) => void
}

export default function QuizCard({ question, onAnswer }: Props) {
  return (
    <div>
      <p
        className="text-xs font-bold mb-2 tracking-widest uppercase"
        style={{ color: '#43a047', letterSpacing: '1.5px' }}
      >
        QUESTION {question.id} / 7
      </p>
      <p
        className="text-sm font-bold mb-5 leading-relaxed"
        style={{ color: '#1b5e20' }}
      >
        {question.text}
      </p>
      <div className="flex flex-col gap-2">
        {ANSWER_OPTIONS.map((option) => (
          <button
            key={option.label}
            onClick={() => onAnswer(option.score)}
            className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 transition-all active:scale-98"
            style={{
              background: 'rgba(255,255,255,0.7)',
              border: '1px solid rgba(27,94,32,0.15)',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  )
}
