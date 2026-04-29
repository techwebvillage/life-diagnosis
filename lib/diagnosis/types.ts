// lib/diagnosis/types.ts

export type DiagnosisAxis = 'L' | 'M' | 'F'
export type RiskLevel = 'high' | 'medium' | 'low'

export type DiagnosisTypeContent = {
  icon: string
  name: string
  description: string
  recommendation: string
  risks: Record<DiagnosisAxis, RiskLevel>
}

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  high: '高',
  medium: '中',
  low: '低',
}

export const RISK_LEVEL_WIDTHS: Record<RiskLevel, string> = {
  high: '88%',
  medium: '55%',
  low: '28%',
}

export const AXIS_LABELS: Record<DiagnosisAxis, string> = {
  L: '家族への万が一リスク',
  M: '医療・収入減少リスク',
  F: '老後・資金不足リスク',
}

export const DIAGNOSIS_TYPES: Record<DiagnosisAxis, DiagnosisTypeContent> = {
  L: {
    icon: '🏠',
    name: '家族保障型',
    description:
      '大切な家族の生活を守ることが最優先。万が一に備えた死亡保障を中心に、家族の将来を支える保険設計が向いています。',
    recommendation: '定期死亡保険・収入保障保険',
    risks: { L: 'high', M: 'medium', F: 'low' },
  },
  M: {
    icon: '🏥',
    name: '医療・リスク備え型',
    description:
      '病気やケガへの不安が大きい。医療費の自己負担に備えた医療保険や、働けなくなったときの収入を守る就業不能保険が向いています。',
    recommendation: '医療保険・就業不能保険',
    risks: { L: 'low', M: 'high', F: 'medium' },
  },
  F: {
    icon: '🌱',
    name: '資産形成型',
    description:
      '老後への備えや資産形成を意識している。積立型保険や個人年金保険など、「貯蓄＋保障」を両立できる商品が向いています。',
    recommendation: '終身保険（積立型）・個人年金保険',
    risks: { L: 'low', M: 'medium', F: 'high' },
  },
}

export const DISPLAY_SCORE_BY_TYPE: Record<DiagnosisAxis, number> = {
  L: 90,
  M: 87,
  F: 85,
}
