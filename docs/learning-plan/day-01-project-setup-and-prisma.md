# Day 1: Project Setup And Prisma

## Goal

Next.js 14、TypeScript、Tailwind CSS、Prisma、MySQL の基礎環境を作り、掲示板アプリの土台を理解する。

この日は「コードを書く量」よりも、project structure、database schema、migration、Prisma Client の役割を説明できるようになることを重視する。

## Learning Topics

- Next.js App Router の基本構造。
- `src/app`、`src/components`、`src/lib`、`prisma` の役割。
- server component、client component、layout、page の位置づけ。
- Prisma schema、migration、Prisma Client の違い。
- MySQL connection string と `.env` の役割。
- `User`、`Post`、`Response` model の relation。
- development DB と production-style DB の違い。

## Coding Tasks

Codex が生成・設定した内容:

- Next.js 14 TypeScript project。
- Tailwind CSS。
- Prisma。
- MySQL datasource。
- `User`、`Post`、`Response` model。
- Prisma Client helper。
- first migration。
- home page。
- dashboard placeholder。

作成・変更された主なファイル:

```text
prisma/schema.prisma
src/lib/db.ts
src/app/layout.tsx
src/app/page.tsx
src/app/dashboard/page.tsx
package.json
.env.example
```

## Manual Testing Checklist

MySQL を起動する:

```powershell
scripts\start-local-mysql.cmd
```

Prisma Client を生成する:

```powershell
npx.cmd prisma generate
```

migration 状態を確認する:

```powershell
npx.cmd prisma migrate status
```

開発サーバーを起動する:

```powershell
npm.cmd run dev
```

ブラウザで確認:

```text
http://localhost:3000
```

MySQL table を確認:

```sql
USE bulletin_board;
SHOW TABLES;
DESCRIBE users;
DESCRIBE posts;
DESCRIBE responses;
```

## Intentional Bug Drill

Bug drill:

```text
DATABASE_URL を一時的に壊し、Prisma が DB に接続できない error を読む。
```

確認すること:

- error message に host、port、database、user、password のどれが関係しているか。
- `.env` と Prisma command の関係。
- `npx.cmd prisma generate` と `npx.cmd prisma migrate status` の違い。

## Hint Ladder

1. Concept hint:
   `DATABASE_URL` は Prisma が MySQL に接続するための住所。
2. File/layer hint:
   `.env` と `prisma/schema.prisma` を見る。
3. Command hint:
   `npx.cmd prisma migrate status` で接続状態を確認する。
4. Final fix:
   `.env` の `DATABASE_URL` を正しい MySQL 接続文字列に戻す。

## Explanation Practice

答えられるようにする質問:

- `schema.prisma` は何を定義するか。
- migration は何を作るか。
- Prisma Client は何に使うか。
- `provider = "mysql"` はなぜ重要か。
- `@@map("users")` は何を意味するか。
- `Post.authorId` は何を保存するか。
- `Response.postId` と `Response.authorId` は何を保存するか。
- `.env` と `.env.example` の違いは何か。
- `.env` を Git に含めない理由は何か。

## Done Criteria

- App が local で起動する。
- Prisma migration status が正常。
- MySQL に `users`、`posts`、`responses` table がある。
- `User`、`Post`、`Response` の relation を説明できる。
- schema、migration、Prisma Client の違いを説明できる。

## Notes To Write Yourself

- 今日つまずいた command。
- MySQL connection で理解したこと。
- Prisma relation でまだ曖昧なこと。
