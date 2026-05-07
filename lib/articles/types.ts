export type ArticleMeta = {
  slug: string
  category: string
  title: string
  description: string
}

export type Article = {
  frontmatter: ArticleMeta
  content: string
}
