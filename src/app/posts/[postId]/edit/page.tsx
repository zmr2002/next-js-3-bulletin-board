import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { PostForm } from "@/components/posts/PostForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

interface EditPostPageProps {
  params: {
    postId: string;
  };
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=/posts/${params.postId}/edit`);
  }

  const post = await prisma.post.findFirst({
    where: {
      id: params.postId,
      isDeleted: false
    },
    select: {
      id: true,
      title: true,
      content: true,
      authorId: true
    }
  });

  if (!post) {
    notFound();
  }

  if (post.authorId !== session.user.id) {
    redirect(`/posts/${post.id}`);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <Link
          className="text-sm font-medium text-slate-600 hover:text-slate-950"
          href={`/posts/${post.id}`}
        >
          投稿へ戻る
        </Link>
      </div>

      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          掲示板
        </p>
        <h1 className="text-3xl font-bold text-slate-950">投稿を編集</h1>
        <p className="text-sm leading-6 text-slate-600">
          このページは投稿者本人だけが開けます。API 側でも ownership check を行います。
        </p>
      </div>

      <PostForm
        mode="edit"
        postId={post.id}
        initialData={{
          title: post.title,
          content: post.content
        }}
      />
    </main>
  );
}
