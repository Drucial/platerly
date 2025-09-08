# Platerly

Platerly is an AI-powered recipe and meal planning application that unifies recipe management, pantry tracking, grocery automation, and meal planning into one seamless experience.

## Features

- **Smart Recipe Ingestion**: Add recipes via photo, link, or text input with AI-powered parsing
- **Personal Recipe Book**: Search and categorize your recipe collection
- **Pantry & Ingredient Tracking**: Keep track of what you have on hand
- **Automated Grocery Lists**: Generate shopping lists based on your meal plans
- **Weekly Meal Planning**: Calendar view for planning your meals

## Tech Stack

- **Next.js 15** with App Router and Turbopack
- **React 19** with TypeScript
- **Tailwind CSS 4** + shadcn/ui components
- **PostgreSQL** with Prisma ORM
- **TanStack Query** for server state management
- **OpenAI API** for AI-powered features
- **AWS S3** for file storage

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (package manager)
- PostgreSQL database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd platerly
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.local.template .env.local
```
Edit `.env.local` with your database URL, OpenAI API key, and AWS credentials.

4. Set up the database:
```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database
pnpm db:push

# Optional: Open Prisma Studio to view data
pnpm db:studio
```

5. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Development Commands

### Core Commands
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Database Commands
- `pnpm db:generate` - Regenerate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio GUI
- `pnpm db:reset` - Reset database

## Project Structure

```
src/
├── actions/       # Next.js Server Actions
├── app/           # App Router pages and layouts
├── components/    # Reusable React components
│   └── ui/        # shadcn/ui components
├── hooks/         # Custom React hooks with TanStack Query
├── lib/           # Utilities and configurations
└── types/         # TypeScript type definitions

prisma/            # Database schema and migrations
docs/              # Project documentation
```

## Contributing

See `CLAUDE.md` for detailed development guidelines and established patterns when contributing to this project.
