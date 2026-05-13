// app/diagnosis/preview/page.tsx
'use client'

import { useEffect, useState } from 'react'
import type { DiagnosisType } from '@/lib/diagnosis/types'
import { VALID_TYPES, TYPE_TO_KEYWORD } from '@/lib/diagnosis/types'

const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XTFxWwZ'
const STORAGE_KEY = 'lv_quiz_result'

type QuizResult = {
  type: DiagnosisType
}

export default function PreviewPage() {
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

  const keyword = result ? TYPE_TO_KEYWORD[result.type] : null

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
          {result === null || keyword === null ? (
            <div className="text-center py-8 text-sm" style={{ color: '#888' }}>
              読み込み中...
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-xs mb-3" style={{ color: '#666' }}>
                  あなたの診断キーワード
                </p>
                <div
                  className="inline-flex items-center justify-center w-28 h-28 rounded-full text-white text-6xl font-black shadow-lg"
                  style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}
                >
                  {keyword}
                </div>
                <p className="text-xs mt-3" style={{ color: '#666' }}>
                  このアルファベットをLINEに送ってください
                </p>
              </div>

              <div
                className="rounded-xl p-4 mb-5 text-sm leading-relaxed"
                style={{ background: 'rgba(27,94,32,0.06)', color: '#444' }}
              >
                <p className="font-bold mb-2" style={{ color: '#1b5e20' }}>
                  受け取り方
                </p>
                <ol className="space-y-1 list-none">
                  <li>① 下のボタンからLINE友だち追加</li>
                  <li>
                    ② LINEに上のアルファベット（
                    <span className="font-black" style={{ color: '#1b5e20' }}>
                      {keyword}
                    </span>
                    ）を送信
                  </li>
                  <li>③ 診断結果URLが届きます</li>
                </ol>
              </div>

              <a
                href={LINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LINEで診断結果を受け取る（外部リンク）"
                className="block w-full text-center py-4 rounded-xl font-bold text-base text-white active:scale-95 transition-all"
                style={{ background: '#06c755' }}
              >
                LINEで結果を受け取る →
              </a>
              <p className="text-xs text-center mt-2" style={{ color: '#888' }}>
                ※ 無料・迷惑メールなし
              </p>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
