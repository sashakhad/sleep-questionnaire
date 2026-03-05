---
plan: 04-04
status: complete
commits:
  - test(04-04): add daytime severity chain and restless legs conditional tests
---

## Summary

Created `cypress/e2e/conditional-daytime-restless.cy.ts` with 22 tests covering daytime and restless legs conditionals.

**Planned nap conditionals (2 tests):** Nap duration select shows with `daysPerWeek=2`, disappears when set to 0.

**Sleepiness severity chain (6 tests):** Severity slider shows with `sleepinessInterferes=true`, `tiredButCantSleep` radio visible at severity=5 (≤6), Important Safety Warning absent at severity=5 (≤8), both slider and tired radio hide when sleepiness unchecked, narcolepsy questions show when `fallAsleepDuring` has items AND `sleepinessInterferes=true`, hide when sleepiness unchecked.

**Pain severity conditional (3 tests):** Pain slider hidden with `painAffectsSleep=false`, appears on check, disappears on uncheck.

**Chronic Fatigue warning (2 tests):** Warning absent when `jointMusclePain=false` (even with other conditions met), appears when `jointMusclePain` is checked (all 3 conditions: nonRestorativeSleep + jointMusclePain + sleepinessInterferes).

**Restless legs conditionals (9 tests):** `legCrampsPerWeek` field toggle on `legCramps`, Frequent Nocturnal Leg Cramps warning at ≥2 (not at 1), field hides on uncheck, RLS warning appears for each of the 3 core symptoms (troubleLyingStill, urgeToMoveLegs, movementRelieves), disappears when sole checked symptom unchecked.

## Test Results

- 22/22 passing
