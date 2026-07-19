# 要件対応レビュー

## プロジェクト概要

このプロジェクトは、入社先企業から提示された「next.js 課題3: Next.js ログイン式掲示板システム 技術仕様書」に基づいて作成したログイン式掲示板アプリです。

Next.js 14、TypeScript、Prisma、MySQL、NextAuth.js、Zod、React Hook Form、Tailwind CSS を使用しています。

## 実装済み機能

- ユーザー登録
- ログイン / ログアウト
- bcryptjs によるパスワードハッシュ化
- ダッシュボード / プロフィールのログイン保護
- プロフィール表示 / 編集 / 退会
- 投稿一覧 / 詳細 / 作成 / 編集 / 削除
- 投稿者本人だけが編集・削除できる API 認可チェック
- 投稿詳細ページでのレスポンス作成
- Zod による入力バリデーション
- Jest によるバリデーションテスト

## ローカル確認コマンド

```powershell
scripts\start-local-mysql.cmd
npx.cmd prisma generate
npx.cmd prisma migrate status
npm.cmd test
npm.cmd run build
npm.cmd run dev
```

## 手動機能チェックリスト

- 正しい情報でユーザー登録できる。
- 同じメールアドレスで重複登録できない。
- 正しいパスワードでログインできる。
- 間違ったパスワードではログインできない。
- ログアウトできる。
- ログアウト状態で `/dashboard` にアクセスするとログイン画面へ redirect される。
- 自分のプロフィールを表示・編集できる。
- 投稿を作成できる。
- 投稿一覧と投稿詳細を表示できる。
- 自分の投稿を編集・削除できる。
- 別ユーザーは他人の投稿を編集・削除できない。
- ログイン状態でレスポンスを作成できる。
- ログアウト状態ではレスポンスを作成できない。
- soft delete されたデータは通常画面に表示されない。

## 要件対応

- Next.js 14 App Router: 対応済み。
- TypeScript: 対応済み。
- Tailwind CSS: 対応済み。
- React Hook Form: 対応済み。
- Zod: 対応済み。
- Next.js API Routes: 対応済み。
- Prisma ORM: 対応済み。
- MySQL: 対応済み。
- NextAuth.js: 対応済み。
- bcryptjs: 対応済み。
- ユーザー登録: 対応済み。
- ログイン / ログアウト: 対応済み。
- ダッシュボード保護: 対応済み。
- プロフィール表示 / 編集: 対応済み。
- 投稿 CRUD: 対応済み。
- 投稿者本人のみ編集・削除可能: 対応済み。
- レスポンス機能: 対応済み。
- 入力バリデーション: 対応済み。

## 既知の差分

- 課題例の `/dashboard/posts/...` 構造は、操作しやすいように `/posts/...` route として実装しています。
- register confirmation page は未実装です。
- pagination は未実装です。
- 自動テストは validation schema test が中心で、full browser integration test は未実装です。

## セキュリティ上の対応

- パスワードは保存前に bcryptjs でハッシュ化します。
- API route は Zod で入力値を検証します。
- 保護ページは `getServerSession(authOptions)` でログイン状態を確認します。
- 投稿やレスポンスの作成者は、ブラウザから送信された user id ではなく `session.user.id` から決定します。
- 投稿編集・削除の所有者チェックは UI だけでなく API 側でも実施します。
- soft-deleted users/posts/responses は通常表示から除外します。
- Prisma query API を使用し、SQL injection リスクを抑えます。

## MySQL 設定例

ローカル開発:

```env
DATABASE_URL="mysql://root:YOUR_LOCAL_MYSQL_PASSWORD@127.0.0.1:3307/bulletin_board"
```

本番環境の例:

```env
DATABASE_URL="mysql://APP_USER:APP_PASSWORD@DB_HOST:3306/DB_NAME"
NEXTAUTH_URL="https://your-domain.example"
NEXTAUTH_SECRET="replace-with-a-long-random-secret"
```

本番用の password や secret は Git に commit しません。
