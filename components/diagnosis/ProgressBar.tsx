// components/diagnosis/ProgressBar.tsx

type Props = {
  current: number
  total: number
}

export default function ProgressBar({ current, total }: Props) {
  const percentage = Math.round((current / total) * 100)

  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1" style={{ color: 'rgba(255,255,255,0.7)' }}>
        <span>Q{current} / {total}</span>
        <span>{percentage}%</span>
      </div>
      <div
        className="w-full rounded-full h-1.5"
        style={{ background: 'rgba(255,255,255,0.25)' }}
      >
        <div
          className="h-1.5 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, background: 'rgba(255,255,255,0.9)' }}
        />
      </div>
    </div>
  )
}
