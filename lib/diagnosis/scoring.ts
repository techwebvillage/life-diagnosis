// lib/diagnosis/scoring.ts

import type { DiagnosisType } from './types'

const CONCERN_TO_TYPE: Record<string, DiagnosisType> = {
  '保険の見直し': 'INSURANCE',
  '老後資金': 'PENSION',
  '資産運用': 'ASSET',
  '住宅購入': 'LIFEPLAN',
  '退職金・共済の活用': 'PENSION',
  '家計の見直し': 'LIFEPLAN',
  '子どもの教育費': 'LIFEPLAN',
}

const TYPE_PRIORITY: DiagnosisType[] = ['PENSION', 'INSURANCE', 'ASSET', 'LIFEPLAN']

const CONCERN_QUESTION_INDEX = 3

export function determineType(answers: string[][]): DiagnosisType {
  const concerns = answers[CONCERN_QUESTION_INDEX] ?? []
  const counts: Record<DiagnosisType, number> = {
    INSURANCE: 0,
    ASSET: 0,
    PENSION: 0,
    LIFEPLAN: 0,
  }
  for (const concern of concerns) {
    const t = CONCERN_TO_TYPE[concern]
    if (t) counts[t]++
  }
  const maxCount = Math.max(...Object.values(counts))
  if (maxCount === 0) return 'LIFEPLAN'
  return TYPE_PRIORITY.find((t) => counts[t] === maxCount) ?? 'LIFEPLAN'
}
