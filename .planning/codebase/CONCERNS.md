# Codebase Concerns

**Analysis Date:** 2026-03-01

## Tech Debt

**Plain-text password comparison in admin auth:**
- Issue: `ADMIN_PASSWORD` compared with `===` (no hashing) in `src/app/api/admin/login/route.ts`
- Why: Simple MVP auth implementation
- Impact: Password exposed in timing attacks if constant-time comparison not used (it isn't for the password check itself, only for the HMAC signature)
- Fix approach: Use `bcrypt` or `argon2` for password hashing, or switch to a proper auth provider

**`SESSION_SECRET` has insecure default fallback:**
- Issue: `src/lib/auth.ts` falls back to `'default-secret-change-in-production'` if `SESSION_SECRET` is not set
- Why: Developer convenience during local setup
- Impact: If `SESSION_SECRET` is not set in production, all session tokens are signed with a known secret — admin sessions can be forged
- Fix approach: Throw an error at startup if `SESSION_SECRET` is not set in production (`process.env.NODE_ENV === 'production'`)

**No `.env.example` file:**
- Issue: No `.env.example` or `.env.template` to document required environment variables
- Why: Likely omitted during initial setup
- Impact: New developers don't know what env vars are required (`DATABASE_URL`, `ADMIN_PASSWORD`, `SESSION_SECRET`)
- Fix approach: Create `.env.example` with placeholder values for all required vars

**EDS scoring logic duplicated:**
- Issue: `EDS_WEIGHTS` constant and scoring logic exist in both `src/lib/diagnosis-algorithms.ts` (exported `EDS_WEIGHTS`) and `src/components/questionnaire/sections/ReportSection.tsx` (local `EDS_WEIGHTS` and `calculateEDSScore`)
- Why: `ReportSection` was built before algorithms were extracted to `diagnosis-algorithms.ts`
- Impact: Divergence risk — changes to one won't automatically update the other
- Fix approach: Remove local `EDS_WEIGHTS` and `calculateEDSScore` from `ReportSection.tsx`, import from `src/lib/diagnosis-algorithms.ts`

**`package-lock.json` present alongside `pnpm-lock.yaml`:**
- Issue: Both `package-lock.json` (npm) and `pnpm-lock.yaml` (pnpm) exist in the repo
- Why: Project was likely initialized with npm before switching to pnpm
- Impact: Confusion about which lockfile is authoritative; CI uses pnpm but `package-lock.json` may mislead developers
- Fix approach: Delete `package-lock.json`, ensure `.gitignore` excludes it

## Known Bugs

**`cy.wait(500)` in Cypress custom command:**
- Symptoms: Tests may be flaky if 500ms is insufficient for form to render
- Trigger: `cy.navigateToSection()` in `cypress/support/commands.ts` uses `cy.wait(500)` after visiting `/dev`
- File: `cypress/support/commands.ts`
- Root cause: Arbitrary timeout instead of waiting for specific element
- Fix: Replace `cy.wait(500)` with `cy.get('[specific-element]').should('be.visible')`

## Security Considerations

**Admin password stored in plain `.env`:**
- Risk: `.env` file contains `ADMIN_PASSWORD="sleepwell"` — a weak, guessable password
- Files: `.env`
- Current mitigation: `.env` is gitignored
- Recommendations: Use a strong password in production; consider environment-specific `.env` files

**`NEXT_PUBLIC_SHOW_DEV_TOOLS=true` in `.env`:**
- Risk: Dev navigation page (`/dev`) is accessible in production if this env var is set
- Files: `.env`, `src/app/dev/page.tsx`
- Current mitigation: Env var controls visibility, but `/dev` route itself is not protected by auth middleware
- Recommendations: Add middleware protection to `/dev` route, or ensure `NEXT_PUBLIC_SHOW_DEV_TOOLS` is `false`/unset in production

**No rate limiting on auth endpoints:**
- Risk: `/api/admin/login` has no rate limiting — brute-force attacks possible
- File: `src/app/api/admin/login/route.ts`
- Current mitigation: None
- Recommendations: Add rate limiting middleware (e.g., `@upstash/ratelimit` or Vercel Edge middleware)

**Patient data in `rawData` JSON column:**
- Risk: Full questionnaire responses (including health data) stored as unencrypted JSON in PostgreSQL
- File: `prisma/schema.prisma` (`rawData Json` field)
- Current mitigation: Database access controlled by `DATABASE_URL` credentials
- Recommendations: Consider field-level encryption for sensitive health data; ensure HIPAA compliance requirements are understood

## Performance Bottlenecks

**Large `diagnosis-algorithms.ts` file:**
- Problem: Single file contains all diagnosis logic (~600+ lines)
- File: `src/lib/diagnosis-algorithms.ts`
- Impact: Not a runtime concern, but increases cognitive load for maintenance
- Improvement path: Split into domain-specific modules (e.g., `insomnia.ts`, `sleep-apnea.ts`, `narcolepsy.ts`)

**No pagination in CSV export:**
- Problem: `GET /api/responses/csv` fetches up to 10,000 rows into memory at once
- File: `src/app/api/responses/csv/route.ts`
- Measurement: Unknown — depends on response volume
- Improvement path: Stream CSV generation using Node.js streams or chunked responses

## Fragile Areas

**`QuestionnaireForm.tsx` section orchestration:**
- File: `src/components/questionnaire/QuestionnaireForm.tsx`
- Why fragile: Single large component manages all 15+ sections, navigation state, form submission, and dev mode
- Common failures: Adding a new section requires changes in multiple places (sections array, sectionTitles, conditional rendering)
- Safe modification: Follow existing pattern exactly; test navigation after adding sections
- Test coverage: No unit tests for form orchestration; covered only by Cypress E2E

**Admin auth session validation:**
- File: `src/lib/auth.ts`
- Why fragile: Custom HMAC session implementation with manual timestamp parsing and constant-time comparison
- Common failures: Token format changes break all existing sessions; `SESSION_SECRET` rotation invalidates all sessions
- Safe modification: Treat as security-critical code; add tests before changing
- Test coverage: No tests for auth module

## Scaling Limits

**Neon PostgreSQL free tier:**
- Current capacity: Free tier limits (compute hours, storage)
- Limit: Neon free tier pauses after inactivity; cold start latency on first request
- Symptoms at limit: Slow first request after inactivity period
- Scaling path: Upgrade to Neon paid plan for always-on compute

**Single `QuestionnaireResponse` model:**
- Current capacity: Suitable for current use
- Limit: No indexing on `createdAt` or demographic fields beyond what Prisma defaults provide
- Improvement path: Add database indexes if query performance degrades with large datasets

## Dependencies at Risk

**`@react-pdf/renderer` 4.x:**
- Risk: Complex dependency with limited maintainer activity; React 19 compatibility may have edge cases
- Impact: PDF generation (`/api/generate-pdf`) breaks
- Migration plan: Monitor for issues; `puppeteer` or `playwright` PDF generation as fallback

**`next` 16.x (pre-release/canary):**
- Risk: Version `^16.1.1` is ahead of stable Next.js releases (as of analysis date, Next.js stable is 15.x)
- Impact: Potential instability, breaking changes, or undocumented behavior
- Migration plan: Verify intended version; pin to stable `15.x` if `16.x` was unintentional

## Missing Critical Features

**No `.env.example`:**
- Problem: No documented list of required environment variables
- Current workaround: Developers must inspect code to find required vars
- Blocks: Onboarding new developers, setting up new environments
- Implementation complexity: Trivial (create file with placeholder values)

**No error monitoring:**
- Problem: No Sentry or equivalent — production errors are silent
- Current workaround: Vercel logs only (7-day retention on free plan)
- Blocks: Debugging production issues, tracking error rates
- Implementation complexity: Low (add Sentry SDK)

## Test Coverage Gaps

**Admin auth module (`src/lib/auth.ts`):**
- What's not tested: Session token creation, verification, expiry, constant-time comparison
- Risk: Security regression in auth logic could go undetected
- Priority: High
- Difficulty to test: Medium (requires mocking Web Crypto API or using real crypto)

**API route handlers:**
- What's not tested: `POST /api/responses`, `GET /api/responses`, `GET /api/responses/csv`, `POST /api/generate-pdf`
- Risk: Regressions in data submission, retrieval, or export
- Priority: High
- Difficulty to test: Medium (requires mocking Prisma client)

**`QuestionnaireForm` navigation logic:**
- What's not tested: Section progression, back navigation, form submission flow
- Risk: Navigation bugs not caught until E2E tests (slow feedback loop)
- Priority: Medium
- Difficulty to test: Medium (requires full form rendering with mock data)

**`ReportSection` diagnosis display:**
- What's not tested: How diagnosis results are rendered for different severity levels
- Risk: Clinical information displayed incorrectly
- Priority: High (patient-facing)
- Difficulty to test: Medium (component test with mock form data)

---

*Concerns audit: 2026-03-01*
*Update as issues are fixed or new ones discovered*
