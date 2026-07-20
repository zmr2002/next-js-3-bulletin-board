# Next.js ログイン式掲示板

Next.js 14 App Router、TypeScript、Prisma、MySQL、NextAuth.js を使用した、ログイン式の掲示板アプリケーションです。

入社先企業から提示された技術課題をもとに、ユーザー登録からログイン、プロフィール管理、投稿と返信までの一連の流れを実装しました。画面を動かすだけでなく、入力検証、セッション管理、API 側の認可、データベース操作までを一つのアプリケーションとして確認できる構成にしています。

## 主な機能

### アカウント

- ユーザー登録
- ログイン / ログアウト
- プロフィールの表示と編集
- アカウントの退会（ソフトデリート）
- ダッシュボードとプロフィールページのログイン保護

### 投稿と返信

- 投稿の一覧、詳細、作成、編集、削除
- 投稿への返信
- 投稿者本人だけが編集・削除できる認可チェック
- 削除済みデータを通常画面から除外するソフトデリート

### 入力検証

- React Hook Form と Zod によるフォーム検証
- API Route でのサーバー側検証
- 重複メールアドレスや不正な入力に対するエラー表示

## アプリケーション構成

```mermaid
flowchart LR
    Browser["Browser / React Forms"] --> Validation["React Hook Form + Zod"]
    Validation --> API["Next.js API Routes"]
    API --> Session["NextAuth Session"]
    API --> Prisma["Prisma Client"]
    Prisma --> MySQL[(MySQL)]
```

登録、ログイン、投稿作成などの書き込み処理では、ブラウザから受け取った値をそのまま保存しません。API 側でも入力を検証し、ログインユーザーの識別にはサーバー上のセッションを使用します。

## データモデル

```mermaid
erDiagram
    User ||--o{ Post : creates
    User ||--o{ Response : writes
    Post ||--o{ Response : receives

    User {
        string id PK
        string name
        string email UK
        string password
        boolean isDeleted
    }

    Post {
        string id PK
        string title
        string content
        string authorId FK
        boolean isDeleted
    }

    Response {
        string id PK
        string content
        string postId FK
        string authorId FK
        boolean isDeleted
    }
```

## 実装上のポイント

### 認証とセッション

NextAuth.js の Credentials Provider を使用しています。ログイン時に bcryptjs でパスワードを照合し、JWT と session callback を通して `session.user.id` を利用できるようにしています。

### サーバー側の認可

編集・削除ボタンを投稿者だけに表示するだけでなく、API Route でも投稿の `authorId` と `session.user.id` を比較します。別のユーザーが API を直接呼び出した場合も、他人の投稿を変更できません。

### ソフトデリート

ユーザー、投稿、返信には `isDeleted` を持たせています。削除時にレコード自体を消すのではなく状態を更新し、通常の取得処理では削除済みデータを除外します。

### クライアントとサーバーの二重検証

フォームでは入力直後にエラーを表示し、API Route でも同じ Zod schema を使って再検証します。ブラウザ側の検証を回避したリクエストも、サーバー側で拒否します。

## 技術スタック

| 分類 | 使用技術 |
| --- | --- |
| フレームワーク | Next.js 14 App Router、React 18 |
| 言語 | TypeScript |
| UI | Tailwind CSS、React Hook Form |
| バリデーション | Zod |
| 認証 | NextAuth.js、bcryptjs |
| データベース | MySQL 8、Prisma ORM |
| テスト | Jest、Testing Library |

## セットアップ

### 必要な環境

- Node.js 20 以降
- npm
- MySQL 8

### 1. 依存関係をインストール

```bash
npm install
```

### 2. データベースを作成

MySQL にログインし、開発用データベースを作成します。

```sql
CREATE DATABASE bulletin_board
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
```

### 3. 環境変数を設定

`.env.example` を参考に `.env` または `.env.local` を作成します。

```env
DATABASE_URL="mysql://USER:PASSWORD@127.0.0.1:3306/bulletin_board"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-this-with-a-long-random-secret"
```

実際のパスワードや secret は Git にコミットしないでください。

### 4. Prisma を準備

```bash
npx prisma generate
npx prisma migrate deploy
```

### 5. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開きます。

PowerShell の実行ポリシーによって `npm` や `npx` がブロックされる場合は、`npm.cmd` と `npx.cmd` を使用してください。

## テストとビルド

Zod schema のテストを実行します。

```bash
npm test
```

型チェックを含む本番用ビルドを確認します。

```bash
npm run build
```

## セキュリティ上の対応

- パスワードは bcryptjs でハッシュ化して保存します。
- 保護ページではサーバー側でセッションを確認します。
- 投稿や返信の作成者は `session.user.id` から決定します。
- 投稿の編集・削除は API 側でも所有者を確認します。
- API Route で入力値を再検証します。
- Prisma Client を通してデータベースにアクセスします。
- `.env` と `.env.local` は Git の管理対象外です。

## 現在の制限

- 投稿一覧のページネーションは未実装です。
- メールアドレス確認とパスワード再設定は未実装です。
- 自動テストは入力バリデーションが中心で、ブラウザ E2E テストはありません。
- 公開環境へのデプロイは行っていません。

## 補足ドキュメント

要件への対応状況と手動確認項目は [`docs/final-review.md`](docs/final-review.md) にまとめています。
