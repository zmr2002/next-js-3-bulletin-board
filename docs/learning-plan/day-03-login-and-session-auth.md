# Day 3: Login And Session Auth

## 目標

NextAuth Credentials Provider を使い、login/logout、JWT session、`session.user.id` を理解する。

## 学習内容

- NextAuth.js。
- Credentials Provider。
- `authorize`。
- `bcrypt.compare`。
- JWT session strategy。
- callback による `token.id` と `session.user.id`。
- TypeScript module augmentation。

## Codex が実装したこと

- `authOptions`。
- NextAuth route。
- login form。
- logout button。
- session callback。
- `src/types/next-auth.d.ts`。

## 重要ファイル

```text
src/lib/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/components/auth/LoginForm.tsx
src/components/auth/LogoutButton.tsx
src/types/next-auth.d.ts
src/components/layout/Header.tsx
```

## 完了条件

- registered user が login できる。
- wrong password は拒否される。
- logout できる。
- `session.user.id` を使う理由を説明できる。
