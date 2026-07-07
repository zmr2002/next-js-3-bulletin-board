import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { responseSchema } from "@/lib/validations";

interface ResponseRouteContext {
  params: {
    postId: string;
  };
}

export async function POST(request: Request, { params }: ResponseRouteContext) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

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
        id: true
      }
    });

    if (!post) {
      return NextResponse.json({ error: "投稿が見つかりません。" }, { status: 404 });
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
    const data = responseSchema.parse(body);

    const response = await prisma.response.create({
      data: {
        content: data.content,
        postId: params.postId,
        authorId: session.user.id
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    return NextResponse.json({ response }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "レスポンス入力が正しくありません。",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "レスポンス作成に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
