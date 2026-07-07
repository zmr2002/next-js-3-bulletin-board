"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { profileSchema, type ProfileInput } from "@/lib/validations";

interface ProfileFormProps {
  initialData: ProfileInput;
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();
  const [successMessage, setSuccessMessage] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData
  });

  async function onSubmit(values: ProfileInput) {
    setFormError(undefined);
    setSuccessMessage(undefined);

    const response = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as {
      error?: string;
      user?: ProfileInput;
    };

    if (!response.ok) {
      setFormError(result.error ?? "プロフィール更新に失敗しました。");
      return;
    }

    setSuccessMessage("プロフィールを更新しました。");
    router.refresh();
    router.push("/dashboard/profile");
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

      <FormError message={formError} />
      {successMessage ? <p className="text-sm text-green-700">{successMessage}</p> : null}

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "保存中..." : "プロフィールを保存"}
      </Button>
    </form>
  );
}
