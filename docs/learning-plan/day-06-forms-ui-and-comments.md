# Day 6: Forms, UI, And Responses

## 目標

response/comment 機能を追加し、form handling、client component、relation、soft delete filtering を復習する。

## 学習内容

- React Hook Form。
- Zod resolver。
- `"use client"` が必要な component。
- response/comment model。
- response が post/user に接続する仕組み。
- response count。

## Codex が実装したこと

- response create API。
- `ResponseForm`。
- post detail page の response list。
- post list page の response count。
- logged-out user への login prompt。

## 重要ファイル

```text
src/app/api/posts/[postId]/responses/route.ts
src/components/posts/ResponseForm.tsx
src/app/posts/[postId]/page.tsx
src/app/posts/page.tsx
src/lib/validations.ts
prisma/schema.prisma
```

## 完了条件

- logged-in user が response を作成できる。
- logged-out user は response form を見られない。
- empty response は拒否される。
- response は正しい post に表示される。
- response count が表示される。
