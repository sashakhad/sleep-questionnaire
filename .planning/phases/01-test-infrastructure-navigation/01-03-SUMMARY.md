---
plan: 01-03
phase: 01-test-infrastructure-navigation
status: complete
commits:
  - df2a110 test(01-03): add Continue/Previous button and progress bar tests
  - 864b2bd test(01-03): add dev sidebar section jumping tests
---

## Summary

Created `cypress/e2e/navigation.cy.ts` — the navigation test suite covering forward/backward navigation, progress tracking, and dev sidebar section jumping.

## Tasks Completed

### Task 1: Continue/Previous button navigation and progress bar tests

**describe('Continue and Previous buttons')**
- `should show Continue button on the first section` — verifies Continue exists and is visible on intro
- `should not show Previous button on the first section` — verifies bottom nav Previous has `invisible` class
- `should navigate to next section when Continue is clicked` — clicks Continue on intro, confirms demographics title appears
- `should navigate back when Previous is clicked` — navigates to demographics, clicks Previous header button, verifies intro appears
- `should show Generate Report button on second-to-last section` — on mental-health, confirms "Generate Report" exists and "Continue" does not
- `should not show Continue on the report section but Previous should be visible` — on report, no Continue, Previous is visible

**describe('Progress bar')**
- `should show 0% progress on intro` — verifies `aria-valuenow="0"`
- `should update progress when navigating to daytime section` — daytime is index 3, `(3/15)*100 = 20` (exact), verifies `aria-valuenow="20"`. Note: daytime used instead of demographics to avoid floating-point aria-valuenow issues (demographics = 6.666...)
- `should show 100% on report section` — verifies `aria-valuenow="100"`
- `should show correct step indicator` — daytime at index 3 shows "Step 4 of 16"

### Task 2: Dev sidebar section jumping tests

**describe('Dev sidebar navigation')**
- `should display all 16 sections in the sidebar` — counts nav buttons equals `SECTIONS.length`
- `should highlight the active section in the sidebar` — checks `bg-primary/10` class on active button
- `should navigate to a section when sidebar item is clicked` — clicks parasomnia sidebar button, checks URL and card title
- `should update the form content when jumping between sections` — starts on demographics, clicks breathing-disorders, verifies content updates

## Deviations

- Used daytime (index 3, 20%) for intermediate progress bar test instead of demographics (index 1, 6.666...) to avoid floating-point string comparison issues with `aria-valuenow`. Documented in test comment.

## Verification

- `cypress/e2e/navigation.cy.ts` exists with both describe groups
- All helpers imported from `../support/test-data` and `../support/assertions`
- TypeScript compilation passes
- Phase 1 complete: test infrastructure established
