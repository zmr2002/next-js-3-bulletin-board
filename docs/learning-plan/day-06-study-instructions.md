# Day 6 学習手順: Responses, UI Polish, Relation Review

## 目的

Day 6 では、response/comment 機能を追加し、post と user への relation、validation、client component を理解する。

## Step 1: 起動

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

## Step 2: 読むファイル

```text
src/app/api/posts/[postId]/responses/route.ts
src/components/posts/ResponseForm.tsx
src/app/posts/[postId]/page.tsx
src/app/posts/page.tsx
src/lib/validations.ts
prisma/schema.prisma
```

## Step 3: Response creation flow

```text
logged-in user が ResponseForm に content を入力する。
form が /api/posts/[postId]/responses に POST request を送る。
API が session を確認する。
API が post が存在し active か確認する。
API が current user が active か確認する。
responseSchema.parse(body) で validation する。
Prisma が content、postId、authorId を保存する。
router.refresh() で server-rendered page を更新する。
```

## Step 4: Relation の理解

```text
response.postId -> response を post に接続する。
response.authorId -> response を user に接続する。
```

実際の作成:

```ts
await prisma.response.create({
  data: {
    content: data.content,
    postId: params.postId,
    authorId: session.user.id
  }
});
```

## Step 5: 回答ガイド

質問: response creation に login が必要な理由は？

答え:

```text
この app では全 response が real user に属する設計だからです。
authorId に session.user.id を保存する必要があります。
```

質問: API が post の存在を確認する理由は？

答え:

```text
fake post、deleted post、deleted author の post に response を作らないためです。
```

質問: `router.refresh()` は何をしますか？

答え:

```text
API が MySQL に response を保存したあと、現在の server-rendered page の data を再取得します。
```

質問: response list が `isDeleted: false` を filter する理由は？

答え:

```text
soft-deleted response は DB には残るが、通常画面では表示しないためです。
```

## Step 6: 意図的なバグ練習

実施した内容:

- response の `postId` relation を壊すバグ。
- `responseSchema.parse(body)` を外す validation bug。
- runtime validation と TypeScript cast の違いを確認。

## 完了条件

- response create が動作する。
- empty response が拒否される。
- response が正しい post に紐づく。
- response count が更新される。
- response relation を説明できる。
