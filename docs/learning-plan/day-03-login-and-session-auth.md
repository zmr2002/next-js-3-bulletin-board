# Day 3: Login And Session Auth

## Goal

Day 3 の目標は、NextAuth Credentials Provider を使って login/logout を実装し、JWT session、password comparison、`session.user.id`、TypeScript module augmentation を理解することです。

この日は「認証の仕組み」を深く読みます。Codex が main baseline を作り、あなたは login flow を動かしながら、どの file がどの役割を持つかを確認します。

## Learning Topics

- NextAuth.js の役割。
- Credentials Provider の役割。
- `authorize` function が login check の中心になる理由。
- `bcrypt.compare` が raw password と hash を比較する仕組み。
- JWT session strategy。
- `jwt` callback が token に user id を入れる流れ。
- `session` callback が `session.user.id` を作る流れ。
- なぜ post/profile 操作に `session.user.id` が必要になるか。
- NextAuth route handler で `GET` と `POST` の両方が必要な理由。
- TypeScript module augmentation で Session/JWT の型を拡張する理由。

## What Codex Should Generate Or Implement

Codex が生成・実装する baseline:

- `src/lib/auth.ts` の `authOptions`。
- Credentials Provider。
- `authorize` function。
- NextAuth route handler。
- login page。
- login form。
- logout button。
- header の login/logout 表示切り替え。
- JWT callback。
- session callback。
- `src/types/next-auth.d.ts`。

目的は、registered user が login でき、server-side code が現在の user id を安全に取得できる状態にすることです。

## Files Codex Should Create Or Modify

重要ファイル:

```text
src/lib/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/app/login/page.tsx
src/components/auth/LoginForm.tsx
src/components/auth/LogoutButton.tsx
src/components/layout/Header.tsx
src/types/next-auth.d.ts
```

読む順番のおすすめ:

1. `src/lib/auth.ts`
2. `src/app/api/auth/[...nextauth]/route.ts`
3. `src/types/next-auth.d.ts`
4. `src/components/auth/LoginForm.tsx`
5. `src/components/layout/Header.tsx`

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
http://localhost:3000/login
```

test account:

```text
email: test@example.com
password: Password123
```

存在しない場合は、Day 2 の register page から作成します。

## Manual Testing Checklist

- registered user で login する。
- wrong password で login が失敗することを確認する。
- logout する。
- login 後に header の表示が変わることを確認する。
- logout 後に header が Login/Register 表示へ戻ることを確認する。
- browser refresh 後も session が維持されることを確認する。
- invalid email/password で error message が出ることを確認する。

## Small Manual Tasks You Should Do Yourself

小さな手動変更:

1. login page の heading text を少し変更する。
2. login failure message を読みやすくする。
3. logout button の redirect 先を確認する。
4. header で login user の email が表示される箇所を探す。

学習目的:

- login form は client component であることを確認する。
- session を読む header は server component でも書けることを確認する。
- client-side action と server-side session read の違いを理解する。

## Intentional Bug Drill

Day 3 では、session id の bug drill を行います。

### Bug: session callback から id copy を外す

Codex が一時的に、`session` callback から `session.user.id = token.id` のような処理を外します。

あなたが確認すること:

- login 自体は成功するか。
- `session.user.id` が必要な場所でどんな問題が出るか。
- TypeScript error と runtime behavior のどちらが出るか。
- post creation や profile update で user id が必要な理由。

修正の考え方:

```text
authorize returns user.id
-> jwt callback copies user.id to token.id
-> session callback copies token.id to session.user.id
-> app code uses session.user.id
```

## Hint Ladder

詰まった場合は、Codex に次の順番で hint を求めます。

1. conceptual hint: token と session のどちらを見るべきか。
2. file hint: `auth.ts` か type declaration のどちらか。
3. code-shape hint: callback の data flow。
4. final fix: 修正内容と理由。

## Explanation Practice

自分の言葉で答える質問:

- NextAuth login は Credentials Provider でどう動くか。
- `authorize` は何をするか。
- MySQL ではどこで user を探すか。
- `bcrypt.compare` はどこで使われるか。
- なぜ `authorize` は id/name/email だけを返すのか。
- JWT callback は何を token に保存するか。
- session callback は何を `session.user.id` にコピーするか。
- NextAuth route はなぜ `authOptions` を使うのか。
- NextAuth route はなぜ `GET` と `POST` handler の両方を export するのか。
- TypeScript はなぜ `src/types/next-auth.d.ts` を必要とするのか。
- logout button を押すと何が起きるか。

## Done Criteria

Day 3 が完了したと言える状態:

- registered user が login できる。
- wrong password は login に失敗する。
- logout できる。
- header が login 状態に応じて変わる。
- session に user id が入る。
- `session.user.id` がなぜ必要か説明できる。
- Credentials Provider、JWT callback、session callback の流れを説明できる。

## Notes To Write Yourself

学習後に自分で残すメモ:

```text
今日わかったこと:

まだ曖昧なこと:

自分で直した bug:

次に復習したい file:
```
