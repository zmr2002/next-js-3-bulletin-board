# Codex 引き継ぎ: プロジェクト背景と要件

## 1. 状況

これはインターン学習課題です。

課題の期限はおよそ1週間です。

初心者向けの学習・実装課題ですが、最終成果物としては、提示された技術仕様に基づいた動作する full-stack web application が求められています。

プロジェクトの対象は、Next.js によるログイン式掲示板システムです。

## 2. 現在のスキルレベル

### 初級レベルで理解している技術

- Next.js 14
- TypeScript
- Tailwind CSS
- MySQL。ただし詳細はかなり忘れている
- CSS
- HTML

### 比較的強い既存のプログラミング経験

- Python
- 約4年の Python 経験
- 変数、関数、制御構文、データ構造、debugging、一般的な application logic など、基本的な programming concept は理解している

### 現時点で知識が少ない、またはほぼ未経験の分野

- Prisma ORM
- NextAuth.js
- bcryptjs
- Zod
- React Hook Form
- Jest
- 実プロジェクト構成での Next.js API Routes
- authentication/session implementation
- Next.js における full-stack application architecture
- production-style database design と migration workflow
- web authentication と user-generated content に関する security practices

## 3. 個人目標

- 1週間以内にインターン学習課題を完了する。
- 動作するログイン式掲示板システムを作る。
- code を生成するだけでなく、application の core flow を理解する。
- 実装、手動 debugging、小さな問題修正を通じて学ぶ。
- 次の main application flow を説明できるようになる:
  - user registration
  - password hashing
  - login
  - session handling
  - protected dashboard
  - post creation
  - post listing
  - post detail display
  - post editing
  - post deletion
  - profile management
- AI/Codex の planning と implementation support を使いながらも、成果物を理解して説明できるレベルまで学習する。

## 4. 主なプロジェクト要件

最終プロジェクトは、下に貼り付けられている技術仕様を満たす必要があります。

中心となる required application は、以下の技術を使ったログイン式掲示板システムです:

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Next.js API Routes
- Prisma ORM
- production database として MySQL
- development database として必要に応じて SQLite
- authentication に NextAuth.js
- password hashing に bcryptjs
- schema validation に Zod
- form handling に React Hook Form
- test に Jest

## 5. 期待される主な機能

- User registration
- User login
- User logout
- Password hashing
- Protected dashboard pages
- User profile display
- User profile editing
- Post list page
- Post detail page
- Post creation
- Post editing
- Post deletion または soft deletion
- user authorization。ユーザーは自分の post だけ edit/delete できる
- 時間があれば、または仕様上必要であれば Response/comment model と feature
- register/login/post/response form の基本 validation
- basic unit test または integration test
- basic security awareness:
  - hashed passwords
  - protected API routes
  - Prisma-based database access
  - XSS awareness
  - CSRF awareness

## 6. 時間制約

作業は約1週間で完了する必要があります。

そのため、計画は初心者が限られた時間で実行できる現実的な内容である必要があります。

## 7. 既知のリスクポイント

- NextAuth.js の session setup は初心者には難しい可能性がある。
- `session.user.id` のために、NextAuth callback と TypeScript type configuration が追加で必要になる可能性がある。
- Prisma relation は最初は混乱しやすい。
- App Router における API route structure が不慣れ。
- React Hook Form と Zod integration が不慣れ。
- MySQL knowledge が弱く、復習が必要。
- 提示された sample `app/api/posts/route.ts` は `z.ZodError` を使っているが、示された imports には `zod` からの `z` import が含まれていない。

## 8. Original Assignment Text

# next.js 課題3

# **Next.js** ログイン式掲示板システム 技術仕様書

## ■ 技術スタック

### フロントエンド

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **React Hook Form** (バリデーション)
- **Zod** (スキーマバリデーション)

### バックエンド

- **Next.js API Routes**
- **Prisma ORM**
- **NextAuth.js** (認証)
- **bcryptjs** (パスワードハッシュ化)

### データベース

- **MySQL** (本番環境)
- **SQLite** (開発環境)

## ■ プロジェクト構造

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       ├── page.tsx
│   │       └── confirm/
│   │           └── page.tsx
│   ├── dashboard/
│   │   ├── page.tsx
│   │   ├── posts/
│   │   │   ├── [id]/
│   │   │   │   ├── edit/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   └── profile/
│   │       ├── page.tsx
│   │       └── edit/
│   │           └── page.tsx
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── users/
│   │   │   ├── register/
│   │   │   │   └── route.ts
│   │   │   └── [id]/
│   │   │       └── route.ts
│   │   └── posts/
│   │       ├── route.ts
│   │       └── [id]/
│   │           └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Form.tsx
│   │   └── Pagination.tsx
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── posts/
│   │   ├── PostList.tsx
│   │   ├── PostForm.tsx
│   │   └── PostCard.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Navigation.tsx
├── lib/
│   ├── auth.ts
│   ├── db.ts
│   ├── validations.ts
│   └── utils.ts
├── types/
│   └── index.ts
└── prisma/
    ├── schema.prisma
    └── migrations/

```

## ■ データベース設計

### スキーマ定義 (Prisma)

```
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  password  String
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  responses Response[]

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String   @db.Text
  authorId  String
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author    User       @relation(fields: [authorId], references: [id])
  responses Response[]

  @@map("posts")
}

model Response {
  id        String   @id @default(cuid())
  content   String   @db.Text
  postId    String
  authorId  String
  isDeleted Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  post      Post @relation(fields: [postId], references: [id])
  author    User @relation(fields: [authorId], references: [id])

  @@map("responses")
}

```

## ■ 認証システム

### NextAuth.js設定

```tsx
// lib/auth.ts
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./db"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
            isDeleted: false
          }
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
}

```

## ■ バリデーション

### Zodスキーマ

```tsx
// lib/validations.ts
import { z } from "zod"

export const registerSchema = z.object({
  name: z.string()
    .min(1, "名前は必須です")
    .max(50, "名前は50文字以内で入力してください"),
  email: z.string()
    .email("有効なメールアドレスを入力してください"),
  password: z.string()
    .min(8, "パスワードは8文字以上で入力してください")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
           "パスワードは大文字、小文字、数字を含む必要があります")
})

export const loginSchema = z.object({
  email: z.string().email("有効なメールアドレスを入力してください"),
  password: z.string().min(1, "パスワードは必須です")
})

export const postSchema = z.object({
  title: z.string()
    .min(1, "タイトルは必須です")
    .max(100, "タイトルは100文字以内で入力してください"),
  content: z.string()
    .min(1, "本文は必須です")
    .max(2000, "本文は2000文字以内で入力してください")
})

export const responseSchema = z.object({
  content: z.string()
    .min(1, "レスは必須です")
    .max(500, "レスは500文字以内で入力してください")
})

```

## ■ 主要コンポーネント

### 投稿一覧コンポーネント

```tsx
// components/posts/PostList.tsx
import { Post, User } from "@prisma/client"
import { PostCard } from "./PostCard"
import { Pagination } from "../ui/Pagination"

interface PostWithAuthor extends Post {
  author: User
  _count: {
    responses: number
  }
}

interface PostListProps {
  posts: PostWithAuthor[]
  currentPage: number
  totalPages: number
  currentUserId?: string
}

export function PostList({
  posts,
  currentPage,
  totalPages,
  currentUserId
}: PostListProps) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          currentUserId={currentUserId}
        />
      ))}

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  )
}

```

### 投稿フォームコンポーネント

```tsx
// components/posts/PostForm.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { postSchema } from "@/lib/validations"

interface PostFormData {
  title: string
  content: string
}

interface PostFormProps {
  initialData?: PostFormData
  onSubmit: (data: PostFormData) => Promise<void>
  isLoading?: boolean
}

export function PostForm({
  initialData,
  onSubmit,
  isLoading = false
}: PostFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PostFormData>({
    resolver: zodResolver(postSchema),
    defaultValues: initialData
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          タイトル
        </label>
        <input
          {...register("title")}
          type="text"
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.title && (
          <p className="text-red-600 text-sm">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium">
          本文
        </label>
        <textarea
          {...register("content")}
          rows={5}
          className="mt-1 block w-full rounded-md border-gray-300"
        />
        {errors.content && (
          <p className="text-red-600 text-sm">{errors.content.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-md disabled:opacity-50"
      >
        {isLoading ? "送信中..." : "投稿する"}
      </button>
    </form>
  )
}

```

## ■ APIルート

### 投稿API

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { postSchema } from "@/lib/validations"
import { authOptions } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = 10
  const skip = (page - 1) * limit

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where: {
          isDeleted: false,
          author: {
            isDeleted: false
          }
        },
        include: {
          author: {
            select: { id: true, name: true }
          },
          _count: {
            select: { responses: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.post.count({
        where: {
          isDeleted: false,
          author: {
            isDeleted: false
          }
        }
      })
    ])

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: "投稿の取得に失敗しました" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "認証が必要です" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const validatedData = postSchema.parse(body)

    const post = await prisma.post.create({
      data: {
        ...validatedData,
        authorId: session.user.id
      },
      include: {
        author: {
          select: { id: true, name: true }
        }
      }
    })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "バリデーションエラー", issues: error.issues },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "投稿の作成に失敗しました" },
      { status: 500 }
    )
  }
}

```

## ■ テスト設計

### Jest設定

```jsx
// jest.config.js
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)

```

### ユニットテスト例

```tsx
// __tests__/lib/validations.test.ts
import { postSchema, registerSchema } from "@/lib/validations"

describe("Validation Schemas", () => {
  describe("postSchema", () => {
    it("有効な投稿データを通す", () => {
      const validData = {
        title: "テスト投稿",
        content: "これはテスト投稿の本文です"
      }

      expect(() => postSchema.parse(validData)).not.toThrow()
    })

    it("タイトルが空の場合はエラーを返す", () => {
      const invalidData = {
        title: "",
        content: "本文"
      }

      expect(() => postSchema.parse(invalidData)).toThrow()
    })
  })

  describe("registerSchema", () => {
    it("有効な登録データを通す", () => {
      const validData = {
        name: "テストユーザー",
        email: "test@example.com",
        password: "Password123"
      }

      expect(() => registerSchema.parse(validData)).not.toThrow()
    })

    it("不正なメールアドレスの場合はエラーを返す", () => {
      const invalidData = {
        name: "テストユーザー",
        email: "invalid-email",
        password: "Password123"
      }

      expect(() => registerSchema.parse(invalidData)).toThrow()
    })
  })
})

```

### インテグレーションテスト例

```tsx
// __tests__/api/posts.test.ts
import { NextRequest } from "next/server"
import { GET, POST } from "@/app/api/posts/route"
import { prisma } from "@/lib/db"

// テスト用のモック
jest.mock("@/lib/db", () => ({
  prisma: {
    post: {
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    }
  }
}))

describe("/api/posts", () => {
  describe("GET", () => {
    it("投稿一覧を正常に取得する", async () => {
      const mockPosts = [
        {
          id: "1",
          title: "テスト投稿",
          content: "テスト内容",
          author: { id: "1", name: "テストユーザー" },
          _count: { responses: 0 }
        }
      ]

      ;(prisma.post.findMany as jest.Mock).mockResolvedValue(mockPosts)
      ;(prisma.post.count as jest.Mock).mockResolvedValue(1)

      const request = new NextRequest("http://localhost:3000/api/posts")
      const response = await GET(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.posts).toEqual(mockPosts)
      expect(data.pagination.total).toBe(1)
    })
  })
})

```

## ■ セキュリティ対策

### CSRF対策

- Next.jsのCSRF保護機能を活用
- APIルートでのトークン検証

### XSS対策

- React自動エスケープ機能を利用
- DOMPurifyライブラリの導入（必要に応じて）

### SQLインジェクション対策

- Prisma ORMのパラメータ化クエリを使用

### パスワードセキュリティ

- bcryptjsでのハッシュ化
- 強力なパスワードポリシーの実装

## ■ デプロイメント

### 環境変数

```
# .env.local
DATABASE_URL="mysql://user:password@localhost:3306/bulletin_board"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"

```

### ビルド＆デプロイ

```bash
# 依存関係のインストール
npm install

# データベースのマイグレーション
npx prisma migrate dev

# ビルド
npm run build

# 本番環境での起動
npm start

```

## ■ 開発の進め方

1. **環境構築**: Next.js + Prisma + MySQL
2. **認証システム**: NextAuth.js実装
3. **基本CRUD**: 投稿の作成・読み取り・更新・削除
4. **ユーザー管理**: プロフィール編集・退会機能
5. **レス機能**: 投稿へのレス機能（オプション）
6. **テスト実装**: ユニット・インテグレーションテスト
7. **UI/UX改善**: デザインとユーザビリティの向上

この仕様書に基づいて、段階的に開発を進めることで、堅牢で保守性の高いNext.js掲示板システムを構築できます。
