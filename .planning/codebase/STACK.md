# Technology Stack

**Analysis Date:** 2026-03-01

## Languages

**Primary:**
- TypeScript 5.x - All application code (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- JavaScript - Config files (`jest.config.js`, `postcss.config.mjs`)
- CSS - Global styles (`src/app/globals.css`)

## Runtime

**Environment:**
- Node.js 20.x (LTS) - `package.json` engines implied; CI uses `node-version: 20.x`
- Browser - React client components with `'use client'` directive

**Package Manager:**
- pnpm 10.8.1 - `pnpm-lock.yaml` present; CI uses `pnpm/action-setup@v2` with version `10.8.1`

## Frameworks

**Core:**
- Next.js 16.x - Full-stack React framework with App Router (`src/app/`)
- React 19.x - UI library

**Testing:**
- Jest 30.x - Unit and component tests (`jest.config.js`)
- Cypress 14.x - E2E tests (`cypress/e2e/`)
- Vitest 3.x - Storybook component tests (`vitest.config.ts`)
- React Testing Library 16.x - Component rendering in Jest

**Build/Dev:**
- TypeScript 5.x - Type checking (`tsconfig.json`)
- Tailwind CSS 4.x - Utility-first styling (`tailwind.config.ts`)
- Prettier 3.x - Code formatting (`.prettierrc.json`)
- ESLint 9.x - Linting (`eslint.config.mjs`)
- Storybook 9.x - Component development/documentation (`.storybook/`)

## Key Dependencies

**Critical:**
- `@prisma/client` 7.x + `@prisma/adapter-pg` - PostgreSQL ORM and adapter (`src/lib/prisma.ts`)
- `react-hook-form` 7.x - Form state management (`src/components/questionnaire/QuestionnaireForm.tsx`)
- `zod` 3.x - Schema validation (`src/validations/questionnaire.ts`)
- `@hookform/resolvers` 5.x - Zod integration with react-hook-form
- `@react-pdf/renderer` 4.x - PDF generation from React components (`src/app/api/generate-pdf/route.ts`)

**Infrastructure:**
- `@radix-ui/*` - Headless UI primitives (checkbox, dialog, radio-group, select, slider, etc.)
- `class-variance-authority` + `clsx` + `tailwind-merge` - Conditional class utilities (`src/lib/utils.ts`)
- `lucide-react` - Icon library
- `date-fns` 4.x - Date utilities used in diagnosis algorithms
- `dotenv` - Environment variable loading for Prisma config

## Configuration

**Environment:**
- `.env` file (gitignored) - `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SHOW_DEV_TOOLS`
- `SESSION_SECRET` env var used in `src/lib/auth.ts` (not in `.env`, must be set in production)
- No `.env.example` present

**Build:**
- `tsconfig.json` - TypeScript compiler options (strict mode, `@/*` path alias)
- `tsconfig.jest.json` - Separate tsconfig for Jest
- `next.config.ts` - Minimal Next.js config (no custom options)
- `tailwind.config.ts` - Tailwind configuration
- `postcss.config.mjs` - PostCSS with `@tailwindcss/postcss`
- `prisma.config.ts` - Prisma config with dotenv loading

## Platform Requirements

**Development:**
- macOS/Linux/Windows with Node.js 20.x and pnpm
- PostgreSQL database (Neon serverless in production)
- `pnpm run dev` starts Next.js with Turbopack

**Production:**
- Vercel - Next.js hosting (`.vercel/project.json` present, project ID `prj_NMlSZrwmM4RG51YcJGDMxP7Bgoic`)
- Neon PostgreSQL - Serverless PostgreSQL (`DATABASE_URL` in `.env`)
- `pnpm run build` runs `prisma generate && next build`

---

*Stack analysis: 2026-03-01*
*Update after major dependency changes*
