---
plan: 04-01
status: complete
commits:
  - fix(commands): use aria-checked/data-state for uncheckCheckbox on shadcn buttons
  - test(04-01): add shift work and preference conditional visibility tests
---

## Summary

Created `cypress/e2e/conditional-chronotype.cy.ts` with 16 tests covering all chronotype conditional branches.

**Shift work conditionals (5 tests):** Verified shift type/days fields hide when `shiftWork=false`, `pastShiftWorkYears` shows when not shift working, shift details appear on check, `pastShiftWorkYears` disappears on check, and full toggle round-trip works correctly.

**Preference conditionals (4 tests):** Verified `preferenceStrength` field shows for late/early preferences, hides for flexible, label changes to "morning preference" for early, and hides again when switching back to flexible.

**Warning alerts (7 tests):** Verified Night Owl alert shows for late, Morning Person alert shows for early (and Night Owl hides), both hide for flexible, Shift Work Impact warning appears on shift work check, and also triggers when `pastShiftWorkYears > 0`.

**Bug fixed:** `uncheckCheckbox` in `commands.ts` used `prop('checked')` which is always falsy on shadcn `button[role="checkbox"]` elements. Fixed to use `aria-checked`/`data-state` attributes.

## Test Results

- 16/16 passing
