import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { postSchema } from "@/lib/validations";

interface PostRouteContext {
  params: {
    postId: string;
  };
}

export async function GET(_request: Request, { params }: PostRouteContext) {
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
      createdAt: true,
      updatedAt: true,
      authorId: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  if (!post) {
    return NextResponse.json({ error: "投稿が見つかりません。" }, { status: 404 });
  }

  return NextResponse.json({ post });
}

export async function PATCH(request: Request, { params }: PostRouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: params.postId,
        isDeleted: false
      },
      select: {
        id: true,
        authorId: true
      }
    });

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません。" }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "自分の投稿だけ編集できます。" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const data = postSchema.parse(body);

    const updatedPost = await prisma.post.update({
      where: {
        id: post.id
      },
      data: {
        title: data.title,
        content: data.content
      },
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
        authorId: true
      }
    });

    return NextResponse.json({ post: updatedPost });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "投稿入力が正しくありません。",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "投稿更新に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: PostRouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    const post = await prisma.post.findFirst({
      where: {
        id: params.postId,
        isDeleted: false
      },
      select: {
        id: true,
        authorId: true
      }
    });

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません。" }, { status: 404 });
    }

    if (post.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "自分の投稿だけ削除できます。" },
        { status: 403 }
      );
    }

    await prisma.post.update({
      where: {
        id: post.id
      },
      data: {
        isDeleted: true
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "投稿削除に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
