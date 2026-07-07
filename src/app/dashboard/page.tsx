import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      isDeleted: false
    },
    select: {
      name: true,
      email: true
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <div className="mb-8">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/">
          ホームへ戻る
        </Link>
      </div>
      <section className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          ダッシュボード
        </p>
        <h1 className="text-3xl font-bold text-slate-950">
          ようこそ、{user.name} さん
        </h1>
        <p className="max-w-2xl leading-7 text-slate-700">
          このページはログイン済みユーザーだけが閲覧できます。現在 {user.email} でログインしています。
        </p>
        <div className="flex flex-wrap gap-3 pt-3">
          <Link
            href="/dashboard/profile"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            プロフィールを見る
          </Link>
          <Link
            href="/dashboard/profile/edit"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            プロフィール編集
          </Link>
          <Link
            href="/posts/new"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            投稿を作成
          </Link>
          <Link
            href="/posts"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            投稿を見る
          </Link>
        </div>
      </section>
    </main>
  );
}
