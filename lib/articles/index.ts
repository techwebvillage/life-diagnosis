import fs from 'fs'
import path from 'path'
import type { Article, ArticleMeta } from './types'

export type { Article, ArticleMeta }

const articlesDir = path.join(process.cwd(), 'content', 'articles')

function parseMdx(raw: string): { title: string; description: string; content: string } {
  const lines = raw.split('\n')
  const title = lines[0]?.trim() ?? ''
  const description = lines[2]?.trim() ?? ''
  const content = lines.slice(3).join('\n').trimStart()
  return { title, description, content }
}

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
      const { title, description } = parseMdx(raw)
      articles.push({ slug, category, title, description })
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
  const { title, description, content } = parseMdx(raw)

  return {
    frontmatter: { slug, category, title, description },
    content,
  }
}
