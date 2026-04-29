// lib/diagnosis/questions.ts

import type { DiagnosisAxis } from './types'

export type AnswerOption = {
  label: string
  score: number
}

export type Question = {
  id: number
  text: string
  axis: DiagnosisAxis | DiagnosisAxis[]
}

export const ANSWER_OPTIONS: AnswerOption[] = [
  { label: 'とても思う', score: 3 },
  { label: 'まあ思う', score: 2 },
  { label: 'あまり思わない', score: 1 },
  { label: '全く思わない', score: 0 },
]

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: '配偶者やお子様など、あなたの収入に頼っている家族がいますか？',
    axis: 'L',
  },
  {
    id: 2,
    text: '病気やケガで長期入院になった場合の医療費が心配ですか？',
    axis: 'M',
  },
  {
    id: 3,
    text: '老後の生活資金について、今から備えておきたいと感じますか？',
    axis: 'F',
  },
  {
    id: 4,
    text: '万が一のとき、家族の生活を守れるか不安がありますか？',
    axis: 'L',
  },
  {
    id: 5,
    text: '現在の医療・入院への備えが不十分だと感じることがありますか？',
    axis: 'M',
  },
  {
    id: 6,
    text: '将来受け取れる公的年金だけでは生活が不安だと思いますか？',
    axis: 'F',
  },
  {
    id: 7,
    text: '今の保険をプロに相談・見直ししてみたいと思いますか？',
    axis: ['L', 'M', 'F'],
  },
]
