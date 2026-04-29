// app/diagnosis/page.tsx

import Link from 'next/link'

export default function DiagnosisTopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: '#43a047', letterSpacing: '2.5px' }}
          >
            Life Village
          </p>
          <h1 className="text-2xl font-black leading-snug" style={{ color: '#1b5e20' }}>
            あなたに合った<br />
            保険がわかる<br />
            無料診断
          </h1>
        </div>

        <div className="glass-card px-6 py-8">
          <ul className="flex flex-col gap-3 mb-8">
            {[
              '7問・約1分で診断できます',
              'ライフステージ別に3タイプで診断',
              '結果に合わせた無料相談をご提案',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#444' }}>
                <span className="font-black mt-0.5 flex-shrink-0" style={{ color: '#2e7d32' }}>✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/diagnosis/quiz"
            className="btn-primary block w-full text-center py-4 text-base"
          >
            診断スタート →
          </Link>

          <p className="text-center text-xs mt-3" style={{ color: '#888' }}>
            完全無料・登録不要
          </p>
        </div>
      </div>
    </main>
  )
}
