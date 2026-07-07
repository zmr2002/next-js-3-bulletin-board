# Day 5 デバッグ報告: `next dev` と port 3001 問題

この文書は、Day 5 の途中で発生した開発サーバー起動問題について、何が起きたのか、なぜ混乱しやすかったのか、どのように切り分けたのかを記録するためのものです。

この問題は、投稿 CRUD の学習内容そのものではありません。ただし、実務では「コードのバグ」と「開発環境の問題」を切り分ける力も重要なので、学習ログとして残します。

## 起きたこと

Day 5 の作業中、開発サーバーの状態が不安定になりました。

確認できた状態:

```text
next build works
next start works
next dev hangs
next dev --turbo works
```

具体的には、通常の `next dev` が `Starting...` のような状態で止まり、ブラウザからアクセスしても応答しませんでした。一方で、production build と `next start` は動き、さらに `next dev --turbo` も動きました。

このため、アプリケーションコード全体が壊れているというより、通常の development server の起動過程、cache、既存 process、または Next.js の dev mode 側の問題である可能性が高いと判断しました。

## なぜ port 3001 が開けなかったのか

PowerShell や Next.js の出力では、port 3000 が使われているように見えることがありました。そのため、Next.js が別 port、たとえば 3001 に切り替わる場面がありました。

しかし、port が使われていることと、Next.js app が browser request に正常応答できることは別です。

重要な違い:

```text
port is occupied
= 何らかの process がその port を確保している

app is ready
= Next.js が route を読み込み、HTTP request に返答できる
```

今回の混乱は、低レベルの listener は存在するように見えるのに、Next.js が app として ready になっていなかった点にあります。そのため、`localhost:3001` を開いても、ブラウザ側では timeout や接続失敗のように見えました。

## 背景知識

Next.js の開発サーバーには、production build とは違う処理があります。

- file watcher。
- hot reload。
- route の動的解析。
- `.next` cache。
- dev overlay。
- middleware や App Router の development runtime。

そのため、次のようなことが起こりえます。

```text
npm.cmd run build は成功する
しかし npm.cmd run dev は起動途中で止まる
```

これは、「TypeScript や route が完全に壊れている」という意味ではありません。build が通るなら、少なくとも production compilation の観点では大きな構文エラーや型エラーはないと考えられます。

## 切り分けで確認したこと

確認した項目:

- `npm.cmd run build` が成功するか。
- `next start` で production server が起動するか。
- `next dev` がどこで止まるか。
- `next dev --turbo` が動くか。
- 既存の Next.js process が port を占有していないか。
- `.next` cache が古い状態を持っていないか。

観察結果:

```text
build success
production start success
normal dev hangs
turbo dev works
```

この結果から、Day 5 の投稿 CRUD コードそのものを全て巻き戻すより、動作する dev mode を使って学習を継続し、別途環境問題として記録する方が合理的だと判断しました。

## 実施した対応

Day 5 の学習時間を守るため、次の方針にしました。

1. まず build と test で、コード全体が壊れていないことを確認する。
2. 通常の `next dev` が詰まる場合は、動作する `next dev --turbo` を使う。
3. 古い process が疑わしい場合は、既存の Node/Next process を停止してから再起動する。
4. 必要な場合だけ `.next` cache を削除して再生成する。
5. 投稿 CRUD の学習と、環境問題の調査を分けて扱う。

## 学習ポイント

この問題から学ぶべきことは、次の3つです。

```text
port が開いている = app が正常に動いている、ではない。
build が通る = dev server が必ず起動する、でもない。
環境問題とアプリケーションコードの問題は分けて調べる。
```

特に初心者のうちは、ブラウザで開けないと「自分のコードが全部壊れた」と感じやすいです。しかし、今回のように `build`、`start`、`dev --turbo` を比較すると、問題の範囲をかなり狭められます。

## 次に同じ問題が起きたら

同じ症状が出た場合は、次の順番で確認します。

```powershell
npm.cmd run build
```

build が通るか確認します。

```powershell
npm.cmd run dev
```

通常の dev server がどこで止まるか確認します。

```powershell
npm.cmd run dev -- --turbo
```

または package script に合わせて Turbo dev mode を試します。

port の使用状況を見る場合:

```powershell
netstat -ano | findstr :3000
netstat -ano | findstr :3001
```

ただし、ここで process が見つかっても、それだけで app が ready とは判断しません。

## 今回の結論

今回の Day 5 問題は、投稿 CRUD の実装ミスというより、通常の Next.js dev server が起動途中で止まる環境・cache・process 周辺の問題として扱いました。

学習上の結論:

- コードが壊れているかどうかは `test` と `build` で確認する。
- dev server の起動問題は、アプリ機能のバグと分けて考える。
- deadline が近い場合、動作する開発モードを使って本来の学習を続ける判断も必要。
