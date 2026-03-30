# Client Algorithm Review Mode

## Summary

The `/review` route now behaves like an algorithm viewer first and a patient-report preview second.

The client can open a named scenario, see the expected-vs-actual verification immediately, inspect diagnosis pathway cards with live thresholds and observed values, and then scroll down to the patient-facing report copy that was generated from the same fixed inputs.

## What The Review Mode Now Includes

- A shareable review route at `/review`
- Stable deep links for individual scenarios using `?scenario=...`
- Automatic normalization of missing or invalid scenario params back to a shareable URL
- A grouped scenario index so reviewers can move quickly between related paths
- Dedicated named scenarios for RLS and pain-related sleep disturbance in addition to the existing insomnia, OSA, COMISA, EDS, insufficient-sleep, narcolepsy, nightmare, mild-respiratory, and chronic-fatigue examples
- A first-class "Algorithm Viewer" panel that surfaces:
  - scenario summary
  - expected vs actual verification
  - computed metrics
  - diagnosis pathway cards
  - written-reference crosswalk content
- The patient-facing report preserved below the viewer as a preview

## Review Flow

Review mode is intended to make client sign-off fast and repeatable.

Instead of filling out the questionnaire manually, a reviewer can:

1. open `/review`
2. choose a named scenario
3. inspect the algorithm viewer at the top of the page
4. confirm that expected outcomes match the live report output
5. review the diagnosis cards that show rules, thresholds, observed values, and outcomes
6. cross-check the live path against the written reference
7. optionally inspect the patient-facing report preview below

## How To Use It

Open the review page:

```text
/review
```

Open a specific scenario directly:

```text
/review?scenario=healthy-sleeper
/review?scenario=maintenance-insomnia
/review?scenario=comisa
/review?scenario=restless-legs-classic
/review?scenario=pain-related-sleep-disturbance
```

On the page, the reviewer can:

- choose a scenario from the selector
- use the grouped scenario index cards to jump between related cases
- inspect mismatches first in the expected-vs-actual grid
- review computed metrics feeding the algorithm
- inspect diagnosis pathway cards for insomnia, OSA, COMISA, EDS, insufficient sleep, RLS, nightmares, narcolepsy, chronic fatigue, pain-related sleep disturbance, and leg cramps
- use the written-reference crosswalk that mirrors `docs/ALGORITHM_REFERENCE.md`
- scroll down to the patient-facing report preview when needed

## What The Algorithm Viewer Shows

The top-of-page viewer is now the main review artifact.

For the selected scenario it shows:

- scenario label, description, and expected-path highlights
- a verification summary with match count and mismatch count
- expected vs actual values for:
  - insomnia presence and severity
  - probable OSA
  - COMISA
  - RLS
  - nightmare disorder
  - narcolepsy screen
  - EDS
  - EDS from naps
  - insufficient sleep
  - chronic fatigue symptoms
  - pain-related sleep disturbance
  - mild respiratory disturbance
- computed metrics used by the scoring path
- diagnosis cards with:
  - plain-English rule summary
  - observed inputs
  - threshold values
  - met / not met criteria
  - final live outcome
- written-reference summaries and open clarification notes pulled from the same sections documented in `docs/ALGORITHM_REFERENCE.md`

## Important Guardrails

This review mode is intentionally fixed and controlled.

- It uses named scenarios rather than freeform threshold editing.
- It does not introduce an in-browser threshold editor.
- It is meant for review and sign-off, not live algorithm tuning.
- It does not save questionnaire responses when used in review mode.
- It keeps server-driven report generation as the source of truth instead of re-implementing scoring logic in the browser.

This follows the agreed sequencing:

1. shareable review mode
2. expected-vs-actual verification
3. live algorithm viewer aligned to the written reference
4. sign-off on remaining ambiguities
5. only then consider editable thresholds or configurable tuning

## Implementation Notes

The implementation still reuses the existing questionnaire and report-generation flow, but the review surface is now biased toward "show the algorithm" rather than "show the report first."

Main changes:

- `ReviewPageClient` now normalizes review URLs so the selected scenario is always shareable
- `QuestionnaireForm` now groups scenarios into review-friendly buckets and presents the viewer as the primary artifact
- `ReportSection` now renders a dedicated review-mode panel ahead of the patient-facing report preview
- `ReviewModePanel` turns the live breakdown into diagnosis cards and a written-reference crosswalk
- `review-mode.ts` centralizes scenario grouping, review highlights, pathway ordering, and written-reference metadata
- `diagnosis-scenarios.ts` now includes dedicated RLS and pain-related examples and more client-friendly labels

## Files Added Or Updated

Main additions:

- `src/components/questionnaire/review/ReviewModePanel.tsx`
- `src/lib/review-mode.ts`
- `src/lib/__tests__/review-mode.test.ts`

Main updates:

- `docs/CLIENT_ALGORITHM_REVIEW_MODE.md`
- `src/app/review/ReviewPageClient.tsx`
- `src/components/questionnaire/QuestionnaireForm.tsx`
- `src/components/questionnaire/sections/ReportSection.tsx`
- `src/lib/__tests__/scenario-review.test.ts`
- `src/lib/diagnosis-scenarios.ts`

## Validation Performed

I validated the implementation with:

- IDE lint diagnostics on the edited files
- `pnpm type-check`
- focused Jest coverage for scenario alignment and review-mode helpers
- a runtime smoke check of `/review?scenario=comisa`

## Result

The app now gives the client a clearer review surface for sign-off:

- pick a scenario
- inspect the algorithm viewer
- confirm expected vs actual
- compare the live pathway with the written reference
- optionally review the patient-facing report preview

That should make stakeholder review much faster than inferring the algorithm from the questionnaire or scanning the full report copy first.
