// lib/diagnosis/scoring.ts

import { QUESTIONS } from './questions'
import type { DiagnosisAxis } from './types'

export type AxisScores = Record<DiagnosisAxis, number>

const TYPE_PRIORITY: DiagnosisAxis[] = ['L', 'M', 'F']
const SCORE_MIN = 80
const SCORE_MAX = 100
const RAW_MAX = 21 // 7問 × 3点

export function calcAxisScores(answers: number[]): AxisScores {
  const scores: AxisScores = { L: 0, M: 0, F: 0 }
  answers.forEach((score, index) => {
    const question = QUESTIONS[index]
    const axes = Array.isArray(question.axis) ? question.axis : [question.axis]
    axes.forEach((axis) => {
      scores[axis] += score
    })
  })
  return scores
}

export function determineType(axisScores: AxisScores): DiagnosisAxis {
  const maxScore = Math.max(...Object.values(axisScores))
  const type = TYPE_PRIORITY.find((axis) => axisScores[axis] === maxScore)
  if (!type) throw new Error(`determineType: no matching axis in scores ${JSON.stringify(axisScores)}`)
  return type
}

export function calcDisplayScore(answers: number[]): number {
  const rawTotal = answers.reduce((sum, s) => sum + s, 0)
  return Math.round(SCORE_MIN + (rawTotal / RAW_MAX) * (SCORE_MAX - SCORE_MIN))
}
