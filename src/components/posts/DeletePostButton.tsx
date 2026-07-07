"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { FormError } from "@/components/ui/FormError";

interface DeletePostButtonProps {
  postId: string;
}

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string>();
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      "この投稿を削除しますか？MySQL から物理削除せず、一覧から非表示にします。"
    );

    if (!confirmed) {
      return;
    }

    setError(undefined);
    setIsDeleting(true);

    const response = await fetch(`/api/posts/${postId}`, {
      method: "DELETE"
    });

    const result = (await response.json()) as {
      error?: string;
    };

    setIsDeleting(false);

    if (!response.ok) {
      setError(result.error ?? "投稿の削除に失敗しました。");
      return;
    }

    router.refresh();
    router.push("/posts");
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        onClick={handleDelete}
        disabled={isDeleting}
        className="bg-red-700 hover:bg-red-800"
      >
        {isDeleting ? "削除中..." : "削除"}
      </Button>
      <FormError message={error} />
    </div>
  );
}
