# Day 5 Debugging Report: `next dev` と port 問題

## 背景

Day 5 で開発サーバー周辺の問題が発生した。

確認された状態:

```text
next build works
next start works
next dev hangs
next dev --turbo works
```

一時的に port 3000 が使用中に見える状態があり、3001 を開いても application が表示されないことがあった。

## 何が起きたか

`next dev` が `Starting...` の状態で止まり、低レベルの listener は開いているように見えた。

そのため:

```text
port は使われているように見える
しかし app は ready ではない
HTTP request は timeout する
```

という状態になった。

## なぜ 3001 が開けなかったのか

Next.js dev server が正常に ready になっていない場合、別 port に fallback しても、その process が request を処理できる状態とは限らない。

つまり:

```text
port が listen していること
app が browser request に応答できること
```

は別の問題である。

## Debugging process

確認したこと:

- `npm.cmd run build` は成功した。
- `next start` は成功した。
- `next dev --turbo` は動作した。
- 古い Next.js process や `.next` cache が影響する可能性を確認した。

対応:

- 古い dev server process を止める。
- 必要に応じて `.next` を削除する。
- 再度 `npm.cmd run dev` を試す。
- 学習時間を守るため、動作する dev mode を使って Day 5 を継続した。

## 学習ポイント

```text
port occupied = app ready ではない。
build が通ることと dev server が起動することも別問題。
環境問題に時間を使いすぎず、学習タスクを進める判断も重要。
```
