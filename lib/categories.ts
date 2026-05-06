export type CategoryConfig = {
  slug: string
  name: string
  description: string
}

export const CATEGORIES: CategoryConfig[] = [
  {
    slug: 'insurance',
    name: '保険',
    description: '公務員の共済と民間保険の違い、見直しポイント、必要保障額の考え方を解説。',
  },
  {
    slug: 'investment',
    name: '資産形成',
    description: 'つみたてNISA・iDeCoの基礎から公務員向け活用法まで。老後に向けた資産づくりを解説。',
  },
  {
    slug: 'life-plan',
    name: 'ライフプラン',
    description: 'キャッシュフロー表の作り方、住宅・教育費・老後資金の同時設計ノウハウを紹介。',
  },
  {
    slug: 'tax',
    name: '節税・税金',
    description: 'ふるさと納税・確定申告・医療費控除など公務員が使える節税手法を徹底解説。',
  },
  {
    slug: 'money-basics',
    name: '公務員のお金基礎',
    description: '給与明細の読み方・共済組合の仕組み・手取り計算など、お金の基礎知識を解説。',
  },
]

export function getCategoryBySlug(slug: string): CategoryConfig | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategorySlug(name: string): string {
  return CATEGORIES.find((c) => c.name === name)?.slug ?? ''
}
