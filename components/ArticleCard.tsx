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
      <div className="mt-3 flex flex-wrap gap-1">
        {article.tags.map((tag) => (
          <span key={tag} className="text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
      <p className="mt-3 text-xs text-gray-400">{article.publishedAt}</p>
    </Link>
  )
}
