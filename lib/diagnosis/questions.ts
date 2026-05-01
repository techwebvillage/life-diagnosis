// lib/diagnosis/questions.ts

export type SingleSelectQuestion = {
  id: number
  text: string
  type: 'single'
  options: string[]
}

export type MultiSelectQuestion = {
  id: number
  text: string
  type: 'multi'
  options: string[]
}

export type Question = SingleSelectQuestion | MultiSelectQuestion

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: 'あなたの職種を教えてください',
    type: 'single',
    options: ['教員', '地方公務員', '国家公務員', 'その他（公務員）'],
  },
  {
    id: 2,
    text: '年代を教えてください',
    type: 'single',
    options: ['20代', '30代', '40代', '50代'],
  },
  {
    id: 3,
    text: '家族構成を教えてください',
    type: 'single',
    options: ['独身', '既婚・子なし', '既婚・子あり'],
  },
  {
    id: 4,
    text: '今、気になっていることを選んでください（複数可）',
    type: 'multi',
    options: [
      '保険の見直し',
      '老後資金',
      '資産運用',
      '住宅購入',
      '退職金・共済の活用',
      '家計の見直し',
      '子どもの教育費',
    ],
  },
  {
    id: 5,
    text: 'お金の備えについて、今の状況を教えてください',
    type: 'single',
    options: ['何もしていない', '少し始めた', '見直したい'],
  },
]
