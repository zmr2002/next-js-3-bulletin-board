import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { postSchema } from "@/lib/validations";

export async function GET() {
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
      updatedAt: true,
      author: {
        select: {
          id: true,
          name: true,
          email: true
        }
      }
    }
  });

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
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
      return NextResponse.json({ error: "ユーザーが見つかりません。" }, { status: 404 });
    }

    const body = await request.json();
    const data = postSchema.parse(body);

    const post = await prisma.post.create({
      data: {
        title: data.title,
        content: data.content,
        authorId: session.user.id
      },
      select: {
        id: true,
        title: true,
        content: true,
        createdAt: true,
        authorId: true
      }
    });

    return NextResponse.json({ post }, { status: 201 });
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
      { error: "投稿作成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
