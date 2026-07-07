# Day 5 学習手順: Post CRUD と Authorization

## 目的

Day 5 では、post CRUD と server-side ownership check を理解する。

## Step 1: 起動

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

## Step 2: 読むファイル

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
```

## Step 3: Post CRUD flow

Create:

```text
logged-in user が PostForm を送信する。
API が session を確認する。
postSchema で validation する。
Prisma が authorId = session.user.id で post を作成する。
```

Read:

```text
post list/detail page が isDeleted: false の post を読む。
author が soft-deleted ではない post だけ表示する。
```

Update:

```text
edit page/API が post を読む。
post.authorId と session.user.id を比較する。
一致した場合だけ title/content を update する。
```

Delete:

```text
API が author か確認する。
物理削除ではなく isDeleted = true にする。
```

## Step 4: 重要な理解

質問: `authorId` は何を保存しますか？

答え:

```text
post を作成した user の id を保存します。
```

質問: UI で edit/delete button を隠すだけでは不十分な理由は？

答え:

```text
user は browser console や API client から直接 PATCH/DELETE request を送れるためです。
```

質問: API route で ownership check が必要な理由は？

答え:

```text
API route が最終的な security gate だからです。
```

質問: soft delete の理由は？

答え:

```text
DB row を残しつつ、通常画面では非表示にできるためです。
```

## Step 5: 意図的なバグ練習

実施した内容:

- API ownership check を外すバグ。
- `isDeleted: false` filter を外すバグ。
- 2 user を使って UI-only security が不十分であることを確認。

## 完了条件

- post CRUD が動作する。
- 他人の post は edit/delete できない。
- soft-deleted post は list に出ない。
- ownership authorization を説明できる。
