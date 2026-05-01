// app/diagnosis/preview/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DiagnosisType } from '@/lib/diagnosis/types'
import { DEFAULT_TYPE, VALID_TYPES } from '@/lib/diagnosis/types'

const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XXXXXXX'
const STORAGE_KEY = 'lv_quiz_result'

type QuizResult = {
  type: DiagnosisType
}

export default function PreviewPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof (parsed as QuizResult).type === 'string' &&
        (VALID_TYPES as string[]).includes((parsed as QuizResult).type)
      ) {
        setResult({ type: (parsed as QuizResult).type })
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  function handleViewResult() {
    const type = result?.type ?? DEFAULT_TYPE
    router.push(`/diagnosis/result?type=${type}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div
          className="rounded-t-2xl px-6 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: 'white' }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ opacity: 0.7 }}>
            Life Village
          </p>
          <h2 className="text-lg font-black">診断が完了しました</h2>
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
          {result === null ? (
            <div className="text-center py-8 text-sm" style={{ color: '#888' }}>
              読み込み中...
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-center font-bold mb-3" style={{ color: '#1b5e20' }}>
                  LINEで詳細な診断結果を受け取る
                </p>
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: '#06c755' }}
                >
                  LINEで結果を受け取る →
                </a>
                <p className="text-xs text-center mt-2" style={{ color: '#888' }}>
                  ※ 無料・迷惑メールなし
                </p>
              </div>

              <div className="border-t my-4" style={{ borderColor: 'rgba(27,94,32,0.12)' }} />

              <button onClick={handleViewResult} className="btn-primary w-full py-4 text-sm">
                診断結果を見る →
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
