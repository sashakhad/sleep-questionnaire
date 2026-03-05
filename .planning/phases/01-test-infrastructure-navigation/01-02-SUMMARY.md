---
plan: 01-02
phase: 01-test-infrastructure-navigation
status: complete
commits:
  - 0a9737c fix(01-02): replace fragile cy.wait(500) with element-based waiting
  - 09b3744 feat(01-02): add form interaction helper commands
---

## Summary

Enhanced `cypress/support/commands.ts` with robust waiting and new form interaction helpers.

## Tasks Completed

### Task 1: Improve navigateToSection with element-based waiting
- Removed `cy.wait(500)` from `navigateToSection`
- Replaced with `cy.get('[data-slot="card-title"]', { timeout: 10000 }).should('be.visible')`
- This confirms React hydration and section routing are complete before tests proceed
- Existing call sites (`cy.navigateToSection('demographics')` etc.) remain compatible

### Task 2: Add form interaction helper commands
- Added `cy.selectOption(label, value)` — opens shadcn Select combobox by label, clicks matching option
- Added `cy.clickRadio(value)` — clicks shadcn RadioGroup button by value attribute with force
- Added `cy.checkCheckbox(label)` — finds checkbox by label text and checks it if unchecked (handles both native and shadcn patterns)
- Added `cy.uncheckCheckbox(label)` — same but unchecks
- Updated `Chainable` interface declaration with all 4 new command signatures

## Verification

- `cy.wait(500)` no longer exists in `commands.ts`
- `navigateToSection` uses element-based assertion
- All 4 new commands present with TypeScript declarations
- TypeScript interface updated for all new commands
