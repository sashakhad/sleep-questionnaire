---
plan: 01-01
phase: 01-test-infrastructure-navigation
status: complete
commits:
  - eb68bae feat(01-01): add shared test data constants
  - 5d870d1 feat(01-01): add reusable assertion helpers and update e2e entry
---

## Summary

Created two new Cypress support files to centralize test data and assertion helpers for the entire test suite.

## Tasks Completed

### Task 1: Create shared test data constants
- Created `cypress/support/test-data.ts` with:
  - `SECTIONS` — ordered array of all 16 section slugs (as const)
  - `SECTION_TITLES` — Record mapping section slugs to display titles, matching `sectionTitles` in `QuestionnaireForm.tsx`
  - `SELECTORS` — object with commonly used CSS selectors including `[data-slot="card-title"]` for shadcn CardTitle
  - `TOTAL_SECTIONS` — constant `16`
  - `SectionSlug` type derived from `SECTIONS`

### Task 2: Create reusable assertion helpers
- Created `cypress/support/assertions.ts` with 8 exported helper functions:
  - `assertSectionVisible(sectionTitle)` — checks card title contains expected text
  - `assertProgressBar(expectedPercent)` — checks `aria-valuenow` attribute
  - `assertStepIndicator(currentStep, totalSteps)` — checks "Step X of Y" text
  - `assertContinueEnabled()` / `assertContinueDisabled()` — checks Continue button state
  - `assertPreviousVisible()` / `assertPreviousNotVisible()` — checks Previous button visibility (including `invisible` class)
  - `assertFormExists()` — shorthand form existence check
- Updated `cypress/support/e2e.ts` to import `./test-data` and `./assertions`

## Verification

- Files exist with all required exports
- `e2e.ts` imports both new modules
- Existing test files (`app.cy.ts`, `round3-feedback.cy.ts`) not modified
