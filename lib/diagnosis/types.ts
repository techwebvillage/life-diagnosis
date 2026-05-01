// lib/diagnosis/types.ts

export type DiagnosisType = 'INSURANCE' | 'ASSET' | 'PENSION' | 'LIFEPLAN'

export type DiagnosisTypeContent = {
  icon: string
  name: string
  description: string
  recommendation: string
  points: string[]
}

export const DIAGNOSIS_TYPES: Record<DiagnosisType, DiagnosisTypeContent> = {
  INSURANCE: {
    icon: '🛡️',
    name: '保険見直し優先',
    description:
      '今の保障が共済と重複している可能性があります。公務員特有の制度を踏まえた上で、本当に必要な保障だけに最適化します。',
    recommendation: '生命保険・医療保険の見直し',
    points: [
      '共済との重複保障を確認',
      '掛け捨てコストを最適化',
      '公務員に必要な保障に絞る',
    ],
  },
  ASSET: {
    icon: '📈',
    name: '資産形成スタート',
    description:
      '公務員の安定収入はiDeCo・NISAを最大限活用するチャンスです。積立額のシミュレーションから口座開設のご案内まで丁寧にサポートします。',
    recommendation: 'つみたてNISA・iDeCoの活用',
    points: [
      '公務員向けiDeCoの活用方法',
      'つみたてNISAの最適な積立設定',
      '将来の資産額シミュレーション',
    ],
  },
  PENSION: {
    icon: '🏦',
    name: '退職金・共済活用',
    description:
      '退職後の収支をシミュレーションし、共済年金・退職金の最適な受け取り方を一緒に考えます。老後も安心できる資金計画を設計します。',
    recommendation: '退職金運用・年金受取プランの設計',
    points: [
      '退職金の最適な受け取り方',
      '共済年金との組み合わせ',
      '老後の月次収支シミュレーション',
    ],
  },
  LIFEPLAN: {
    icon: '🗺️',
    name: 'ライフプラン再設計',
    description:
      '住宅購入・教育費・老後資金など、ライフイベントを総合的に考えたキャッシュフロー計画が必要です。FPによるトータル相談をお勧めします。',
    recommendation: 'キャッシュフロー表作成・FP総合相談',
    points: [
      'ライフイベント別の資金計画',
      '住宅ローンと貯蓄のバランス',
      '教育費・老後資金の同時最適化',
    ],
  },
}

export const VALID_TYPES: DiagnosisType[] = ['INSURANCE', 'ASSET', 'PENSION', 'LIFEPLAN']
export const DEFAULT_TYPE: DiagnosisType = 'LIFEPLAN'
