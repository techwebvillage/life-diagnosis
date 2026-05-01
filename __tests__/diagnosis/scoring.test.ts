// __tests__/diagnosis/scoring.test.ts

import { determineType } from '@/lib/diagnosis/scoring'

describe('determineType', () => {
  test('PENSION に対応する懸念が最多の場合 PENSION を返す', () => {
    const answers = [
      ['教員'],
      ['30代'],
      ['独身'],
      ['老後資金', '退職金・共済の活用'],
      ['何もしていない'],
    ]
    expect(determineType(answers)).toBe('PENSION')
  })

  test('INSURANCE だけ選択した場合 INSURANCE を返す', () => {
    const answers = [
      ['地方公務員'],
      ['20代'],
      ['独身'],
      ['保険の見直し'],
      ['何もしていない'],
    ]
    expect(determineType(answers)).toBe('INSURANCE')
  })

  test('ASSET だけ選択した場合 ASSET を返す', () => {
    const answers = [
      ['国家公務員'],
      ['30代'],
      ['独身'],
      ['資産運用'],
      ['少し始めた'],
    ]
    expect(determineType(answers)).toBe('ASSET')
  })

  test('LIFEPLAN 系が最多の場合 LIFEPLAN を返す', () => {
    const answers = [
      ['国家公務員'],
      ['40代'],
      ['既婚・子あり'],
      ['住宅購入', '家計の見直し', '子どもの教育費'],
      ['少し始めた'],
    ]
    expect(determineType(answers)).toBe('LIFEPLAN')
  })

  test('同点の場合は優先順位 PENSION > INSURANCE で PENSION を返す', () => {
    const answers = [
      ['教員'],
      ['30代'],
      ['既婚・子なし'],
      ['老後資金', '保険の見直し'],
      ['見直したい'],
    ]
    expect(determineType(answers)).toBe('PENSION')
  })

  test('同点の場合は優先順位 INSURANCE > ASSET で INSURANCE を返す', () => {
    const answers = [
      ['地方公務員'],
      ['20代'],
      ['独身'],
      ['保険の見直し', '資産運用'],
      ['何もしていない'],
    ]
    expect(determineType(answers)).toBe('INSURANCE')
  })

  test('Q4 が空の場合 LIFEPLAN を返す', () => {
    const answers = [['教員'], ['30代'], ['独身'], [], ['何もしていない']]
    expect(determineType(answers)).toBe('LIFEPLAN')
  })

  test('Q4 に未知の選択肢が含まれていても既知のものでタイプを判定する', () => {
    const answers = [
      ['地方公務員'],
      ['40代'],
      ['既婚・子あり'],
      ['老後資金', '未知の項目'],
      ['少し始めた'],
    ]
    expect(determineType(answers)).toBe('PENSION')
  })
})
