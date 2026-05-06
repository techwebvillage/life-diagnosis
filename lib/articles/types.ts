export type ArticleMeta = {
  slug: string
  category: string
  title: string
  description: string
  tags: string[]
  publishedAt: string
}

export type Article = {
  frontmatter: ArticleMeta
  content: string
}
