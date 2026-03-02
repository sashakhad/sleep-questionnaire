---
plan: 03-02
status: complete
commit: cd5137f
---

# Summary: Demographics Section Validation Tests

## What Was Done

Created `cypress/e2e/validation-demographics.cy.ts` with 7 tests verifying that yearOfBirth, sex, and zipcode (min 5 chars) are all required before Continue is enabled, and that the birth year range cap (minimum 12 years old) is enforced.

## Tasks Completed

- **Task 1**: Created `cypress/e2e/validation-demographics.cy.ts` — 7 tests covering all required field gates and the birth year age constraint
- **Task 2**: Verified no regressions in full test suite (navigation.cy.ts failures are pre-existing)

## Test Results

- `validation-demographics.cy.ts`: 7/7 passing

## Key Decisions

- Used helper `goToDemographics()` to navigate from `/` through intro disclaimer to demographics section — more reliable than direct navigation for empty-state testing
- YearComboboxField uses a custom Popover (not shadcn Select), so selected years via `cy.contains(year).click()` after opening the popover
- Used the popover's search input (`input[placeholder="Type a year..."]`) to verify the age constraint: searching for `currentYear - 11` shows "No year found."
- Fixed `{escape}` → `{esc}` after initial test run
