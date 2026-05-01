// app/diagnosis/quiz/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/diagnosis/questions'
import { determineType } from '@/lib/diagnosis/scoring'
import ProgressBar from '@/components/diagnosis/ProgressBar'
import QuizCard from '@/components/diagnosis/QuizCard'

const STORAGE_KEY = 'lv_quiz_result'

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[][]>([])

  function handleAnswer(answer: string[]) {
    const newAnswers = [...answers, answer]

    if (newAnswers.length === QUESTIONS.length) {
      setAnswers(newAnswers)
      try {
        const type = determineType(newAnswers)
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ type }))
        } catch {
          // プライベートブラウジング時は無視
        }
      } catch {
        // エラー時もデフォルト結果として /preview へ遷移
      }
      router.push('/diagnosis/preview')
    } else {
      setAnswers(newAnswers)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const question = QUESTIONS[currentIndex]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div
          className="rounded-t-2xl px-6 py-4"
          style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}
        >
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />
        </div>

        <div
          className="rounded-b-2xl px-6 py-8 shadow-sm"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.8)',
            borderTop: 'none',
            backdropFilter: 'blur(14px)',
          }}
        >
          <QuizCard key={currentIndex} question={question} onAnswer={handleAnswer} />
        </div>
      </div>
    </main>
  )
}
