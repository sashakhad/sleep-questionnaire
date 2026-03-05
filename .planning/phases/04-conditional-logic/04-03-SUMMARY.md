---
plan: 04-03
status: complete
commits:
  - test(04-03): add nightmare and parasomnia conditional follow-up tests
---

## Summary

Created `cypress/e2e/conditional-nightmares-parasomnia.cy.ts` with 22 tests covering nightmare and parasomnia conditional logic.

**Nightmare conditionals (14 tests):** Dream recall info shows/hides on `remembersDreams`, `badDreamsPerWeek` field toggles with `hasBadDreams`, Frequent Bad Dreams warning at ≥3 (not at 2), nightmare follow-up fields toggle with `hasNightmares`, Possible Nightmare Disorder at ≥2 per week with less-frequent info disappearing, all fields hide when nightmares unchecked, Trauma-Related Nightmares alert on `associatedWithTrauma`.

**Parasomnia conditionals (8 tests):** Follow-up checkboxes (remembersEvents, actsOutDreams, hasInjuredOrLeftHome) hidden with empty `nightBehaviors`, Safety Measures warning hidden, both appear when Walk is checked, hide again when unchecked, RBD alert requires BOTH `remembersEvents` AND `actsOutDreams` (not just one).

**Note:** Night behavior checkboxes are raw Radix Checkbox components (not CheckboxField), but `cy.checkCheckbox` / `cy.uncheckCheckbox` still work since FormLabel has `for` attribute pointing to the button's id.

## Test Results

- 22/22 passing
