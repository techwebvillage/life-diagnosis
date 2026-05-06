import { CATEGORIES, getCategoryBySlug, getCategorySlug } from '@/lib/categories'

describe('CATEGORIES', () => {
  test('5つのカテゴリが定義されている', () => {
    expect(CATEGORIES).toHaveLength(5)
  })

  test('各カテゴリが slug・name・description を持つ', () => {
    for (const cat of CATEGORIES) {
      expect(cat.slug).toBeTruthy()
      expect(cat.name).toBeTruthy()
      expect(cat.description).toBeTruthy()
    }
  })
})

describe('getCategoryBySlug', () => {
  test('insurance スラッグで保険カテゴリを返す', () => {
    const cat = getCategoryBySlug('insurance')
    expect(cat?.name).toBe('保険')
  })

  test('存在しないスラッグで undefined を返す', () => {
    expect(getCategoryBySlug('unknown')).toBeUndefined()
  })
})

describe('getCategorySlug', () => {
  test('保険名でinsuranceスラッグを返す', () => {
    expect(getCategorySlug('保険')).toBe('insurance')
  })

  test('存在しないカテゴリ名で空文字を返す', () => {
    expect(getCategorySlug('不明')).toBe('')
  })
})
