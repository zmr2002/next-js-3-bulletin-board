import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-4xl flex-col justify-center px-6 py-12">
      <div className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          インターン学習プロジェクト
        </p>
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-slate-950">
            ログイン式掲示板アプリ
          </h1>
          <p className="max-w-2xl text-lg leading-8 text-slate-700">
            Next.js 14、TypeScript、Tailwind CSS、Prisma、MySQL を使って、
            登録・ログイン・投稿・レスポンスの流れを学ぶアプリです。
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/posts"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            投稿を見る
          </Link>
          <Link
            href="/register"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            アカウント作成
          </Link>
          <Link
            href="/dashboard"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            ダッシュボード
          </Link>
        </div>
      </div>
    </main>
  );
}
