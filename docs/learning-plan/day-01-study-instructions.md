# Day 1 学習手順: Project Setup と Prisma

## 目的

Day 1 では、Next.js project の構造、Prisma、MySQL 接続、基本 model を理解する。

## Step 1: 環境確認

MySQL を起動:

```powershell
scripts\start-local-mysql.cmd
```

Prisma を確認:

```powershell
npx.cmd prisma generate
npx.cmd prisma migrate status
```

開発サーバーを起動:

```powershell
npm.cmd run dev
```

## Step 2: 読むファイル

```text
prisma/schema.prisma
src/lib/db.ts
src/app/page.tsx
src/app/dashboard/page.tsx
package.json
.env.example
```

## Step 3: Prisma model の理解

`User` は account 情報を表す。

`Post` は投稿を表し、`authorId` で `User` に接続する。

`Response` はコメント/返信を表し、`postId` で `Post` に接続し、`authorId` で `User` に接続する。

```text
User -> Post: User が複数の Post を持つ
Post -> Response: Post が複数の Response を持つ
User -> Response: User が複数の Response を書く
```

## Step 4: よくある質問

質問: `provider = "mysql"` はなぜ重要ですか？

答え:

```text
Prisma が MySQL 用の SQL と型に合わせて動作するためです。
```

質問: `@@map("users")` は何ですか？

答え:

```text
Prisma model 名と実際の table 名を対応させる設定です。
```

質問: `Post` に `authorId` が必要な理由は？

答え:

```text
どの user がその post を作成したか保存するためです。
```

質問: `Response` に `postId` と `authorId` がある理由は？

答え:

```text
どの post への response か、誰が書いた response かを保存するためです。
```

## Step 5: 意図的なバグ練習

Day 1 では、`DATABASE_URL` を一時的に壊して Prisma の error を読む練習をした。

学習ポイント:

```text
.env の接続情報が間違うと Prisma は DB に接続できない。
error message から host、port、database、password などを確認する。
```

## 完了条件

- `npm.cmd run dev` で app が起動する。
- `npx.cmd prisma migrate status` が成功する。
- schema、migration、Prisma Client の違いを説明できる。
