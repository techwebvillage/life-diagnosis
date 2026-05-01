# Life Village リニューアル実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** LifeVillageを生命保険診断から「公務員向け総合マネー相談窓口」へリニューアルする。診断アプリを5問・4タイプに再設計し、LP v2を8セクションで完成させる。

**Architecture:** 診断アプリ（Next.js）はセッションストレージ経由で診断結果を引き継ぎ、結果ページのCTAが相談予約URLへ型情報をクエリパラメータで渡す。LP（静的HTML）は診断アプリへのリンクを持つ独立した集客ページ。

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS（appディレクトリ）; 静的HTML/CSS（LP）; Jest（テスト）

---

## ファイル構成

| ファイル | 対応 |
|---------|------|
| `lib/diagnosis/types.ts` | 修正（3タイプ → 4タイプに置き換え） |
| `lib/diagnosis/questions.ts` | 修正（7問Likert → 5問カテゴリ選択に置き換え） |
| `lib/diagnosis/scoring.ts` | 修正（軸スコア集計 → カテゴリ型判定に置き換え） |
| `__tests__/diagnosis/scoring.test.ts` | 修正（新ロジックに対応したテストに置き換え） |
| `components/diagnosis/QuizCard.tsx` | 修正（単一選択・複数選択の両対応） |
| `app/diagnosis/quiz/page.tsx` | 修正（状態管理を `string[][]` に変更） |
| `app/diagnosis/page.tsx` | 修正（コピーを総合マネー診断に更新） |
| `app/diagnosis/preview/page.tsx` | 修正（DiagnosisAxis → DiagnosisType） |
| `app/diagnosis/result/page.tsx` | 修正（新タイプのバリデーション） |
| `components/diagnosis/ResultCard.tsx` | 修正（4タイプ対応、displayScore削除） |
| `lp/v2/index.html` | 修正（8セクション全実装） |
| `lp/v2/style.css` | 修正（セクション固有スタイルを追記） |
| `TechVillage/businesses/life_village.md` | 修正（事業概要を更新） |

---

## Task 1: 型定義の置き換え（lib/diagnosis/types.ts）

**Files:**
- Modify: `lib/diagnosis/types.ts`

- [ ] **Step 1: types.ts を新4タイプ定義に完全置き換え**

```typescript
// lib/diagnosis/types.ts

export type DiagnosisType = 'INSURANCE' | 'ASSET' | 'PENSION' | 'LIFEPLAN'

export type DiagnosisTypeContent = {
  icon: string
  name: string
  description: string
  recommendation: string
  points: string[]
}

export const DIAGNOSIS_TYPES: Record<DiagnosisType, DiagnosisTypeContent> = {
  INSURANCE: {
    icon: '🛡️',
    name: '保険見直し優先',
    description:
      '今の保障が共済と重複している可能性があります。公務員特有の制度を踏まえた上で、本当に必要な保障だけに最適化します。',
    recommendation: '生命保険・医療保険の見直し',
    points: [
      '共済との重複保障を確認',
      '掛け捨てコストを最適化',
      '公務員に必要な保障に絞る',
    ],
  },
  ASSET: {
    icon: '📈',
    name: '資産形成スタート',
    description:
      '公務員の安定収入はiDeCo・NISAを最大限活用するチャンスです。積立額のシミュレーションから口座開設のご案内まで丁寧にサポートします。',
    recommendation: 'つみたてNISA・iDeCoの活用',
    points: [
      '公務員向けiDeCoの活用方法',
      'つみたてNISAの最適な積立設定',
      '将来の資産額シミュレーション',
    ],
  },
  PENSION: {
    icon: '🏦',
    name: '退職金・共済活用',
    description:
      '退職後の収支をシミュレーションし、共済年金・退職金の最適な受け取り方を一緒に考えます。老後も安心できる資金計画を設計します。',
    recommendation: '退職金運用・年金受取プランの設計',
    points: [
      '退職金の最適な受け取り方',
      '共済年金との組み合わせ',
      '老後の月次収支シミュレーション',
    ],
  },
  LIFEPLAN: {
    icon: '🗺️',
    name: 'ライフプラン再設計',
    description:
      '住宅購入・教育費・老後資金など、ライフイベントを総合的に考えたキャッシュフロー計画が必要です。FPによるトータル相談をお勧めします。',
    recommendation: 'キャッシュフロー表作成・FP総合相談',
    points: [
      'ライフイベント別の資金計画',
      '住宅ローンと貯蓄のバランス',
      '教育費・老後資金の同時最適化',
    ],
  },
}

export const VALID_TYPES: DiagnosisType[] = ['INSURANCE', 'ASSET', 'PENSION', 'LIFEPLAN']
export const DEFAULT_TYPE: DiagnosisType = 'LIFEPLAN'
```

- [ ] **Step 2: コミット**

```bash
cd /Users/nozaki/Desktop/CEO/TechVillage/life-village
git add lib/diagnosis/types.ts
git commit -m "refactor: replace 3-type insurance system with 4-type money consultation types"
```

---

## Task 2: 質問データの置き換え（lib/diagnosis/questions.ts）

**Files:**
- Modify: `lib/diagnosis/questions.ts`

- [ ] **Step 1: questions.ts を5問カテゴリ選択形式に完全置き換え**

```typescript
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
```

- [ ] **Step 2: コミット**

```bash
git add lib/diagnosis/questions.ts
git commit -m "refactor: replace 7 likert questions with 5 categorical questions for public servants"
```

---

## Task 3: タイプ判定ロジックとテストの置き換え

**Files:**
- Modify: `lib/diagnosis/scoring.ts`
- Modify: `__tests__/diagnosis/scoring.test.ts`

- [ ] **Step 1: scoring.ts を新ロジックに完全置き換え**

Q4（index 3）の複数選択をタイプにマッピングして最多タイプを返す。同点時は `PENSION > INSURANCE > ASSET > LIFEPLAN` の優先順位。

```typescript
// lib/diagnosis/scoring.ts

import type { DiagnosisType } from './types'

const CONCERN_TO_TYPE: Record<string, DiagnosisType> = {
  '保険の見直し': 'INSURANCE',
  '老後資金': 'PENSION',
  '資産運用': 'ASSET',
  '住宅購入': 'LIFEPLAN',
  '退職金・共済の活用': 'PENSION',
  '家計の見直し': 'LIFEPLAN',
  '子どもの教育費': 'LIFEPLAN',
}

const TYPE_PRIORITY: DiagnosisType[] = ['PENSION', 'INSURANCE', 'ASSET', 'LIFEPLAN']

const CONCERN_QUESTION_INDEX = 3

export function determineType(answers: string[][]): DiagnosisType {
  const concerns = answers[CONCERN_QUESTION_INDEX] ?? []
  const counts: Record<DiagnosisType, number> = {
    INSURANCE: 0,
    ASSET: 0,
    PENSION: 0,
    LIFEPLAN: 0,
  }
  for (const concern of concerns) {
    const t = CONCERN_TO_TYPE[concern]
    if (t) counts[t]++
  }
  const maxCount = Math.max(...Object.values(counts))
  if (maxCount === 0) return 'LIFEPLAN'
  return TYPE_PRIORITY.find((t) => counts[t] === maxCount) ?? 'LIFEPLAN'
}
```

- [ ] **Step 2: テストを実行して失敗を確認**

```bash
npm test -- --testPathPattern=scoring
```

Expected: FAIL（テストが旧関数 `calcAxisScores`/`calcDisplayScore` をimportしているが、新しいscoring.tsにはそれらが存在しないため）

- [ ] **Step 3: scoring.test.ts を新ロジックに完全置き換え**

```typescript
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
```

- [ ] **Step 4: テストを実行して全件パスを確認**

```bash
npm test -- --testPathPattern=scoring
```

Expected: PASS（8件）

- [ ] **Step 5: コミット**

```bash
git add lib/diagnosis/scoring.ts __tests__/diagnosis/scoring.test.ts
git commit -m "refactor: replace axis scoring with categorical type determination for 4-type system"
```

---

## Task 4: QuizCardコンポーネントの改修

**Files:**
- Modify: `components/diagnosis/QuizCard.tsx`

単一選択（クリックで即次へ）と複数選択（チェック後「次へ」ボタン）の両対応。`key={currentIndex}` をQuizPage側で設定することで、問題が変わるたびに内部stateをリセットする。

- [ ] **Step 1: QuizCard.tsx を書き換え**

```typescript
// components/diagnosis/QuizCard.tsx
'use client'

import { useState } from 'react'
import type { Question } from '@/lib/diagnosis/questions'

type Props = {
  question: Question
  onAnswer: (answer: string[]) => void
}

export default function QuizCard({ question, onAnswer }: Props) {
  const [selected, setSelected] = useState<string[]>([])

  function toggleMulti(option: string) {
    setSelected((prev) =>
      prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
    )
  }

  if (question.type === 'single') {
    return (
      <div>
        <p
          className="text-xs font-bold mb-2 tracking-widest uppercase"
          style={{ color: '#43a047', letterSpacing: '1.5px' }}
        >
          QUESTION {question.id} / 5
        </p>
        <p className="text-sm font-bold mb-5 leading-relaxed" style={{ color: '#1b5e20' }}>
          {question.text}
        </p>
        <div className="flex flex-col gap-2">
          {question.options.map((option) => (
            <button
              key={option}
              onClick={() => onAnswer([option])}
              className="w-full text-left px-4 py-3 rounded-xl text-sm text-gray-700 transition-all active:scale-98"
              style={{
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(27,94,32,0.15)',
              }}
            >
              {option}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <p
        className="text-xs font-bold mb-2 tracking-widest uppercase"
        style={{ color: '#43a047', letterSpacing: '1.5px' }}
      >
        QUESTION {question.id} / 5
      </p>
      <p className="text-sm font-bold mb-1 leading-relaxed" style={{ color: '#1b5e20' }}>
        {question.text}
      </p>
      <p className="text-xs mb-4" style={{ color: '#888' }}>
        複数選択できます
      </p>
      <div className="flex flex-col gap-2 mb-4">
        {question.options.map((option) => {
          const isSelected = selected.includes(option)
          return (
            <button
              key={option}
              onClick={() => toggleMulti(option)}
              className="w-full text-left px-4 py-3 rounded-xl text-sm transition-all"
              style={{
                background: isSelected ? 'rgba(27,94,32,0.12)' : 'rgba(255,255,255,0.7)',
                border: isSelected
                  ? '1.5px solid rgba(27,94,32,0.5)'
                  : '1px solid rgba(27,94,32,0.15)',
                color: isSelected ? '#1b5e20' : '#555',
                fontWeight: isSelected ? 700 : 400,
              }}
            >
              {isSelected ? '✓ ' : ''}
              {option}
            </button>
          )
        })}
      </div>
      <button
        onClick={() => {
          if (selected.length > 0) onAnswer(selected)
        }}
        disabled={selected.length === 0}
        className="w-full py-3 rounded-xl text-sm font-black transition-all"
        style={{
          background:
            selected.length > 0
              ? 'linear-gradient(135deg, #1b5e20, #2e7d32)'
              : 'rgba(27,94,32,0.2)',
          color: selected.length > 0 ? '#fff' : '#888',
          cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
        }}
      >
        次へ →
      </button>
    </div>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add components/diagnosis/QuizCard.tsx
git commit -m "feat: support single-select and multi-select questions in QuizCard"
```

---

## Task 5: Quizページの改修（状態管理の変更）

**Files:**
- Modify: `app/diagnosis/quiz/page.tsx`

`answers: number[]` → `answers: string[][]` に変更。`key={currentIndex}` を QuizCard に渡して問題切り替え時に内部stateをリセット。

- [ ] **Step 1: quiz/page.tsx を書き換え**

```typescript
// app/diagnosis/quiz/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { QUESTIONS } from '@/lib/diagnosis/questions'
import { determineType } from '@/lib/diagnosis/scoring'
import ProgressBar from '@/components/diagnosis/ProgressBar'
import QuizCard from '@/components/diagnosis/QuizCard'

const STORAGE_KEY = 'lv_quiz_result'

export default function QuizPage() {
  const router = useRouter()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<string[][]>([])

  function handleAnswer(answer: string[]) {
    const newAnswers = [...answers, answer]

    if (newAnswers.length === QUESTIONS.length) {
      setAnswers(newAnswers)
      try {
        const type = determineType(newAnswers)
        try {
          sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ type }))
        } catch {
          // プライベートブラウジング時は無視
        }
      } catch {
        // エラー時もデフォルト結果として /preview へ遷移
      }
      router.push('/diagnosis/preview')
    } else {
      setAnswers(newAnswers)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  const question = QUESTIONS[currentIndex]

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div
          className="rounded-t-2xl px-6 py-4"
          style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)' }}
        >
          <ProgressBar current={currentIndex + 1} total={QUESTIONS.length} />
        </div>

        <div
          className="rounded-b-2xl px-6 py-8 shadow-sm"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.8)',
            borderTop: 'none',
            backdropFilter: 'blur(14px)',
          }}
        >
          <QuizCard key={currentIndex} question={question} onAnswer={handleAnswer} />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: コミット**

```bash
git add app/diagnosis/quiz/page.tsx
git commit -m "refactor: update QuizPage state management to string[][] for categorical answers"
```

---

## Task 6: Start / Preview / Result ページと ResultCard の更新

**Files:**
- Modify: `app/diagnosis/page.tsx`
- Modify: `app/diagnosis/preview/page.tsx`
- Modify: `app/diagnosis/result/page.tsx`
- Modify: `components/diagnosis/ResultCard.tsx`

- [ ] **Step 1: app/diagnosis/page.tsx のコピーを総合マネー診断に更新**

```typescript
// app/diagnosis/page.tsx

import Link from 'next/link'

export default function DiagnosisTopPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <p
            className="text-xs font-bold tracking-widest uppercase mb-3"
            style={{ color: '#43a047', letterSpacing: '2.5px' }}
          >
            Life Village
          </p>
          <h1 className="text-2xl font-black leading-snug" style={{ color: '#1b5e20' }}>
            公務員のお金、<br />
            何から相談すべき？<br />
            5問でわかる無料診断
          </h1>
        </div>

        <div className="glass-card px-6 py-8">
          <ul className="flex flex-col gap-3 mb-8">
            {[
              '5問・約1分で診断できます',
              '保険・資産形成・退職金・ライフプランを診断',
              '結果に合わせた専門家への無料相談をご提案',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm" style={{ color: '#444' }}>
                <span className="font-black mt-0.5 flex-shrink-0" style={{ color: '#2e7d32' }}>
                  ✓
                </span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/diagnosis/quiz"
            className="btn-primary block w-full text-center py-4 text-base"
          >
            診断スタート →
          </Link>

          <p className="text-center text-xs mt-3" style={{ color: '#888' }}>
            完全無料・登録不要
          </p>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: app/diagnosis/preview/page.tsx を DiagnosisType 対応に更新**

```typescript
// app/diagnosis/preview/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { DiagnosisType } from '@/lib/diagnosis/types'
import { DEFAULT_TYPE } from '@/lib/diagnosis/types'

const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XXXXXXX'
const STORAGE_KEY = 'lv_quiz_result'

type QuizResult = {
  type: DiagnosisType
}

export default function PreviewPage() {
  const router = useRouter()
  const [result, setResult] = useState<QuizResult | null>(null)

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed: unknown = JSON.parse(raw)
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        typeof (parsed as QuizResult).type === 'string'
      ) {
        setResult({ type: (parsed as QuizResult).type })
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  function handleViewResult() {
    const type = result?.type ?? DEFAULT_TYPE
    router.push(`/diagnosis/result?type=${type}`)
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div
          className="rounded-t-2xl px-6 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: 'white' }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ opacity: 0.7 }}>
            Life Village
          </p>
          <h2 className="text-lg font-black">診断が完了しました</h2>
        </div>

        <div
          className="rounded-b-2xl px-6 py-8 shadow-sm"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.8)',
            borderTop: 'none',
            backdropFilter: 'blur(14px)',
          }}
        >
          {result === null ? (
            <div className="text-center py-8 text-sm" style={{ color: '#888' }}>
              読み込み中...
            </div>
          ) : (
            <>
              <div className="mb-6">
                <p className="text-sm text-center font-bold mb-3" style={{ color: '#1b5e20' }}>
                  LINEで詳細な診断結果を受け取る
                </p>
                <a
                  href={LINE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 rounded-xl font-bold text-sm text-white transition-opacity hover:opacity-90"
                  style={{ background: '#06c755' }}
                >
                  LINEで結果を受け取る →
                </a>
                <p className="text-xs text-center mt-2" style={{ color: '#888' }}>
                  ※ 無料・迷惑メールなし
                </p>
              </div>

              <div className="border-t my-4" style={{ borderColor: 'rgba(27,94,32,0.12)' }} />

              <button onClick={handleViewResult} className="btn-primary w-full py-4 text-sm">
                診断結果を見る →
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 3: app/diagnosis/result/page.tsx を新タイプのバリデーションに更新**

```typescript
// app/diagnosis/result/page.tsx

import type { DiagnosisType } from '@/lib/diagnosis/types'
import { VALID_TYPES, DEFAULT_TYPE } from '@/lib/diagnosis/types'
import ResultCard from '@/components/diagnosis/ResultCard'

const CONSULTATION_URL =
  process.env.NEXT_PUBLIC_CONSULTATION_URL ?? 'https://life.tech-village.co.jp/contact/'
const LINE_URL = process.env.NEXT_PUBLIC_LINE_URL ?? 'https://lin.ee/XXXXXXX'

type Props = {
  searchParams: Promise<{ type?: string }>
}

export default async function ResultPage({ searchParams }: Props) {
  const params = await searchParams
  const rawType = params.type?.toUpperCase()
  const type: DiagnosisType =
    rawType && (VALID_TYPES as string[]).includes(rawType)
      ? (rawType as DiagnosisType)
      : DEFAULT_TYPE

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div
          className="rounded-t-2xl px-6 py-5 text-center"
          style={{ background: 'linear-gradient(135deg, #1b5e20, #2e7d32)', color: 'white' }}
        >
          <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ opacity: 0.7 }}>
            Life Village
          </p>
          <h1 className="text-lg font-black">診断結果</h1>
        </div>

        <div
          className="rounded-b-2xl px-6 py-8 shadow-sm"
          style={{
            background: 'rgba(255,255,255,0.6)',
            border: '1px solid rgba(255,255,255,0.8)',
            borderTop: 'none',
            backdropFilter: 'blur(14px)',
          }}
        >
          <ResultCard type={type} consultationUrl={CONSULTATION_URL} lineUrl={LINE_URL} />
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 4: components/diagnosis/ResultCard.tsx を4タイプ対応に書き換え**

`displayScore` は廃止。推奨内容と3つのポイントを表示。CTAのURLに `?type=TYPE` を付与。

```typescript
// components/diagnosis/ResultCard.tsx

import { DIAGNOSIS_TYPES } from '@/lib/diagnosis/types'
import type { DiagnosisType } from '@/lib/diagnosis/types'

type Props = {
  type: DiagnosisType
  consultationUrl: string
  lineUrl: string
}

export default function ResultCard({ type, consultationUrl, lineUrl }: Props) {
  const def = DIAGNOSIS_TYPES[type]

  return (
    <div className="flex flex-col gap-4">
      <div className="text-center">
        <div className="text-4xl mb-2">{def.icon}</div>
        <h2 className="text-xl font-black" style={{ color: '#1b5e20' }}>
          {def.name}
        </h2>
      </div>

      <p className="text-sm leading-relaxed text-center" style={{ color: '#555' }}>
        {def.description}
      </p>

      <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(27,94,32,0.06)' }}>
        <p className="text-xs font-bold mb-1" style={{ color: '#2e7d32' }}>
          おすすめの相談内容
        </p>
        <p className="text-sm font-black" style={{ color: '#1b5e20' }}>
          {def.recommendation}
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {def.points.map((point) => (
          <div key={point} className="flex items-start gap-2 text-sm" style={{ color: '#444' }}>
            <span className="font-black flex-shrink-0" style={{ color: '#43a047' }}>
              ✓
            </span>
            <span>{point}</span>
          </div>
        ))}
      </div>

      <a
        href={`${consultationUrl}?type=${type}`}
        className="btn-primary block w-full text-center py-4 text-sm"
      >
        この結果をもとに無料相談する →
      </a>
      <a
        href={lineUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="btn-ghost block w-full text-center py-3 text-sm"
      >
        LINEで結果を受け取る
      </a>
    </div>
  )
}
```

- [ ] **Step 5: 全テストを実行してパスを確認**

```bash
npm test
```

Expected: PASS（scoring.test.ts 8件）

- [ ] **Step 6: 開発サーバーで動作確認**

```bash
npm run dev
```

ブラウザで `http://localhost:3000/diagnosis` を開き、5問を回答して結果が4タイプのいずれかで表示されることを確認。

- [ ] **Step 7: コミット**

```bash
git add app/diagnosis/page.tsx app/diagnosis/preview/page.tsx app/diagnosis/result/page.tsx components/diagnosis/ResultCard.tsx
git commit -m "feat: update all diagnosis pages and ResultCard for 4-type money consultation system"
```

---

## Task 7: LP v2 の実装（8セクション）

**Files:**
- Modify: `lp/v2/index.html`
- Modify: `lp/v2/style.css`

- [ ] **Step 1: style.css にセクション固有スタイルを追記**

既存の `style.css`（125行）の末尾に以下を追加する。

```css
/* ── レイアウト共通 ── */
.inner {
  max-width: 680px;
  margin: 0 auto;
  position: relative;
}
.text-center { text-align: center; }

/* ── ヒーロー ── */
.hero {
  background: linear-gradient(160deg, var(--green-softest) 0%, #dcedc8 60%, var(--green-pale) 100%);
  padding-top: 80px;
  padding-bottom: 80px;
}
.hero-title {
  font-size: 36px;
  font-weight: 900;
  color: var(--green-deep);
  line-height: 1.3;
  margin-bottom: 16px;
}
.hero-sub {
  font-size: 14px;
  color: var(--text-sub);
  line-height: 1.9;
  margin-bottom: 36px;
}
.hero-cta {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
.cta-note {
  font-size: 11px;
  color: var(--text-muted);
}

/* ── 課題提起 ── */
.worries-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}
.worry-card {
  padding: 16px;
  font-size: 13px;
  line-height: 1.7;
  color: var(--text-sub);
}
.worry-icon {
  display: block;
  font-size: 24px;
  margin-bottom: 8px;
}
.worries-lead {
  font-size: 15px;
  color: var(--text-sub);
  text-align: center;
  line-height: 1.8;
}
.worries-lead strong {
  color: var(--green-deep);
  font-weight: 900;
}

/* ── サービス概要 ── */
.services-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.service-card {
  padding: 20px 16px;
}
.service-icon {
  display: block;
  font-size: 28px;
  margin-bottom: 10px;
}
.service-card h3 {
  font-size: 14px;
  font-weight: 900;
  color: var(--green-deep);
  margin-bottom: 8px;
}
.service-card p {
  font-size: 12px;
  color: var(--text-sub);
  line-height: 1.7;
}

/* ── 公務員特化の理由 ── */
.reasons-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.reason-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}
.reason-num {
  font-size: 28px;
  font-weight: 900;
  color: var(--green-pale);
  line-height: 1;
  flex-shrink: 0;
  min-width: 48px;
}
.reason-item h3 {
  font-size: 15px;
  font-weight: 900;
  color: var(--green-deep);
  margin-bottom: 6px;
}
.reason-item p {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.8;
}

/* ── 診断CTA（中間） ── */
.diagnosis-cta-section {
  background: linear-gradient(135deg, var(--green-deep) 0%, var(--green-forest) 100%);
}
.diagnosis-cta-section .sec-label,
.diagnosis-cta-section .sec-title,
.diagnosis-cta-section .sec-desc {
  color: rgba(255,255,255,0.9);
}
.diagnosis-cta-section .sec-line {
  background: linear-gradient(90deg, rgba(255,255,255,0.5), rgba(255,255,255,0.2));
}
.diagnosis-cta-section .btn-primary {
  background: #fff;
  color: var(--green-deep);
  box-shadow: 0 8px 28px rgba(0,0,0,0.15);
}

/* ── 相談の流れ ── */
.flow-steps {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}
.flow-step {
  background: var(--glass-bg);
  backdrop-filter: var(--glass-blur);
  -webkit-backdrop-filter: var(--glass-blur);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-card);
  padding: 24px 20px;
  width: 100%;
  max-width: 480px;
}
.flow-num {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--green-deep), var(--green-forest));
  color: #fff;
  font-size: 18px;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}
.flow-step h3 {
  font-size: 15px;
  font-weight: 900;
  color: var(--green-deep);
  margin-bottom: 6px;
}
.flow-step p {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.8;
}
.flow-arrow {
  font-size: 24px;
  color: var(--green-vivid);
  padding: 8px 0;
}

/* ── FAQ ── */
.faq-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.faq-item {
  padding: 16px 20px;
}
.faq-item summary {
  font-size: 14px;
  font-weight: 700;
  color: var(--green-deep);
  cursor: pointer;
  list-style: none;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.faq-item summary::after {
  content: '+';
  font-size: 20px;
  color: var(--green-vivid);
  flex-shrink: 0;
}
.faq-item[open] summary::after {
  content: '−';
}
.faq-item p {
  font-size: 13px;
  color: var(--text-sub);
  line-height: 1.9;
  margin-top: 12px;
  border-top: 1px solid rgba(27,94,32,0.1);
  padding-top: 12px;
}

/* ── 最終CTA ── */
.final-cta-section {
  background: linear-gradient(135deg, var(--green-deep) 0%, #1a4a1e 100%);
  padding: 80px 24px;
}
.final-cta-title {
  font-size: 30px;
  font-weight: 900;
  color: #fff;
  line-height: 1.4;
  margin-bottom: 12px;
  text-align: center;
}
.final-cta-sub {
  font-size: 13px;
  color: rgba(255,255,255,0.7);
  margin-bottom: 32px;
  text-align: center;
}
.btn-large {
  padding: 18px 40px;
  font-size: 16px;
}
.final-cta-section .btn-primary {
  background: #fff;
  color: var(--green-deep);
  box-shadow: 0 8px 28px rgba(0,0,0,0.2);
}

/* ── レスポンシブ ── */
@media (max-width: 480px) {
  .hero-title { font-size: 28px; }
  .worries-grid { grid-template-columns: 1fr; }
  .services-grid { grid-template-columns: 1fr; }
  .final-cta-title { font-size: 24px; }
}
```

- [ ] **Step 2: lp/v2/index.html を8セクション全実装に書き換え**

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Life Village | 公務員の無料マネー相談窓口</title>
  <meta name="description" content="保険・NISA・退職金・ライフプランを、公務員専門の相談窓口がトータルサポート。完全無料・登録不要。">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Zen+Kaku+Gothic+New:wght@400;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="style.css">
</head>
<body>

  <!-- ① ヒーロー -->
  <section class="hero section">
    <div class="deco-circle" style="width:320px;height:320px;top:-80px;right:-100px;background:rgba(67,160,71,0.1)"></div>
    <div class="deco-circle" style="width:200px;height:200px;bottom:-60px;left:-60px;background:rgba(27,94,32,0.08)"></div>
    <div class="inner text-center">
      <span class="sec-label">Life Village</span>
      <h1 class="hero-title">公務員のお金、<br>まるごと相談。</h1>
      <p class="hero-sub">保険・NISA・退職金・ライフプランを<br>公務員専門の相談窓口がトータルサポート</p>
      <div class="hero-cta">
        <a href="https://life.tech-village.co.jp/diagnosis" class="btn-primary">
          今すぐ無料診断する →
        </a>
        <p class="cta-note">完全無料・登録不要・約1分</p>
      </div>
    </div>
  </section>

  <!-- ② 課題提起 -->
  <section class="section section--green">
    <div class="inner">
      <span class="sec-label">こんな悩みはありませんか？</span>
      <h2 class="sec-title">公務員ならではの<br>お金の悩み</h2>
      <div class="sec-line"></div>
      <div class="worries-grid">
        <div class="worry-card glass-card">
          <span class="worry-icon">😟</span>
          <p>「共済があるから大丈夫」と思っていたけど、保障が手薄だった</p>
        </div>
        <div class="worry-card glass-card">
          <span class="worry-icon">🤔</span>
          <p>NISAやiDeCoを始めたいけど、何から手をつければいいかわからない</p>
        </div>
        <div class="worry-card glass-card">
          <span class="worry-icon">😰</span>
          <p>退職金の受け取り方で税金が変わると聞いたけど、詳しくない</p>
        </div>
        <div class="worry-card glass-card">
          <span class="worry-icon">😣</span>
          <p>マイホームを買いたいが、教育費や老後資金との両立が不安</p>
        </div>
      </div>
      <p class="worries-lead">そのお悩み、<strong>Life Villageにまとめてご相談ください。</strong></p>
    </div>
  </section>

  <!-- ③ サービス概要 -->
  <section class="section">
    <div class="inner">
      <span class="sec-label">Services</span>
      <h2 class="sec-title">4つの領域を<br>ワンストップでサポート</h2>
      <div class="sec-line"></div>
      <p class="sec-desc">保険・資産形成・退職金・ライフプランを、<br>公務員専門の相談窓口がまとめて対応します。</p>
      <div class="services-grid">
        <div class="service-card glass-card">
          <span class="service-icon">🛡️</span>
          <h3>保険の見直し</h3>
          <p>共済との重複を確認し、本当に必要な保障だけに最適化。生命・医療・がん保険をトータル提案。</p>
        </div>
        <div class="service-card glass-card">
          <span class="service-icon">📈</span>
          <h3>資産形成・NISA/iDeCo</h3>
          <p>公務員向けiDeCoの活用法からつみたてNISAの設定まで、効率的な資産形成をサポート。</p>
        </div>
        <div class="service-card glass-card">
          <span class="service-icon">🏦</span>
          <h3>退職金・共済の活用</h3>
          <p>退職金の最適な受け取り方・共済年金との組み合わせで、老後も安心できる資金計画を設計。</p>
        </div>
        <div class="service-card glass-card">
          <span class="service-icon">🗺️</span>
          <h3>ライフプランニング</h3>
          <p>住宅購入・教育費・老後資金を総合的に考えたキャッシュフロー計画を一緒に作ります。</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ④ 公務員特化の理由 -->
  <section class="section section--green">
    <div class="inner">
      <span class="sec-label">Why Life Village</span>
      <h2 class="sec-title">一般のFP相談と<br>何が違うのか</h2>
      <div class="sec-line"></div>
      <div class="reasons-list">
        <div class="reason-item">
          <span class="reason-num">01</span>
          <div>
            <h3>共済制度を熟知した提案</h3>
            <p>一般の相談窓口では見落としがちな共済の保障内容を把握した上で、重複なく最適な設計をご提案します。</p>
          </div>
        </div>
        <div class="reason-item">
          <span class="reason-num">02</span>
          <div>
            <h3>公務員向け制度に精通</h3>
            <p>iDeCoの活用法、公務員向け住宅ローン優遇など、公務員特有の制度知識を持つ専門家が対応します。</p>
          </div>
        </div>
        <div class="reason-item">
          <span class="reason-num">03</span>
          <div>
            <h3>職種・年代・家族構成に合わせた個別相談</h3>
            <p>教員・地方公務員・国家公務員など職種によって制度が異なります。あなたの状況に最適なプランをご提案します。</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- ⑤ 診断への誘導（中間CTA） -->
  <section class="section diagnosis-cta-section">
    <div class="deco-circle" style="width:300px;height:300px;top:-80px;right:-80px;background:rgba(255,255,255,0.05)"></div>
    <div class="inner text-center">
      <span class="sec-label">Free Diagnosis</span>
      <h2 class="sec-title">まず、あなたに合った<br>相談領域を診断しよう</h2>
      <div class="sec-line"></div>
      <p class="sec-desc">5問に答えるだけで、今のあなたに必要な<br>お金の相談領域がわかります。</p>
      <a href="https://life.tech-village.co.jp/diagnosis" class="btn-primary">
        無料診断を始める →
      </a>
      <p class="cta-note" style="margin-top:12px;color:rgba(255,255,255,0.6);">完全無料・登録不要・約1分</p>
    </div>
  </section>

  <!-- ⑥ 相談の流れ -->
  <section class="section">
    <div class="inner">
      <span class="sec-label">Flow</span>
      <h2 class="sec-title">相談の流れ</h2>
      <div class="sec-line"></div>
      <div class="flow-steps">
        <div class="flow-step">
          <div class="flow-num">1</div>
          <h3>5問の無料診断（約1分）</h3>
          <p>職種・年代・家族構成と気になることを選ぶだけ。難しい知識は不要です。</p>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-num">2</div>
          <h3>診断結果で相談領域が決まる</h3>
          <p>保険・資産形成・退職金・ライフプランの中から、今の優先度が高い領域をご提示します。</p>
        </div>
        <div class="flow-arrow">↓</div>
        <div class="flow-step">
          <div class="flow-num">3</div>
          <h3>専門家が個別にご提案</h3>
          <p>診断結果をもとに、公務員制度に精通した専門家が無料でご相談をお受けします。</p>
        </div>
      </div>
    </div>
  </section>

  <!-- ⑦ FAQ -->
  <section class="section section--green">
    <div class="inner">
      <span class="sec-label">FAQ</span>
      <h2 class="sec-title">よくある質問</h2>
      <div class="sec-line"></div>
      <div class="faq-list">
        <details class="faq-item glass-card">
          <summary>本当に無料ですか？</summary>
          <p>はい、完全無料です。相談料・診断料は一切かかりません。収益は保険・金融商品の販売手数料・アフィリエイトで成り立っています。ご加入いただかなくても費用は発生しません。</p>
        </details>
        <details class="faq-item glass-card">
          <summary>保険に加入しないといけませんか？</summary>
          <p>いいえ、加入の義務はありません。相談のみでも歓迎です。あなたにとって最善の選択肢をご提案しますので、納得された場合のみご検討ください。</p>
        </details>
        <details class="faq-item glass-card">
          <summary>どんな職種でも相談できますか？</summary>
          <p>教員・地方公務員・国家公務員・みなし公務員など、幅広い職種の方にご対応しています。職種によって共済や制度が異なりますので、お気軽にご相談ください。</p>
        </details>
        <details class="faq-item glass-card">
          <summary>オンラインで相談できますか？</summary>
          <p>はい、Zoom・LINEビデオ通話など、オンラインでのご相談に対応しています。全国どこからでもご利用いただけます。</p>
        </details>
      </div>
    </div>
  </section>

  <!-- ⑧ 最終CTA -->
  <section class="section final-cta-section">
    <div class="deco-circle" style="width:400px;height:400px;top:-100px;left:50%;transform:translateX(-50%);background:rgba(255,255,255,0.04)"></div>
    <div class="inner text-center">
      <h2 class="final-cta-title">公務員のお金、<br>まるごと相談しよう</h2>
      <p class="final-cta-sub">完全無料・登録不要・5問で診断完了</p>
      <a href="https://life.tech-village.co.jp/diagnosis" class="btn-primary btn-large">
        今すぐ無料診断する →
      </a>
      <p style="color:rgba(255,255,255,0.5);font-size:12px;margin-top:20px;">
        Life Village — 公務員専門マネー相談窓口
      </p>
    </div>
  </section>

</body>
</html>
```

- [ ] **Step 3: ブラウザで LP を確認**

```bash
open /Users/nozaki/Desktop/CEO/TechVillage/life-village/lp/v2/index.html
```

8セクションが表示され、スマートフォンサイズ（375px）でも崩れないことを確認。

- [ ] **Step 4: コミット**

```bash
git add lp/v2/index.html lp/v2/style.css
git commit -m "feat: implement full 8-section LP for public servant money consultation"
```

---

## Task 8: 事業概要の更新と最終コミット

**Files:**
- Modify: `TechVillage/businesses/life_village.md` (CEOリポジトリ側)

- [ ] **Step 1: life_village.md を更新**

`/Users/nozaki/Desktop/CEO/TechVillage/businesses/life_village.md` を以下に書き換え。

```markdown
# Life Village — 事業概要

## 事業名
Life Village（ライフビレッジ）

## 事業内容
公務員向け総合マネー相談窓口（無料）

## 所属組織
TechVillage

## ステータス
- LP v2 刷新中（2026年4月〜）
- 診断アプリ（総合マネー診断）開発中

## ターゲット顧客
- 公務員全般（教員・地方公務員・国家公務員・みなし公務員）
- 特に20〜50代で資産形成・保険・退職後に関心のある層

## 主要サービス・商品
1. 保険の見直し（生命・医療・がん・損害保険）
2. 資産形成（つみたてNISA・iDeCo）
3. 退職金・共済の活用（退職金運用・年金受取プラン）
4. ライフプランニング（キャッシュフロー設計）

## 強み・差別化ポイント
- 公務員特有の共済制度を熟知した提案
- 4領域をワンストップでカバー
- 5問の無料診断で相談領域を特定し、専門家への導線を最適化

## 収益モデル
- 保険販売手数料
- 金融商品アフィリエイト（NISA口座開設・ローン等）

## KPI・目標
- 診断完了率
- 無料相談申込数（CV数）

## 関連リンク
- LP（刷新版）：https://life.tech-village.co.jp/
- 診断アプリ：https://life.tech-village.co.jp/diagnosis
```

- [ ] **Step 2: CEO リポジトリ側でコミット**

```bash
cd /Users/nozaki/Desktop/CEO
git add TechVillage/businesses/life_village.md
git commit -m "docs: update Life Village business overview to comprehensive money consultation"
```
