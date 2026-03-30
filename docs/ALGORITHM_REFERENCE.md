# Sleep Algorithm Reference

This document reconstructs the sleep questionnaire algorithm from the correspondence trail in `docs/correspondence/`.

It is intended to answer three questions:

1. What was originally specified in the SOW?
2. What changed in later correspondence?
3. What is the current rule the app should implement?

## How To Read This

- When documents disagree, the latest explicit instruction wins.
- The SOW documents provide the foundation.
- Later review rounds refine or override specific thresholds and criteria.
- The report should describe "symptoms of" a disorder or concern, not a formal diagnosis.

## Source Trail

### Round 0: Initial SOW

Primary sources:

- `docs/correspondence/SOW/emailInstructions.md`
- `docs/correspondence/SOW/questionnaire-comments.txt`
- `docs/correspondence/SOW/REQUIREMENTS.md`

What they established:

- The questionnaire should screen for sleep health optimization issues and likely sleep disorders.
- The targeted disorder set includes insomnia, circadian rhythm disorder, insufficient sleep syndrome, obstructive sleep apnea, COMISA, restless legs syndrome, and narcolepsy / hypersomnia.
- The original IF-formula logic was defined here for:
  - EDS weighted dozing score
  - insomnia thresholds
  - sleep apnea triggers
  - RLS symptom triad
  - nightmare frequency
  - circadian calculations
  - sleep efficiency and weekly sleep calculations

### Round 1: First Review Pass

Primary sources:

- `docs/correspondence/round-1-edits/feedback-rounds-12-28.md`
- `docs/correspondence/round-1-edits/clarification-questions-jan-11.md`

What changed:

- Added tiredness and fatigue ratings, which later became part of the insomnia and chronic fatigue criteria.
- Added mid-sleep time to the sleep metrics discussion.
- Raised clarification questions about:
  - BMI calculation for apnea risk
  - separating bad dreams from nightmares
  - adding leg cramp frequency

This round mostly refined inputs and wording rather than changing thresholds.

### Round 2: Major Algorithm Revision

Primary sources:

- `docs/correspondence/round-2-edits/feedback-1.0.2026.md`
- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

What changed:

- Chris said the "diagnostic specifics look pretty good" but then provided the most important algorithm update.
- The insomnia logic was rewritten into a two-tier system: mild vs moderate-to-severe.
- The sleep apnea logic was rewritten around snoring plus risk factors.
- Chronic fatigue and pain-related sleep disturbance criteria were defined explicitly.
- Chris called out a specific failure case:
  - "I put that I am in bed 7.5 hrs/night but with nocturnal awakenings. It said I have insufficient sleep syndrome instead of identifying maintenance insomnia."

This round is the main authority for the current insomnia, apnea, chronic fatigue, pain-related, COMISA, and insufficient sleep logic.

### Round 3: Latest Revisions

Primary source:

- `docs/correspondence/round-3-edits/additional-comments-2.28.md`

What changed:

- Nightmare disorder threshold changed from 3 per week to 2 per week.
- Redundant diagnosis questions were removed from the questionnaire.
- Several report text changes were requested, but those do not alter the scoring logic except for the nightmare threshold.

## Authority Rules

Use these precedence rules when implementing or reviewing the algorithm:

1. `additional-comments-2.28.md` overrides earlier nightmare frequency guidance.
2. `dl-and-cl-comments-1.11.md` overrides earlier insomnia, apnea, chronic fatigue, pain-related, and insufficient sleep logic when they conflict.
3. `questionnaire-comments.txt` remains the base source for calculations and any rule not explicitly replaced later.
4. `REQUIREMENTS.md` and `QUESTIONNAIRE_SPEC.md` are supporting summaries, not stronger than later direct correspondence.
5. If the SOW-era artifacts disagree internally, prefer the more direct source text in `questionnaire-comments.txt` unless later correspondence explicitly resolves the point. `QUESTIONNAIRE_SPEC.md` is still useful, but it appears to preserve some intermediate interpretations rather than a final override.

## Current Algorithm

### Core Sleep Calculations

| Metric | Current rule | Source |
| --- | --- | --- |
| Time in bed (TIB) | `wake time - lights out`, adjusted across midnight | `questionnaire-comments.txt` |
| Total sleep time (TST) | `TIB - SOL - WASO` | `questionnaire-comments.txt` |
| Sleep efficiency | `TST / TIB * 100` | `questionnaire-comments.txt`, `REQUIREMENTS.md` |
| Weekly average TST | `(scheduled TST * 5 + unscheduled TST * 2) / 7` | `questionnaire-comments.txt`, `feedback-1.0.2026.md` |
| Mid-sleep time | `(TST / 2) + lights out`, accounting for sleep onset latency in the display metrics | `questionnaire-comments.txt`, `feedback-rounds-12-28.md` |
| Social jet lag | weekend/free-day sleep extension or timing shift relative to workdays | `REQUIREMENTS.md`, `feedback-1.0.2026.md` |
| Mid-sleep time change | free-day mid-sleep minus workday mid-sleep | `feedback-1.0.2026.md` |

### Excessive Daytime Sleepiness (EDS)

Inputs:

- Planned naps
- Difficulty staying awake during the day
- Falling asleep in daytime situations
- Weekly average sleep duration

Supported EDS pathways:

1. Planned naps `>= 3 days/week` and `>= 30 minutes`
   - This is explicit in the SOW `questionnaire-comments.txt`.
   - No later correspondence clearly removes this pathway, so it should be treated as a retained daytime-sleepiness signal unless the client confirms otherwise.

2. Difficulty staying awake during the day and a falling-asleep score in the `2-7` range
   - If weekly average sleep is `> 7 hours`, classify as EDS symptoms.
   - If weekly average sleep is `< 7 hours`, route to insufficient sleep instead.

Weighted dozing situations in the source trail:

| Situation | Weight / note |
| --- | --- |
| Stopped at a stop light | `+1` in `questionnaire-comments.txt`; `x2` in `QUESTIONNAIRE_SPEC.md` |
| During lectures or work meetings | 1 |
| While working or studying | 1 |
| During a conversation | 2 |
| Quiet activity during the evening | 1 |
| While eating a meal | 2 |

Historical note:

- The initial SOW described 3-4 as mild, 5-6 as moderate, and 7+ as probable EDS.
- The later round 2 correspondence reframed the gating rule around a 2-7 score plus sleep duration.
- The SOW materials are internally inconsistent on the stop-light weight. `questionnaire-comments.txt` says `+1`, while `QUESTIONNAIRE_SPEC.md` says `x2`. No later correspondence explicitly resolves that conflict.
- The phrase "difficulty staying awake during the day" is explicit in round 2, but the correspondence does not define a single questionnaire field that maps to it. Any implementation of that gate is therefore an interpretation of the intended signal rather than a verbatim rule.
- Round 2 uses `> 7 hours` for EDS and `< 7 hours` for insufficient sleep. It does not explicitly say how to treat exactly `7.0` hours.

Primary source:

- `docs/correspondence/SOW/questionnaire-comments.txt`
- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Insufficient Sleep Syndrome

Current rule:

- Daytime sleepiness / EDS symptoms are present
- Weekly average sleep is `< 7 hours`
- Narcolepsy is not present
- Sleep apnea is not present

Important caveat:

- Chris's example about `7.5 hrs/night` with nocturnal awakenings indicates that at least some nighttime-disruption cases should resolve to maintenance insomnia rather than insufficient sleep. The correspondence does not turn that example into a universal precedence formula, so similar edge cases should still be framed carefully.

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Insomnia

Current rule:

#### Mild

- One or more nighttime criteria:
  - SOL 30-45 minutes
  - WASO 40-60 minutes
  - poor sleep quality
- And at least one daytime criterion:
  - sleepiness interferes with daily activities
  - sleep does not feel restorative
  - tiredness rating 5-7
  - fatigue rating 3-5

#### Moderate-to-severe

- One or more nighttime criteria:
  - SOL greater than 45 minutes
  - WASO greater than 60 minutes
  - poor sleep quality
- And at least two daytime criteria:
  - sleepiness interferes with daily activities
  - sleep does not feel restorative
  - tiredness rating 7+
  - fatigue rating 5+

Implementation note:

- Chris's January comments replaced the earlier simpler insomnia thresholds with this two-tier system.
- Chris explicitly gave an example where 7.5 hours in bed plus nocturnal awakenings should be treated as maintenance insomnia rather than insufficient sleep.
- That example is strong evidence for the intended outcome in similar cases, but the correspondence does not spell out a universal precedence rule beyond the example itself.

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Sleep-Disordered Breathing / Obstructive Sleep Apnea

Current rule:

#### Mild respiratory disturbance

- Snoring alone, or
- Mouth breathing alone, or
- Snoring and mouth breathing together,
- When the probable apnea criteria below are not met

#### Probable sleep apnea

- Pauses / gaps in breathing / struggling to breathe, or
- Snoring plus risk factors

Risk factors:

- Age greater than 60
- BMI greater than 25
- Tiredness, sleepiness, or fatigue greater than 3
- Non-restorative sleep

Severity:

- Snoring plus 1 risk factor: mild
- Snoring plus 3 or more risk factors: moderate-to-severe
- Breathing pauses: moderate-to-severe

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### COMISA

Current rule:

- Insomnia criteria met
- Sleep apnea or sleep-disordered breathing criteria met

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Restless Legs Syndrome (RLS)

Current rule:

- Trouble lying still when trying to sleep
- Urge to move the legs
- Movement relieves the discomfort

Interpretation note:

- Later correspondence broadened the wording of the symptom questions and suggested that even one affirmative answer could trigger an informational pop-up, but it does not clearly replace the classic triad as the core disorder screen.

Primary source:

- `docs/correspondence/SOW/questionnaire-comments.txt`
- `docs/correspondence/round-2-edits/feedback-1.0.2026.md`

### Narcolepsy / Hypersomnia Screen

Current supported screen signals:

- Previously diagnosed narcolepsy or hypersomnia
- Cataplexy-type weakness / loss of muscle control with emotion
- Sleep paralysis as a supportive signal
- A dozing score `> 6` can trigger a narcolepsy / hypersomnia warning or pop-up in later review comments

Interpretation note:

- Earlier SOW materials also referenced dreams while falling asleep or during naps, but those questions were later cut from the questionnaire.
- The correspondence does not provide a single final, fully reconciled narcolepsy / hypersomnia decision tree that is as explicit as the round 2 insomnia or apnea logic.

Primary sources:

- `docs/correspondence/SOW/questionnaire-comments.txt`
- `docs/correspondence/round-2-edits/feedback-1.0.2026.md`

### Nightmares / Bad Dreams

Current rule:

- Nightmare disorder if nightmares occur 2 or more nights per week
- A separate bad-dream warning at 3 or more nights per week appears in round 2, but it should be treated as a carried-forward interpretation unless the client confirms it remained active after round 3

Source trail:

- Original SOW materials used 3 per week as the practical threshold
- Round 3 explicitly changed the report threshold to 2 per week
- Round 2 introduced a separate bad-dreams pathway, but round 3 simplified the questionnaire back to nightmares-per-week only. The bad-dreams branch should therefore be treated as a carried-forward interpretation unless the client confirms it should remain active.

Current authority:

- Nightmare threshold: `docs/correspondence/round-3-edits/additional-comments-2.28.md`
- Bad-dream warning: `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Nocturnal Leg Cramps

Current rule:

- If leg cramps occur on 2 or more nights per week, recommend discussing them with a primary care provider

Primary sources:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`
- `docs/correspondence/round-1-edits/clarification-questions-jan-11.md`

Implementation note:

- The threshold itself is clear. The clarification question simply shows that the questionnaire needed a weekly-frequency input in order to apply the rule reliably.

### Chronic Fatigue / Fibromyalgia / Post-Viral Symptoms

Current rule:

- Insomnia symptoms, or
- 3 or more of the following:
  - sleepiness interferes with daily activities
  - sleep does not feel restorative
  - tiredness rating 7+
  - fatigue rating greater than 7
  - aches and pains and/or joint pain

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Pain-Related Sleep Disturbance

Current rule:

- The round 2 source text says "at least two of the following" and includes pain as one of the listed items:
  - aches and pains and/or joint pain
  - sleepiness interferes with daily activities
  - sleep does not feel restorative
  - tiredness rating 7+
  - fatigue rating 5+

Best-supported reading:

- Requiring pain to be present plus at least one additional listed symptom is a reasonable reading of the section title.
- However, the correspondence itself only says "at least two of the following" and does not separately state that pain is mandatory, so this should still be confirmed with the client.

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

## Report Language Constraint

The report should not present a formal diagnosis.

Instead, the report should use language like:

- "you have symptoms of insomnia"
- "you have symptoms of obstructive sleep apnea"
- "these symptoms could be in the mild or moderate range"
- "follow up with your medical provider or sleep specialist for diagnosis and treatment"

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

## Clarifications To Confirm With Client

These items are now explicitly noted so we do not present them as more settled than the correspondence supports:

- EDS dozing weights: `questionnaire-comments.txt` says "At traffic lights +1" while `QUESTIONNAIRE_SPEC.md` uses `x2`. Later correspondence does not explicitly resolve the conflict.
- EDS presence gate: round 2 requires "difficulty staying awake during the day" plus a dozing score in the `2-7` range, but the correspondence does not define a single field that maps to "difficulty staying awake."
- EDS sleep-duration boundary: round 2 uses `> 7 hours` for EDS and `< 7 hours` for insufficient sleep, but does not explicitly say how to treat exactly `7.0` hours.
- Planned naps: the SOW says `>= 3 days/week` and `>= 30 mins`, but later correspondence does not clearly say whether that pathway remains active alongside the round 2 EDS rule or was meant to be replaced by it.
- Maintenance insomnia versus insufficient sleep: Chris gave a specific example where 7.5 hours in bed with nocturnal awakenings should resolve to maintenance insomnia, but the correspondence does not explicitly generalize that into a universal precedence rule.
- Nightmare disorder versus bad dreams: round 2 separated bad dreams from nightmares, while round 3 simplified the questionnaire to nightmares per week and explicitly changed the nightmare threshold to `2+` per week.
- Narcolepsy / hypersomnia screen: the correspondence supports several screening signals, but it does not provide a fully reconciled final decision tree after the later questionnaire cuts.
- Pain-related sleep disturbance: the source says "at least two of the following" and includes pain as one item; the current implementation interprets that as pain being required.
- Chronic fatigue fatigue threshold: the correspondence says "Fatigue rating >7," which could mean strictly greater than 7 rather than `7+`; this should be preserved as written unless the client wants it broadened.
- Circadian display thresholds: earlier SOW materials vary on exact social jet lag and mid-sleep cutoffs, so those display-oriented thresholds should be treated as lower-confidence than the round 2 disorder rules.

## What This Document Is For

This document is the reference point for:

- reconciling code to the correspondence trail
- reviewing future algorithm changes with the client
- flagging items that still require explicit client sign-off
- validating scenario-based tests
- building a scoring breakdown that shows exactly why a report flag was triggered
