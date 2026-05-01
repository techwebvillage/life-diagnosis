// components/diagnosis/ResultCard.tsx

import { DIAGNOSIS_TYPES } from '@/lib/diagnosis/types'
import type { DiagnosisType } from '@/lib/diagnosis/types'

type Props = {
  type: DiagnosisType
  consultationUrl: string
  lineUrl: string
}

export default function ResultCard({ type, consultationUrl, lineUrl }: Props) {
  const def = DIAGNOSIS_TYPES[type]

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">{def.icon}</div>
        <h2 className="text-xl font-black" style={{ color: '#1b5e20' }}>
          {def.name}
        </h2>
      </div>

      <p className="text-sm leading-relaxed text-center" style={{ color: '#555' }}>
        {def.description}
      </p>

      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(27,94,32,0.06)' }}>
        <p className="text-xs font-bold mb-1" style={{ color: '#2e7d32' }}>
          おすすめの相談内容
        </p>
        <p className="text-sm font-black" style={{ color: '#1b5e20' }}>
          {def.recommendation}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {def.points.map((point) => (
          <div key={point} className="flex items-start gap-2 text-sm" style={{ color: '#444' }}>
            <span className="font-black flex-shrink-0" style={{ color: '#43a047' }}>
              ✓
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>

      <a
        href={`${consultationUrl}?type=${type}`}
        className="btn-primary block w-full text-center py-4 text-sm"
      >
        この結果をもとに無料相談する →
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
