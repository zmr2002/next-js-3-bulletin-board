import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { PostForm } from "@/components/posts/PostForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/posts/new");
  }

  const currentUser = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      isDeleted: false
    },
    select: {
      id: true
    }
  });

  if (!currentUser) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/posts">
          投稿一覧へ戻る
        </Link>
      </div>

      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          掲示板
        </p>
        <h1 className="text-3xl font-bold text-slate-950">投稿を作成</h1>
        <p className="text-sm leading-6 text-slate-600">
          この投稿は、server 側で現在の session user id に紐づけて保存されます。
        </p>
      </div>

      <PostForm mode="create" />
    </main>
  );
}
