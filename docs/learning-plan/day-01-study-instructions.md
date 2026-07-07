# Day 1 学習手順: Project Setup と Prisma

このファイルは、Codex が Day 1 の project baseline を生成したあとに使う。目的は、Next.js project の構造、Prisma、MySQL 接続、基本 model を読みながら理解すること。

## Current Day 1 Baseline

Codex が生成したもの:

- Next.js 14 App Router project。
- TypeScript。
- Tailwind CSS。
- Prisma setup。
- MySQL datasource。
- `User`、`Post`、`Response` model。
- Prisma Client helper。
- home page。
- dashboard placeholder。

重要な route:

```text
/
/dashboard
```

重要な database:

```text
bulletin_board
```

## Step 1: MySQL と App を起動する

MySQL を起動:

```powershell
scripts\start-local-mysql.cmd
```

Prisma Client を生成:

```powershell
npx.cmd prisma generate
```

migration 状態を確認:

```powershell
npx.cmd prisma migrate status
```

Next.js を起動:

```powershell
npm.cmd run dev
```

開く:

```text
http://localhost:3000
```

## Step 2: Manual Database Checklist

MySQL shell を開く:

```powershell
scripts\mysql-shell.cmd
```

SQL:

```sql
USE bulletin_board;
SHOW TABLES;
DESCRIBE users;
DESCRIBE posts;
DESCRIBE responses;
```

確認すること:

- `users` table がある。
- `posts` table がある。
- `responses` table がある。
- `posts.authorId` が user と post をつなぐ。
- `responses.postId` が response と post をつなぐ。
- `responses.authorId` が response と user をつなぐ。

## Step 3: Read These Files Carefully

### 1. `package.json`

Focus:

- `scripts`
- `dependencies`
- `devDependencies`

Questions:

- どの command が dev server を起動するか。
- Prisma Client package はどれか。
- authentication に使う package はどれか。
- password hashing に使う package はどれか。

### 2. `.env.example`

Focus:

- `DATABASE_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

Questions:

- MySQL username はどこに書くか。
- MySQL password はどこに書くか。
- host はどこか。
- port はどこか。
- database name はどこか。
- なぜ本物の `.env` は Git に入れないのか。

### 3. `prisma/schema.prisma`

Focus:

- `datasource db`
- `provider = "mysql"`
- `User`
- `Post`
- `Response`
- `@relation`
- `@@map`

Questions:

- `provider = "mysql"` はなぜ重要か。
- `@@map("users")` は何か。
- `Post` に `authorId` がある理由は何か。
- `Response` に `postId` と `authorId` がある理由は何か。

### 4. `src/lib/db.ts`

Focus:

- `PrismaClient`
- `globalForPrisma`
- `export const prisma`

Questions:

- DB query で import する object は何か。
- development 中に Prisma Client を作りすぎないようにする理由は何か。

### 5. `src/app/page.tsx`

Focus:

- home page text。
- `/posts` link。
- `/register` link。
- `/dashboard` link。

Questions:

- home page にどの text が表示されるか。
- Tailwind の spacing class はどれか。
- dashboard への link はどれか。
- dashboard はなぜあとで protected にする必要があるか。

## Step 4: Completed Answer Guide

Question: どの command が dev server を起動するか？

Answer:

```powershell
npm.cmd run dev
```

Question: Prisma Client package はどれか？

Answer:

```text
@prisma/client
```

Question: authentication に使う package はどれか？

Answer:

```text
next-auth
```

Question: password hashing に使う package はどれか？

Answer:

```text
bcryptjs
```

Question: `provider = "mysql"` はなぜ重要か？

Answer:

```text
Prisma が MySQL 用の SQL、型、migration に合わせて動作するためです。
```

Question: `@@map("users")` は何か？

Answer:

```text
Prisma model 名と実際の MySQL table 名を対応させる設定です。
```

Question: `Post.authorId` は何か？

Answer:

```text
post を作成した user の id を保存する foreign key です。
```

Question: `Response.postId` と `Response.authorId` は何か？

Answer:

```text
postId は response が属する post を示します。
authorId は response を書いた user を示します。
```

Question: DB query で import する object は何か？

Answer:

```ts
import { prisma } from "@/lib/db";
```

## Step 5: Intentional Bug Drill

実施した bug:

```text
DATABASE_URL を壊して Prisma connection error を読む。
```

学習ポイント:

```text
Prisma error は怖いものではなく、接続先・認証・database name を確認するための手がかり。
```

## Step 6: Done Criteria

- `npm.cmd run dev` が動く。
- `npx.cmd prisma migrate status` が成功する。
- MySQL tables を確認できる。
- Prisma schema、migration、Prisma Client の違いを説明できる。
