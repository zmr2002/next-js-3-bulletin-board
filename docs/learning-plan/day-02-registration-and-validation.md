# Day 2: Registration And Validation

## Goal

Day 2 の目標は、ユーザー登録機能を完成させながら、Zod validation、React Hook Form、server-side validation、bcrypt password hashing、duplicate email handling を理解することです。

Day 2 も、あなたがゼロから全てを書く日ではありません。Codex が main baseline を生成し、あなたは生成されたコードを読み、小さな修正、手動テスト、意図的な bug 修正、説明練習を通して理解します。

## Learning Topics

- Zod schema の役割。
- `z.infer` で schema から TypeScript type を作る理由。
- React Hook Form が form state を管理する仕組み。
- `zodResolver` が Zod と form をつなぐ仕組み。
- Next.js App Router の API route handler。
- `request.json()` で browser から送られた JSON を読む流れ。
- client-side validation と server-side validation の違い。
- `bcrypt.hash` で password を保存前に hash 化する理由。
- Prisma で user を作成する流れ。
- duplicate email を database 保存前に検出する理由。
- API response で password を返してはいけない理由。

## What Codex Should Generate Or Implement

Codex が生成・実装する baseline:

- `registerSchema`。
- `loginSchema`。
- `postSchema`。
- `profileSchema`。
- `responseSchema`。
- registration API route。
- duplicate email check。
- password hash。
- registration page。
- registration form。
- reusable UI components。
- validation error と API error の表示。

目的は、登録機能の main path を先に動く状態にして、あなたが「form から MySQL insert までの流れ」を読めるようにすることです。

## Files Codex Should Create Or Modify

重要ファイル:

```text
src/lib/validations.ts
src/app/api/users/register/route.ts
src/app/register/page.tsx
src/components/auth/RegisterForm.tsx
src/components/ui/Input.tsx
src/components/ui/Button.tsx
src/components/ui/FormError.tsx
src/lib/prisma.ts
```

読む順番のおすすめ:

1. `src/lib/validations.ts`
2. `src/components/auth/RegisterForm.tsx`
3. `src/app/api/users/register/route.ts`
4. `src/lib/prisma.ts`

## What You Should Run To Verify It

MySQL:

```powershell
scripts\start-local-mysql.cmd
```

development server:

```powershell
npm.cmd run dev
```

browser:

```text
http://localhost:3000/register
```

database を確認したい場合:

```powershell
scripts\mysql-shell.cmd
```

MySQL 内:

```sql
USE bulletin_board;
SELECT id, name, email, password, createdAt FROM users;
```

## Manual Testing Checklist

- `/register` を開く。
- valid user を登録する。
- MySQL で user row が作られたことを確認する。
- password が raw password ではなく hash になっていることを確認する。
- 同じ email で duplicate registration を試す。
- duplicate email が拒否されることを確認する。
- empty name を試す。
- invalid email を試す。
- weak password を試す。
- API response に password が含まれないことを確認する。

## Small Manual Tasks You Should Do Yourself

小さな手動変更:

1. register form の label または placeholder を少し変更する。
2. password validation message を読みやすくする。
3. duplicate email error message を確認し、必要なら文言だけ改善する。
4. MySQL から test account を自分で削除して、再登録できることを確認する。

学習目的:

- form text がどの component にあるか探す。
- validation message が Zod 由来か API 由来か区別する。
- database に保存された password が hash であることを自分の目で確認する。

## Intentional Bug Drill

Day 2 では、2つの bug drill を行います。

### Bug 1: required field を request から抜く

Codex が register request の field を一時的に壊します。

あなたが確認すること:

- browser form 側で止まるのか。
- API route まで request が届くのか。
- Zod validation error になるのか。
- Prisma error になるのか。

目的:

```text
form -> Zod -> API route -> Prisma -> MySQL
```

のどこで失敗しているかを切り分ける練習です。

### Bug 2: raw password 保存の危険性を確認する

Codex が local-only の練習として、password hash の処理を一時的に壊します。

あなたが確認すること:

- MySQL に raw password が保存されると何が危険か。
- API はなぜ password を返してはいけないか。
- hash に戻したあと、database の見え方がどう変わるか。

この bug は必ず元に戻します。

## Hint Ladder

bug drill で詰まった場合は、Codex に次の順番で助けを求めます。

1. conceptual hint: form、validation、API、Prisma のどの層を疑うべきか。
2. file hint: どの file を読むべきか。
3. code-shape hint: 正解全体ではなく、必要な code shape。
4. final fix: 最後に修正内容と理由。

## Explanation Practice

自分の言葉で答える質問:

- registration に必要な fields は何か。
- email format はどの rule で check されるか。
- password strength はどの rule で check されるか。
- `RegisterInput` はどのように作られるか。
- raw form data は API のどこに入ってくるか。
- data validation はどこで行われるか。
- duplicate email check はどこにあるか。
- password hash はどこで行われるか。
- API はなぜ `select` を使って user を返すのか。
- React Hook Form は何を管理するのか。
- `RegisterForm.tsx` はなぜ `"use client"` が必要なのか。

## Done Criteria

Day 2 が完了したと言える状態:

- user が登録できる。
- password が MySQL に raw password で保存されない。
- duplicate email が拒否される。
- invalid input が Zod validation で拒否される。
- registration form が error message を表示する。
- registration API が password を response に含めない。
- form submit から MySQL insert までの流れを説明できる。

## Notes To Write Yourself

学習後に自分で残すメモ:

```text
今日わかったこと:

まだ曖昧なこと:

自分で直した bug:

次に復習したい file:
```
