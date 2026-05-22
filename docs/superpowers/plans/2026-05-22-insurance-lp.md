# 保険特化LP（公務員向け）実装計画

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 既存 Life Village v2 LP をコピーし、公務員向けに「保険特化」化したLPを `lp/insurance/index.html` として新設する。

**Architecture:** 単一HTMLファイル（CSSインライン）として `lp/v2/index.html` をベースに作成。デザイン資産（カラー・タイポ・グラスカード・アニメーション）はそのまま流用し、各セクションの**中身（コピー・データ）のみ**を保険特化に差し替える。新規CSSは比較表用に小さなブロックを追加するのみ。

**Tech Stack:** 素のHTML + インラインCSS + 軽量Vanilla JS（IntersectionObserverによるフェードイン）。フレームワークなし。

**Spec:** [`docs/superpowers/specs/2026-05-22-insurance-lp-design.md`](../specs/2026-05-22-insurance-lp-design.md)

---

## ファイル構成

```
TechVillage/life-village/lp/
├── v2/
│   ├── index.html          # 既存（変更しない）
│   ├── style.css
│   └── README.md
└── insurance/              # 新設
    └── index.html          # v2/index.html をコピーして差し替え
```

セクション ID とクラス名は **v2 から変更しない**（既存CSSセレクタを再利用するため）。差し替えは `<h1>` `<p>` `<summary>` などの**テキストコンテンツのみ**。

---

## Task 1: ベースファイルをコピーする

**Files:**
- Create: `TechVillage/life-village/lp/insurance/index.html`

- [ ] **Step 1: ディレクトリを作成してファイルをコピー**

Run:
```bash
mkdir -p TechVillage/life-village/lp/insurance
cp TechVillage/life-village/lp/v2/index.html TechVillage/life-village/lp/insurance/index.html
```

- [ ] **Step 2: ブラウザでコピーが正しく表示されることを確認**

Run（macOS）:
```bash
open TechVillage/life-village/lp/insurance/index.html
```

Expected: v2 と同じ見た目（公務員のお金まるごと相談）のLPが表示される。崩れがないこと。

- [ ] **Step 3: コミット**

```bash
cd TechVillage/life-village
git add lp/insurance/index.html
git commit -m "chore(lp): scaffold insurance LP from v2 as starting baseline"
```

---

## Task 2: head とメタ情報を保険LP向けに差し替える

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<head>` 内、行6〜7付近）

- [ ] **Step 1: title と description を差し替え**

Edit `TechVillage/life-village/lp/insurance/index.html`:

`<title>Life Village | 公務員の無料マネー相談窓口</title>`
↓
`<title>公務員のための保険セカンドオピニオン窓口 | Life Village</title>`

`<meta name="description" content="保険・NISA・退職金・ライフプランを、公務員専門の相談窓口がトータルサポート。完全無料・登録不要。">`
↓
`<meta name="description" content="公務員共済と民間保険の重複を整理。Life Village の保険セカンドオピニオンで、本当に必要な保障を無料診断。完全無料・公務員専門。">`

- [ ] **Step 2: ブラウザのタブタイトルを目視確認**

ブラウザでリロード → タブに「公務員のための保険セカンドオピニオン窓口」が出ること。

- [ ] **Step 3: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): swap meta title and description to insurance focus"
```

---

## Task 3: ヘッダーナビ（ロゴ右のCTA）はそのまま維持

ヘッダー（行950〜953）の文言「無料診断を始める」は保険LPでも違和感なし。
**このタスクは変更不要**。次へ。

---

## Task 4: ヒーローセクションを保険特化コピーに差し替える

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ① ヒーロー -->` 内、行955〜982）

- [ ] **Step 1: 浮遊ピル3つを保険LP向けに更新**

`<span class="hero__pill-dot"></span>相談料 完全無料` → そのまま維持
`<span class="hero__pill-dot"></span>公務員専門の相談窓口` → `<span class="hero__pill-dot"></span>共済との重複を整理`
`<span class="hero__pill-dot"></span>オンライン対応OK` → そのまま維持

- [ ] **Step 2: eyebrow とタイトルを差し替え**

`<span class="hero__eyebrow">Money Consultation for Civil Servants</span>`
↓
`<span class="hero__eyebrow">Insurance Second Opinion for Civil Servants</span>`

`<h1 class="hero__title">公務員の方、<br>お金の相談を<br><span class="hero__title--accent">まるごと。</span></h1>`
↓
`<h1 class="hero__title">その保険、<br>"なんとなく"で<br><span class="hero__title--accent">続けていませんか？</span></h1>`

- [ ] **Step 3: 説明文を差し替え**

`<p class="hero__desc">保険・NISA・退職金・住宅購入…公務員ならではのお金の悩みを、共済制度を知り尽くした専門家がまとめて解決します。</p>`
↓
`<p class="hero__desc">公務員には共済という強い保障があります。だからこそ、民間の保険は"最低限"でいい。Life Village は、公務員共済を熟知した専門家があなたの保険を中立にセカンドオピニオンする無料窓口です。</p>`

- [ ] **Step 4: CTAボタンの文言（リンク先は維持）**

`<a href="https://life-diagnosis.vercel.app/diagnosis" class="btn-primary" target="_blank" rel="noopener noreferrer">今すぐ無料診断する →</a>`
↓
`<a href="https://life-diagnosis.vercel.app/diagnosis" class="btn-primary" target="_blank" rel="noopener noreferrer">保険を無料診断する →</a>`

`<a href="https://lin.ee/XTFxWwZ" class="btn-ghost" target="_blank" rel="noopener noreferrer">まず相談してみる</a>`
↓ そのまま維持

- [ ] **Step 5: ブラウザリロードで Hero を目視確認**

リロード → 新しいヒーロー見出しが大きく崩れず表示されること。

- [ ] **Step 6: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): rewrite hero section with insurance second opinion angle"
```

---

## Task 5: メディアバナーは維持

メディアバナー（行984〜1002）は公務員向けマネーガイド全般への導線なので保険LPでも有効。
**変更不要**。次へ。

---

## Task 6: 課題提起セクション → 「公務員のあるある加入経緯」に差し替え

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ② 課題提起 -->` 内、行1004〜1030）

- [ ] **Step 1: セクションラベル・タイトルを差し替え**

`<span class="sec-label">こんな悩みはありませんか？</span>`
↓
`<span class="sec-label">こんな入り方していませんか？</span>`

`<div class="sec-title">公務員ならではの<br>お金の悩み</div>`
↓
`<div class="sec-title">よくわからないまま<br>入っていませんか</div>`

- [ ] **Step 2: 4つの worry-card を「あるある加入経緯」に差し替え**

カード04を削除して3カード構成にしたいが、グリッドの見た目が崩れる可能性があるため4枚維持で書き換える。

カード01:
`<p>「共済があるから大丈夫」と思っていたけど、保障が手薄だった</p>`
↓
`<p>窓口で勧められるまま生命保険を契約。保障内容は正直あまり把握していない</p>`

カード02:
`<p>NISAやiDeCoを始めたいけど、何から手をつければいいかわからない</p>`
↓
`<p>職場で斡旋された医療保険にそのまま加入。共済との違いは説明されなかった</p>`

カード03:
`<p>退職金の受け取り方で税金が変わると聞いたけど、詳しくない</p>`
↓
`<p>親世代に勧められて、若いうちから終身保険に加入。本当に必要か聞かれたら答えられない</p>`

カード04:
`<p>マイホームを買いたいが、教育費や老後資金との両立が不安</p>`
↓
`<p>がん保険・先進医療特約・通院特約…気づけば毎月の保険料が家計を圧迫している</p>`

- [ ] **Step 3: リード文（締めの文）を差し替え**

`<p class="worries-lead">そのお悩み、<strong>Life Villageにまとめてご相談ください。</strong></p>`
↓
`<p class="worries-lead">どれか1つでも当てはまるなら、<strong>一度プロに整理してもらう価値があります。</strong></p>`

- [ ] **Step 4: ブラウザリロードで目視確認**

4枚のカードが崩れずに新しい文言で表示されること。

- [ ] **Step 5: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): rewrite problem section with civil servant insurance enrollment patterns"
```

---

## Task 7: サービス概要セクション → 「3つの落とし穴」に差し替え

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ③ サービス概要 -->` 内、行1032〜1062）

- [ ] **Step 1: セクションラベル・タイトル・説明を差し替え**

`<span class="sec-label">Services</span>`
↓
`<span class="sec-label">Pitfall</span>`

`<div class="sec-title">4つの領域を<br>ワンストップでサポート</div>`
↓
`<div class="sec-title">公務員がハマる<br>3つの落とし穴</div>`

`<p class="sec-desc">保険・資産形成・退職金・ライフプランを、<br>公務員専門の相談窓口がまとめて対応します。</p>`
↓
`<p class="sec-desc">公務員が"よくわからずに"入っている保険には、<br>共通する3つのムダがあります。</p>`

- [ ] **Step 2: 4カードを 3カード（落とし穴）に差し替え**

カード04（ライフプラン）を**削除**し、グリッドは3カードになる。3カード構成でも v2 の CSS（`features__grid`）は破綻しない想定（auto-fit / minmax の場合）が、レイアウトが崩れる場合は Step 6 で確認する。

カード01:
```html
<article class="glass-card features__card">
  <div class="features__tag">落とし穴 ①</div>
  <div class="features__title">共済との重複</div>
  <p class="features__desc">公務員共済の高額療養費付加給付があるのに、民間の医療保険にも手厚く入っている。月々の保険料が"二重払い"になっているケース。</p>
</article>
```

カード02:
```html
<article class="glass-card features__card">
  <div class="features__tag">落とし穴 ②</div>
  <div class="features__title">死亡保障の過剰</div>
  <p class="features__desc">遺族共済年金で家族の生活が守られるのに、数千万円の死亡保障に加入。独身・DINKsなら特に過剰になりやすい領域。</p>
</article>
```

カード03:
```html
<article class="glass-card features__card">
  <div class="features__tag">落とし穴 ③</div>
  <div class="features__title">不要特約の積み上げ</div>
  <p class="features__desc">先進医療特約・通院特約・三大疾病特約…公務員の福利厚生で代替できるものに毎月支払い続けている。</p>
</article>
```

カード04（マイホーム）を削除。

- [ ] **Step 3: ブラウザリロードで目視確認**

3カードが崩れず横並びまたはスタックで表示されること。
**崩れた場合**：`features__grid` の CSS で 3カードがいい感じに収まるか確認。崩れていれば Task 7.5（任意）で対応。

- [ ] **Step 4: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): replace services with 3 pitfalls of civil servant insurance"
```

---

## Task 7.5（任意）: 3カードでグリッドが崩れた場合のCSS微調整

**Step 3 で崩れていなければスキップ。**

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<style>` ブロック末尾、`</style>` 直前 = 行947付近）

- [ ] **Step 1: insurance LP 固有のスタイルを追記**

`</style>` の直前に以下を追加:

```css
/* === insurance LP 固有上書き === */
.section--features .features__grid {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  max-width: 1080px;
  margin: 0 auto;
}
```

- [ ] **Step 2: ブラウザリロードで確認 → コミット**

```bash
git add lp/insurance/index.html
git commit -m "style(insurance-lp): tighten features grid for 3-card layout"
```

---

## Task 8: 公務員特化の理由セクション → 「共済 vs 民間保険」比較表に差し替え

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ④ 公務員特化の理由 -->` 内、行1064〜1094 + `<style>` ブロック末尾）

このセクションは**セクション枠（背景・余白）は流用しつつ、中身を比較表に置き換える**。比較表は既存CSSにないため、本タスクで小さなCSSブロックを追加する。

- [ ] **Step 1: セクションラベル・タイトルを差し替え**

`<span class="sec-label">Why Life Village</span>`
↓
`<span class="sec-label">Benefit</span>`

`<div class="sec-title">一般のFP相談と<br>何が違うのか</div>`
↓
`<div class="sec-title">公務員共済 vs 民間保険<br>本当に必要な保障は？</div>`

- [ ] **Step 2: reasons-list 内の3カードを「比較表 + 解説」に置き換え**

`<div class="reasons-list">` ブロック全体（行1071〜1093）を以下に置き換え:

```html
<div class="compare-wrap">
  <table class="compare-table glass-card">
    <thead>
      <tr>
        <th>保障領域</th>
        <th>公務員共済</th>
        <th>民間保険の必要度</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>医療費</th>
        <td>高額療養費 + 付加給付<br>（自己負担 月25,000円程度〜）</td>
        <td><span class="compare-low">最低限でOK</span></td>
      </tr>
      <tr>
        <th>死亡保障</th>
        <td>遺族共済年金<br>（家族構成により変動）</td>
        <td><span class="compare-mid">家族構成次第</span></td>
      </tr>
      <tr>
        <th>がん・先進医療</th>
        <td>付加給付で大半カバー</td>
        <td><span class="compare-mid">特約は精査が必要</span></td>
      </tr>
      <tr>
        <th>就業不能</th>
        <td>傷病手当金 + 互助会給付</td>
        <td><span class="compare-low">最低限でOK</span></td>
      </tr>
    </tbody>
  </table>
  <p class="compare-note">※ 給付額・対象は職種（教員／地方／国家／みなし）と共済組合により異なります。実際の保障内容は無料相談で個別にご確認ください。</p>
</div>
```

- [ ] **Step 3: 比較表用CSSを `<style>` ブロック末尾に追加**

`</style>` 直前（行947付近）に追加:

```css
/* === insurance LP: 共済 vs 民間 比較表 === */
.compare-wrap {
  max-width: 880px;
  margin: 0 auto;
}
.compare-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
  padding: 0;
}
.compare-table thead th {
  background: var(--green-forest);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  padding: 16px 12px;
  text-align: center;
  letter-spacing: 0.5px;
}
.compare-table tbody th {
  background: var(--green-softest);
  color: var(--green-deep);
  font-weight: 700;
  padding: 16px 12px;
  text-align: left;
  font-size: 14px;
  width: 22%;
}
.compare-table tbody td {
  padding: 16px 12px;
  border-top: 1px solid rgba(0,0,0,0.06);
  font-size: 14px;
  color: var(--text-main);
  line-height: 1.55;
  text-align: center;
  vertical-align: middle;
}
.compare-table tbody tr:first-child td,
.compare-table tbody tr:first-child th { border-top: none; }
.compare-low {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: var(--green-pale);
  color: var(--green-deep);
  font-weight: 700;
  font-size: 13px;
}
.compare-mid {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 999px;
  background: #fff4cc;
  color: #8a6d00;
  font-weight: 700;
  font-size: 13px;
}
.compare-note {
  margin-top: 20px;
  font-size: 12px;
  color: var(--text-sub);
  text-align: center;
  line-height: 1.7;
}
@media (max-width: 640px) {
  .compare-table thead th,
  .compare-table tbody th,
  .compare-table tbody td { padding: 12px 8px; font-size: 12px; }
}
```

- [ ] **Step 4: ブラウザリロードで目視確認**

- 比較表がグリーン基調で表示される
- 4行 × 3列でスマホでも崩れない
- 「最低限でOK」「家族構成次第」のピルが見える

- [ ] **Step 5: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): replace 'why' section with kyosai vs private insurance comparison table"
```

---

## Task 9: 相談の流れセクション → 保険文脈に微調整

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ⑤ 相談の流れ -->` 内、行1096〜1133）

- [ ] **Step 1: 4ステップの文言を保険文脈に調整**

ステップ02:
`<div class="flow__title">診断結果で相談領域が決まる</div>`
↓
`<div class="flow__title">診断結果から保険の優先度が見える</div>`

`<p class="flow__desc">保険・資産形成・退職金・ライフプランの中から、今の優先度が高い領域をご提示します。</p>`
↓
`<p class="flow__desc">あなたの保険加入状況の中で、見直し効果が大きい領域を診断結果としてご提示します。</p>`

ステップ03:
`<p class="flow__desc">診断結果をもとに、公務員制度に精通した専門家が無料でご相談をお受けします。</p>`
↓
`<p class="flow__desc">現在の保険証券を確認しながら、公務員共済を熟知した専門家が無料でセカンドオピニオンをお伝えします。</p>`

ステップ04:
`<div class="flow__title">ご検討・アフターサポート</div>`
↓
`<div class="flow__title">継続OKの判断もできる</div>`

`<p class="flow__desc">ご提案内容をゆっくりご確認いただけます。ご不明点は何度でもご相談OKです。</p>`
↓
`<p class="flow__desc">「今のままで問題なし」という判断もあり。無理な乗り換え勧誘は一切ありません。ご不明点は何度でもご相談OK。</p>`

- [ ] **Step 2: ブラウザリロードで目視確認**

4ステップが崩れず表示されること。

- [ ] **Step 3: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): adjust flow section copy to insurance context"
```

---

## Task 10: FAQ セクションを保険特化のQ&Aに全面差し替え

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ⑥ FAQ -->` 内、行1135〜1160）

- [ ] **Step 1: faq-list 内の4 details ブロックを以下5項目に置き換え**

`<div class="faq-list">` 〜 `</div>` の中身を以下に置き換え:

```html
<details class="faq-item glass-card">
  <summary>しつこい営業や勧誘はありませんか？</summary>
  <p>ありません。本相談はセカンドオピニオン目的のため、現在の保険を継続する判断も歓迎しています。乗り換え前提の営業はいたしません。</p>
</details>
<details class="faq-item glass-card">
  <summary>共済と民間保険、結局どちらに入ればいいですか？</summary>
  <p>公務員の方は共済が"主軸"、民間保険は共済でカバーできない隙間を埋める"補助"が基本です。具体的な配分はあなたの職種・家族構成・既加入の保険によって変わるため、無料相談で個別にご確認いただけます。</p>
</details>
<details class="faq-item glass-card">
  <summary>いま入っている保険を解約しなければいけませんか？</summary>
  <p>いいえ。解約は最終手段です。減額・特約のみ外す・払済保険への変更など、解約せずに保険料を下げる選択肢も多数あります。あなたに合った方法を一緒に検討します。</p>
</details>
<details class="faq-item glass-card">
  <summary>オンラインだけで完結できますか？</summary>
  <p>はい。診断・相談・保険証券の確認まで、全国どこからでもオンライン完結で対応しています。転勤中・育休中の方も多くご利用いただいています。</p>
</details>
<details class="faq-item glass-card">
  <summary>相談は本当に無料ですか？収益源は何ですか？</summary>
  <p>はい、相談・診断は完全無料です。Life Village は提携保険会社からの手数料で運営しており、相談者から費用をいただくことはありません。中立性を保つため、特定の商品を売り込む方針も取っていません。</p>
</details>
```

- [ ] **Step 2: ブラウザリロードで目視確認**

5つの FAQ がアコーディオン展開できること。

- [ ] **Step 3: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): replace FAQ with insurance-specific questions"
```

---

## Task 11: 最終CTAセクションを保険LP向けに差し替え

**Files:**
- Modify: `TechVillage/life-village/lp/insurance/index.html`（`<!-- ⑦ 最終CTA -->` 内、行1162〜1179）

- [ ] **Step 1: タイトル・チェックリスト・ボタン文言を差し替え**

`<div class="cta__title">公務員のお金、<br>まるごと相談しよう</div>`
↓
`<div class="cta__title">保険は"入る"より、<br>"整える"時代へ</div>`

チェックリスト 3項目:
```html
<ul class="cta__checks">
  <li><span class="cta__check-icon">無料</span>5問の診断で保険の見直しポイントが見える</li>
  <li><span class="cta__check-icon">中立</span>共済を熟知した専門家がセカンドオピニオン</li>
  <li><span class="cta__check-icon">安心</span>無理な乗り換え勧誘は一切ありません</li>
</ul>
```

CTAボタン:
`<a href="https://life-diagnosis.vercel.app/diagnosis" class="cta__btn-primary" target="_blank" rel="noopener noreferrer">今すぐ無料診断する →</a>`
↓
`<a href="https://life-diagnosis.vercel.app/diagnosis" class="cta__btn-primary" target="_blank" rel="noopener noreferrer">保険を無料診断する →</a>`

「まず相談してみる」ボタンはそのまま維持。

- [ ] **Step 2: ブラウザリロードで目視確認**

最終CTAが新しい文言で表示されること。両方のボタンが正しいリンク（診断 / LINE）で開けること。

- [ ] **Step 3: コミット**

```bash
git add lp/insurance/index.html
git commit -m "feat(insurance-lp): rewrite final CTA with insurance second opinion messaging"
```

---

## Task 12: フッターは維持

フッター（行1181〜1191）は Life Village 共通のため**変更不要**。
「公務員専門マネー相談窓口」のタグラインは保険LPでも違和感なし。

---

## Task 13: 全体動作確認・完了コミット

- [ ] **Step 1: ブラウザでフルページ確認**

```bash
open TechVillage/life-village/lp/insurance/index.html
```

確認項目:
- [ ] タブのタイトルが「公務員のための保険セカンドオピニオン窓口 | Life Village」
- [ ] Hero「その保険、"なんとなく"で続けていませんか？」が表示される
- [ ] 「こんな入り方していませんか？」セクションに4カード
- [ ] 「公務員がハマる3つの落とし穴」に3カード
- [ ] 「公務員共済 vs 民間保険」比較表が4行表示
- [ ] 「ご相談の流れ」4ステップが保険文脈の文言
- [ ] FAQ が5問
- [ ] 最終CTA「保険は"入る"より、"整える"時代へ」
- [ ] フッターが Life Village 共通

- [ ] **Step 2: レスポンシブ確認**

ブラウザの開発者ツールでスマホ幅（375px）にしても破綻しないこと。
特に比較表が横スクロールせず収まること。

- [ ] **Step 3: CTAリンクの動作確認**

ヘッダー / Hero / 最終CTA / フッターのすべての「無料診断」ボタンが `https://life-diagnosis.vercel.app/diagnosis` を開く。
「まず相談してみる」「無料で相談する」ボタンが `https://lin.ee/XTFxWwZ`（LINE）を開く。

- [ ] **Step 4: push**

```bash
cd TechVillage/life-village
git push origin main
```

Expected: 全コミットが GitHub `techwebvillage/life-diagnosis` の main にプッシュされる。

---

## 完了条件チェックリスト（spec §11 と対応）

- [ ] `lp/insurance/index.html` が単体ブラウザで開いて崩れず表示される
- [ ] 全てのCTAボタンが既存v2と同じ遷移先（診断URL / LINE）に正しく繋がる
- [ ] レスポンシブ（スマホ・タブレット・PC）で破綻しない
- [ ] メタ情報（title・description）が保険LP向けに差し替わっている

---

## 注意事項

- v2/index.html は**絶対に変更しない**（既存LPは公開中）
- セクションのCSSクラス名は変更しない（既存スタイル流用のため）
- 比較表用CSSのみ新規追加。それ以外のCSS変更は不要
- 各タスクで**ブラウザリロード確認 → コミット**のサイクルを守る（差分を細かく追えるようにするため）
