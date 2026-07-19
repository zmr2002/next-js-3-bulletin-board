import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { WithdrawAccountButton } from "@/components/profile/WithdrawAccountButton";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/profile");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between gap-4">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/dashboard">
          ダッシュボードへ戻る
        </Link>
        <Link
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          href="/dashboard/profile/edit"
        >
          プロフィール編集
        </Link>
      </div>

      <section className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            プロフィール
          </p>
          <h1 className="text-3xl font-bold text-slate-950">{user.name}</h1>
          <p className="text-slate-700">{user.email}</p>
        </div>

        <dl className="grid gap-4 rounded-md border border-slate-200 bg-white p-5 sm:grid-cols-2">
          <div>
            <dt className="text-sm font-medium text-slate-500">ユーザーID</dt>
            <dd className="mt-1 break-all text-sm text-slate-950">{user.id}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">作成日時</dt>
            <dd className="mt-1 text-sm text-slate-950">{user.createdAt.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">更新日時</dt>
            <dd className="mt-1 text-sm text-slate-950">{user.updatedAt.toLocaleString()}</dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-slate-500">アカウント状態</dt>
            <dd className="mt-1 text-sm text-slate-950">有効</dd>
          </div>
        </dl>

        <div className="rounded-md border border-red-200 bg-red-50 p-5">
          <h2 className="text-base font-semibold text-red-950">アカウント退会</h2>
          <p className="mt-2 text-sm leading-6 text-red-800">
            退会すると <code>isDeleted</code> が true になり、アカウントは soft delete されます。
            関連データとの整合性を保つため、user row は MySQL に残ります。
          </p>
          <div className="mt-4">
            <WithdrawAccountButton />
          </div>
        </div>
      </section>
    </main>
  );
}
