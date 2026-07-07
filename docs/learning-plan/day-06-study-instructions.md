# Day 6 学習手順: Responses, UI Polish, Relation Review

このファイルは、Day 6 の実作業ログです。目的は、response/comment 機能を完成させながら、生成されたコードを読み、手動で小さく変更し、意図的な bug を直し、最後に自分の言葉で説明できるようになることです。

目安時間: 3-4時間。

## 現在の Day 6 ベースライン

Codex が生成したもの:

- `Response` を作成する API route。
- post detail page に response list を表示する処理。
- response 投稿用の `ResponseForm`。
- post list の response count。
- logged-in user だけが response を投稿できる UI。
- validation error と API error の表示。

この day の学習方針:

```text
Codex が baseline を作る。
あなたが動かす。
あなたが読む。
あなたが小さく変更する。
あなたが bug を直す。
最後に説明する。
```

## Step 1: 起動とログイン

MySQL が起動していない場合:

```powershell
scripts\start-local-mysql.cmd
```

development server:

```powershell
npm.cmd run dev
```

もし通常の dev server が起動途中で止まる場合:

```powershell
npm.cmd run dev -- --turbo
```

browser で開く:

```text
http://localhost:3000
```

テスト用 account:

```text
email: test@example.com
password: Password123
```

この account が存在しない場合は、register page から作成してください。

## Step 2: 手動確認

browser で次を確認します。

1. login する。
2. `/posts` を開く。
3. 既存 post の detail page を開く。
4. response form が表示されることを確認する。
5. response を1件作成する。
6. response が post detail page に表示されることを確認する。
7. `/posts` に戻る。
8. response count が増えていることを確認する。
9. logout する。
10. 同じ post detail page を開く。
11. response form が表示されず、login prompt が表示されることを確認する。

空文字の確認:

1. login する。
2. response form に何も入力しない。
3. submit する。
4. validation error が表示されることを確認する。

## Step 3: 丁寧に読むファイル

### 1. `src/app/api/posts/[postId]/responses/route.ts`

注目すること:

- `getServerSession(authOptions)`。
- login していない user を拒否する処理。
- `params.postId` を使って対象 post を探す処理。
- `isDeleted: false` で soft-deleted post を除外する処理。
- current user が active か確認する処理。
- `responseSchema.parse(body)`。
- `prisma.response.create`。
- `postId` と `authorId`。

理解する流れ:

```text
browser request
-> API route
-> session check
-> post exists check
-> user active check
-> Zod validation
-> Prisma create
-> JSON response
```

### 2. `src/components/posts/ResponseForm.tsx`

注目すること:

- `"use client"`。
- `useState`。
- `useRouter`。
- `useForm<ResponseInput>`。
- `zodResolver(responseSchema)`。
- `fetch(`/api/posts/${postId}/responses`, ...)`。
- `reset()`。
- `router.refresh()`。

理解する流れ:

```text
user types content
-> React Hook Form keeps form state
-> submit handler sends fetch request
-> API creates response
-> form resets
-> router.refresh() reloads server-rendered response list
```

### 3. `src/app/posts/[postId]/page.tsx`

注目すること:

- post detail を Prisma で読む処理。
- response list を一緒に読む処理。
- response author name を select している処理。
- `session?.user?.id` がある場合だけ `ResponseForm` を表示する処理。
- logged-out user に login prompt を表示する処理。

ここで大事なのは、response list は server component 側で database から読まれ、response form は client component 側で user input を扱うという分担です。

### 4. `src/app/posts/page.tsx`

注目すること:

- post list を読む処理。
- author name を一緒に select する処理。
- `_count.responses`。
- deleted response を count から除外する考え方。

response count は、post detail を開かなくても「この post にいくつ response があるか」を一覧で見せるための情報です。

### 5. `prisma/schema.prisma`

注目すること:

```text
User -> posts
User -> responses
Post -> author
Post -> responses
Response -> post
Response -> author
```

特に `Response` は、次の2つの foreign key を持ちます。

```text
postId
authorId
```

つまり response は、「どの post への返信か」と「誰が書いた返信か」の両方を保存します。

## Step 4: 自分で行う小さな変更

### Task 1: response form の文言を変える

対象 file:

```text
src/components/posts/ResponseForm.tsx
```

変更例:

```text
Write a response...
```

を、より自然な日本語に変更します。

確認:

- browser で post detail page を開く。
- placeholder が変わっているか見る。

### Task 2: empty response message を変える

対象 file:

```text
src/app/posts/[postId]/page.tsx
```

response が0件の時に表示される message を探し、自分で少し変更します。

確認:

- response がない post を開く。
- message が変わっているか見る。

### Task 3: response count 表示を確認する

対象 file:

```text
src/app/posts/page.tsx
```

確認すること:

- response が0件、1件、2件以上の post を見る。
- count 表示が自然か確認する。
- 必要なら文言だけ調整する。

この task は UI を大きく変える必要はありません。表示の意味が reviewer に伝われば十分です。

## Step 5: 意図的な bug drill

Day 6 では、2つの bug を直します。

### Bug 1: client component marker の欠落

Codex が一時的に `ResponseForm.tsx` の `"use client"` を壊します。

あなたがやること:

1. browser または terminal の error を読む。
2. error がどの component を指しているか確認する。
3. なぜ server component では `useState` や `useForm` が使えないか考える。
4. `"use client"` を戻す。
5. ページが復旧したことを確認する。

答えとして覚えること:

```text
user input, state, submit handler, router refresh を扱う component は client component にする。
```

### Bug 2: form field name と schema key の不一致

Codex が一時的に `register("content")` や schema key のどこかをずらします。

あなたがやること:

1. response を投稿する。
2. validation error または API error を確認する。
3. browser DevTools の Network tab を開く。
4. response request の payload を見る。
5. React Hook Form の field name、Zod schema、API が読む data を比較する。
6. key を一致させて直す。

答えとして覚えること:

```text
form field name
Zod schema key
API data property

この3つが一致していないと、入力した値が正しく保存されない。
```

## Step 6: 回答ガイド

ここはあなたの回答をもとに、理解しやすい形へ直した内容です。

### Response は Prisma でどのように Post とつながるか

`Response` は `postId` を持っています。`postId` には、返信先の `Post.id` が入ります。

つまり:

```text
Response.postId -> Post.id
```

この接続により、post detail page で「この post に属する response 一覧」を取得できます。

### Response は Prisma でどのように User とつながるか

`Response` は `authorId` も持っています。`authorId` には、response を書いた user の `User.id` が入ります。

つまり:

```text
Response.authorId -> User.id
```

この接続により、response の下に author name を表示できます。

### なぜ response creation に login が必要なのか

この app の設計では、すべての response を user に紐づけます。そのため、誰が書いた response なのかを保存する必要があります。

login していない user には `session.user.id` がありません。`authorId` を安全に決められないため、この app では response creation を login user のみにしています。

補足:

匿名 comment を許可する設計も可能です。ただし、その場合は database schema と API design を変える必要があります。今回の internship task では、login-based bulletin board として user identity を持つ設計にしています。

### なぜ response API は post が存在するか確認するのか

存在しない post、または soft-deleted post に response を作らせないためです。

もしこの確認がないと、browser や API client から直接 request を送って、画面には表示されない post に response を作れてしまう可能性があります。

### なぜ response API は `session.user.id` を使うのか

browser から送られた user id は改ざんできます。

そのため、API は request body の user id を信用せず、server-side session から現在の user id を取得します。

```text
safe source: session.user.id
unsafe source: browser-sent userId
```

### `ResponseForm` はどうやって API に data を送るのか

`ResponseForm` は `fetch` を使って、post detail page の postId に対応する API route へ `POST` request を送ります。

```ts
await fetch(`/api/posts/${postId}/responses`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(values)
});
```

`values` には React Hook Form が管理している form data が入ります。

### response 作成後の `router.refresh()` は何をするのか

`router.refresh()` は、現在の route の server component を再取得します。

response list は server component 側で Prisma から読まれているため、response を作成したあとに refresh すると、新しい response が画面に表示されます。

### なぜ response list は `isDeleted: false` を filter するのか

この project では、削除を物理削除ではなく soft delete で扱います。

つまり、row は database に残りますが、通常画面では表示しません。

そのため、response list では:

```text
isDeleted: false
```

を条件に入れて、削除済み response を通常表示から外します。

### post creation と response creation は何が似ているか

似ている点:

- login session を確認する。
- user が active か確認する。
- Zod で input を validation する。
- Prisma で database に保存する。
- authorId に `session.user.id` を使う。

違う点:

- post は `authorId` だけで user に接続する。
- response は `authorId` に加えて `postId` で post にも接続する。

## Step 7: Day 6 の重要ファイルまとめ

最重要:

```text
src/app/api/posts/[postId]/responses/route.ts
src/components/posts/ResponseForm.tsx
src/app/posts/[postId]/page.tsx
```

重要:

```text
src/app/posts/page.tsx
src/lib/validations.ts
prisma/schema.prisma
```

読む順番のおすすめ:

1. `prisma/schema.prisma`
2. `src/lib/validations.ts`
3. `src/app/api/posts/[postId]/responses/route.ts`
4. `src/components/posts/ResponseForm.tsx`
5. `src/app/posts/[postId]/page.tsx`
6. `src/app/posts/page.tsx`

## Step 8: Done Criteria

Day 6 完了条件:

- logged-in user が response を作成できる。
- logged-out user には response form が表示されない。
- empty response が validation で拒否される。
- response が正しい post に表示される。
- response author name が表示される。
- post list に response count が表示される。
- 2つの bug drill を修正できる。
- response が `postId` と `authorId` で何につながっているか説明できる。
- `npm.cmd test` が通る。
- `npm.cmd run build` が通る。

## Step 9: 自分用メモ

ここに自分の言葉で書く:

```text
今日わかったこと:

まだ曖昧なこと:

自分で直した bug:

次に復習したい file:
```
