# Day 7 学習手順: テスト、MySQL確認、最終提出

このファイルは、Day 7 の学習ログです。目的は、完成したアプリを確認し、validation test を理解し、2つの意図的なバグを修正し、最後にプロジェクト全体の流れを説明できるようになることです。

目安時間: 3-4時間。

## 現在の Day 7 ベースライン

Codex が生成したもの:

- Jest 設定。
- Jest setup file。
- Zod validation test。
- README の更新。
- final review document。
- `package.json` の test script。

確認済み:

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
Result: database schema is up to date
```

## Step 1: 最終チェックを実行する

MySQL が起動していない場合:

```powershell
scripts\start-local-mysql.cmd
```

validation test:

```powershell
npm.cmd test
```

production build:

```powershell
npm.cmd run build
```

Prisma migration status:

```powershell
npx.cmd prisma migrate status
```

MySQL table check:

```powershell
scripts\mysql-shell.cmd
```

MySQL 内で実行:

```sql
USE bulletin_board;
SHOW TABLES;
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM posts;
SELECT COUNT(*) FROM responses;
```

## Step 2: 手動の最終テストチェックリスト

認証:

- 正しい情報で user registration する。
- 同じ email で duplicate registration を試し、拒否されることを確認する。
- 正しい password で login する。
- 間違った password で login に失敗することを確認する。
- logout する。

保護ページ:

- logout 状態で `/dashboard` にアクセスする。
- login page に redirect されることを確認する。
- login 後に `/dashboard` を開く。
- profile page を開く。
- 自分の profile を編集する。

投稿:

- post を作成する。
- post detail page を開く。
- 自分の post を編集する。
- 別 user で login する。
- 別 user が最初の user の post を編集できないことを確認する。
- 自分の post を soft delete する。
- deleted post が通常の list に出ないことを確認する。

レスポンス:

- 表示可能な post detail page を開く。
- login 状態で response を作成する。
- response が正しい post の下に表示されることを確認する。
- `/posts` の response count が更新されることを確認する。
- logout し、response form が非表示になることを確認する。

## Step 3: 丁寧に読むファイル

### 1. `__tests__/lib/validations.test.ts`

注目するもの:

- `describe`
- `it`
- `safeParse`
- `parse`
- `expect(result.success).toBe(...)`

確認ポイント:

- `describe` は同じ schema や機能の test をまとめる。
- `it` は1つの具体的な振る舞いを確認する。
- `safeParse` は例外を投げずに result object を返す。
- 現在の test は validation schema のみを確認し、API、DB、browser integration までは確認しない。

### 2. `src/lib/validations.ts`

schema 対応:

```text
registerSchema -> registration input
loginSchema -> login input
postSchema -> post input
profileSchema -> profile edit input
responseSchema -> response input
```

重要ポイント:

```text
Form 側 validation = 使いやすさ。
API 側 validation = server と DB を守るための安全性。
```

`z.infer` は Zod schema から TypeScript type を作ります。

### 3. `jest.config.js` と `jest.setup.js`

重要ポイント:

- `next/jest` は Next.js project を Jest が理解しやすくする。
- `jsdom` は test 用の仮想 browser environment を提供する。
- `moduleNameMapper` は `@/` を `src/` に対応させる。
- `jest.setup.js` は `@testing-library/jest-dom` を読み込む。

### 4. `README.md` と `docs/final-review.md`

確認ポイント:

- setup command。
- MySQL configuration。
- test/build command。
- app flow。
- security notes。
- known limitations。

## Step 4: 手動修正タスク

完了済み:

- validation test を1つ追加。
- test name をより明確に変更。

最終的な test:

```text
npm.cmd test
Result: passed, 15 tests
```

## Step 5: 意図的なバグ修正ドリル

完了済み:

```text
Bug 1: validation logic bug
password rule が小文字・大文字・数字を要求する状態に戻った。
```

```text
Bug 2: project wiring/import bug
posts page が Link を next/link から import する状態に戻り、production build が通った。
```

## Step 6: 説明問題と回答ガイド

質問: ローカルで project を起動するにはどうしますか？

答え:

```text
MySQL を起動してから Next.js dev server を起動します。
```

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

質問: どの test を追加し、なぜ追加しましたか？

答え:

```text
registerSchema、loginSchema、postSchema、profileSchema、responseSchema の validation test を追加しました。
正しい入力が通り、不正な入力が拒否されることを提出前に確認するためです。
```

質問: `npm.cmd test` は何を確認しますか？

答え:

```text
Jest を実行し、現在は registration、login、post、profile、response の validation rule を確認します。
```

質問: `npm.cmd run build` は何を確認しますか？

答え:

```text
Next.js app が production 用に compile できるか確認します。
TypeScript error、broken import、server/client component の問題などを見つけられます。
```

質問: validation test が提出前に役立つ理由は何ですか？

答え:

```text
主要な入力ルールが壊れていないことを素早く確認できるためです。
```

質問: 高度な integration test が今回必須でない理由は何ですか？

答え:

```text
1週間の beginner task では、動く app、basic validation test、build、manual check を優先するためです。
```

質問: registration は form から MySQL までどう動きますか？

答え:

```text
RegisterForm が name/email/password を集める。
React Hook Form と Zod が browser 側で validation する。
form が /api/users/register に JSON を送る。
API が registerSchema で再 validation する。
API が duplicate email を確認する。
bcrypt が password を hash 化する。
Prisma が MySQL の users table に user を作成する。
API は password を返さず user 情報だけ返す。
```

質問: なぜ password を hash 化しますか？

答え:

```text
DB が漏れても元の password を直接読まれないようにするためです。
```

質問: NextAuth login はどう動きますか？

答え:

```text
LoginForm が signIn("credentials") に email/password を渡す。
NextAuth が Credentials Provider の authorize を実行する。
authorize は input validation、MySQL user lookup、soft-deleted user rejection、bcrypt.compare を行う。
正しければ id/name/email を返す。
JWT callback と session callback が user id を session に入れる。
```

質問: session data には何が入りますか？

答え:

```text
session.user.id、session.user.name、session.user.email など、login 後に app が使う user 情報が入ります。
```

質問: なぜ `session.user.id` が必要ですか？

答え:

```text
誰が post、profile、delete、response の操作をしているかを server 側で信頼して判断するためです。
browser から送られた user id は改ざん可能なので信用しません。
```

質問: protected page はどう動きますか？

答え:

```text
server page が getServerSession(authOptions) を呼ぶ。
session.user.id がなければ login に redirect する。
session があれば MySQL から current user を読み、active user の場合だけ page を表示する。
```

質問: post CRUD はどう動きますか？

答え:

```text
Create: logged-in user が PostForm を送信し、API が postSchema で validation して authorId = session.user.id で作成する。
Read: isDeleted: false の post と active author を読み込む。
Update: post を読み、logged-in user が author か確認して title/content を更新する。
Delete: author か確認し、isDeleted = true にして soft delete する。
```

質問: なぜ ownership check は API route で必要ですか？

答え:

```text
UI で Edit/Delete button を隠すだけでは security にならないためです。
user は直接 PATCH/DELETE request を送れるので、API route が最後の防衛ラインです。
```

質問: response は post と user にどう接続しますか？

答え:

```text
response は postId と authorId を保存します。
postId は response を post に接続し、authorId は response を書いた user に接続します。
```

質問: Prisma は Next.js と MySQL をどう接続しますか？

答え:

```text
schema.prisma が provider、model、relation を定義します。
DATABASE_URL が MySQL 接続先を教えます。
Prisma migration が MySQL table を作ります。
Prisma Client により Next.js code から prisma.user.findUnique や prisma.post.create のように DB 操作できます。
```

質問: 最終提出で重要なファイルはどれですか？

答え:

```text
prisma/schema.prisma
src/lib/auth.ts
src/lib/db.ts
src/lib/validations.ts
src/types/next-auth.d.ts
src/app/api/users/register/route.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/api/posts/route.ts
src/app/api/posts/[postId]/route.ts
src/app/api/posts/[postId]/responses/route.ts
src/app/dashboard/page.tsx
src/app/posts/page.tsx
src/app/posts/[postId]/page.tsx
src/components/auth/*
src/components/posts/*
__tests__/lib/validations.test.ts
README.md
docs/final-review.md
```

## Step 7: 完了条件

- `npm.cmd test` が通る。
- `npm.cmd run build` が通る。
- `npx.cmd prisma migrate status` が schema up to date を表示する。
- 主要な手動アプリ確認が通る。
- README と final review document が日本語で mentor に読める状態になっている。
- Step 6 の説明問題に答えた。
