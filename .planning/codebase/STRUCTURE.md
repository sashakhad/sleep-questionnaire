# Codebase Structure

**Analysis Date:** 2026-03-01

## Directory Layout

```
sleep-questionnaire/
├── src/
│   ├── app/                    # Next.js App Router pages and API routes
│   │   ├── admin/              # Admin dashboard (password-protected)
│   │   ├── api/                # API route handlers
│   │   │   ├── admin/          # Admin auth endpoints
│   │   │   ├── generate-pdf/   # PDF generation endpoint
│   │   │   └── responses/      # Questionnaire response CRUD + CSV export
│   │   ├── dev/                # Dev navigation page (section jumping)
│   │   ├── globals.css         # Global CSS (Tailwind base)
│   │   ├── layout.tsx          # Root layout with fonts and metadata
│   │   └── page.tsx            # Home page (renders QuestionnaireForm)
│   ├── components/
│   │   ├── questionnaire/      # Questionnaire-specific components
│   │   │   ├── form-fields/    # Reusable field components
│   │   │   ├── sections/       # One component per questionnaire section
│   │   │   ├── QuestionnaireForm.tsx  # Main form orchestrator
│   │   │   └── ReportPDF.tsx   # PDF report component
│   │   ├── ui/                 # shadcn/ui components
│   │   └── __tests__/          # Component unit tests
│   ├── lib/
│   │   ├── __tests__/          # Library unit tests
│   │   ├── auth.ts             # Session management (HMAC tokens)
│   │   ├── diagnosis-algorithms.ts  # Sleep diagnosis pure functions
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── utils.ts            # cn() utility for Tailwind class merging
│   ├── stories/                # Storybook stories
│   ├── types/
│   │   ├── jest.d.ts           # Jest type augmentations
│   │   └── questionnaire.ts    # QuestionnaireData, QuestionnaireSection types
│   ├── validations/
│   │   └── questionnaire.ts    # Zod schemas for all questionnaire sections
│   └── middleware.ts           # Next.js middleware (auth guards)
├── cypress/
│   ├── e2e/                    # E2E test specs
│   └── support/                # Custom commands and setup
├── prisma/
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Prisma migration files
├── public/                     # Static assets
├── .storybook/                 # Storybook configuration
├── docs/                       # Project documentation and feedback
├── .github/workflows/          # GitHub Actions CI
├── .env                        # Local environment variables (gitignored)
├── cypress.config.ts           # Cypress configuration
├── eslint.config.mjs           # ESLint flat config
├── jest.config.js              # Jest configuration
├── jest.setup.ts               # Jest setup (testing-library/jest-dom)
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies and scripts
├── pnpm-lock.yaml              # pnpm lockfile
├── postcss.config.mjs          # PostCSS with Tailwind
├── prisma.config.ts            # Prisma config (with dotenv)
├── tailwind.config.ts          # Tailwind configuration
├── tsconfig.json               # TypeScript configuration
├── tsconfig.jest.json          # TypeScript config for Jest
└── vitest.config.ts            # Vitest config (Storybook tests only)
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router pages and API routes
- Contains: Page components, layout, API route handlers
- Key files: `layout.tsx` (root layout), `page.tsx` (home), `middleware.ts` (auth)
- Subdirectories: `admin/` (dashboard), `api/` (endpoints), `dev/` (dev tools)

**`src/components/questionnaire/`:**
- Purpose: All questionnaire UI components
- Contains: Main form orchestrator, section components, reusable field components, PDF renderer
- Key files: `QuestionnaireForm.tsx` (main form), `ReportPDF.tsx` (PDF layout)
- Subdirectories: `sections/` (15+ section components), `form-fields/` (7 reusable field types)

**`src/components/ui/`:**
- Purpose: shadcn/ui component library (generated/customized)
- Contains: Button, Card, Checkbox, Dialog, Form, Input, Label, Popover, Progress, RadioGroup, Select, Slider
- Key files: All are thin wrappers around Radix UI primitives

**`src/lib/`:**
- Purpose: Shared utilities and business logic
- Contains: Auth, Prisma client, diagnosis algorithms, utility functions
- Key files: `diagnosis-algorithms.ts` (clinical logic), `auth.ts` (session management), `prisma.ts` (DB client)

**`src/types/`:**
- Purpose: TypeScript type definitions
- Key files: `questionnaire.ts` (QuestionnaireData interface, QuestionnaireSection union type)

**`src/validations/`:**
- Purpose: Zod validation schemas shared between client and server
- Key files: `questionnaire.ts` (per-section schemas + combined `questionnaireSchema`)

**`cypress/`:**
- Purpose: E2E test suite
- Contains: Test specs in `e2e/`, custom commands in `support/`
- Key files: `e2e/app.cy.ts` (smoke tests), `e2e/round3-feedback.cy.ts` (regression tests), `support/commands.ts` (`navigateToSection` command)

**`prisma/`:**
- Purpose: Database schema and migrations
- Key files: `schema.prisma` (single `QuestionnaireResponse` model)

## Key File Locations

**Entry Points:**
- `src/app/page.tsx` - Public questionnaire page
- `src/app/layout.tsx` - Root layout
- `src/middleware.ts` - Auth middleware
- `src/app/dev/page.tsx` - Dev section navigation

**Configuration:**
- `tsconfig.json` - TypeScript config with `@/*` → `./src/*` path alias
- `jest.config.js` - Jest with ts-jest, jsdom environment
- `cypress.config.ts` - Cypress with `baseUrl: http://localhost:3000`
- `.env` - `DATABASE_URL`, `ADMIN_PASSWORD`, `NEXT_PUBLIC_SHOW_DEV_TOOLS`

**Core Logic:**
- `src/lib/diagnosis-algorithms.ts` - All sleep diagnosis algorithms
- `src/validations/questionnaire.ts` - All Zod schemas
- `src/types/questionnaire.ts` - Core TypeScript types
- `src/lib/prisma.ts` - Database client

**API Routes:**
- `src/app/api/responses/route.ts` - POST (submit) + GET (list) responses
- `src/app/api/responses/csv/route.ts` - GET CSV export
- `src/app/api/generate-pdf/route.ts` - POST PDF generation
- `src/app/api/admin/login/route.ts` - POST admin login
- `src/app/api/admin/logout/route.ts` - POST admin logout

**Testing:**
- `src/lib/__tests__/diagnosis-algorithms.test.ts` - Unit tests for diagnosis logic
- `src/components/__tests__/ExampleForm.test.tsx` - Component test example
- `cypress/e2e/app.cy.ts` - Smoke E2E tests
- `cypress/e2e/round3-feedback.cy.ts` - Regression E2E tests

## Naming Conventions

**Files:**
- `PascalCase.tsx` - React components (`QuestionnaireForm.tsx`, `DaytimeSection.tsx`)
- `camelCase.ts` - Library/utility modules (`diagnosis-algorithms.ts` is an exception using kebab-case)
- `kebab-case.ts` - Some lib files (`diagnosis-algorithms.ts`, `auth.ts`)
- `*.test.ts` / `*.test.tsx` - Test files co-located in `__tests__/` subdirectories
- `*.cy.ts` - Cypress E2E tests in `cypress/e2e/`

**Directories:**
- `PascalCase` not used for directories
- kebab-case or camelCase for directories (`form-fields/`, `sections/`, `__tests__/`)

## Where to Add New Code

**New Questionnaire Section:**
- Section component: `src/components/questionnaire/sections/{SectionName}Section.tsx`
- Section schema: Add to `src/validations/questionnaire.ts`
- Section type: Add to `QuestionnaireSection` union in `src/types/questionnaire.ts`
- Register in form: `src/components/questionnaire/QuestionnaireForm.tsx`

**New API Endpoint:**
- Route handler: `src/app/api/{feature}/route.ts`
- Add auth guard if needed: update `src/middleware.ts` matcher

**New Diagnosis Algorithm:**
- Implementation: Add to `src/lib/diagnosis-algorithms.ts`
- Tests: `src/lib/__tests__/diagnosis-algorithms.test.ts`

**New Form Field Component:**
- Implementation: `src/components/questionnaire/form-fields/{FieldType}Field.tsx`

**New shadcn/ui Component:**
- Generated via `pnpm dlx shadcn@latest add <component>`
- Output: `src/components/ui/{component}.tsx`

## Special Directories

**`.next/`:**
- Purpose: Next.js build output and cache
- Source: Generated by `pnpm run build` or `pnpm run dev`
- Committed: No (gitignored)

**`node_modules/`:**
- Purpose: Installed dependencies
- Source: `pnpm install`
- Committed: No (gitignored)

**`prisma/migrations/`:**
- Purpose: Database migration history
- Source: Generated by `prisma migrate dev`
- Committed: Yes

**`docs/`:**
- Purpose: Project documentation, client feedback correspondence
- Committed: Yes

---

*Structure analysis: 2026-03-01*
*Update when directory structure changes*
