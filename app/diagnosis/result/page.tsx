// app/diagnosis/result/page.tsx

import type { DiagnosisType } from '@/lib/diagnosis/types'
import { VALID_TYPES, DEFAULT_TYPE } from '@/lib/diagnosis/types'
import ResultCard from '@/components/diagnosis/ResultCard'

const CONSULTATION_URL =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ?? 'https://life.tech-village.co.jp/consultation/'
const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XXXXXXX'

type Props = {
  searchParams: Promise<{ type?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams
  const rawType = params.type?.toUpperCase()
  const type: DiagnosisType =
    rawType && (VALID_TYPES as string[]).includes(rawType)
      ? (rawType as DiagnosisType)
      : DEFAULT_TYPE

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
          <h1 className="text-lg font-black">診断結果</h1>
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
          <ResultCard type={type} consultationUrl={CONSULTATION_URL} lineUrl={LINE_URL} />
        </div>
      </div>
    </main>
  )
}
