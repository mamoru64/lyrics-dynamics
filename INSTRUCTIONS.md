# 開発インストラクション

## 共通要件
- 言語は日本語を規定とする
- クリーンアーキテクチャに基づく層分離を行う
- 開発言語はTypeScriptを用いる

## フロントエンド開発要件
- Vue.jsを用いて開発する
- コンポーネントはAtomic Designに基づき整理する
- TextAlive App APIトークンはフロント環境変数（`VITE_TEXTALIVE_APP_TOKEN`）で管理する

## 実装方針
- `apps/frontend`: Vue 3 + Vite + Atomic Design + Clean Architecture
- 役割分離: `domain` / `application` / `infrastructure` / `presentation`
