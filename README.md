# lyrics-dynamics

TextAlive App APIを活用し、歌詞と楽曲の進行に合わせて文字・図形表現をリアルタイム生成するWebアプリケーションの開発基盤です。

## 技術スタック
- 共通: TypeScript / Clean Architecture
- フロントエンド: Vue 3 + Vite（Atomic Design構成）
- 連携: TextAlive App API（トークンはフロント環境変数で管理）

## ディレクトリ構成
- `apps/frontend`
	- `src/domain`
	- `src/application`
	- `src/infrastructure`
	- `src/presentation/components/{atoms,molecules,organisms,templates}`

## セットアップ
1. 依存関係のインストール

```bash
npm install
```

2. 環境変数ファイルの作成

```bash
cp .env.example .env
```

3. 開発起動

```bash
npm run dev
```

4. ビルド

```bash
npm run build
```

## 環境変数
- `VITE_TEXTALIVE_APP_TOKEN`

## 参照ドキュメント
- 要件インストラクション: `INSTRUCTIONS.md`
- 機能提案: `docs/textalive-feature-ideas.md`