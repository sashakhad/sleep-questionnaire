---
plan: 04-02
status: complete
commits:
  - test(04-02): add work/school time and lifestyle conditional visibility tests
---

## Summary

Created `cypress/e2e/conditional-lifestyle.cy.ts` with 12 tests covering work/school time and lifestyle section conditionals.

**Work/school time (4 tests):** Verified field shows with default late preference, hides when flexible is selected, reappears when flexible + shift work checked, and stays visible when switching from late to early.

**Caffeine conditionals (4 tests):** Verified `lastCaffeineTime` shows with `caffeinePerDay=2`, hides at 0, reappears at 1, and High Caffeine warning triggers at >4 servings.

**Exercise conditionals (4 tests):** Verified duration/end-time fields show with `exerciseDaysPerWeek=3`, hide at 0 with No Regular Exercise warning, Great Exercise Habits alert at ≥5, and fields restore when going from 0 back to 2.

## Test Results

- 12/12 passing
