import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";

import { DeletePostButton } from "@/components/posts/DeletePostButton";
import { ResponseForm } from "@/components/posts/ResponseForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface PostDetailPageProps {
  params: {
    postId: string;
  };
}

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const session = await getServerSession(authOptions);

  const post = await prisma.post.findFirst({
    where: {
      id: params.postId,
      isDeleted: false,
      author: {
        is: {
          isDeleted: false
        }
      }
    },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          email: true
        }
      },
      responses: {
        where: {
          isDeleted: false,
          author: {
            is: {
              isDeleted: false
            }
          }
        },
        orderBy: {
          createdAt: "asc"
        },
        select: {
          id: true,
          content: true,
          createdAt: true,
          authorId: true,
          author: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  if (!post) {
    notFound();
  }

  const isAuthor = session?.user?.id === post.authorId;

  return (
    <main className="mx-auto min-h-screen w-full max-w-4xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/posts">
          投稿一覧へ戻る
        </Link>
        {isAuthor ? (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
              href={`/posts/${post.id}/edit`}
            >
              編集
            </Link>
            <DeletePostButton postId={post.id} />
          </div>
        ) : null}
      </div>

      <article className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            投稿詳細
          </p>
          <h1 className="text-3xl font-bold text-slate-950">{post.title}</h1>
          {isAuthor ? (
            <p className="text-sm font-medium text-slate-700">
              あなたがこの投稿の作成者です。
            </p>
          ) : null}
          <p className="text-sm text-slate-500">
            投稿者: {post.author.name} ({post.author.email}) / {post.createdAt.toLocaleString()}
          </p>
          {post.updatedAt.getTime() !== post.createdAt.getTime() ? (
            <p className="text-sm text-slate-500">
              更新日時: {post.updatedAt.toLocaleString()}
            </p>
          ) : null}
        </div>

        <div className="rounded-md border border-slate-200 bg-white p-6">
          <p className="whitespace-pre-wrap leading-7 text-slate-800">{post.content}</p>
        </div>
      </article>

      <section className="mt-10 space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              レスポンス
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">
              {post.responses.length} 件のレスポンス
            </h2>
          </div>
        </div>

        {post.responses.length === 0 ? (
          <div className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-center">
            <h3 className="text-base font-semibold text-slate-950">まだレスポンスがありません</h3>
            <p className="mt-2 text-sm text-slate-600">
              ログインすると、この投稿にレスポンスできます。
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {post.responses.map((response) => {
              const isResponseAuthor = session?.user?.id === response.authorId;

              return (
                <article
                  key={response.id}
                  className="rounded-md border border-slate-200 bg-white p-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-950">
                      {response.author.name}
                      {isResponseAuthor ? (
                        <span className="ml-2 rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600">
                          あなた
                        </span>
                      ) : null}
                    </p>
                    <p className="text-xs text-slate-500">
                      {response.createdAt.toLocaleString()}
                    </p>
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                    {response.content}
                  </p>
                </article>
              );
            })}
          </div>
        )}

        <div className="rounded-md border border-slate-200 bg-white p-5">
          {session?.user?.id ? (
            <ResponseForm postId={post.id} />
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-600">ログインすると、この議論に参加できます。</p>
              <Link
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 hover:bg-white"
                href={`/login?callbackUrl=/posts/${post.id}`}
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
