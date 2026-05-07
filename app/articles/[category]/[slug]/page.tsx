import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import ArticleBody from '@/components/ArticleBody'
import ConsultationCTA from '@/components/ConsultationCTA'
import { getCategoryBySlug } from '@/lib/categories'
import { getAllArticles, getArticleBySlug } from '@/lib/articles'

type Props = {
  params: Promise<{ category: string; slug: string }>
}

export async function generateStaticParams() {
  const articles = await getAllArticles()
  return articles.map((a) => ({ category: a.category, slug: a.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params
  const article = await getArticleBySlug(category, slug)
  if (!article) return {}
  return {
    title: `${article.frontmatter.title} | Life Village`,
    description: article.frontmatter.description,
    openGraph: {
      title: article.frontmatter.title,
      description: article.frontmatter.description,
    },
  }
}

export default async function ArticlePage({ params }: Props) {
  const { category, slug } = await params
  const article = await getArticleBySlug(category, slug)
  if (!article) notFound()

  const cat = getCategoryBySlug(category)
  const { frontmatter, content } = article

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="mb-2 flex items-center gap-2 text-sm text-gray-500">
        <a href="/articles" className="hover:text-green-700">記事一覧</a>
        <span>›</span>
        <a href={`/articles/${category}`} className="hover:text-green-700">
          {cat?.name ?? category}
        </a>
      </div>

      <span className="text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-2 py-0.5">
        {cat?.name ?? category}
      </span>

      <h1 className="mt-3 text-xl font-bold text-gray-800 leading-snug">
        {frontmatter.title}
      </h1>

      <p className="mt-2 text-sm text-gray-500">{frontmatter.description}</p>

      <ArticleBody>
        <MDXRemote
          source={content}
          options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
          components={{ hr: () => null }}
        />
      </ArticleBody>

      <ConsultationCTA />
    </div>
  )
}
