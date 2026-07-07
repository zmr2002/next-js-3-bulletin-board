"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";

export function WithdrawAccountButton() {
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleWithdraw() {
    const confirmed = window.confirm(
      "このアカウントを退会しますか？ログアウトされ、このアカウントではログインできなくなります。"
    );

    if (!confirmed) {
      return;
    }

    setError(undefined);
    setIsSubmitting(true);

    const response = await fetch("/api/users/withdraw", {
      method: "POST"
    });

    if (!response.ok) {
      setIsSubmitting(false);
      setError("アカウント退会に失敗しました。");
      return;
    }

    await signOut({ callbackUrl: "/" });
  }

  return (
    <div>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleWithdraw}
        className="rounded-md bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "退会処理中..." : "アカウントを退会"}
      </button>
      {error ? <p className="mt-2 text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
