# Day 2: Registration And Validation

## 目標

ユーザー登録機能を作り、Zod validation、React Hook Form、bcrypt password hash、duplicate email check を理解する。

## 学習内容

- Zod schema。
- React Hook Form。
- `zodResolver`。
- Next.js API Route の `POST` handler。
- `bcrypt.hash`。
- Prisma による user 作成。
- API response で password を返さない理由。

## Codex が実装したこと

- `registerSchema` などの validation schema。
- registration API。
- password hash。
- duplicate email check。
- registration form。
- reusable UI components。

## 重要ファイル

```text
src/lib/validations.ts
src/app/api/users/register/route.ts
src/components/auth/RegisterForm.tsx
src/components/ui/Input.tsx
src/components/ui/Button.tsx
src/components/ui/FormError.tsx
```

## 確認ポイント

- 正しい入力で user registration できる。
- duplicate email は `409 Conflict` で拒否される。
- DB に保存される password は raw password ではなく hash。
- API response に password は含まれない。

## 完了条件

- user が登録できる。
- password が hash 化される。
- duplicate email が拒否される。
- registration flow を説明できる。
