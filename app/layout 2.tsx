import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '保険ニーズ診断 | Life Village',
  description:
    '7問・約1分であなたに合った保険タイプがわかる無料診断。ライフステージ別に3タイプで判定し、プロへの無料相談へつなぎます。',
  openGraph: {
    title: '保険ニーズ診断 | Life Village',
    description: 'あなたに合った保険がわかる無料診断。7問・約1分で診断できます。',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          fontFamily: "'Zen Kaku Gothic New', sans-serif",
          background: 'linear-gradient(160deg, #e8f5e9 0%, #c8e6c9 50%, #dcedc8 100%)',
          minHeight: '100vh',
        }}
      >
        {children}
      </body>
    </html>
  )
}
