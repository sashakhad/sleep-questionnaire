# Comprehensive Cypress E2E Test Suite

## What This Is

A comprehensive Cypress end-to-end test suite for the sleep questionnaire application. The suite covers every section of the 16-step questionnaire wizard, validates client feedback changes from rounds 1–3, tests conditional logic, API endpoints (CSV export, PDF generation), the admin dashboard, and the diagnosis report. Tests run against `http://localhost:3000` and use the `/dev` route for section navigation with pre-filled mock data.

## Core Value

Robustness and coverage — every section of the app must have at least basic test coverage, with deeper tests for validation and the diagnosis report.

## Requirements

### Validated

- ✓ Cypress 14.x installed and configured (`cypress.config.ts`, `baseUrl: http://localhost:3000`) — existing
- ✓ Custom `cy.navigateToSection(section)` command visits `/dev?section={section}` — existing
- ✓ Smoke tests for page load, form existence, page structure (`cypress/e2e/app.cy.ts`) — existing
- ✓ Round 3 feedback regression tests for 12 client change items (`cypress/e2e/round3-feedback.cy.ts`) — existing
- ✓ Dev route (`/dev`) with sidebar navigation and pre-filled mock data — existing
- ✓ 16 questionnaire sections: intro, demographics, sleep-disorder-diagnoses, daytime, scheduled-sleep, unscheduled-sleep, breathing-disorders, restless-legs, parasomnia, nightmares, chronotype, sleep-hygiene, bedroom, lifestyle, mental-health, report — existing

### Active

- [ ] Full questionnaire flow test — navigate all 16 sections with realistic data, verify each renders correctly
- [ ] Validation tests — required fields on intro (disclaimer checkbox) and demographics (yearOfBirth, sex, zipcode) block navigation; birth year range cap (12 years old); time field formats
- [ ] Client feedback verification — all 12 items from `docs/correspondence/round-3-edits/CHANGES-IMPLEMENTED.md` verified in comprehensive tests (birth year range, OSA/RLS removal, planned nap removal, 0-minute fall asleep, hour picker scrolling, narcolepsy removal, AM/PM defaults and warnings, conditional work/school question, parasomnia diagnosis removal, nightmare contributing factors removal, report text updates, "Personalized" removal)
- [ ] Conditional logic tests — shift work questions appear only when shift work selected; work/school time hides when "flexible" chosen; nightmare follow-ups appear conditionally; pain severity shows only when pain affects sleep; leg cramp frequency appears when leg cramps checked
- [ ] CSV export test — `GET /api/responses/csv` returns proper CSV format with correct headers and `Content-Type: text/csv`
- [ ] PDF generation test — `POST /api/generate-pdf` returns PDF blob with `Content-Type: application/pdf`
- [ ] Report generation tests — pre-fill mock data, navigate to report, verify diagnosis sections appear based on data (insomnia, sleep apnea, EDS, nightmares), check report text matches updated language from feedback
- [ ] Admin dashboard tests — admin login flow, CSV export from admin panel
- [ ] Navigation tests — Previous/Continue buttons, progress bar updates, section jumping via dev page sidebar

### Out of Scope

- Visual regression testing — deferred to future iteration, not blocking for functional coverage
- Performance benchmarks — not needed for functional E2E validation
- Mobile-specific viewport tests — can be added later as a separate test suite
- Accessibility audits (a11y) — valuable but separate concern, not v1

## Context

**Existing test infrastructure:**
- `cypress/e2e/app.cy.ts` — 3 smoke tests (page loads, structure, form exists)
- `cypress/e2e/round3-feedback.cy.ts` — 20+ regression tests for client feedback changes
- `cypress/support/commands.ts` — `navigateToSection` custom command (uses `/dev` route)
- `cypress/support/e2e.ts` — support file entry point

**Application structure:**
- 16-section questionnaire wizard with React Hook Form + Zod validation
- Client-side report generation via `diagnosis-algorithms.ts` pure functions
- Server-side PDF generation via `@react-pdf/renderer`
- Admin dashboard with HMAC session auth, paginated response list, CSV download
- API routes: `POST /api/responses`, `GET /api/responses`, `GET /api/responses/csv`, `POST /api/generate-pdf`, `POST /api/admin/login`, `POST /api/admin/logout`

**Known concern:** `cy.wait(500)` in `navigateToSection` is fragile — should be replaced with element-based waiting, but that's an improvement, not a blocker.

**Section order in the form:** intro → demographics → sleep-disorder-diagnoses → daytime → scheduled-sleep → unscheduled-sleep → breathing-disorders → restless-legs → parasomnia → nightmares → chronotype → sleep-hygiene → bedroom → lifestyle → mental-health → report

**Client feedback docs:** `docs/correspondence/round-3-edits/CHANGES-IMPLEMENTED.md` documents all 12 feedback items that must be verified.

## Constraints

- **Test runner**: Cypress 14.x (already installed) — no switching to Playwright or other frameworks
- **Target**: Tests run against `http://localhost:3000` — app must be running before tests execute
- **Navigation**: Use `/dev` route for section jumping (pre-fills mock data via `cy.navigateToSection()`)
- **Existing files**: Keep `app.cy.ts` and `round3-feedback.cy.ts` intact — add new test files alongside them
- **Package manager**: pnpm for all commands

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Add new test files alongside existing ones (don't modify `app.cy.ts` or `round3-feedback.cy.ts`) | Preserve existing passing tests; additive approach is safer | — Pending |
| Use `/dev` route with mock data for most section tests | Dev route pre-fills realistic data, enables direct section navigation without filling prior sections | — Pending |
| Test API endpoints via `cy.request()` not UI interactions | CSV/PDF endpoints don't have direct UI triggers that are easy to test; `cy.request()` is more reliable | — Pending |
| Standard depth (5-8 phases, 3-5 plans each) | Balances thoroughness with execution speed for a test-only project | — Pending |

---
*Last updated: 2026-03-01 after initialization*
