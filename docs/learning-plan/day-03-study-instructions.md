# Day 3 学習手順: Login と Session Auth

このファイルは、Codex が Day 3 の authentication baseline を生成したあとに使う。目的は、NextAuth login、password comparison、session callback、TypeScript augmentation を理解すること。

## Current Day 3 Baseline

Codex が生成したもの:

- `authOptions`。
- NextAuth Credentials Provider。
- `authorize`。
- login form。
- logout button。
- session callback。
- JWT callback。
- NextAuth type augmentation。

Main routes:

```text
/login
/api/auth/[...nextauth]
```

## Step 1: App を起動する

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

Test account:

```text
email: test@example.com
password: Password123
```

## Step 2: Manual Testing Checklist

- `/login` を開く。
- correct email/password で login する。
- wrong password を試す。
- header に user email と logout button が出る。
- logout する。
- protected page にアクセスしたとき redirect される。

## Step 3: Read These Files Carefully

### 1. `src/lib/auth.ts`

Focus:

- `CredentialsProvider`
- `authorize`
- `loginSchema.safeParse`
- `prisma.user.findUnique`
- `user.isDeleted`
- `bcrypt.compare`
- returned user object
- `jwt` callback
- `session` callback

Questions:

- `authorize` は何をするか。
- user は MySQL のどこから探すか。
- bcrypt はどこで password を比較するか。
- `authorize` が `id`, `name`, `email` だけ返す理由は何か。
- JWT callback は何を保存するか。
- session callback は何を `session.user.id` にコピーするか。

### 2. `src/app/api/auth/[...nextauth]/route.ts`

Focus:

- `NextAuth(authOptions)`
- `GET`
- `POST`

Questions:

- この route が `authOptions` を使う理由は何か。
- NextAuth が `GET` と `POST` handler を必要とする理由は何か。

### 3. `src/types/next-auth.d.ts`

Focus:

- `declare module "next-auth"`
- `Session`
- `User`
- `declare module "next-auth/jwt"`
- `JWT`

Questions:

- TypeScript がこの file を必要とする理由は何か。
- `Session` と `JWT` の両方に `id` を追加する理由は何か。

### 4. `src/components/auth/LoginForm.tsx`

Focus:

- `"use client"`
- `signIn("credentials")`
- `redirect: false`
- `callbackUrl`
- `router.push`
- `router.refresh`

Questions:

- この component に `"use client"` が必要な理由は何か。
- `signIn("credentials")` は何を呼ぶか。
- `redirect: false` を使う理由は何か。
- login 失敗時は何が起きるか。

## Step 4: Completed Answer Guide

Question: `authorize` は何をするか？

Answer:

```text
email/password を validation し、MySQL から user を探し、bcrypt.compare で password を確認します。
```

Question: `bcrypt.compare` は何をするか？

Answer:

```text
入力 password と DB に保存された hash が同じ password 由来か確認します。decrypt はしません。
```

Question: `authorize` が password を返さない理由は？

Answer:

```text
password hash であっても client/session に持たせる必要がなく、security risk になるためです。
```

Question: JWT callback は何をするか？

Answer:

```text
login 成功時に user.id を token.id に保存します。
```

Question: session callback は何をするか？

Answer:

```text
token.id を session.user.id にコピーし、app が current user id を使えるようにします。
```

Question: `redirect: false` を使う理由は？

Answer:

```text
NextAuth に自動 redirect させず、form component 側で error 表示や redirect を制御するためです。
```

Question: TypeScript augmentation が必要な理由は？

Answer:

```text
default の Session type には user.id がないため、session.user.id を安全に使えるよう型を拡張します。
```

## Step 5: Intentional Bug Drill

Bug:

```text
session callback で id を copy しないようにして、session.user.id が使えない問題を確認する。
```

学習ポイント:

```text
post creation、profile update、authorization は current user id が必要なので session.user.id が重要。
```

## Step 6: Explanation Questions

- NextAuth login は Credentials Provider でどう動くか。
- `authorize` は何をするか。
- bcrypt は decrypt せずにどう password を比較するか。
- session data には何が入るか。
- `session.user.id` が必要な理由は何か。
- JWT callback と session callback の違いは何か。
- logout button は何をするか。
- Day 3 の重要ファイルはどれか。

## Done Criteria

- login/logout が動く。
- wrong password が拒否される。
- session に user id が入る。
- NextAuth login flow を説明できる。
