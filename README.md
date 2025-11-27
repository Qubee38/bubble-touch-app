# ぷにぷにタッチ遊び 🫧

幼児（1歳児〜）向けのシャボン玉タッチアプリ

## 概要

画面をタッチするとシャボン玉が弾け、自動的に新しいシャボン玉が生成され続けるインタラクティブアプリです。タップ回数によって色の濃さが変わり、視覚的に「硬さ」が分かります。

## 主な機能

- 🫧 **シャボン玉の自動生成**: 画面下部からふわふわ浮かび上がる
- 👆 **タッチで弾ける**: タップすると拡大しながら弾けるアニメーション
- ✨ **パーティクル**: 弾けると光の粒が飛び散る
- 🔢 **タップ回数機能**: 1〜5回タップで弾けるシャボン玉
- 🎵 **効果音**: タップ音、弾ける音、BGM
- ⚙️ **設定画面**: 音量、タップ回数、難易度を調整可能

## 技術スタック

- **React 18** + **TypeScript**
- **Canvas API** - 高速な描画とアニメーション
- **howler.js** - 音声管理
- **Vite** - ビルドツール
- **Vercel** - ホスティング

## ローカル開発

### 必要な環境
- Node.js 18以上

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/あなたのユーザー名/bubble-touch-app.git
cd bubble-touch-app

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで `http://localhost:5173` にアクセス

### ビルド

```bash
npm run build
npm run preview
```

## ディレクトリ構成

```
src/
├── components/          # Reactコンポーネント
│   ├── BubbleCanvas.tsx
│   ├── SettingsPanel.tsx
│   └── SettingsButton.tsx
├── lib/                 # コアロジック
│   ├── Bubble.ts
│   ├── AudioManager.ts
│   └── CanvasRenderer.ts
├── utils/               # ユーティリティ
│   ├── collision.ts
│   ├── particles.ts
│   └── storage.ts
├── types/               # 型定義
│   ├── bubble.ts
│   └── settings.ts
└── App.tsx
```

## 設定項目

保護者向け設定画面（⚙️アイコンをタップ）で以下を調整可能：

- **音の設定**: BGM、音量、ほめことば
- **あそびかた**: タップ回数（1〜5回）
- **むずかしさ**: 速度、大きさ

設定はブラウザのlocalStorageに保存されます。