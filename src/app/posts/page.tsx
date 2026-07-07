import { getServerSession } from "next-auth";
import Link from "next/link";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function PostsPage() {
  const session = await getServerSession(authOptions);

  const posts = await prisma.post.findMany({
    where: {
      isDeleted: false,
      author: {
        is: {
          isDeleted: false
        }
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    select: {
      id: true,
      title: true,
      content: true,
      createdAt: true,
      authorId: true,
      author: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          responses: {
            where: {
              isDeleted: false
            }
          }
        }
      }
    }
  });

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            掲示板
          </p>
          <h1 className="text-3xl font-bold text-slate-950">投稿一覧</h1>
          <p className="text-sm leading-6 text-slate-600">
            有効なユーザーの投稿を読み、ログイン後に自分の投稿を作成できます。
          </p>
          <p className="text-sm text-slate-500">
            現在 {posts.length} 件の投稿を表示しています。
          </p>
        </div>
        {session?.user?.id ? (
          <Link
            href="/posts/new"
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            新規投稿
          </Link>
        ) : (
          <Link
            href="/login?callbackUrl=/posts/new"
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
          >
            ログインして投稿
          </Link>
        )}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-md border border-dashed border-slate-300 bg-white p-8 text-center">
          <h2 className="text-lg font-semibold text-slate-950">まだ投稿がありません</h2>
          <p className="mt-2 text-sm text-slate-600">
            ログイン後に最初の投稿を作成できます。
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => {
            const isAuthor = session?.user?.id === post.authorId;
            const preview =
              post.content.length > 180 ? `${post.content.slice(0, 180)}...` : post.content;

            return (
              <article key={post.id} className="rounded-md border border-slate-200 bg-white p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-slate-950">
                      <Link href={`/posts/${post.id}`} className="hover:underline">
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-sm text-slate-500">
                      投稿者: {post.author.name} / {post.createdAt.toLocaleString()}
                    </p>
                    <p className="text-sm text-slate-500">
                      {post._count.responses}{" "}
                      件のレスポンス
                    </p>
                  </div>
                  {isAuthor ? (
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                      自分の投稿
                    </span>
                  ) : null}
                </div>
                <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {preview}
                </p>
                <Link
                  className="mt-4 inline-block text-sm font-medium text-slate-950 underline"
                  href={`/posts/${post.id}`}
                >
                  詳細を見る
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}
