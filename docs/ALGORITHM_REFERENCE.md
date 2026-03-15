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

- Difficulty staying awake during the day
- Falling asleep in daytime situations
- Weekly average sleep duration

Weighted dozing situations:

| Situation | Weight |
| --- | --- |
| Stopped at a stop light | 2 |
| During lectures or work meetings | 1 |
| While working or studying | 1 |
| During a conversation | 2 |
| Quiet activity during the evening | 1 |
| While eating a meal | 2 |

Current rule:

- Presence threshold: difficulty staying awake during the day and a dozing score in the 2-7 range.
- If weekly average sleep is `>= 7 hours`, classify as EDS symptoms.
- If weekly average sleep is `< 7 hours`, route to insufficient sleep instead.

Historical note:

- The initial SOW described 3-4 as mild, 5-6 as moderate, and 7+ as probable EDS.
- The later round 2 correspondence reframed the gating rule around a 2-7 score plus sleep duration.

Primary source:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Insufficient Sleep Syndrome

Current rule:

- Daytime sleepiness / EDS symptoms are present
- Weekly average sleep is `< 7 hours`
- Narcolepsy is not present
- Sleep apnea is not present

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
- Chris explicitly called out that maintenance insomnia must not be misclassified as insufficient sleep when time in bed is adequate.

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

Primary source:

- `docs/correspondence/SOW/questionnaire-comments.txt`

### Narcolepsy / Hypersomnia Screen

Current rule:

- Previously diagnosed narcolepsy or hypersomnia, or
- Weakness / loss of muscle control with emotion plus sleep paralysis

Primary sources:

- `docs/correspondence/SOW/questionnaire-comments.txt`
- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`

### Nightmare Disorder

Current rule:

- Nightmare disorder if nightmares occur 2 or more nights per week
- Bad dream warning if bad dreams occur 3 or more nights per week

Source trail:

- Original SOW materials used 3 per week as the practical threshold
- Round 3 explicitly changed the report threshold to 2 per week

Current authority:

- `docs/correspondence/round-3-edits/additional-comments-2.28.md`

### Nocturnal Leg Cramps

Current rule:

- If leg cramps occur on 2 or more nights per week, recommend discussing them with a primary care provider

Primary sources:

- `docs/correspondence/round-2-edits/dl-and-cl-comments-1.11.md`
- `docs/correspondence/round-1-edits/clarification-questions-jan-11.md`

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

- Pain is present
- And at least two of the following are present:
  - aches and pains and/or joint pain
  - sleepiness interferes with daily activities
  - sleep does not feel restorative
  - tiredness rating 7+
  - fatigue rating 5+

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

## What This Document Is For

This document is the reference point for:

- reconciling code to the correspondence trail
- reviewing future algorithm changes with the client
- validating scenario-based tests
- building a scoring breakdown that shows exactly why a report flag was triggered
