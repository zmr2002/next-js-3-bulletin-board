# Next.js ログイン式掲示板

Next.js 14 App Router を使った、インターン学習課題用のログイン式掲示板アプリです。

目的は、動く full-stack アプリを完成させることに加えて、登録、ログイン、session、protected page、CRUD、validation、Prisma/MySQL の流れを説明できるようになることです。

## 技術スタック

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- React Hook Form
- Zod
- Next.js API Routes
- Prisma ORM
- MySQL
- NextAuth.js
- bcryptjs
- Jest

## 主な機能

- ユーザー登録
- ログイン / ログアウト
- bcrypt による password hash
- dashboard/profile の protected page
- profile 表示 / 編集 / account withdrawal
- post list/detail/create/edit/soft delete
- 投稿者本人だけが post edit/delete できる API authorization
- response/comment 作成
- Zod validation
- Jest による validation test

## セットアップ

依存関係をインストールします。

```powershell
npm.cmd install
```

`.env.example` を参考に `.env` または `.env.local` を作成します。

```env
DATABASE_URL="mysql://root:YOUR_LOCAL_MYSQL_PASSWORD@127.0.0.1:3307/bulletin_board"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-this-with-a-long-random-local-secret"
```

注意:

```text
.env と .env.local は Git 管理外です。
GitHub に実際の password や secret を commit しないでください。
```

## ローカル MySQL

開発時の例:

```text
Host: 127.0.0.1
Port: 3307
Database: bulletin_board
```

MySQL を起動します。

```powershell
scripts\start-local-mysql.cmd
```

MySQL shell を開きます。

```powershell
scripts\mysql-shell.cmd
```

`scripts\mysql-shell.cmd` は password を直接書かず、実行時に入力する形にしています。

## Prisma

Prisma Client を生成します。

```powershell
npx.cmd prisma generate
```

migration 状態を確認します。

```powershell
npx.cmd prisma migrate status
```

初回構築時に migration を実行する場合:

```powershell
npx.cmd prisma migrate dev --name init
```

## 起動方法

開発サーバーを起動します。

```powershell
npm.cmd run dev
```

ブラウザで開きます。

```text
http://localhost:3000
```

PowerShell で `npm` が実行ポリシーによりブロックされる場合は、`npm.cmd` と `npx.cmd` を使います。

## テストとビルド

Jest test を実行します。

```powershell
npm.cmd test
```

production build を確認します。

```powershell
npm.cmd run build
```

現在の確認結果:

```text
npm.cmd test
Result: passed, 15 tests
```

```text
npm.cmd run build
Result: passed
```

## アプリ全体の流れ

1. ユーザーが登録フォームに name、email、password を入力する。
2. React Hook Form と Zod がブラウザ側で validation する。
3. `/api/users/register` が server 側でも `registerSchema` で validation する。
4. API が duplicate email を確認する。
5. bcrypt が password を hash 化する。
6. Prisma が MySQL の `users` table に user を作成する。
7. LoginForm が `signIn("credentials")` を呼ぶ。
8. NextAuth の `authorize` が user 検索と bcrypt password 比較を行う。
9. JWT/session callback が `session.user.id` を session に入れる。
10. Protected page は `getServerSession(authOptions)` で login 状態を確認する。
11. Post/response API は browser から送られた user id ではなく `session.user.id` を使う。
12. Edit/delete API は必ず server 側で ownership check を行う。

## セキュリティ上のポイント

- Password は平文保存せず bcrypt で hash 化する。
- API route は Zod で server-side validation する。
- Protected page は server-side session check を行う。
- 投稿やレスポンスの author は `session.user.id` から決める。
- UI でボタンを隠すだけでなく、API route でも所有者確認を行う。
- `isDeleted` による soft delete を使い、通常画面では deleted data を除外する。
- Prisma query API を使い、手書き SQL 文字列より SQL injection リスクを下げる。

## レビュー用ドキュメント

最終レビュー:

```text
docs/final-review.md
```

7日間の学習サマリー:

```text
docs/learning-plan/study-summary-ja.md
```

Day 7 学習ログ:

```text
docs/learning-plan/day-07-tests-mysql-review-and-submission.md
```
