# lyrics-dynamics

TextAlive App APIを活用し、歌詞と楽曲の進行に合わせて文字・図形表現をリアルタイム生成するWebアプリケーションの開発基盤です。

## 技術スタック
- 共通: TypeScript / Clean Architecture
- フロントエンド: Vue 3 + Vite + Pinia（Atomic Design構成）
- バックエンド: Express.js + SQLite
- 連携: TextAlive App API（トークンは`.env`で管理）

## ディレクトリ構成
- `apps/frontend`
	- `src/domain`
	- `src/application`
	- `src/infrastructure`
	- `src/presentation/components/{atoms,molecules,organisms,templates}`
- `apps/backend`
	- `src/domain`
	- `src/application`
	- `src/infrastructure`
	- `src/presentation`
	- `src/shared`

## セットアップ
1. 依存関係のインストール

```bash
npm install
```

2. 環境変数ファイルの作成

```bash
cp .env.example .env
```

3. 開発起動（フロント・バック同時）

```bash
npm run dev
```

4. ビルド

```bash
npm run build
```

## APIエンドポイント
- `GET /api/health`
- `GET /api/textalive/status`
- `POST /api/expressions/realtime`
- `GET /api/expressions/recent?limit=20`

## 参照ドキュメント
- 要件インストラクション: `INSTRUCTIONS.md`
- 機能提案: `docs/textalive-feature-ideas.md`