# Architecture

**Analysis Date:** 2026-03-01

## Pattern Overview

**Overall:** Full-stack Next.js App Router application with a multi-section form wizard, server-side data persistence, PDF generation, and a password-protected admin dashboard.

**Key Characteristics:**
- Single-page questionnaire wizard (15+ sections, client-side state)
- Server-side form submission via Next.js API routes
- Stateless admin auth via HMAC-signed session cookies
- Pure-function diagnosis algorithms extracted for testability
- No global state management library (React local state only)

## Layers

**UI Layer (Client Components):**
- Purpose: Multi-step questionnaire form, section navigation, report display
- Contains: `QuestionnaireForm`, section components, form-field components
- Location: `src/components/questionnaire/`
- Depends on: Validation schemas, diagnosis algorithms, shadcn/ui components
- Used by: `src/app/page.tsx` (public), `src/app/dev/page.tsx` (dev navigation)

**API Layer (Route Handlers):**
- Purpose: HTTP endpoints for data submission, retrieval, CSV export, PDF generation, auth
- Contains: Next.js Route Handlers
- Location: `src/app/api/`
- Depends on: Prisma client, Zod schemas, auth utilities, PDF renderer
- Used by: Client components via `fetch()`

**Data Layer:**
- Purpose: Database access and schema
- Contains: Prisma client singleton, schema definition
- Location: `src/lib/prisma.ts`, `prisma/schema.prisma`
- Depends on: Neon PostgreSQL via `DATABASE_URL`
- Used by: API route handlers

**Business Logic Layer:**
- Purpose: Sleep diagnosis algorithms (pure functions, fully testable)
- Contains: Threshold constants, scoring functions, diagnosis generators
- Location: `src/lib/diagnosis-algorithms.ts`
- Depends on: `date-fns`, questionnaire types
- Used by: `ReportSection` component, `ReportPDF` component

**Auth Layer:**
- Purpose: Admin session management
- Contains: HMAC session token creation/verification, cookie management
- Location: `src/lib/auth.ts`, `src/middleware.ts`
- Depends on: Web Crypto API, Next.js cookies
- Used by: Admin API routes, middleware

**Validation Layer:**
- Purpose: Shared Zod schemas for client and server validation
- Contains: Per-section schemas, combined `questionnaireSchema`
- Location: `src/validations/questionnaire.ts`
- Depends on: Zod, date-fns
- Used by: `QuestionnaireForm` (react-hook-form resolver), API route handlers

## Data Flow

**Questionnaire Submission:**

1. User fills multi-step form in `QuestionnaireForm` (`src/components/questionnaire/QuestionnaireForm.tsx`)
2. React Hook Form manages client-side state with Zod validation
3. On final section, user submits → `POST /api/responses`
4. `src/app/api/responses/route.ts` validates with `questionnaireSchema.parse()`
5. Prisma saves `QuestionnaireResponse` to Neon PostgreSQL
6. Response returns `{ success: true, id }` to client

**Report Generation (Client-side):**

1. On `report` section, `ReportSection` component receives full form data
2. Calls `generateDiagnosisReport()` from `src/lib/diagnosis-algorithms.ts`
3. Renders diagnosis results directly in the browser (no API call)

**PDF Download:**

1. User clicks download in `ReportSection`
2. `POST /api/generate-pdf` with full form data
3. Server validates data, renders `ReportPDF` React component
4. `@react-pdf/renderer` converts to PDF buffer
5. Returns as `application/pdf` attachment

**Admin Dashboard:**

1. Admin visits `/admin` → middleware checks `admin_session` cookie
2. If no valid session → redirect to `/admin/login`
3. Admin submits password → `POST /api/admin/login` → HMAC session token created
4. `AdminDashboardClient` fetches `GET /api/responses` (paginated)
5. CSV export via `GET /api/responses/csv`

**State Management:**
- All questionnaire state lives in React Hook Form within `QuestionnaireForm`
- No persistent client-side state (no localStorage, no global store)
- Section navigation tracked via `currentSection` local state

## Key Abstractions

**QuestionnaireForm:**
- Purpose: Orchestrates the entire multi-step questionnaire
- Location: `src/components/questionnaire/QuestionnaireForm.tsx`
- Pattern: Single large form with conditional section rendering, shared `useForm` instance

**Section Components:**
- Purpose: Render one section of the questionnaire
- Examples: `DaytimeSection`, `ScheduledSleepSection`, `ReportSection`
- Location: `src/components/questionnaire/sections/`
- Pattern: Accept `form: UseFormReturn<QuestionnaireFormData>` prop, render fields

**Form Field Components:**
- Purpose: Reusable field wrappers for common input types
- Examples: `CheckboxField`, `RadioGroupField`, `SelectField`, `TimeField`
- Location: `src/components/questionnaire/form-fields/`
- Pattern: Accept `form`, `name`, `label`, `options` props; generic over field names

**Diagnosis Algorithms:**
- Purpose: Pure functions for clinical sleep disorder scoring
- Location: `src/lib/diagnosis-algorithms.ts`
- Pattern: Exported named functions + `THRESHOLDS` constants; no side effects

## Entry Points

**Public Questionnaire:**
- Location: `src/app/page.tsx`
- Triggers: HTTP GET `/`
- Responsibilities: Renders `QuestionnaireForm`

**Dev Navigation:**
- Location: `src/app/dev/page.tsx`
- Triggers: HTTP GET `/dev?section=<section>`
- Responsibilities: Sidebar nav for jumping to any section (enabled by `NEXT_PUBLIC_SHOW_DEV_TOOLS`)

**Admin Dashboard:**
- Location: `src/app/admin/page.tsx` → `AdminDashboardClient`
- Triggers: HTTP GET `/admin` (protected by middleware)
- Responsibilities: Display paginated responses, CSV download

**Middleware:**
- Location: `src/middleware.ts`
- Triggers: All requests matching `/admin/:path*` and `/api/responses/:path*`
- Responsibilities: Session validation, redirect unauthenticated users

## Error Handling

**Strategy:** Try/catch in API routes, return JSON error responses with appropriate HTTP status codes

**Patterns:**
- API routes catch all errors, log with `console.error`, return `{ error: string }` JSON
- Zod validation errors detected by `error.name === 'ZodError'` and return 400
- Client components handle `response.ok` checks, display error state in UI
- No global error boundary beyond Next.js default

## Cross-Cutting Concerns

**Logging:**
- `console.error` in API routes for server errors
- `console.warn` allowed (ESLint allows warn/error)
- No structured logging library

**Validation:**
- Zod schemas in `src/validations/questionnaire.ts` used on both client (react-hook-form) and server (API routes)
- Fail-fast on invalid input with 400 responses

**Authentication:**
- Next.js middleware (`src/middleware.ts`) guards `/admin` routes and non-POST `/api/responses`
- HMAC-signed cookies with 24-hour expiry
- Password comparison is plain string equality (no bcrypt)

---

*Architecture analysis: 2026-03-01*
*Update when major patterns change*
