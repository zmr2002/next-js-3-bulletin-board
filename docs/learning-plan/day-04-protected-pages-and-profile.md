# Day 4: Protected Pages And Profile

## 目標

protected page、profile display/edit、account withdrawal を実装し、authentication と authorization の違いを理解する。

## 学習内容

- server-side session check。
- `getServerSession(authOptions)`。
- `redirect`。
- profile update validation。
- duplicate email protection。
- soft delete。

## Codex が実装したこと

- protected dashboard。
- profile page。
- profile edit page。
- profile update API。
- account withdrawal API。
- withdrawn user の login 拒否。

## 重要ファイル

```text
src/app/dashboard/page.tsx
src/app/dashboard/profile/page.tsx
src/app/dashboard/profile/edit/page.tsx
src/app/api/users/profile/route.ts
src/app/api/users/withdraw/route.ts
src/components/profile/ProfileForm.tsx
src/components/profile/WithdrawAccountButton.tsx
```

## 完了条件

- logged-out user は dashboard/profile にアクセスできない。
- logged-in user は自分の profile を見られる。
- logged-in user は自分の profile だけ編集できる。
- account withdrawal は `isDeleted = true` にする。
