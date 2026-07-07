import {
  loginSchema,
  postSchema,
  profileSchema,
  registerSchema,
  responseSchema
} from "@/lib/validations";

describe("registerSchema", () => {
  it("正しい登録入力を受け付ける", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "Password123"
    });

    expect(result.success).toBe(true);
  });

  it("メールアドレス形式ではない登録入力を拒否する", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "not-an-email",
      password: "Password123"
    });

    expect(result.success).toBe(false);
  });

  it("大文字・小文字・数字を含まない弱いパスワードを拒否する", () => {
    const result = registerSchema.safeParse({
      name: "Test User",
      email: "test@example.com",
      password: "password"
    });

    expect(result.success).toBe(false);
  });

  it("表示名とメールアドレスの前後の空白を削除する", () => {
    const result = registerSchema.parse({
      name: "  Test User  ",
      email: "  test@example.com  ",
      password: "Password123"
    });

    expect(result.name).toBe("Test User");
    expect(result.email).toBe("test@example.com");
  });
});

describe("loginSchema", () => {
  it("正しいログイン入力を受け付ける", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: "Password123"
    });

    expect(result.success).toBe(true);
  });

  it("不正なメールアドレス形式を拒否する", () => {
    const result = loginSchema.safeParse({
      email: "wrong",
      password: "Password123"
    });

    expect(result.success).toBe(false);
  });

  it("未入力のパスワードを拒否する", () => {
    const result = loginSchema.safeParse({
      email: "test@example.com",
      password: ""
    });

    expect(result.success).toBe(false);
  });
});

describe("postSchema", () => {
  it("正しい投稿入力を受け付ける", () => {
    const result = postSchema.safeParse({
      title: "Hello board",
      content: "This is a valid post."
    });

    expect(result.success).toBe(true);
  });

  it("空のタイトルを拒否する", () => {
    const result = postSchema.safeParse({
      title: "",
      content: "This is a valid post."
    });

    expect(result.success).toBe(false);
  });

  it("空の本文を拒否する", () => {
    const result = postSchema.safeParse({
      title: "Hello board",
      content: ""
    });

    expect(result.success).toBe(false);
  });

  it("100文字を超えるタイトルを拒否する", () => {
    const result = postSchema.safeParse({
      title: "toomanycharacterstoomanycharacterstoomanycharacterstoomanycharacterstoomanycharacterstoomanycharacterstoomanycharacterstoomanycharacterstoomanycharacters",
      content: "This is a valid post."
    });

    expect(result.success).toBe(false);
  });
});

describe("profileSchema", () => {
  it("正しいプロフィール入力を受け付ける", () => {
    const result = profileSchema.safeParse({
      name: "Updated User",
      email: "updated@example.com"
    });

    expect(result.success).toBe(true);
  });

  it("空のプロフィール名を拒否する", () => {
    const result = profileSchema.safeParse({
      name: "",
      email: "updated@example.com"
    });

    expect(result.success).toBe(false);
  });
});

describe("responseSchema", () => {
  it("正しいレスポンス入力を受け付ける", () => {
    const result = responseSchema.safeParse({
      content: "I agree with this post."
    });

    expect(result.success).toBe(true);
  });

  it("空のレスポンス本文を拒否する", () => {
    const result = responseSchema.safeParse({
      content: ""
    });

    expect(result.success).toBe(false);
  });
});
