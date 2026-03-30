# Sleep Algorithm Correspondence Memo

Thank you for the detailed comments and review notes throughout the questionnaire revisions. We re-reviewed the correspondence trail from the SOW through the later feedback rounds so that the current algorithm reference reflects the written guidance as closely as possible.

This memo is intended to do two things:

1. Summarize the parts of the algorithm that now appear well supported by the correspondence.
2. Clearly separate those settled points from the smaller set of items that still seem to need confirmation.

## What Appears Settled

- The strongest current authority for insomnia, insufficient sleep, sleep-disordered breathing / sleep apnea, COMISA, chronic fatigue, and pain-related sleep disturbance is `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`.
- The strongest current authority for nightmare frequency is `docs/correspondence/round-3-edits/additional-comments-2.28.md`, which changes the nightmare-disorder threshold to `2+` times per week.
- The report language should describe "symptoms of" a disorder or concern, rather than present a formal diagnosis.
- The current insomnia screen is best understood as a two-tier model:
  - Mild: `SOL 30-45` or `WASO 40-60` or poor sleep quality, plus at least one daytime indicator.
  - Moderate-to-severe: `SOL >45` or `WASO >60` or poor sleep quality, plus at least two daytime indicators.
- The current sleep apnea screen is best understood as:
  - Pauses / gaps in breathing / struggling to breathe, or
  - Snoring plus risk factors such as age over 60, BMI over 25, tiredness / sleepiness / fatigue over 3, or non-restorative sleep.
- The current insufficient-sleep logic is best understood as daytime sleepiness symptoms with full-week average sleep below `7 hours`, provided narcolepsy and sleep apnea are not present.
- The nightmare-disorder threshold should now be treated as `2+` times per week, not `3+` times per week.
- The chronic-fatigue / fibromyalgia / post-viral screen is best understood as insomnia symptoms and/or `3+` of the listed daytime fatigue indicators.

## Where Earlier Logic Needed Correction

In reviewing the correspondence trail, a few earlier report or implementation paths appear not to have fully reflected the later written guidance. The main examples were:

- Using a nightmare threshold of `3/week` instead of the later `2+/week`.
- Using simplified sleep-apnea report logic rather than the later pauses-or-snoring-plus-risk-factors rule.
- Using older insomnia report heuristics rather than the later two-tier insomnia criteria.
- Using a `60 minute` planned-nap threshold instead of the original SOW threshold of `30 minutes`.
- Using an overly narrow chronic-fatigue rule instead of the later insomnia-or-`3+ symptoms` screen.

## Points Where We Would Appreciate Confirmation

There are a few items where the correspondence is not fully decisive, and we want to be careful not to overstate them:

- `EDS stop-light weight`: `questionnaire-comments.txt` says `+1`, while `QUESTIONNAIRE_SPEC.md` says `x2`.
- `Difficulty staying awake during the day`: the later correspondence uses this phrase, but does not define exactly which questionnaire field should represent it.
- `EDS sleep-duration boundary`: round 2 says `>7 hours` for EDS and `<7 hours` for insufficient sleep, but does not explicitly say how to treat exactly `7.0` hours.
- `Planned naps`: the SOW clearly uses `>=3 days/week` and `>=30 minutes`, but the later correspondence does not explicitly say whether that pathway remains active alongside the round 2 EDS rule or was intended to be replaced.
- `Maintenance insomnia versus insufficient sleep`: Chris's `7.5 hrs/night` example clearly indicates that nocturnal awakenings should not be misread as insufficient sleep in that scenario, but the correspondence does not spell out a universal precedence rule for all similar cases.
- `Bad dreams versus nightmares`: round 2 introduced a separate bad-dreams pathway, while round 3 simplified the questionnaire back to nightmares per week. We would appreciate confirmation on whether the separate bad-dreams pathway should remain active.
- `Pain-related sleep disturbance`: the source says "at least two of the following" and includes pain as one listed item, but does not explicitly say that pain must always be present.
- `Narcolepsy / hypersomnia screen`: the correspondence supports several screening signals, but it does not provide a single final decision tree that is as explicit as the insomnia or sleep-apnea rules.
- `Chronic fatigue fatigue threshold`: the wording is `Fatigue rating >7`, which may be intended as strictly greater than 7 rather than `7+`.

## Current Documentation

The updated working reference is now in:

- `docs/ALGORITHM_REFERENCE.md`

That document is intended to be the implementation-facing reconciliation artifact. It now:

- follows the correspondence trail more closely
- preserves important caveats where the source material is still ambiguous
- separates stronger authority from lower-confidence interpretations

## Correspondence Reviewed

- `docs/correspondence/SOW/questionnaire-comments.txt`
- `docs/correspondence/SOW/REQUIREMENTS.md`
- `docs/correspondence/SOW/QUESTIONNAIRE_SPEC.md`
- `docs/correspondence/round-1-edits/feedback-rounds-12-28.md`
- `docs/correspondence/round-1-edits/clarification-questions-jan-11.md`
- `docs/correspondence/round-2-edits/feedback-1.0.2026.md`
- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`
- `docs/correspondence/round-3-edits/additional-comments-2.28.md`

If it would be helpful, the next step can be to turn the open items above into a short client-confirmation checklist so the remaining ambiguities can be resolved directly.
