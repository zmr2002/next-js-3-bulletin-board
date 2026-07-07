# Day 4: Protected Pages And Profile

## Goal

Day 4 の目標は、dashboard/profile を protected page にし、profile display/edit、duplicate email protection、account withdrawal を実装しながら、authentication と authorization の違いを理解することです。

この日は「ログインしているか」と「その user がその操作をしてよいか」を分けて考える練習をします。

## Learning Topics

- `getServerSession(authOptions)` による server-side session check。
- App Router の `redirect`。
- authentication と authorization の違い。
- UI-only protection が不十分な理由。
- profile update validation。
- duplicate email protection。
- soft delete による account withdrawal。
- soft-deleted user の login rejection。
- browser から送られた user id を信用しない理由。

## What Codex Should Generate Or Implement

Codex が生成・実装する baseline:

- protected dashboard page。
- profile display page。
- profile edit page。
- profile update API。
- account withdrawal API。
- withdrawn user login rejection。
- profile form。
- withdrawal button。
- header/navigation の更新。

目的は、login user だけが dashboard/profile にアクセスでき、自分の profile だけを編集できる状態にすることです。

## Files Codex Should Create Or Modify

重要ファイル:

```text
src/app/dashboard/page.tsx
src/app/dashboard/profile/page.tsx
src/app/dashboard/profile/edit/page.tsx
src/app/api/users/profile/route.ts
src/app/api/users/withdraw/route.ts
src/components/profile/ProfileForm.tsx
src/components/profile/WithdrawAccountButton.tsx
src/lib/auth.ts
src/lib/validations.ts
```

読む順番のおすすめ:

1. `src/app/dashboard/page.tsx`
2. `src/app/dashboard/profile/page.tsx`
3. `src/app/api/users/profile/route.ts`
4. `src/components/profile/ProfileForm.tsx`
5. `src/app/api/users/withdraw/route.ts`

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
http://localhost:3000/dashboard
```

test account:

```text
email: test@example.com
password: Password123
```

## Manual Testing Checklist

- logout 状態で `/dashboard` にアクセスする。
- `/login?callbackUrl=/dashboard` に redirect されることを確認する。
- login 後に dashboard を開く。
- profile page を開く。
- profile に id/name/email/createdAt/updatedAt が表示されることを確認する。
- password が表示されないことを確認する。
- profile edit page を開く。
- name/email を変更する。
- duplicate email を試す。
- error message が出ることを確認する。
- account withdrawal を試す。
- withdrawal 後に logout されることを確認する。
- withdrawn user が再 login できないことを確認する。

## Small Manual Tasks You Should Do Yourself

小さな手動変更:

1. dashboard の説明文を少し変更する。
2. profile page の field label を確認する。
3. profile edit form の validation message を読む。
4. withdrawal confirmation message を読み、自分の言葉で危険性を説明する。

学習目的:

- protected page の guard がどこにあるかを探す。
- page guard と API guard の両方が必要な理由を理解する。
- soft delete が database 上で何を変えるかを確認する。

## Intentional Bug Drill

Day 4 では、2つの bug drill を行います。

### Bug 1: protected page の session check を外す

Codex が一時的に protected page の `getServerSession(authOptions)` check を外します。

あなたが確認すること:

- logout 状態で page が見えてしまうか。
- UI だけで守ることがなぜ不十分か。
- server-side redirect がどこで必要か。

修正の考え方:

```text
protected page は render 前に server-side session check を行う。
```

### Bug 2: duplicate email handling を壊す

Codex が一時的に profile update API の duplicate email check を壊します。

あなたが確認すること:

- browser ではどんな error が出るか。
- API response は 409 か 500 か。
- user-friendly error message になっているか。
- Prisma unique constraint error と事前 check の違い。

修正の考え方:

```text
先に email を findUnique する。
見つかった user が自分以外なら 409 を返す。
```

## Hint Ladder

bug drill で詰まった場合は、Codex に次の順番で hint を求めます。

1. conceptual hint: page guard か API validation か。
2. file hint: dashboard/profile/API のどの file か。
3. code-shape hint: session check や duplicate check の形。
4. final fix: 修正内容と理由。

## Explanation Practice

自分の言葉で答える質問:

- protected page はこの app でどう動くか。
- authentication と authorization は何が違うか。
- dashboard/profile page はなぜ `getServerSession(authOptions)` を使うか。
- profile query はなぜ `session.user.id` を使うか。
- profile API はなぜ browser から user id を受け取らないか。
- profile editing はどこで validation されるか。
- duplicate email protection はどう動くか。
- account withdrawal は MySQL の何を変更するか。
- soft-deleted user はなぜ login できないか。
- Day 4 の重要 file はどれか。

## Done Criteria

Day 4 が完了したと言える状態:

- logged-out user は dashboard/profile にアクセスできない。
- logged-in user は dashboard を見られる。
- logged-in user は自分の profile を見られる。
- logged-in user は自分の profile を編集できる。
- duplicate email が拒否される。
- account withdrawal が soft delete として動く。
- withdrawn user が再 login できない。
- page guard と API guard の違いを説明できる。

## Notes To Write Yourself

学習後に自分で残すメモ:

```text
今日わかったこと:

まだ曖昧なこと:

自分で直した bug:

次に復習したい file:
```
