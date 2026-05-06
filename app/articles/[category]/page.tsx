import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ArticleCard from '@/components/ArticleCard'
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories'
import { getArticlesByCategory } from '@/lib/articles'

type Props = {
  params: Promise<{ category: string }>
}

export async function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) return {}
  return {
    title: `${cat.name}の記事一覧 | Life Village`,
    description: cat.description,
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = getCategoryBySlug(category)
  if (!cat) notFound()

  const articles = await getArticlesByCategory(category)

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-2">
        <span className="text-xs font-medium text-green-700 border border-green-300 rounded-full px-3 py-1">
          カテゴリ
        </span>
      </div>
      <h1 className="mt-3 text-2xl font-bold text-gray-800">{cat.name}</h1>
      <p className="mt-2 text-sm text-gray-500">{cat.description}</p>
      <p className="mt-1 text-xs text-gray-400">{articles.length}件の記事</p>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articles.map((article) => (
          <ArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  )
}
