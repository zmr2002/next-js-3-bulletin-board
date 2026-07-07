"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { registerSchema, type RegisterInput } from "@/lib/validations";

export function RegisterForm() {
  const [formError, setFormError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  });

  async function onSubmit(values: RegisterInput) {
    setFormError(undefined);
    setSuccessMessage(undefined);

    const response = await fetch("/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as {
      error?: string;
      user?: { email: string };
    };

    if (!response.ok) {
      setFormError(result.error ?? "登録に失敗しました。");
      return;
    }

    setSuccessMessage(`${result.user?.email} を登録しました。ログインできます。`);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="name">
          名前
        </label>
        <Input id="name" autoComplete="name" {...register("name")} />
        <FormError message={errors.name?.message} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="email">
          メールアドレス
        </label>
        <Input id="email" type="email" autoComplete="email" {...register("email")} />
        <FormError message={errors.email?.message} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="password">
          パスワード
        </label>
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          {...register("password")}
        />
        <p className="mt-1 text-xs text-slate-500">
          8文字以上で、大文字・小文字・数字を含めてください。
        </p>
        <FormError message={errors.password?.message} />
      </div>

      <FormError message={formError} />
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "登録中..." : "登録する"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        すでにアカウントをお持ちですか？{" "}
        <Link className="font-medium text-slate-950 underline" href="/login">
          ログイン
        </Link>
      </p>
    </form>
  );
}
