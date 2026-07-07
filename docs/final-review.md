# 最終レビュー

提出またはデモの前に、このファイルで最終確認をします。

## プロジェクト概要

このプロジェクトは、Next.js 14、TypeScript、Prisma、MySQL、NextAuth、Zod、React Hook Form、Tailwind CSS を使ったログイン式掲示板アプリです。

実装済み機能:

- validation と password hash 付きのユーザー登録。
- NextAuth Credentials Provider による login/logout。
- server-side で保護された dashboard/profile ページ。
- profile 表示、編集、account withdrawal。
- post list/detail/create/edit/soft delete。
- 投稿者本人だけが edit/delete できる API authorization。
- 投稿詳細ページでの response/comment 作成。
- 主要入力に対する Zod validation test。

## ローカル確認コマンド

```powershell
scripts\start-local-mysql.cmd
npx.cmd prisma generate
npx.cmd prisma migrate status
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

## テストアカウント

```text
email: test@example.com
password: Password123
```

```text
email: test2@test.com
password: Password123
```

## 手動機能チェックリスト

- 正しい情報でユーザー登録する。
- 重複登録を試す。
- 正しいパスワードでログインする。
- 間違ったパスワードでログインを試す。
- ログアウトする。
- ログアウト状態で `/dashboard` にアクセスし、redirect を確認する。
- 自分の profile を編集する。
- post を作成する。
- post detail page を表示する。
- 自分の post を編集する。
- 別 user が自分の post を編集できないことを確認する。
- 自分の post を soft delete する。
- ログイン状態で response を作成する。
- ログアウト状態では response を作成できないことを確認する。

## 要件カバレッジレビュー

結論:

```text
インターン課題の core requirements は実装済みで、ローカルで検証済みです。
```

確認済みコマンド:

```text
npm.cmd test
Result: passed, 15 tests
```

```text
npm.cmd run build
Result: passed
```

```text
npx.cmd prisma migrate status
Result: MySQL schema is up to date
```

要件対応:

- Next.js 14 App Router: 実装済み。
- TypeScript: 実装済み。
- Tailwind CSS: 実装済み。
- Next.js API Routes: 実装済み。
- Prisma ORM: 実装済み。
- MySQL database: `DATABASE_URL` 経由で実装済み。
- NextAuth.js authentication: 実装済み。
- bcryptjs password hashing: 実装済み。
- Zod validation: 実装済み。
- React Hook Form: 実装済み。
- Jest tests: validation schema test として実装済み。
- User registration/login/logout: 実装済み。
- Protected dashboard/profile pages: 実装済み。
- Profile display/editing: 実装済み。
- Post list/detail/create/edit/soft-delete: 実装済み。
- Author-only post edit/delete authorization: API route 側で実装済み。
- Response/comment feature: 実装済み。
- Basic security awareness: hash、validation、session check、Prisma query、React escaping により基本対応済み。

既知の制限:

- テストは validation schema 中心で、full API/browser integration test ではありません。
- pagination は未実装です。
- custom CSRF token をすべての custom API route に個別実装してはいません。
- 課題例の `/dashboard/posts/...` 構造は、より単純な `/posts/...` route に調整しています。
- 課題例の register confirmation page は未実装です。

最終判断:

```text
1週間の beginner internship task としては、動作する full-stack 掲示板プロジェクトとして十分です。
残る制限は、レビュー時に正直に説明できれば許容範囲です。
```

## セキュリティメモ

- Password は保存前に bcrypt で hash 化する。
- API route は Zod で入力 validation する。
- Protected page は `getServerSession(authOptions)` を使う。
- API route は browser から送られた user id ではなく `session.user.id` を使う。
- Post edit/delete の所有者チェックは UI だけでなく API 側でも行う。
- Soft-deleted users/posts/responses は通常表示から除外する。
- Prisma query API を使うことで、手書き SQL 文字列より SQL injection リスクを下げる。

## MySQL 設定

ローカル開発:

```env
DATABASE_URL="mysql://root:YOUR_LOCAL_MYSQL_PASSWORD@127.0.0.1:3307/bulletin_board"
```

本番風の例:

```env
DATABASE_URL="mysql://APP_USER:APP_PASSWORD@DB_HOST:3306/DB_NAME"
NEXTAUTH_URL="https://your-domain.example"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
```

本番用 secret は Git に commit しないこと。
