# Next.js ログイン式掲示板

入社先企業から提示された「next.js 課題3: Next.js ログイン式掲示板システム 技術仕様書」に基づいて作成した掲示板アプリです。

Next.js 14 App Router、TypeScript、Prisma、MySQL、NextAuth.js を使用し、ユーザー登録、ログイン、プロフィール管理、投稿 CRUD、レスポンス投稿、バリデーション、認可チェックを実装しています。

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
- bcryptjs によるパスワードハッシュ化
- ダッシュボード / プロフィールのログイン保護
- プロフィール表示 / 編集 / 退会
- 投稿一覧 / 詳細 / 作成 / 編集 / 削除
- 投稿者本人だけが編集・削除できる認可チェック
- 投稿へのレスポンス作成
- Zod による入力バリデーション
- Jest によるバリデーションテスト

## セットアップ

依存関係をインストールします。

```powershell
npm.cmd install
```

`.env.example` を参考に、`.env` または `.env.local` を作成します。

```env
DATABASE_URL="mysql://root:YOUR_LOCAL_MYSQL_PASSWORD@127.0.0.1:3307/bulletin_board"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-this-with-a-long-random-local-secret"
```

`.env` と `.env.local` は Git 管理外です。実際のパスワードや secret は commit しないでください。

## ローカル MySQL

開発時の接続例:

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

`scripts\mysql-shell.cmd` はパスワードをファイル内に保存せず、実行時に入力する形式です。

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

PowerShell で `npm` が実行ポリシーによりブロックされる場合は、`npm.cmd` と `npx.cmd` を使用します。

## テストとビルド

Jest test を実行します。

```powershell
npm.cmd test
```

production build を確認します。

```powershell
npm.cmd run build
```

## アプリケーションの流れ

1. ユーザーが登録フォームに名前、メールアドレス、パスワードを入力します。
2. React Hook Form と Zod が入力値を検証します。
3. `/api/users/register` がサーバー側でも入力値を検証します。
4. API がメールアドレスの重複を確認します。
5. bcryptjs がパスワードをハッシュ化します。
6. Prisma が MySQL の `users` table にユーザーを作成します。
7. LoginForm が `signIn("credentials")` を呼び出します。
8. NextAuth の `authorize` がユーザー検索とパスワード照合を行います。
9. JWT/session callback が `session.user.id` を session に追加します。
10. 保護ページは `getServerSession(authOptions)` でログイン状態を確認します。
11. 投稿とレスポンスの API は、ブラウザから送られた user id ではなく `session.user.id` を使用します。
12. 編集・削除 API はサーバー側で所有者チェックを行います。

## セキュリティ上の対応

- パスワードは平文保存せず、bcryptjs でハッシュ化します。
- API route は Zod で server-side validation を行います。
- 保護ページは server-side session check を行います。
- 投稿やレスポンスの作成者は `session.user.id` から決定します。
- UI でボタンを隠すだけでなく、API route でも所有者確認を行います。
- `isDeleted` による soft delete を使い、通常画面では削除済みデータを除外します。
- Prisma query API を使用し、手書き SQL 文字列による SQL injection リスクを抑えます。

## 補足ドキュメント

要件対応と確認結果は次のファイルにまとめています。

```text
docs/final-review.md
```
