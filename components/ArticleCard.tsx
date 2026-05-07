import Link from 'next/link'
import type { ArticleMeta } from '@/lib/articles'
import { getCategoryBySlug } from '@/lib/categories'

type Props = {
  article: ArticleMeta
}

export default function ArticleCard({ article }: Props) {
  const cat = getCategoryBySlug(article.category)

  return (
    <Link
      href={`/articles/${article.category}/${article.slug}`}
      className="block bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow border border-green-100"
    >
      <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
        {cat?.name ?? article.category}
      </span>
      <h2 className="mt-3 text-base font-bold text-gray-800 leading-snug line-clamp-2">
        {article.title}
      </h2>
      <p className="mt-2 text-sm text-gray-500 line-clamp-2">{article.description}</p>
    </Link>
  )
}
