// components/diagnosis/ResultCard.tsx

import {
  DIAGNOSIS_TYPES,
  AXIS_LABELS,
  RISK_LEVEL_LABELS,
  RISK_LEVEL_WIDTHS,
} from '@/lib/diagnosis/types'
import type { DiagnosisAxis } from '@/lib/diagnosis/types'

const AXIS_COLORS: Record<DiagnosisAxis, string> = {
  L: 'linear-gradient(90deg, #1b5e20, #43a047)',
  M: 'linear-gradient(90deg, #006064, #26c6da)',
  F: 'linear-gradient(90deg, #e65100, #ff9800)',
}

type Props = {
  type: DiagnosisAxis
  displayScore: number
  consultationUrl: string
  lineUrl: string
}

export default function ResultCard({ type, displayScore, consultationUrl, lineUrl }: Props) {
  const def = DIAGNOSIS_TYPES[type]

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <span
          className="inline-block text-white text-xs font-bold px-3 py-1 rounded-full mb-2"
          style={{ background: '#1b5e20', letterSpacing: '1px' }}
        >
          {type} タイプ
        </span>
        <div className="text-3xl mb-1">{def.icon}</div>
        <h2 className="text-xl font-black" style={{ color: '#1b5e20' }}>
          {def.name}
        </h2>
      </div>

      <p className="text-sm leading-relaxed text-center" style={{ color: '#555' }}>
        {def.description}
      </p>

      <p className="text-xs font-bold text-center" style={{ color: '#2e7d32' }}>
        推奨：{def.recommendation}
      </p>

      <div className="flex flex-col gap-2">
        {(Object.keys(def.risks) as DiagnosisAxis[]).map((axis) => {
          const level = def.risks[axis]
          return (
            <div key={axis}>
              <div className="flex justify-between text-xs mb-1" style={{ color: '#666' }}>
                <span>{AXIS_LABELS[axis]}</span>
                <span style={{ color: '#1b5e20', fontWeight: 700 }}>{RISK_LEVEL_LABELS[level]}</span>
              </div>
              <div
                className="h-2 rounded-full w-full"
                style={{ background: 'rgba(27,94,32,0.1)' }}
              >
                <div
                  className="h-2 rounded-full transition-all duration-500"
                  style={{
                    width: RISK_LEVEL_WIDTHS[level],
                    background: AXIS_COLORS[axis],
                  }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="text-center py-2">
        <p className="text-xs mb-1" style={{ color: '#888' }}>適合スコア</p>
        <p className="text-4xl font-black" style={{ color: '#1b5e20' }}>
          {displayScore}
          <span className="text-base font-normal ml-1" style={{ color: '#888' }}>点</span>
        </p>
      </div>

      <a
        href={consultationUrl}
        className="btn-primary block w-full text-center py-4 text-sm"
      >
        無料相談を申し込む →
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost block w-full text-center py-3 text-sm"
      >
        LINEで結果を受け取る
      </a>
    </div>
  )
}
