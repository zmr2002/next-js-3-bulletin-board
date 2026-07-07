import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Day 3
        </p>
        <h1 className="text-3xl font-bold text-slate-950">ログイン</h1>
        <p className="text-sm leading-6 text-slate-600">
          NextAuth Credentials Provider、Prisma、bcrypt を使ってログインします。
          保存済みの password hash と入力 password を比較します。
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
