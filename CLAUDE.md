# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Platerly is an AI-powered recipe and meal planning application built with Next.js 15. The concept is to create a modern recipe book and meal planning app that unifies recipe management, pantry tracking, grocery automation, and meal planning into one seamless experience.

Core features include:
- Smart recipe ingestion (photo, link, or text input with AI parsing)
- Personal recipe book with search and categorization
- Pantry and ingredient tracking
- Automated grocery list generation
- Weekly meal planning with calendar view

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle with Turbopack
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands
- `pnpm db:generate` - Regenerate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:reset` - Reset database

### Package Manager
This project uses **pnpm** as the package manager (confirmed by presence of pnpm-lock.yaml).

## Architecture

### Tech Stack
- **Next.js 15** with App Router (latest features enabled)
- **React 19** 
- **TypeScript** with strict mode
- **Tailwind CSS 4** for styling
- **shadcn/ui** component library (New York style, configured in components.json)
- **Turbopack** for fast builds and development
- **PostgreSQL** for database
- **Prisma** for database ORM and migrations
- **TanStack Query** for server state management and data fetching
- **React Hook Form** with Zod validation for forms
- **Sonner** for toast notifications
- **Motion/React** (Framer Motion) for animations and transitions
- **OpenAI API** for AI-powered recipe parsing and smart features
- **AWS S3** for file storage (recipe images, user uploads)

### Directory Structure
```
src/                 # Source code directory (Next.js 13+ src pattern)
  ├── actions/       # Next.js Server Actions
  │   ├── user.ts    # User CRUD operations
  │   ├── image.ts   # Image CRUD operations  
  │   ├── ingredient.ts # Ingredient CRUD operations
  │   ├── ingredient-location.ts # IngredientLocation CRUD operations
  │   └── ingredient-type.ts # IngredientType CRUD operations
  ├── app/           # Next.js App Router pages and layouts
  │   ├── admin/     # Admin pages
  │   │   └── user/  # User management admin page
  │   ├── page.tsx   # Home page
  │   ├── layout.tsx # Root layout with QueryProvider and Toaster
  │   └── globals.css # Global Tailwind styles
  ├── components/    # Reusable React components
  │   ├── ui/        # shadcn/ui components (Button, Form, Dialog, etc.)
  │   └── users/     # User-specific components
  ├── generated/     # Generated files (Prisma client) - EXCLUDED FROM LINT
  │   └── prisma/    # Generated Prisma client
  ├── hooks/         # Custom React hooks
  │   └── user/      # User-related TanStack Query hooks
  ├── lib/           # Utility functions and configurations
  │   ├── db.ts      # Prisma client singleton
  │   ├── query-client.tsx # TanStack Query configuration
  │   ├── utils.ts   # Utility functions (cn helper)
  │   └── users/     # User-specific utilities
  │       └── validations.ts # Zod schemas for user forms
  ├── types/         # TypeScript type definitions
  └── utils/         # Additional utility functions
prisma/              # Database schema and migrations
  └── schema.prisma  # Prisma schema with User, Image, Ingredient models
docs/
  └── concept.md     # Product concept and feature specifications
```

### Key Configurations
- **TypeScript**: Strict mode, ES2017 target, path mapping (`@/*` → `./src/*`)
- **ESLint**: Next.js core web vitals + TypeScript rules, `src/generated/**` excluded
- **shadcn/ui**: New York style, Lucide icons, CSS variables enabled
- **Path Aliases**: `@/` maps to src directory for clean imports
- **Database**: PostgreSQL with Prisma ORM, soft delete pattern implemented
- **Forms**: React Hook Form with Zod validation and shadcn/ui Form components
- **State Management**: TanStack Query for server state with custom mutation hooks

## Established Patterns

### TanStack Query Mutation Hooks Pattern
```typescript
// Custom hook with options support
export function useCreateExample(options?: MutationOptions) {
  const queryClient = useQueryClient()
  
  return useMutation({
    ...options, // Spread options first
    mutationFn: (data) => serverAction(data),
    onSuccess: (result, variables, context) => {
      // Core hook functionality (cache management) always runs first
      queryClient.refetchQueries({ queryKey: ["examples"] })
      
      // Then call component-specific callback
      options?.onSuccess?.(result, variables, context)
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context)
    },
  })
}
```

### Server Actions Pattern
```typescript
// Server actions return consistent format
export async function createExample(data: CreateData) {
  try {
    const result = await db.example.create({ data })
    revalidatePath("/examples")
    return { success: true, data: result }
  } catch (error) {
    return { success: false, error: "Error message" }
  }
}
```

### Form Components with shadcn/ui
```typescript
// Use shadcn/ui Form components with React Hook Form + Zod
const form = useForm<FormData>({
  resolver: zodResolver(schema),
  defaultValues: { ... }
})

const mutation = useMutation({
  onSuccess: (result) => {
    if (result.success) {
      form.reset()
      toast.success("Success message")
    }
  }
})
```

### Soft Delete Implementation
- Use `destroyed_at` timestamp field (nullable)
- Filter queries with `destroyed_at: null` for active records
- Provide restore functionality for soft-deleted records
- Handle email uniqueness with restoration dialog pattern

## Development Notes

### Current Implementation Status
- ✅ **User Management System** - Complete admin interface with CRUD operations
- ✅ **Database Setup** - PostgreSQL with Prisma, User model with soft deletes
- ✅ **Recipe Data Models** - Image, Ingredient, IngredientLocation, IngredientType models with server actions
- ✅ **Authentication Patterns** - Server actions, TanStack Query hooks, form validation
- 🔄 **Recipe Features** - Data layer complete, UI not yet implemented (see docs/concept.md for specifications)

### When Implementing New Features
- **Follow established patterns** documented above for consistency
- **Use shadcn/ui components** with the Form pattern for all forms
- **Implement TanStack Query hooks** following the established mutation hook pattern
- **Create server actions** with consistent return format `{ success: boolean, data?, error? }`
- **Use Zod schemas** in `src/lib/[domain]/validations.ts` for form validation
- **Implement soft deletes** with `destroyed_at` field and restore functionality
- **Use Sonner toast notifications** for user feedback
- **Maintain TypeScript strict mode** compliance throughout
- **Store environment variables** in `.env.local` (see template structure)

### TypeScript Guidelines
- **NEVER use `any` type** - Always prefer proper typing, `unknown`, or union types
- **Avoid type assertions (`as`)** wherever possible - Use type guards and proper type narrowing instead
- **Prefer `type` over `interface`** for simple object shapes and unions - Use `interface` only for extensible contracts
- **Use proper type guards** for runtime type checking instead of type assertions
- **Import types from Prisma client** using `import { ModelName } from "@/generated/prisma"`
- **Use `unknown` for error parameters** in callbacks and properly narrow the type with guards

### VSCode Configuration
- **Format on save** enabled with Prettier
- **Auto-organize imports** and remove unused imports on save
- **ESLint auto-fix** on save
- **2-space indentation** for all file types
- **Recommended extensions** defined in `.vscode/extensions.json`