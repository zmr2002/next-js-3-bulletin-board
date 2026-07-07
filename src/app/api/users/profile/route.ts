import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { profileSchema } from "@/lib/validations";

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
    }

    const body = await request.json();
    const data = profileSchema.parse(body);

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

    const existingUserWithEmail = await prisma.user.findUnique({
      where: {
        email: data.email
      },
      select: {
        id: true
      }
    });

    const emailBelongsToAnotherUser =
      existingUserWithEmail && existingUserWithEmail.id !== session.user.id;

    if (emailBelongsToAnotherUser) {
      return NextResponse.json(
        { error: "このメールアドレスは別のアカウントで使用されています。" },
        { status: 409 }
      );
    }

    const user = await prisma.user.update({
      where: {
        id: session.user.id
      },
      data: {
        name: data.name,
        email: data.email
      },
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: "プロフィール入力が正しくありません。",
          issues: error.issues
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "プロフィール更新に失敗しました。もう一度お試しください。" },
      { status: 500 }
    );
  }
}
