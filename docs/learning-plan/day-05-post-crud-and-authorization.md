# Day 5: Post CRUD And Authorization

## Goal

Day 5 の目標は、投稿の list/detail/create/edit/delete を完成させ、Prisma relation、CRUD API design、soft delete、ownership authorization を理解することです。

この日は bulletin board の中心機能です。Codex が main CRUD baseline を生成し、あなたは実際に2つの account を使って「自分の投稿だけ編集・削除できる」ことを確認します。

## Learning Topics

- CRUD の基本。
- Prisma relation between `User` and `Post`。
- `Post.authorId` の意味。
- post list/detail/create/update/delete API。
- soft delete。
- ownership authorization。
- UI で edit/delete button を隠すことと、API route で拒否することの違い。
- browser から直接 request を送れるため、API authorization が必要な理由。
- `notFound()` の使い方。

## What Codex Should Generate Or Implement

Codex が生成・実装する baseline:

- post list page。
- post detail page。
- post create page。
- post edit page。
- post create API。
- post detail API。
- post update API。
- post delete API。
- reusable `PostForm`。
- `DeletePostButton`。
- author-only edit/delete UI。
- author-only API authorization。
- soft delete filtering。

目的は、普通の browser 操作でも、直接 API request でも、他人の post を変更できない状態を作ることです。

## Files Codex Should Create Or Modify

重要ファイル:

```text
src/app/posts/page.tsx
src/app/posts/[postId]/page.tsx
src/app/posts/new/page.tsx
src/app/posts/[postId]/edit/page.tsx
src/app/api/posts/route.ts
src/app/api/posts/[postId]/route.ts
src/components/posts/PostForm.tsx
src/components/posts/DeletePostButton.tsx
src/lib/validations.ts
prisma/schema.prisma
```

読む順番のおすすめ:

1. `prisma/schema.prisma`
2. `src/app/api/posts/route.ts`
3. `src/app/api/posts/[postId]/route.ts`
4. `src/app/posts/page.tsx`
5. `src/app/posts/[postId]/page.tsx`
6. `src/components/posts/PostForm.tsx`
7. `src/components/posts/DeletePostButton.tsx`

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
http://localhost:3000/posts
```

test accounts:

```text
email: test@example.com
password: Password123
```

```text
email: test2@example.com
password: Password123
```

必要なら register page から作成します。

## Manual Testing Checklist

- user A で login する。
- post を作成する。
- post list に表示されることを確認する。
- post detail page を開く。
- author name が表示されることを確認する。
- user A には edit/delete button が表示されることを確認する。
- post を edit する。
- edit 内容が保存されることを確認する。
- user B で login する。
- user A の post detail page を開く。
- user B には edit/delete button が表示されないことを確認する。
- user B が直接 edit URL を開こうとしても拒否されることを確認する。
- user A で post を soft delete する。
- deleted post が通常の list に表示されないことを確認する。

## Small Manual Tasks You Should Do Yourself

小さな手動変更:

1. post list の empty state message を変更する。
2. post detail page の author/date 表示を確認する。
3. post form の placeholder を少し変える。
4. delete confirmation message を読みやすくする。

学習目的:

- page、form component、API route の分担を確認する。
- UI text をどの file が持っているか探す。
- author-only control が UI と API の両方にあることを確認する。

## Intentional Bug Drill

Day 5 では、2つの bug drill を行います。

### Bug 1: API ownership check を外す

Codex が一時的に post update/delete API の ownership check を壊します。

あなたが確認すること:

- UI では edit/delete button が隠れているか。
- それでも直接 request すれば変更できる可能性があるか。
- API route の authorization がなぜ必要か。

修正の考え方:

```text
post.authorId と session.user.id を比較する。
一致しない場合は 403 Forbidden を返す。
```

### Bug 2: soft delete filter を外す

Codex が一時的に post list の `isDeleted: false` filter を壊します。

あなたが確認すること:

- deleted post が list に出てしまうか。
- detail page ではどう扱われるか。
- list query と detail query の両方に filter が必要な理由。

修正の考え方:

```text
通常画面では isDeleted: false の post だけを取得する。
```

## Hint Ladder

bug drill で詰まった場合は、Codex に次の順番で hint を求めます。

1. conceptual hint: authorization か soft delete filter か。
2. file hint: API route か page query か。
3. code-shape hint: `authorId` check や `isDeleted` filter の形。
4. final fix: 修正内容と理由。

## Explanation Practice

自分の言葉で答える質問:

- Post は Prisma で User とどうつながるか。
- `authorId` は何を保存するか。
- app はどうやって current user の post を作るか。
- post creation はなぜ browser-sent user id ではなく `session.user.id` を使うか。
- post list はどうやって author name を読み込むか。
- Edit/Delete button を隠すことと API authorization は何が違うか。
- API はどうやって他人の post edit/delete を防ぐか。
- post の soft delete はどう動くか。
- normal post list はなぜ `isDeleted: false` を filter するか。
- Day 5 の重要 file はどれか。

## Done Criteria

Day 5 が完了したと言える状態:

- user が post を作成できる。
- post list が表示される。
- post detail が表示される。
- author が自分の post を edit できる。
- author が自分の post を delete できる。
- 別 user は他人の post を edit/delete できない。
- deleted post は通常 list に出ない。
- author-only authorization が API route にある。
- `authorId` relation と ownership check を説明できる。

## Notes To Write Yourself

学習後に自分で残すメモ:

```text
今日わかったこと:

まだ曖昧なこと:

自分で直した bug:

次に復習したい file:
```
