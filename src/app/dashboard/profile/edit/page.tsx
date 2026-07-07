import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";

import { ProfileForm } from "@/components/profile/ProfileForm";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export default async function EditProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/dashboard/profile/edit");
  }

  const user = await prisma.user.findFirst({
    where: {
      id: session.user.id,
      isDeleted: false
    },
    select: {
      name: true,
      email: true
    }
  });

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8">
        <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/dashboard/profile">
          プロフィールへ戻る
        </Link>
      </div>

      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          プロフィール
        </p>
        <h1 className="text-3xl font-bold text-slate-950">プロフィール編集</h1>
        <p className="text-sm leading-6 text-slate-600">
          プロフィール更新は Zod で検証され、現在ログインしているユーザーにだけ保存されます。
        </p>
      </div>

      <ProfileForm initialData={user} />
    </main>
  );
}
