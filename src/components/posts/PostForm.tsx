"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { postSchema, type PostInput } from "@/lib/validations";

interface PostFormProps {
  mode: "create" | "edit";
  postId?: string;
  initialData?: PostInput;
}

export function PostForm({ mode, postId, initialData }: PostFormProps) {
  const router = useRouter();
  const [formError, setFormError] = useState<string>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<PostInput>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData ?? {
      title: "",
      content: ""
    }
  });

  async function onSubmit(values: PostInput) {
    setFormError(undefined);

    const response = await fetch(mode === "create" ? "/api/posts" : `/api/posts/${postId}`, {
      method: mode === "create" ? "POST" : "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(values)
    });

    const result = (await response.json()) as {
      error?: string;
      post?: { id: string };
    };

    if (!response.ok) {
      setFormError(result.error ?? "投稿の保存に失敗しました。");
      return;
    }

    router.refresh();
    router.push(`/posts/${result.post?.id}`);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="title">
          タイトル
        </label>
        <Input id="title" autoComplete="off" {...register("title")} />
        <FormError message={errors.title?.message} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-slate-800" htmlFor="content">
          本文
        </label>
        <Textarea id="content" {...register("content")} />
        <p className="mt-1 text-xs text-slate-500">最大2000文字まで入力できます。</p>
        <FormError message={errors.content?.message} />
      </div>

      <FormError message={formError} />

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? "保存中..." : mode === "create" ? "投稿を作成" : "投稿を保存"}
      </Button>
    </form>
  );
}
