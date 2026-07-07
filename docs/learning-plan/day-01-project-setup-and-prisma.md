# Day 1: Project Setup And Prisma

## 目標

Next.js 14、TypeScript、Tailwind CSS、Prisma、MySQL の基礎構成を作り、掲示板アプリの土台を理解する。

## 学習内容

- Next.js App Router の基本構造。
- `src/app`、`src/components`、`src/lib`、`prisma` の役割。
- Prisma schema、migration、Prisma Client の役割。
- MySQL connection string と `.env` の関係。
- `User`、`Post`、`Response` model の relation。

## Codex が実装したこと

- Next.js 14 project setup。
- TypeScript/Tailwind の基本構成。
- Prisma setup。
- MySQL datasource。
- `User`、`Post`、`Response` model。
- Prisma Client helper。
- Home page と dashboard placeholder。

## 重要ファイル

```text
prisma/schema.prisma
src/lib/db.ts
src/app/page.tsx
src/app/dashboard/page.tsx
.env.example
```

## 確認コマンド

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate status
npm.cmd run dev
```

MySQL 例:

```env
DATABASE_URL="mysql://root:YOUR_LOCAL_MYSQL_PASSWORD@127.0.0.1:3307/bulletin_board"
```

## 手動確認

- App が起動する。
- Prisma Client が生成される。
- Migration status が up to date になる。
- MySQL に `users`、`posts`、`responses` table がある。

## 重要な理解

- `schema.prisma` は DB model と relation を定義する。
- migration は schema を実際の DB table に反映する。
- Prisma Client は TypeScript から DB を操作するための client。
- `authorId` は post/response を user に接続する。
- `postId` は response を post に接続する。

## 完了条件

- App が local で起動する。
- MySQL と Prisma が接続できる。
- `User`、`Post`、`Response` の relation を説明できる。
