# 開発インストラクション

## 共通要件
- 言語は日本語を規定とする
- クリーンアーキテクチャに基づく層分離を行う
- 開発言語はTypeScriptを用いる
- express.js によりホスティングする

## フロントエンド開発要件
- Vue.jsを用いて開発する
- 状態管理ライブラリを用いる（Pinia）
- コンポーネントはAtomic Designに基づき整理する

## バックエンド開発要件
- TextAlive App APIを用いて、楽曲に図形や文字等でインタラクティブ体験を与える機能を実現する
- 永続化層にはsqliteを用いる
- TextAlive App APIトークンは`.env`に分離する
- 歌詞や楽曲情報をAI分析し、リアルタイムに文字や図形表現を与える

## 実装方針
- `apps/frontend`: Vue 3 + Vite + Pinia + Atomic Design + Clean Architecture
- `apps/backend`: Express + SQLite + TextAlive連携 + AI分析ユースケース
- 役割分離: `domain` / `application` / `infrastructure` / `presentation`
