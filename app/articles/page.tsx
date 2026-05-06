import type { Metadata } from 'next'
import Link from 'next/link'
import ArticleCard from '@/components/ArticleCard'
import { CATEGORIES } from '@/lib/categories'
import { getAllArticles } from '@/lib/articles'

export const metadata: Metadata = {
  title: 'マネー記事一覧 | Life Village',
  description: '公務員のお金に関する記事を、保険・資産形成・ライフプラン・節税・お金基礎の5カテゴリで配信。',
}

export default async function ArticlesPage() {
  const articles = await getAllArticles()

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800">マネー記事一覧</h1>
      <p className="mt-2 text-sm text-gray-500">
        公務員のお金に関する情報を5つのカテゴリでお届けします。
      </p>

      <div className="mt-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/articles/${cat.slug}`}
            className="text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 hover:bg-green-100 transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={`${article.category}-${article.slug}`} article={article} />
        ))}
      </div>
    </div>
  )
}
