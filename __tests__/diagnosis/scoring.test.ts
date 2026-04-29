// __tests__/diagnosis/scoring.test.ts

import { calcAxisScores, determineType, calcDisplayScore } from '@/lib/diagnosis/scoring'
import type { AxisScores } from '@/lib/diagnosis/scoring'

describe('calcAxisScores', () => {
  test('全問3点の場合、各軸に正しいスコアを集計する', () => {
    const answers = [3, 3, 3, 3, 3, 3, 3]
    const result = calcAxisScores(answers)
    expect(result.L).toBe(9)
    expect(result.M).toBe(9)
    expect(result.F).toBe(9)
  })

  test('全問0点の場合、全軸が0になる', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0]
    const result = calcAxisScores(answers)
    expect(result.L).toBe(0)
    expect(result.M).toBe(0)
    expect(result.F).toBe(0)
  })

  test('M軸のみ高い場合に正しく集計する', () => {
    const answers = [0, 3, 0, 0, 3, 0, 0]
    const result = calcAxisScores(answers)
    expect(result.L).toBe(0)
    expect(result.M).toBe(6)
    expect(result.F).toBe(0)
  })

  test('F軸のみ高い場合に正しく集計する', () => {
    const answers = [0, 0, 3, 0, 0, 3, 0]
    const result = calcAxisScores(answers)
    expect(result.L).toBe(0)
    expect(result.M).toBe(0)
    expect(result.F).toBe(6)
  })

  test('Q7は全軸に加算される', () => {
    const answers = [0, 0, 0, 0, 0, 0, 2]
    const result = calcAxisScores(answers)
    expect(result.L).toBe(2)
    expect(result.M).toBe(2)
    expect(result.F).toBe(2)
  })
})

describe('determineType', () => {
  test('最高スコアの軸のタイプを返す', () => {
    const scores: AxisScores = { L: 3, M: 8, F: 5 }
    expect(determineType(scores)).toBe('M')
  })

  test('L と M が同点の場合、L を返す（優先順位 L > M > F）', () => {
    const scores: AxisScores = { L: 8, M: 8, F: 3 }
    expect(determineType(scores)).toBe('L')
  })

  test('全軸同点の場合、L を返す', () => {
    const scores: AxisScores = { L: 5, M: 5, F: 5 }
    expect(determineType(scores)).toBe('L')
  })

  test('F のみ最高の場合、F を返す', () => {
    const scores: AxisScores = { L: 2, M: 3, F: 9 }
    expect(determineType(scores)).toBe('F')
  })

  test('M と F が同点で L が低い場合、M を返す', () => {
    const scores: AxisScores = { L: 1, M: 7, F: 7 }
    expect(determineType(scores)).toBe('M')
  })
})

describe('calcDisplayScore', () => {
  test('全問0点で80を返す', () => {
    const answers = [0, 0, 0, 0, 0, 0, 0]
    expect(calcDisplayScore(answers)).toBe(80)
  })

  test('全問3点で100を返す', () => {
    const answers = [3, 3, 3, 3, 3, 3, 3]
    expect(calcDisplayScore(answers)).toBe(100)
  })

  test('常に80〜100の範囲に収まる', () => {
    const answers = [1, 2, 0, 3, 1, 2, 1]
    const score = calcDisplayScore(answers)
    expect(score).toBeGreaterThanOrEqual(80)
    expect(score).toBeLessThanOrEqual(100)
  })
})
