import * as fs from 'fs'
import { getAllArticles, getArticleBySlug, getArticlesByCategory } from '@/lib/articles'

jest.mock('fs')
const mockFs = fs as jest.Mocked<typeof fs>

const SAMPLE_MDX = `共済と民間保険の違い
公務員が知るべき保険の基礎知識

本文テキスト`

const SAMPLE_MDX_2 = `つみたてNISAの始め方
公務員向けNISA活用ガイド

本文テキスト2`

beforeEach(() => {
  jest.resetAllMocks()
  mockFs.existsSync.mockReturnValue(true)
  mockFs.readdirSync.mockImplementation((p: any) => {
    const str = String(p)
    if (str.endsWith('/articles')) return ['insurance', 'investment'] as any
    if (str.endsWith('/insurance')) return ['kyosai-vs-private.mdx'] as any
    if (str.endsWith('/investment')) return ['nisa-basics.mdx'] as any
    return [] as any
  })
  mockFs.statSync.mockImplementation((p: any) => {
    const str = String(p)
    const isDir = str.endsWith('/insurance') || str.endsWith('/investment')
    return { isDirectory: () => isDir } as any
  })
  mockFs.readFileSync.mockImplementation((p: any) => {
    if (String(p).includes('insurance')) return SAMPLE_MDX as any
    return SAMPLE_MDX_2 as any
  })
})

describe('getAllArticles', () => {
  test('全カテゴリの記事を返す', async () => {
    const articles = await getAllArticles()
    expect(articles).toHaveLength(2)
  })

  test('各記事に必須フィールドが含まれる', async () => {
    const articles = await getAllArticles()
    const article = articles.find((a) => a.category === 'insurance')!
    expect(article.slug).toBe('kyosai-vs-private')
    expect(article.category).toBe('insurance')
    expect(article.title).toBe('共済と民間保険の違い')
    expect(article.description).toBe('公務員が知るべき保険の基礎知識')
  })
})

describe('getArticlesByCategory', () => {
  test('指定カテゴリの記事のみ返す', async () => {
    const articles = await getArticlesByCategory('insurance')
    expect(articles).toHaveLength(1)
    expect(articles[0].category).toBe('insurance')
  })
})

describe('getArticleBySlug', () => {
  test('カテゴリとスラッグで記事を返す', async () => {
    const article = await getArticleBySlug('insurance', 'kyosai-vs-private')
    expect(article).not.toBeNull()
    expect(article!.frontmatter.title).toBe('共済と民間保険の違い')
    expect(article!.content).toContain('本文テキスト')
  })

  test('存在しない記事で null を返す', async () => {
    mockFs.existsSync.mockReturnValue(false)
    const article = await getArticleBySlug('insurance', 'not-exist')
    expect(article).toBeNull()
  })
})
