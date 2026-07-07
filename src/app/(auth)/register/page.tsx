import { RegisterForm } from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-12">
      <div className="mb-8 space-y-2">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Day 2
        </p>
        <h1 className="text-3xl font-bold text-slate-950">アカウント作成</h1>
        <p className="text-sm leading-6 text-slate-600">
          Zod で入力を検証し、bcryptjs で password を hash 化して、
          Prisma 経由で MySQL に user を保存します。
        </p>
      </div>
      <RegisterForm />
    </main>
  );
}
