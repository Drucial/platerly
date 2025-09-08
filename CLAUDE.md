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
- **Motion/React** (Framer Motion) for animations and transitions
- **OpenAI API** for AI-powered recipe parsing and smart features
- **AWS S3** for file storage (recipe images, user uploads)

### Directory Structure
```
src/                 # Source code directory (Next.js 13+ src pattern)
  ├── app/           # Next.js App Router pages and layouts
  │   ├── page.tsx   # Home page (currently default Next.js template)
  │   ├── layout.tsx # Root layout with Geist fonts
  │   └── globals.css # Global Tailwind styles
  ├── components/    # Reusable React components
  │   └── ui/        # shadcn/ui components
  ├── hooks/         # Custom React hooks
  ├── lib/           # Utility functions and configurations
  │   └── utils.ts   # Utility functions (cn helper for class merging)
  ├── types/         # TypeScript type definitions
  └── utils/         # Additional utility functions
docs/
  └── concept.md     # Product concept and feature specifications
```

### Key Configurations
- **TypeScript**: Strict mode, ES2017 target, path mapping (`@/*` → `./src/*`)
- **ESLint**: Next.js core web vitals + TypeScript rules
- **shadcn/ui**: New York style, Lucide icons, CSS variables enabled
- **Path Aliases**: `@/` maps to src directory for clean imports

### Expected Future Structure
When implementing the full application, expect these additional directories:
```
prisma/              # Database schema and migrations
  ├── schema.prisma  # Prisma schema definition
  └── migrations/    # Database migration files
src/lib/             # Additional library files
  ├── db.ts          # Prisma client setup
  ├── openai.ts      # OpenAI API configuration
  ├── s3.ts          # AWS S3 client setup
  └── validations.ts # Zod schemas for data validation
```

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