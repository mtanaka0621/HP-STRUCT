# STRUCT - All in One ERP 日本語サイト

バーティカルSaaSのオールインワンERP「STRUCT」の日本語マーケティングサイトです。

## プロジェクト概要

- **プロジェクト名**: STRUCT - All in One ERP
- **目標**: IT・コンサル・人材などの業界向けバーティカルSaaSの製品紹介・マーケティングサイト
- **主な機能**: アサイン管理・販売管理・購買管理・勤怠経費管理・承認管理・評価管理・情報管理・経営管理の8機能紹介

---

## コードベース概要

### ファイル構成

| ファイル | 役割 |
|----------|------|
| `css/style.css` | 全ページ共通スタイルシート（約5,260行）。23セクションに分割しコメント整備済み |
| `js/main.js` | ナビ・アニメーション・Canvas雲エフェクト・SIV接続線ほか全インタラクション（約1,550行、24機能） |
| `js/lightbox.js` | 画像クリック拡大ライトボックス（IIFE形式、MutationObserver対応） |

### コード品質
- **css/style.css**: セクションヘッダーコメント（1〜23番）・インラインコメント整備済み。重複定義（`.hfloat`）にはコメントで用途を明示
- **js/main.js**: 24機能すべてにセクションコメント（`// ===== N. 機能名 =====`）・JSDoc付き関数整備済み
- **js/lightbox.js**: JSDoc・インラインコメント・ARIA属性完備

---

## 完了済み機能

### 📄 ページ一覧

| ページ | パス | 説明 |
|--------|------|------|
| ホーム | `index.html` | メインLP・全機能概要 |
| 料金 | `pricing.html` | 料金プラン・FAQ |
| **FAQ** | `faq.html` | よくあるご質問（製品・契約・ご利用方法） |
| **お問い合わせ** | `contact.html` | お問い合わせフォーム |
| アサイン管理 | `features/assignment-management.html` | スタッフ稼働のリアルタイム最適化 |
| **販売管理** | `features/sales-management.html` | 顧客管理・受注管理①②・売掛管理（ソースから正確なコンテンツ再構成済み） |
| **購買管理** | `features/purchase-management.html` | 協力会社管理・発注管理・債務管理・支払管理（ソースから正確なコンテンツ再構成済み） |
| **勤怠・経費管理** | `features/attendance-expense-management.html` | 勤怠申請・勤怠管理・経費申請・経費管理・休暇申請・休暇管理（ソースから正確なコンテンツ再構成済み） |
| **承認管理** | `features/approval-management.html` | 承認管理・承認フロータイプマスター（ソースから正確なコンテンツ再構成済み） |
| **評価管理** | `features/evaluation-management.html` | 評価申請（評価者向け）・評価管理（人事部向け）・評価マスター（ソースから正確なコンテンツ再構成済み） |
| **情報管理** | `features/information-management.html` | 社内自己紹介・新入社員参照・業務連絡・研修活動・会議室予約・タスク管理（ソースから正確なコンテンツ再構成済み） |
| **経営管理** | `features/business-management.html` | 予算管理・経営ダッシュボード・スタッフダッシュボード・アサイン予実・プロジェクト予実・スタッフ状況管理（ソースから正確なコンテンツ再構成済み） |
| 利用規約 | `terms.html` | 利用規約（全条文） |
| プライバシーポリシー | `privacy.html` | 個人情報保護方針 |
| 情報セキュリティ方針 | `security-policy.html` | セキュリティポリシー |
| 非機能要件の対応 | `non-functional.html` | セキュリティ・可用性・保守性等 |
| 特定商取引法 | `trade.html` | 特定商取引法に基づく表示 |

### 🎨 デザイン統一（全機能ページ）

全7つの機能ページ（販売管理〜経営管理）が `assignment-management.html` と同一デザインで作成済み：

- **ヒーローセクション**: Canvas雲エフェクト + グラジエント背景 + スクリーンフレーム + フローティングバッジ
- **コンセプトバナー**: 紫帯 + 機能キーワード
- **コンセプトカード**: 3〜4列グリッド
- **フィーチャーセクション**: 白/ライト/グラジエント交互背景 + 左右2カラム
- **コールアウト**: 3カラム数値インパクト
- **CTAセクション**: 紫グラジエント
- **スクロールリビール**: アニメーション付き

### 🔗 ナビゲーション更新

- **ヘッダー**: dropdown-desc（説明文）を全ページから削除
- **ヘッダーFAQ**: `pricing.html#faq` → `faq.html` に変更
- **ヘッダーお問い合わせ**: `#contact` → `contact.html` に変更
- **フッタータグライン**: 「バーティカルSaaSソリューション」（2行表示・「へ。」なし）

---

## ファイル構造

```
/
├── index.html                    # メインLP
├── pricing.html                  # 料金ページ
├── faq.html                      # FAQ
├── contact.html                  # お問い合わせ
├── terms.html                    # 利用規約
├── privacy.html                  # プライバシーポリシー
├── security-policy.html          # 情報セキュリティ方針
├── non-functional.html           # 非機能要件の対応
├── trade.html                    # 特定商取引法
├── features/
│   ├── assignment-management.html
│   ├── sales-management.html
│   ├── purchase-management.html
│   ├── attendance-expense-management.html
│   ├── approval-management.html
│   ├── business-management.html
│   ├── evaluation-management.html
│   └── information-management.html
├── css/
│   └── style.css                 # 共通スタイルシート（約5,260行）
├── js/
│   ├── main.js                   # メインスクリプト（約1,550行）
│   └── lightbox.js               # 画像ライトボックス
├── images/
│   ├── struct_logo.svg
│   ├── current_logo_ref.jpg      # ロゴ参照画像
│   ├── new_logo_ref.jpg          # 新ロゴ参照画像
│   ├── new_logo_design.png       # 新ロゴデザイン
│   ├── assign/          # アサイン管理画像（2.png, 3.png, 4.png, 6.png）
│   ├── sales/           # 販売管理画像
│   ├── purchase/        # 購買管理画像
│   ├── attendance/      # 勤怠経費管理画像
│   ├── approval/        # 承認管理画像
│   ├── evaluation/      # 評価管理画像
│   ├── information/     # 情報管理画像
│   ├── business/        # 経営管理画像
│   └── features/        # 機能ページ共通画像
└── backup/
    └── 20260507_000000/ # 2026-05-07 バックアップ（全HTML・CSS・JS・画像）
```

---

## 主要URI一覧

| URI | 説明 |
|-----|------|
| `/index.html` | メインLP |
| `/pricing.html` | 料金プラン |
| `/faq.html` | FAQ |
| `/contact.html` | お問い合わせ |
| `/features/assignment-management.html` | アサイン管理 |
| `/features/sales-management.html` | 販売管理 |
| `/features/purchase-management.html` | 購買管理 |
| `/features/attendance-expense-management.html` | 勤怠・経費管理 |
| `/features/approval-management.html` | 承認管理 |
| `/features/business-management.html` | 経営管理 |
| `/features/evaluation-management.html` | 評価管理 |
| `/features/information-management.html` | 情報管理 |

---

## データモデル・アセット

### 画像アセット（images/ 配下）
- `assign/`: 2.png, 3.png, 4.png, 5.png, 6.png（アサイン管理スクリーンショット）
- `sales/`: sales-order-sec1.png, 3.png, 4.png, 5.png
- `purchase/`: pm-s1.png〜pm-s4.png
- `attendance/`: hero-dashboard.png, s1〜s6-attendance.png
- `approval/`: approval-s1.png, approval-s2.png
- `evaluation/`: eval-1.png〜eval-3.png
- `information/`: s1〜s5-info_management.png, s2-information_management.png, task-list-mode.png
- `business/`: business-mngmt.png, mngnt-dashboard.png, staff-dashboard.png, assignmnt-forecast.png, project-forecast.png, staff-situation.png

---

## 未実装・推奨次ステップ

1. **お問い合わせフォームのバックエンド連携**: 現在はクライアントサイドのみの処理（フォーム送信メール送信機能なし）
2. **多言語対応**: 英語版との切り替え機能
3. **CMS統合**: ブログ・お知らせ機能
4. **SEOメタタグ最適化**: OGP・Twitter Card設定の強化
5. **Google Analytics等のトラッキング**: 行動分析の設定
6. **パフォーマンス最適化**: 画像のWebP変換・遅延ロード

---

Copyright © 2026 Cartridge Japan Corporation. All Rights Reserved.
