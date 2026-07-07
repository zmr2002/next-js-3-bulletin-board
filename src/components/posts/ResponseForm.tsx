"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Textarea } from "@/components/ui/Textarea";
import { responseSchema, type ResponseInput } from "@/lib/validations";

interface ResponseFormProps {
  postId: string;
}

export function ResponseForm({ postId }: ResponseFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<ResponseInput>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      content: ""
    }
  });

  async function onSubmit(values: ResponseInput) {
    setFormError(undefined);

    const response = await fetch(`/api/posts/${postId}/responses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as {
      error?: string;
    };

    if (!response.ok) {
      setFormError(result.error ?? "レスポンス作成に失敗しました。");
      return;
    }

    reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="response">
          レスポンスを追加
        </label>
        <Textarea
          id="response"
          className="min-h-28"
          placeholder="レスポンスを入力してください"
          {...register("content")}
        />
        <p className="mt-1 text-xs text-slate-500">最大500文字まで入力できます。</p>
        <FormError message={errors.content?.message} />
      </div>

      <FormError message={formError} />

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "投稿中..." : "レスポンスを投稿"}
      </Button>
    </form>
  );
}
