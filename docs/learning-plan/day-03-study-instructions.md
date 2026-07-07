# Day 3 学習手順: Login と Session Auth

## 目的

Day 3 では、NextAuth による login、password 比較、session の仕組みを理解する。

## Step 1: 起動

```powershell
scripts\start-local-mysql.cmd
npm.cmd run dev
```

ブラウザ:

```text
http://localhost:3000/login
```

## Step 2: 読むファイル

```text
src/lib/auth.ts
src/app/api/auth/[...nextauth]/route.ts
src/components/auth/LoginForm.tsx
src/components/auth/LogoutButton.tsx
src/types/next-auth.d.ts
src/components/layout/Header.tsx
```

## Step 3: Login flow

```text
LoginForm が signIn("credentials") を呼ぶ。
NextAuth が Credentials Provider の authorize を実行する。
authorize が loginSchema で input を確認する。
Prisma が email で user を探す。
soft-deleted user は拒否する。
bcrypt.compare が入力 password と保存済み hash を比較する。
正しければ id/name/email を返す。
JWT callback が token.id に user.id を入れる。
session callback が session.user.id に token.id をコピーする。
```

## Step 4: 回答ガイド

質問: `authorize` は何をしますか？

答え:

```text
login input を検証し、DB から user を探し、password が正しいか確認します。
```

質問: `bcrypt.compare` は何をしますか？

答え:

```text
入力 password と保存済み hash が同じ password から作られたものか確認します。
password を decrypt するわけではありません。
```

質問: JWT callback は何をしますか？

答え:

```text
login 成功時に user.id を token.id に保存します。
```

質問: session callback は何をしますか？

答え:

```text
token.id を session.user.id にコピーし、app から現在の user id を使えるようにします。
```

質問: `redirect: false` の理由は？

答え:

```text
login 成功/失敗を form component 側で制御し、error message を表示するためです。
```

## Step 5: 意図的なバグ練習

実施した内容:

- session callback を外した場合に `session.user.id` が使えなくなることを確認。
- TypeScript type augmentation が必要な理由を確認。

## 完了条件

- login/logout が動く。
- invalid password が拒否される。
- `session.user.id` の役割を説明できる。
