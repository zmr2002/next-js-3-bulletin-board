import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          ログイン
        </p>
        <h1 className="text-3xl font-bold text-slate-950">ログイン</h1>
        <p className="text-sm leading-6 text-slate-600">
          登録済みのメールアドレスとパスワードでログインしてください。
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
