# Day 5: Post CRUD And Authorization

## 目標

投稿の list/detail/create/edit/delete を実装し、Prisma relation と ownership authorization を理解する。

## 学習内容

- CRUD。
- `authorId` relation。
- server-side authorization。
- API route の ownership check。
- soft delete。
- UI で button を隠すことと security の違い。

## Codex が実装したこと

- post list page。
- post detail page。
- post create page。
- post edit page。
- post create/update/delete API。
- author-only edit/delete。
- soft delete。

## 重要ファイル

```text
src/app/posts/page.tsx
src/app/posts/[postId]/page.tsx
src/app/posts/new/page.tsx
src/app/posts/[postId]/edit/page.tsx
src/app/api/posts/route.ts
src/app/api/posts/[postId]/route.ts
src/components/posts/PostForm.tsx
src/components/posts/DeletePostButton.tsx
```

## 完了条件

- user が自分の post を create/read/update/delete できる。
- user は他人の post を edit/delete できない。
- deleted post は通常 list に出ない。
- API route 側で ownership check がある。
