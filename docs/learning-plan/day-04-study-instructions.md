# Day 4 学習手順: Protected Pages と Profile

このファイルは、Codex が Day 4 の protected page/profile baseline を生成したあとに使う。目的は、server-side session check、profile update、soft delete を理解すること。

## Current Day 4 Baseline

Codex が生成したもの:

- protected dashboard。
- profile page。
- profile edit page。
- profile update API。
- account withdrawal API。
- profile form。
- withdrawal button。

Main routes:

```text
/dashboard
/dashboard/profile
/dashboard/profile/edit
/api/users/profile
/api/users/withdraw
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

Protected pages:

- logout 状態で `/dashboard` を開く。
- login page に redirect される。
- login 後に `/dashboard` を開く。
- `/dashboard/profile` を開く。
- `/dashboard/profile/edit` を開く。

Profile edit:

- name を変更する。
- email を変更する。
- invalid email を試す。
- duplicate email を試す。
- update 後に profile page へ戻る。

Withdrawal:

- confirmation が出る。
- confirm すると `isDeleted = true` になる。
- sign out される。
- withdrawn account では login できない。

## Step 3: Read These Files Carefully

### 1. `src/app/dashboard/page.tsx`

Focus:

- `getServerSession(authOptions)`
- `redirect`
- `session.user.id`
- `prisma.user.findFirst`
- `isDeleted: false`

Questions:

- page はどこで login check をするか。
- query が `session.user.id` を使う理由は何か。
- `isDeleted: false` を filter する理由は何か。

### 2. `src/app/dashboard/profile/page.tsx`

Focus:

- selected user fields。
- password が select されていないこと。
- withdrawal section。

Questions:

- どの user fields が表示されるか。
- どの field が意図的に表示されないか。
- withdrawal が soft delete である理由は何か。

### 3. `src/app/dashboard/profile/edit/page.tsx`

Focus:

- server-side session check。
- current user load。
- `ProfileForm initialData`。

Questions:

- edit page が current user を server で読み込む理由は何か。
- form が name/email だけ受け取る理由は何か。

### 4. `src/app/api/users/profile/route.ts`

Focus:

- authentication check。
- `profileSchema.parse(body)`。
- current user check。
- duplicate email check。
- `prisma.user.update`。

Questions:

- API はどこで authentication を確認するか。
- input はどこで validation されるか。
- browser から user id を受け取らない理由は何か。
- duplicate email はどう防ぐか。

### 5. `src/app/api/users/withdraw/route.ts`

Focus:

- authentication check。
- `isDeleted: true`。

Questions:

- withdrawal は MySQL で何を変更するか。
- なぜ user row を物理削除しないのか。
- withdrawn user が login できない理由は何か。

## Step 4: Completed Answer Guide

Question: protected page はどう動くか？

Answer:

```text
server page が getServerSession(authOptions) を呼び、session.user.id がなければ login page に redirect します。
```

Question: authentication と authorization の違いは？

Answer:

```text
authentication は「ログインしているか」。
authorization は「その操作をしてよい user か」。
```

Question: profile query が `session.user.id` を使う理由は？

Answer:

```text
browser から送られた user id は改ざん可能なので、server-side session の user id を信頼するためです。
```

Question: profile editing はどう validation されるか？

Answer:

```ts
const data = profileSchema.parse(body);
```

Question: duplicate email protection はどう動くか？

Answer:

```text
入力 email を持つ user を探し、その id が current user と違う場合は 409 を返します。
```

Question: withdrawal は MySQL で何を変更するか？

Answer:

```text
users.isDeleted を true にします。
```

Question: soft-deleted user login が失敗する理由は？

Answer:

```text
NextAuth authorize が user.isDeleted を確認し、true なら null を返すためです。
```

## Step 5: Intentional Bug Drill

Bug 1:

```text
protected page から session check を外し、logout 状態で見えてしまう問題を確認する。
```

Bug 2:

```text
duplicate email handling を壊し、DB unique constraint error と user-friendly error の違いを確認する。
```

## Step 6: Explanation Questions

- protected page はこの app でどう動くか。
- authentication と authorization の違いは何か。
- dashboard/profile pages が `getServerSession(authOptions)` を使う理由は何か。
- profile queries が `session.user.id` を使う理由は何か。
- profile API が browser user id を信用してはいけない理由は何か。
- profile editing はどう validation するか。
- account withdrawal は MySQL で何を変えるか。
- Day 4 の重要ファイルはどれか。

## Done Criteria

- protected pages が機能する。
- profile display/edit が機能する。
- duplicate email が拒否される。
- withdrawal が soft delete になる。
- auth guard placement を説明できる。
