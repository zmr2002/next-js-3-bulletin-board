# Day 4 学習手順: Protected Pages と Profile

## 目的

Day 4 では、server-side session check による protected page と profile management を理解する。

## Step 1: 起動

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

テストアカウント例:

```text
email: test@example.com
password: Password123
```

## Step 2: 読むファイル

```text
src/app/dashboard/page.tsx
src/app/dashboard/profile/page.tsx
src/app/dashboard/profile/edit/page.tsx
src/app/api/users/profile/route.ts
src/app/api/users/withdraw/route.ts
src/components/profile/ProfileForm.tsx
src/components/profile/WithdrawAccountButton.tsx
```

## Step 3: Protected page の仕組み

```text
server page が getServerSession(authOptions) を呼ぶ。
session.user.id がなければ login page に redirect する。
session があれば MySQL から current user を読む。
user が存在し、isDeleted: false の場合だけ page を表示する。
```

## Step 4: Profile update flow

```text
ProfileForm が name/email を送信する。
API が getServerSession(authOptions) で login を確認する。
profileSchema.parse(body) で validation する。
current user が active か確認する。
同じ email を別 user が使っていないか確認する。
Prisma が users table を update する。
```

## Step 5: 回答ガイド

質問: authentication と authorization の違いは？

答え:

```text
authentication は「ログインしているか」。
authorization は「その操作をしてよい user か」。
```

質問: profile query が `session.user.id` を使う理由は？

答え:

```text
browser から user id を受け取ると改ざんできるため、server-side session の user id を信用するためです。
```

質問: soft delete の理由は？

答え:

```text
関連する post/response を保持しつつ、通常表示や login から除外できるためです。
```

質問: withdrawal 後に sign out する理由は？

答え:

```text
account が isDeleted: true になったあとも session が残ると不自然なので、logout して状態を揃えるためです。
```

## Step 6: 意図的なバグ練習

実施した内容:

- protected page から session check を外すバグ。
- duplicate email handling の不備。
- logout/withdrawal 周辺の redirect と session 状態の確認。

## 完了条件

- dashboard/profile が protected。
- profile edit が動作する。
- duplicate email が拒否される。
- withdrawal が `isDeleted = true` にする。
