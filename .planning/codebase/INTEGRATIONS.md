# External Integrations

**Analysis Date:** 2026-03-01

## APIs & External Services

**Payment Processing:**
- Not detected

**Email/SMS:**
- Not detected

**External APIs:**
- Not detected (self-contained application)

## Data Storage

**Databases:**
- Neon PostgreSQL - Primary data store for questionnaire responses
  - Connection: via `DATABASE_URL` env var (pooled Neon connection string)
  - Client: Prisma ORM 7.x with `@prisma/adapter-pg` driver adapter (`src/lib/prisma.ts`)
  - Migrations: `prisma migrate dev` in `prisma/migrations/`
  - Schema: `prisma/schema.prisma` - single `QuestionnaireResponse` model

**File Storage:**
- Not detected (no S3 or file storage integration)

**Caching:**
- Not detected (no Redis or caching layer)

## Authentication & Identity

**Auth Provider:**
- Custom HMAC-signed session tokens - Password-based admin authentication
  - Implementation: `src/lib/auth.ts` - Web Crypto API (HMAC-SHA256 signatures)
  - Token storage: `httpOnly` cookie named `admin_session`
  - Session management: 24-hour expiry with timestamp validation
  - Password: `ADMIN_PASSWORD` env var (compared directly in `src/app/api/admin/login/route.ts`)
  - Session secret: `SESSION_SECRET` env var (falls back to insecure default if not set)

**OAuth Integrations:**
- Not detected

## Monitoring & Observability

**Error Tracking:**
- Not detected (no Sentry or similar)

**Analytics:**
- Not detected

**Logs:**
- Console only - `console.error` and `console.warn` in API routes
- Vercel logs capture stdout/stderr in production

## CI/CD & Deployment

**Hosting:**
- Vercel - Next.js app hosting
  - Project ID: `prj_NMlSZrwmM4RG51YcJGDMxP7Bgoic` (`.vercel/project.json`)
  - Deployment: Automatic on main branch push (Vercel GitHub integration)
  - Environment vars: Configured in Vercel dashboard

**CI Pipeline:**
- GitHub Actions - Lint, type-check, unit tests, and E2E tests
  - Workflows: `.github/workflows/ci.yml`
  - Triggers: push/PR to `main` branch
  - Jobs: `build` (lint + type-check + jest) → `e2e` (cypress run against built app)
  - No secrets required in CI (DATABASE_URL not needed for unit tests)

## Environment Configuration

**Development:**
- Required env vars: `DATABASE_URL`, `ADMIN_PASSWORD`
- Optional: `NEXT_PUBLIC_SHOW_DEV_TOOLS=true` (enables `/dev` page navigation)
- Secrets location: `.env` file (gitignored via `.env*` pattern)
- No `.env.example` present — developers must get credentials out-of-band

**Production:**
- Secrets management: Vercel environment variables dashboard
- `SESSION_SECRET` must be set in production (has insecure default fallback in `src/lib/auth.ts`)
- Database: Neon PostgreSQL with SSL (`sslmode=require&channel_binding=require`)

## Webhooks & Callbacks

**Incoming:**
- Not detected

**Outgoing:**
- Not detected

## PDF Generation

**@react-pdf/renderer 4.x** - Server-side PDF generation
- Endpoint: `POST /api/generate-pdf` (`src/app/api/generate-pdf/route.ts`)
- Renders `ReportPDF` React component (`src/components/questionnaire/ReportPDF.tsx`) to PDF buffer
- Returns PDF as `application/pdf` attachment

---

*Integration audit: 2026-03-01*
*Update when adding/removing external services*
