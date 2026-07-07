# Day 2 学習手順: Registration と Validation

このファイルは、Codex が Day 2 の registration baseline を生成したあとに使う。目的は、form submit から MySQL insert までの流れを理解すること。

## Current Day 2 Baseline

Codex が生成したもの:

- Zod validation schemas。
- registration API。
- bcrypt password hashing。
- duplicate email rejection。
- registration form。
- reusable UI components。

Main route:

```text
/register
```

Main API endpoint:

```text
POST /api/users/register
```

## Step 1: App を起動する

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

開く:

```text
http://localhost:3000/register
```

## Step 2: Manual Testing Checklist

Valid registration:

- name を入力する。
- email を入力する。
- password に `Password123` のような strong password を入力する。
- submit する。
- success message を確認する。

Invalid registration:

- empty name。
- invalid email。
- short password。
- lowercase only password。
- duplicate email。

Database check:

```sql
USE bulletin_board;
SELECT id, name, email, password, isDeleted, createdAt FROM users;
```

確認:

```text
password column が raw password ではなく hash になっている。
```

## Step 3: Read These Files Carefully

### 1. `src/lib/validations.ts`

Focus:

- `registerSchema`
- `name`
- `email`
- `password`
- `.email()`
- `.min(8)`
- `.regex(...)`
- `z.infer`

Questions:

- registration に必要な fields は何か。
- email format を確認する rule は何か。
- password strength を確認する rule は何か。
- `registerSchema` から作られる TypeScript type は何か。

### 2. `src/app/api/users/register/route.ts`

Focus:

- `request.json()`
- `registerSchema.parse(body)`
- `prisma.user.findUnique`
- `bcrypt.hash`
- `prisma.user.create`
- `select`
- `z.ZodError`

Questions:

- raw form data はどこから API に入るか。
- data はどこで validation されるか。
- duplicate email check はどこか。
- password はどこで hash 化されるか。
- API が `select` を使う理由は何か。

### 3. `src/components/auth/RegisterForm.tsx`

Focus:

- `"use client"`
- `useForm<RegisterInput>`
- `zodResolver(registerSchema)`
- `handleSubmit`
- `fetch("/api/users/register")`
- `setFormError`
- `successMessage`

Questions:

- この component に `"use client"` が必要な理由は何か。
- React Hook Form は何を管理するか。
- Zod resolver は何をつなぐか。
- API が error を返したら何が起きるか。

## Step 4: Completed Answer Guide

Question: registration に必要な fields は？

Answer:

```text
name, email, password
```

Question: email format を確認する rule は？

Answer:

```ts
.email()
```

Question: password strength を確認する rule は？

Answer:

```ts
.min(8)
.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
```

Question: raw form data は API のどこに入るか？

Answer:

```ts
const body = await request.json();
```

Question: data はどこで validation されるか？

Answer:

```ts
const data = registerSchema.parse(body);
```

Question: duplicate email check はどこか？

Answer:

```ts
const existingUser = await prisma.user.findUnique({
  where: { email: data.email }
});
```

Question: password はどこで hash 化されるか？

Answer:

```ts
const hashedPassword = await bcrypt.hash(data.password, 12);
```

Question: API が `select` を使う理由は？

Answer:

```text
client に返してよい field だけを選ぶためです。password hash は返しません。
```

Question: React Hook Form は何を管理するか？

Answer:

```text
input value、submit handling、validation errors、isSubmitting、reset などを管理します。
```

Question: `"use client"` が必要な理由は？

Answer:

```text
useState、useForm、onSubmit、browser fetch など client-side interaction を使うためです。
```

## Step 5: Intentional Bug Drill

Bug 1:

```text
register request から required field を外し、form/Zod/API/Prisma のどこで失敗するか確認する。
```

Bug 2:

```text
raw password を保存する危険性を確認し、bcrypt hash に戻す。
```

## Step 6: Explanation Questions

- registration は form submit から MySQL insert までどう動くか。
- Zod は何を validation するか。
- server-side validation が必要な理由は何か。
- password を hash 化する理由は何か。
- bcrypt は original password の代わりに何を保存するか。
- duplicate email はどう拒否されるか。
- API が password field を返してはいけない理由は何か。
- Day 2 の重要ファイルはどれか。

## Done Criteria

- user が登録できる。
- duplicate email が拒否される。
- password が hash 化される。
- registration flow を説明できる。
