// components/diagnosis/QuizCard.tsx
'use client'

import { useState } from 'react'
import type { Question } from '@/lib/diagnosis/questions'

type Props = {
  question: Question
  onAnswer: (answer: string[]) => void
}

export default function QuizCard({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  function toggleMulti(option: string) {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    )
  }

  if (question.type === 'single') {
    return (
      <div>
        <p
          className="text-xs font-bold mb-2 tracking-widest uppercase"
          style={{ color: '#43a047', letterSpacing: '1.5px' }}
        >
          QUESTION {question.id} / 5
        </p>
        <p className="text-sm font-bold mb-5 leading-relaxed" style={{ color: '#1b5e20' }}>
          {question.text}
        </p>
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onAnswer([option])}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 transition-all active:scale-98"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(27,94,32,0.15)',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <p
        className="text-xs font-bold mb-2 tracking-widest uppercase"
        style={{ color: '#43a047', letterSpacing: '1.5px' }}
      >
        QUESTION {question.id} / 5
      </p>
      <p className="text-sm font-bold mb-1 leading-relaxed" style={{ color: '#1b5e20' }}>
        {question.text}
      </p>
      <p className="text-xs mb-4" style={{ color: '#888' }}>
        複数選択できます
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {question.options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              onClick={() => toggleMulti(option)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: isSelected ? 'rgba(27,94,32,0.12)' : 'rgba(255,255,255,0.7)',
                border: isSelected
                  ? '1.5px solid rgba(27,94,32,0.5)'
                  : '1px solid rgba(27,94,32,0.15)',
                color: isSelected ? '#1b5e20' : '#555',
                fontWeight: isSelected ? 700 : 400,
              }}
            >
              {isSelected ? '✓ ' : ''}
              {option}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => {
          if (selected.length > 0) onAnswer(selected)
        }}
        disabled={selected.length === 0}
        className="w-full py-3 rounded-xl text-sm font-black transition-all"
        style={{
          background:
            selected.length > 0
              ? 'linear-gradient(135deg, #1b5e20, #2e7d32)'
              : 'rgba(27,94,32,0.2)',
          color: selected.length > 0 ? '#fff' : '#888',
          cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        次へ →
      </button>
    </div>
  )
}
