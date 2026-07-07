import { getServerSession } from "next-auth";
import Link from "next/link";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { authOptions } from "@/lib/auth";

export async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex min-h-14 w-full max-w-4xl items-center justify-between px-6">
        <Link className="text-sm font-bold text-slate-950" href="/">
          学習掲示板
        </Link>
        <div className="flex items-center gap-4">
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/posts">
            投稿
          </Link>
          <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/dashboard">
            ダッシュボード
          </Link>
          {session?.user ? (
            <>
              <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/dashboard/profile">
                プロフィール
              </Link>
              <span className="text-sm text-slate-500">{session.user.email}</span>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/login">
                ログイン
              </Link>
              <Link className="text-sm font-medium text-slate-600 hover:text-slate-950" href="/register">
                登録
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
