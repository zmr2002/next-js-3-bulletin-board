# Day 2 学習手順: Registration と Validation

## 目的

Day 2 では、登録フォームから MySQL の user row 作成までの流れを理解する。

## Step 1: 起動と確認

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

ブラウザ:

```text
http://localhost:3000/register
```

## Step 2: 読むファイル

```text
src/lib/validations.ts
src/components/auth/RegisterForm.tsx
src/app/api/users/register/route.ts
src/components/ui/Input.tsx
src/components/ui/Button.tsx
src/components/ui/FormError.tsx
```

## Step 3: 登録 flow

```text
RegisterForm が name/email/password を集める。
React Hook Form と Zod が browser 側で validation する。
form が /api/users/register に JSON を送る。
API route が registerSchema.parse(body) で server-side validation する。
Prisma が duplicate email を確認する。
bcrypt.hash が password を hash 化する。
Prisma が users table に user を作成する。
API は password を返さず user 情報だけ返す。
```

## Step 4: 回答ガイド

質問: registration に必要な fields は？

答え:

```text
name, email, password
```

質問: email format を確認する rule は？

答え:

```ts
.email()
```

質問: password strength を確認する rule は？

答え:

```ts
.min(8)
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
```

質問: raw form data は API のどこに入りますか？

答え:

```ts
const body = await request.json();
```

質問: data はどこで validation されますか？

答え:

```ts
const data = registerSchema.parse(body);
```

質問: password はどこで hash 化されますか？

答え:

```ts
const hashedPassword = await bcrypt.hash(data.password, 12);
```

質問: API が password を返さない理由は？

答え:

```text
password hash であっても client に返す必要がなく、security risk になるためです。
```

## Step 5: 意図的なバグ練習

実施した内容:

- required field を抜いて validation error を確認。
- server-side validation が必要な理由を確認。
- raw password を保存してはいけない理由を確認。

## 完了条件

- register が動作する。
- password hash を確認できる。
- duplicate email error を確認できる。
- browser validation と server validation の違いを説明できる。
