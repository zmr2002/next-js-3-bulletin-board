# Day 6: Forms, UI, And Responses

## Goal

Day 6 の目標は、既存の login-based bulletin board に response/comment 機能を追加しながら、form handling、client component、Prisma relation、soft delete filtering を復習することです。

この日も、ゼロから全部を手で実装するのではありません。Codex が main baseline を生成し、あなたは生成されたコードを読み、小さな変更、動作確認、バグ修正、説明練習を通して理解を深めます。

## Learning Topics

- React Hook Form が form state をどう管理するか。
- Zod resolver が browser form validation と schema をどうつなぐか。
- `"use client"` が必要になる component の特徴。
- Response model が Post と User の両方につながる理由。
- API route で session、validation、Prisma create を組み合わせる流れ。
- `router.refresh()` が server-rendered page を再取得する理由。
- soft delete された post、user、response を list から除外する考え方。
- UI-only restriction と server-side rule の違い。

## What Codex Should Generate Or Implement

Codex が実装する main baseline:

- response create API。
- `ResponseForm` client component。
- post detail page の response list。
- post list page の response count。
- logged-out user には response form の代わりに login prompt を表示。
- empty/error/loading state の改善。
- 必要に応じた validation message と UI text の調整。

Codex が作る目的は、提出可能な機能の土台を先に作ることです。あなたの学習は、その土台を読んで、なぜそう書かれているかを説明し、小さい変更で理解を確認することに置きます。

## Files Codex Should Create Or Modify

重要ファイル:

```text
src/app/api/posts/[postId]/responses/route.ts
src/components/posts/ResponseForm.tsx
src/app/posts/[postId]/page.tsx
src/app/posts/page.tsx
src/lib/validations.ts
prisma/schema.prisma
```

関連して読むファイル:

```text
src/components/ui/Button.tsx
src/components/ui/Textarea.tsx
src/components/ui/FormError.tsx
src/lib/auth.ts
src/lib/prisma.ts
```

## What You Should Run To Verify It

MySQL が起動していない場合:

```powershell
scripts\start-local-mysql.cmd
```

development server:

```powershell
npm.cmd run dev
```

通常の dev server が詰まる場合:

```powershell
npm.cmd run dev -- --turbo
```

validation test:

```powershell
npm.cmd test
```

production build:

```powershell
npm.cmd run build
```

## Manual Testing Checklist

browser で確認すること:

- `test@example.com` / `Password123` で login する。
- post detail page を開く。
- response form が表示される。
- response を投稿する。
- 投稿後に response list に表示される。
- `/posts` に戻り、response count が更新されている。
- 空の response を投稿しようとして validation error が出る。
- logout する。
- logged-out 状態では response form が表示されず、login prompt が表示される。

別 user で確認すること:

- 別 user でも response を作成できる。
- response の author name が正しく表示される。
- post author と response author が混ざらない。

## Small Manual Tasks You Should Do Yourself

小さな手動変更:

1. response の placeholder text を少し自然な表現に変える。
2. response list の empty state message を変更する。
3. response count の単数・複数表示、または日本語表示を確認する。
4. response form の submit button text を変えて、画面に反映されるか確認する。

学習目的:

- どの component が browser に表示されているかを探す。
- 変更した text がどの route で使われるかを確認する。
- client component と server component の境界を体感する。

## Intentional Bug Drill

Day 6 では、2つの bug drill を行います。

### Bug 1: `"use client"` を外す

Codex が `ResponseForm.tsx` の `"use client"` を一時的に外します。

あなたが確認すること:

- browser または terminal にどんな error が出るか。
- なぜ `useForm`、`useState`、`router.refresh()` は client component 側で必要なのか。
- server component では browser event を扱えないこと。

修正の考え方:

```text
form interaction, state, submit handler, router refresh
これらを使う component は client component にする。
```

### Bug 2: form field name と schema key をずらす

Codex が form の field name か Zod schema key を一時的にずらします。

あなたが確認すること:

- form に入力しても API に期待する値が届かない。
- validation error がどこで発生しているか。
- Network tab で request payload を見る。

修正の考え方:

```text
React Hook Form の register name
Zod schema の key
API が読む data property

この3つを一致させる。
```

## Hint Ladder

bug drill で詰まった場合は、Codex にこの順番で hint を求めます。

1. conceptual hint: どの層を疑うべきかだけ聞く。
2. file hint: どの file を見るべきか聞く。
3. code-shape hint: 正解そのものではなく、必要な code shape を聞く。
4. final fix: 最後に修正内容と理由を聞く。

この順番にする理由は、手で debugging する時間を学習の中心に置くためです。

## Explanation Practice

自分の言葉で答える質問:

- Response は Prisma でどのように Post とつながるか。
- Response は Prisma でどのように User とつながるか。
- なぜこの app では response creation に login が必要なのか。
- response API はなぜ post が存在するか確認するのか。
- response API はなぜ `session.user.id` を使うのか。
- `ResponseForm` はどうやって API に data を送るのか。
- response 作成後の `router.refresh()` は何をするのか。
- response list はなぜ `isDeleted: false` を filter するのか。
- post creation と response creation は何が似ているか。
- Day 6 で最も重要な files はどれか。

## Done Criteria

Day 6 が完了したと言える状態:

- logged-in user が response を作成できる。
- logged-out user は response form を使えない。
- empty response が validation で拒否される。
- response が正しい post detail page に表示される。
- response author name が表示される。
- post list に response count が表示される。
- `npm.cmd test` が通る。
- `npm.cmd run build` が通る。
- response が postId と authorId で何につながっているか説明できる。

## Notes To Write Yourself

学習後に自分で残すメモ:

```text
今日わかったこと:

まだ曖昧なこと:

自分で直した bug:

次に復習したい file:
```
