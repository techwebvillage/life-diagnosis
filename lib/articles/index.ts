import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Article, ArticleMeta } from './types'

export type { Article, ArticleMeta }

const articlesDir = path.join(process.cwd(), 'content', 'articles')

export async function getAllArticles(): Promise<ArticleMeta[]> {
  if (!fs.existsSync(articlesDir)) return []

  const categoryDirs = fs
    .readdirSync(articlesDir)
    .filter((item) => fs.statSync(path.join(articlesDir, item)).isDirectory())

  const articles: ArticleMeta[] = []

  for (const category of categoryDirs) {
    const categoryPath = path.join(articlesDir, category)
    const files = fs.readdirSync(categoryPath).filter((f) => f.endsWith('.mdx'))

    for (const filename of files) {
      const slug = filename.replace(/\.mdx$/, '')
      const raw = fs.readFileSync(path.join(categoryPath, filename), 'utf-8')
      const { data } = matter(raw)

      articles.push({
        slug,
        category,
        title: data.title ?? '',
        description: data.description ?? '',
      })
    }
  }

  return articles
}

export async function getArticlesByCategory(categorySlug: string): Promise<ArticleMeta[]> {
  const all = await getAllArticles()
  return all.filter((a) => a.category === categorySlug)
}

export async function getArticleBySlug(
  category: string,
  slug: string
): Promise<Article | null> {
  const filePath = path.join(articlesDir, category, `${slug}.mdx`)
  if (!fs.existsSync(filePath)) return null

  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)

  return {
    frontmatter: {
      slug,
      category,
      title: data.title ?? '',
      description: data.description ?? '',
    },
    content,
  }
}
