import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です。" }, { status: 401 });
  }

  await prisma.user.update({
    where: {
      id: session.user.id
    },
    data: {
      isDeleted: true
    }
  });

  return NextResponse.json({ ok: true });
}
