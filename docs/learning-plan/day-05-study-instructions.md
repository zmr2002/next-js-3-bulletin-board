# Day 5 学習手順: Post CRUD と Authorization

このファイルは、Codex が Day 5 の post CRUD baseline を生成したあとに使う。目的は、post relation、CRUD API、soft delete、ownership authorization を理解すること。

## Current Day 5 Baseline

Codex が生成したもの:

- post list page。
- post detail page。
- post create page。
- post edit page。
- post create/update/delete API。
- post form。
- delete button。
- response count の土台。

Main routes:

```text
/posts
/posts/new
/posts/[postId]
/posts/[postId]/edit
```

Main API endpoints:

```text
GET /api/posts
POST /api/posts
GET /api/posts/[postId]
PATCH /api/posts/[postId]
DELETE /api/posts/[postId]
```

## Step 1: App を起動する

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

## Step 2: Manual Testing Checklist

User 1:

- login する。
- post を作成する。
- post list で確認する。
- post detail を開く。
- edit する。
- delete する。

User 2:

- 別 account で login する。
- User 1 の post detail を開く。
- edit/delete button が表示されないことを確認する。
- direct URL `/posts/[postId]/edit` を試す。
- API direct request でも拒否される設計であることを確認する。

## Step 3: Read These Files Carefully

### 1. `src/app/api/posts/route.ts`

Focus:

- `GET`
- `POST`
- `getServerSession(authOptions)`
- current user check。
- `postSchema.parse(body)`
- `prisma.post.create`
- `authorId: session.user.id`

Questions:

- どの function が posts を list するか。
- どの function が post を create するか。
- post creation に session が必要な理由は何か。
- API はどこで post を current user に attach するか。
- list が deleted posts/deleted authors を filter する理由は何か。

### 2. `src/app/api/posts/[postId]/route.ts`

Focus:

- `GET`
- `PATCH`
- `DELETE`
- post lookup。
- `post.authorId !== session.user.id`
- `isDeleted: true`

Questions:

- どの function が one post を読むか。
- どの function が one post を edit するか。
- どの function が one post を soft-delete するか。
- edit/delete の前に post を load する理由は何か。
- author-only authorization check はどこか。

### 3. `src/app/posts/page.tsx`

Focus:

- `prisma.post.findMany`
- `author select`
- `_count.responses`
- author badge。

Questions:

- author name を別 query なしで表示できる理由は何か。
- `session.user.id` と `post.authorId` を比較する理由は何か。
- empty state は何を表示するか。

### 4. `src/app/posts/[postId]/page.tsx`

Focus:

- `notFound()`
- author-only edit/delete controls。
- response area。

Questions:

- post が存在しない/削除済みの場合は何が起きるか。
- non-author に edit/delete controls を隠す理由は何か。
- hiding buttons だけでは security として不十分な理由は何か。

### 5. `src/components/posts/PostForm.tsx`

Focus:

- `"use client"`
- React Hook Form。
- `mode`
- create/edit endpoint switching。
- `router.refresh`
- `router.push`

Questions:

- form が create/edit をどう選ぶか。
- API が error を返すと何が起きるか。
- save 成功時は何が起きるか。

## Step 4: Completed Answer Guide

Question: post は Prisma で user にどう接続するか？

Answer:

```text
Post table の authorId に user.id を保存します。
```

Question: `authorId` は何を保存するか？

Answer:

```text
post を作成した user の id です。
```

Question: app は current user の post をどう作るか？

Answer:

```text
API が getServerSession(authOptions) で session.user.id を取得し、authorId に保存します。
```

Question: browser-sent user id ではなく `session.user.id` を使う理由は？

Answer:

```text
browser から送られた user id は改ざん可能ですが、server-side session は trusted source だからです。
```

Question: hiding Edit/Delete buttons と API authorization の違いは？

Answer:

```text
button を隠すのは UI。API authorization は direct request も防ぐ security check。
```

Question: API は one user が another user's post を edit することをどう防ぐか？

Answer:

```ts
if (post.authorId !== session.user.id) {
  return NextResponse.json(..., { status: 403 });
}
```

Question: soft delete はどう動くか？

Answer:

```text
row を削除せず isDeleted を true にし、normal query では isDeleted: false だけ表示します。
```

## Step 5: Intentional Bug Drills

Bug 1:

```text
API ownership check を外し、別 user が direct request で edit/delete できる危険を確認する。
```

Bug 2:

```text
post list の isDeleted filter を外し、deleted post が表示される問題を確認する。
```

## Step 6: Explanation Questions

- post は user にどう接続するか。
- `authorId` は何を保存するか。
- post creation はなぜ session を必要とするか。
- post list は author name をどう読み込むか。
- UI hiding と API authorization の違いは何か。
- soft delete はどう動くか。
- Day 5 の重要ファイルはどれか。

## Done Criteria

- user が own posts を create/list/read/edit/delete できる。
- user は another user's posts を edit/delete できない。
- deleted posts は normal lists に出ない。
- ownership check を説明できる。
