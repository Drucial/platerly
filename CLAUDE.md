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
  │   └── user.ts    # User CRUD operations
  ├── app/           # Next.js App Router pages and layouts
  │   ├── admin/     # Admin pages
  │   │   └── user/  # User management admin page
  │   ├── page.tsx   # Home page
  │   ├── layout.tsx # Root layout with QueryProvider and Toaster
  │   └── globals.css # Global Tailwind styles
  ├── components/    # Reusable React components
  │   ├── ui/        # shadcn/ui components (Button, Form, Dialog, etc.)
  │   └── users/     # User-specific components
  ├── generated/     # Generated files (Prisma client)
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
  └── schema.prisma  # Prisma schema with User model
docs/
  └── concept.md     # Product concept and feature specifications
```

### Key Configurations
- **TypeScript**: Strict mode, ES2017 target, path mapping (`@/*` → `./src/*`)
- **ESLint**: Next.js core web vitals + TypeScript rules
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

The codebase is in early stages - currently showing the default Next.js template page. The actual Platerly features described in docs/concept.md need to be implemented.

When implementing new features:
- Follow the shadcn/ui component patterns
- Use the `cn()` utility from lib/utils.ts for conditional classes
- Leverage Next.js App Router patterns with server actions for data mutations
- Use TanStack Query for client-side data fetching and caching
- Implement Prisma models following the recipe/meal planning domain
- Use Motion/React for smooth page transitions and micro-animations
- Maintain TypeScript strict mode compliance
- Store environment variables for OpenAI API keys and AWS credentials in .env.local