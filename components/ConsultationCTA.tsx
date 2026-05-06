type Props = {
  title?: string
  description?: string
}

export default function ConsultationCTA({
  title = '無料でマネー相談を始める',
  description = '公務員専門のFPが、保険・資産形成・ライフプランをワンストップでサポートします。',
}: Props) {
  return (
    <div className="mt-10 bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
      <p className="text-sm font-bold text-green-800">{title}</p>
      <p className="mt-2 text-xs text-gray-600">{description}</p>
      <a
        href="https://life.tech-village.co.jp/#contact"
        className="mt-4 inline-block bg-green-600 hover:bg-green-700 text-white text-sm font-bold px-6 py-3 rounded-full transition-colors"
      >
        無料相談を申し込む →
      </a>
    </div>
  )
}
