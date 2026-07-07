# 学習サマリー

このファイルは、mentor review 用に 7日間の学習内容を日本語でまとめたものです。詳細な作業ログは各 day ファイルに残していますが、レビュー時はこのサマリーと `docs/final-review.md` を読むと全体像を追いやすいです。

## 学習方針

このプロジェクトでは、Codex が主要な baseline code を生成し、学習者がそれを読み、動かし、小さな修正と意図的なバグ修正を行う流れで進めました。

目的は「すべてをゼロから手書きすること」ではなく、1週間の期限内で動くアプリを完成させながら、重要なコードの意味を説明できるようになることです。

## Day 1: Project Setup And Prisma

- Next.js 14、TypeScript、Tailwind の構成を確認。
- Prisma schema、migration、Prisma Client を学習。
- MySQL 接続と `User`、`Post`、`Response` model を確認。
- `DATABASE_URL` や migration error の見方を練習。

## Day 2: Registration And Validation

- Zod schema と React Hook Form の関係を学習。
- registration API を実装。
- duplicate email check と bcrypt password hash を確認。
- form validation と server-side validation の違いを学習。

## Day 3: Login And Session Auth

- NextAuth Credentials Provider を実装。
- bcrypt.compare による password 照合を学習。
- JWT/session callback で `session.user.id` を扱う理由を確認。
- TypeScript module augmentation を学習。

## Day 4: Protected Pages And Profile

- `getServerSession(authOptions)` による protected page を実装。
- dashboard/profile/profile edit を作成。
- profile update API と duplicate email check を確認。
- account withdrawal を soft delete として実装。

## Day 5: Post CRUD And Authorization

- Post list/detail/create/edit/delete を実装。
- `authorId` による user と post の relation を学習。
- UI で edit/delete を隠すだけでは不十分で、API route 側の ownership check が必要だと確認。
- post soft delete を実装。

## Day 6: Responses And UI Polish

- Response/comment 作成機能を追加。
- response が `postId` と `authorId` で post/user に接続することを学習。
- response count と response list を実装。
- validation、relation、soft delete のバグ修正練習を実施。

## Day 7: Tests And Final Review

- Jest を設定。
- `registerSchema`、`loginSchema`、`postSchema`、`profileSchema`、`responseSchema` の validation test を追加。
- `npm.cmd test` と `npm.cmd run build` で確認。
- GitHub review 向けに README と final review document を整理。

## 最終的に説明できるべき流れ

- 登録フォームから MySQL に user が保存される流れ。
- password を bcrypt で hash 化する理由。
- NextAuth login と session callback の流れ。
- `session.user.id` を使う理由。
- protected page の仕組み。
- post CRUD の仕組み。
- API route で ownership check を行う理由。
- response が post/user に接続する仕組み。
- Prisma が Next.js と MySQL をつなぐ仕組み。
