import { z } from "zod";

export const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "表示名を入力してください。")
    .max(50, "名前は50文字以内で入力してください。"),
  email: z
    .string()
    .trim()
    .email("有効なメールアドレスを入力してください。")
    .max(191, "メールアドレスは191文字以内で入力してください。"),
  password: z
    .string()
    .min(8, "パスワードは8文字以上で入力してください。")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "パスワードには大文字・小文字・数字を含めてください。"
    )
});

export const loginSchema = z.object({
  email: z.string().trim().email("有効なメールアドレスを入力してください。"),
  password: z.string().min(1, "パスワードを入力してください。")
});

export const postSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "タイトルを入力してください。")
    .max(100, "タイトルは100文字以内で入力してください。"),
  content: z
    .string()
    .trim()
    .min(1, "本文を入力してください。")
    .max(2000, "本文は2000文字以内で入力してください。")
});

export const profileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "表示名を入力してください。")
    .max(50, "名前は50文字以内で入力してください。"),
  email: z
    .string()
    .trim()
    .email("有効なメールアドレスを入力してください。")
    .max(191, "メールアドレスは191文字以内で入力してください。")
});

export const responseSchema = z.object({
  content: z
    .string()
    .trim()
    .min(1, "レスポンス本文を入力してください。")
    .max(500, "レスポンスは500文字以内で入力してください。")
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type PostInput = z.infer<typeof postSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type ResponseInput = z.infer<typeof responseSchema>;
