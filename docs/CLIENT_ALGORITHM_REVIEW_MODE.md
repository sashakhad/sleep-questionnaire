# Client Algorithm Review Mode

## Summary

I implemented a shareable review mode that lets the client inspect named algorithm scenarios without completing the full questionnaire manually.

The goal was to turn the existing developer-only scenario review tools into something that can be opened directly, shared by URL, and used to verify whether the algorithm is taking the expected path for each scenario.

## What Was Added

- A new shareable review route at `/review`
- Deep links for individual scenarios using `?scenario=...`
- A scenario index so reviewers can quickly jump to a specific algorithm path
- Automatic loading of the selected scenario and direct navigation to the generated report
- A scenario verification panel that compares expected vs actual report outcomes
- Access to the algorithm scoring breakdown outside local dev mode

## What The Review Mode Does

Review mode is designed to make algorithm review fast and repeatable.

Instead of filling out the questionnaire by hand, a reviewer can:

1. open `/review`
2. pick a named scenario
3. jump straight to the generated report
4. inspect the expected vs actual outcomes
5. expand the detailed scoring breakdown to see why a result was triggered

This makes it much easier to review branches like insomnia, OSA, COMISA, insufficient sleep, narcolepsy screening, nightmares, and related flags.

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
/review?scenario=narcolepsy-screen
```

On the page, the reviewer can:

- choose a scenario from the selector
- use the scenario index cards to jump between cases
- read the generated report
- review the "Scenario Verification" section
- expand "Algorithm Review Details" to inspect metrics, thresholds, and met/not-met criteria

## What The Verification Panel Shows

For each named scenario, the review UI now compares:

- the expected outcome from the scenario definition
- the actual outcome produced by the live report generation

This gives a fast visual check for whether the algorithm is behaving as intended for that path.

Examples of checks include:

- insomnia present or absent
- insomnia severity
- probable OSA
- COMISA
- RLS
- nightmare disorder
- narcolepsy screen
- EDS
- insufficient sleep
- chronic fatigue symptoms
- pain-related sleep disturbance
- mild respiratory disturbance

## Important Guardrails

This review mode is intentionally fixed and controlled.

- It uses named scenarios rather than freeform threshold editing.
- It does not introduce an in-browser threshold editor.
- It is meant for review and sign-off, not live algorithm tuning.
- It does not save questionnaire responses when used in review mode.

This follows the agreed sequencing:

1. shareable review mode
2. expected-vs-actual verification
3. sign-off on remaining ambiguities
4. only then consider editable thresholds or configurable tuning

## Implementation Notes

The implementation reuses the existing questionnaire and report surfaces rather than building a parallel review tool.

Main changes:

- Added a dedicated review route using the App Router
- Extended `QuestionnaireForm` to support a review mode with scenario selection, deep links, auto-loading, and no response persistence
- Extended `ReportSection` to show a scenario verification summary and expose the algorithm breakdown in review mode
- Added helper logic to compare scenario expectations against actual report output
- Extracted shared report types and shared constants so client code no longer imports `server-only` algorithm code

## Files Added Or Updated

Main additions:

- `docs/CLIENT_ALGORITHM_REVIEW_MODE.md`
- `src/app/review/page.tsx`
- `src/app/review/ReviewPageClient.tsx`
- `src/lib/scenario-review.ts`
- `src/lib/diagnosis-report-types.ts`
- `src/lib/diagnosis-shared.ts`

Main updates:

- `src/components/questionnaire/QuestionnaireForm.tsx`
- `src/components/questionnaire/sections/ReportSection.tsx`
- `src/components/questionnaire/sections/DaytimeSection.tsx`
- `src/lib/diagnosis-algorithms.ts`

## Validation Performed

I validated the implementation with:

- ESLint on the edited files
- TypeScript type checking
- focused Jest tests for scenario review helpers and diagnosis algorithms
- a runtime smoke check of the new review route

## Result

The app now has a shareable client review surface that is much closer to how the algorithm should be discussed with stakeholders:

- pick a scenario
- inspect the report
- confirm expected vs actual
- review the exact scoring path

This should make client review substantially faster and reduce the need to manually re-enter questionnaire data for every algorithm branch.
