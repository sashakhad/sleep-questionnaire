# Questions for Danny — Retainer Round 1

**Context**: Following the [April 16, 2026 call](correspondence/meetings/2026-04-16-sasha-danny-algorithm-dev.md),
three priorities were agreed: algorithm refinement, report language, and
backend security. This document captures the open questions that require
Danny's (or his clinical colleagues') input before we can implement them.
Items marked **actionable now** are already underway or complete.

---

## 1. Algorithm — Fibromyalgia vs Chronic Fatigue Differentiation

### Current state

The algorithm has a single combined `screenChronicFatigue` screen that flags
when **either**:

- Insomnia is present, or
- ≥ 3 of: sleepiness interferes, non-restorative sleep, tiredness ≥ 7,
  fatigue > 7, pain affects sleep OR joint/muscle pain.

Both the report UI and the PDF show a single combined "Chronic Fatigue /
Fibromyalgia" message. There is no separate fibromyalgia-only or CFS-only
flag in `FullReportResult` or `ALGORITHM_REFERENCE.md`.

### What Danny / colleagues need to answer

1. **Should the algorithm differentiate fibromyalgia from chronic fatigue
   syndrome, or keep them as one combined screen?**
2. If differentiated, **what criteria separate them?** A decision tree is
   ideal. Some possible directions:
   - Does presence of widespread **musculoskeletal pain** tip toward
     fibromyalgia (e.g., pain affects sleep AND joint/muscle pain + tender
     points language)?
   - Does **post-exertional malaise / unrefreshing sleep + fatigue without
     dominant pain** tip toward CFS?
   - Are there specific patient-reportable tender-point or pain-distribution
     questions we should add to the questionnaire?
3. **Should post-viral illness (e.g., long COVID) be its own screen,** or
   stay inside a combined fatigue category?
4. Should the distinction change **what the report says** (different
   recommendations, different referral guidance)?

### What we'd change once answered

- Split `screenChronicFatigue` into separate pathways in
  [src/lib/diagnosis-algorithms.ts](../src/lib/diagnosis-algorithms.ts).
- Add separate flags (e.g., `hasFibromyalgiaSymptoms`, `hasCFSSymptoms`) on
  `FullReportResult`.
- Add separate "Identified Sleep Issues" sections to
  [ReportSection.tsx](../src/components/questionnaire/sections/ReportSection.tsx)
  and the equivalent PDF blocks.
- Add scenarios covering each pathway to
  [src/lib/diagnosis-scenarios.ts](../src/lib/diagnosis-scenarios.ts).
- Update the decision tree view on the tuning dashboard so Danny can see and
  tweak each branch.

---

## 2. Algorithm — Insomnia vs Circadian Rhythm Disorder Differentiation

### Current state

- **Insomnia** is scored from scheduled sleep metrics: SOL, WASO, sleep
  efficiency, and daytime symptom counts.
- **Delayed Sleep Phase Disorder (DSPD)** is detected only as a **chronotype
  informational block** (when `chronotypeType === 'delayed'`). It is not a
  scored disorder, has no precedence logic, and can co-fire with insomnia.
- There is no formal circadian rhythm **disorder** decision tree in
  `ALGORITHM_REFERENCE.md` or the code.

### What Danny / colleagues need to answer

1. **When should a delayed sleep phase pattern override an insomnia
   diagnosis?** Example scenarios to adjudicate:
   - Patient has SOL of 60 min on scheduled nights but mid-sleep is at 5 AM
     (severe delay). Insomnia flagged currently; should it be DSPD instead?
   - Patient with large social-jet-lag (> 2h) but normal SOL on free days —
     is this DSPD or not?
2. **What thresholds signal DSPD vs insomnia?** Candidates we could use:
   - Mid-sleep time (scheduled vs free)
   - Social jet lag magnitude
   - Chronotype preference
   - Patient-reported trouble waking at scheduled times
3. **Advanced Sleep Phase Disorder** — same questions. Should we flag it
   when chronotype is markedly advanced, and how?
4. **Shift work disorder** — the questionnaire captures shift work history;
   should it feed a separate screen?
5. **Non-24-hour and irregular sleep-wake rhythm** — in scope, or out?

### What we'd change once answered

- Add precedence logic inside `diagnoseInsomnia` (or wrap it) in
  [src/lib/diagnosis-algorithms.ts](../src/lib/diagnosis-algorithms.ts) to
  downgrade / redirect insomnia when circadian criteria are met.
- Add `hasCircadianRhythmDisorder` (and sub-types if needed) to
  `FullReportResult`.
- Replace or augment the DSPD "informational" block in
  [ReportSection.tsx](../src/components/questionnaire/sections/ReportSection.tsx)
  with a proper disorder section when flagged.
- Add matching scenarios and a new decision-tree card on the tuning
  dashboard.

---

## 3. Report Language — Thin Sections

Several "Identified Sleep Issues" entries on the web report are a single
sentence + "See our website for more information." Other sections (COMISA,
chronic fatigue, pain-related, medication-related, insufficient sleep) have
multi-sentence clinical narratives. The thin sections:

- **Insomnia** (non-COMISA case)
- **OSA** (non-COMISA case)
- **RLS**
- **Nightmare disorder** (we just added a separate Bad Dreams block)
- **Delayed Sleep Phase**
- **Sleep Hygiene Issues** — title only, no concrete bullets

### What Danny needs to provide

For each section above, please write (or approve a draft of):

1. **2–4 sentence clinical narrative** describing the condition in
   patient-friendly language.
2. **Key risk or impact statement** — why does this matter for the patient?
3. **Recommended next step** — what specifically should they do (see
   primary care, specific specialist, specific website section, etc.)?

These can be drafted by Sasha first and sent for clinical review, but final
copy sign-off should come from Danny or a clinical colleague given this is a
medical product.

Location: [ReportSection.tsx](../src/components/questionnaire/sections/ReportSection.tsx)
and [ReportPDF.tsx](../src/components/questionnaire/ReportPDF.tsx).

---

## 4. Report Language — Gender Terminology

Danny mentioned on the April 16 call that his kid had feedback on gender
terminology.

### Current state

- The report uses second-person ("you" / "your") throughout, which is
  already inclusive.
- No `he/she` phrasing in the codebase.
- The questionnaire has a sex field with: Male, Female, Transgender, Other,
  Prefer not to say.

### What Danny needs to specify

1. **Is the "sex" field the problem** (e.g., should it be "gender
   identity" with different options)?
2. **Is a specific question label** using outdated terminology?
3. **Is there specific report copy** that needs changing — if so, which
   sections and what should the new wording be?

Without a concrete pointer we risk changing the wrong thing.

---

## 5. Other Round-1 Follow-Ups

### 5a. Narcolepsy screen refinement

The algorithm has a narcolepsy screen (`screenNarcolepsy`), but its
threshold logic is essentially a binary (prior diagnosis OR cataplexy + sleep
paralysis). The report just added on the web side will now surface this.

**Question for Danny:** is this screen sensitive enough, or should we expand
it (e.g., EDS severity + sleep paralysis + cataplexy equivalents)?

### 5b. Validation study data structure

Danny mentioned his colleague's sleep lab could run 1,000 patients through
the questionnaire and run a validation study against actual diagnoses.

**Question for Danny:** what data format would the lab need? We already
export to CSV. Should we add:

- A compact "algorithm verdict" column set (flags + severities) for easy
  comparison with the sleep lab's diagnoses?
- An anonymized "scoring breakdown" dump?
- A stable patient identifier that the lab can use to cross-reference?

### 5c. AI Solutions partnership

Danny mentioned talking with "AI Solutions" about using the questionnaire.

**Question for Danny:** is there a specific integration scope we should be
planning for (e.g., API for third-party consumption, white-label support),
or is this still exploratory?

---

## Status Summary

| Priority | Status |
|----------|--------|
| Server-side algorithm protection | **Actionable — done** (patient-facing EDS weight exposure fixed, rate limiting + auth gate on debug added) |
| Missing report sections (narcolepsy, bad dreams, anxiety) | **Actionable — done** |
| Tuning dashboard redesign | **Actionable — done** (decision-tree view replaces the old columns) |
| Fibromyalgia vs CFS differentiation | **Blocked** — awaiting clinical criteria |
| Insomnia vs circadian rhythm differentiation | **Blocked** — awaiting clinical criteria |
| Thin report section language | **Blocked** — awaiting Danny's clinical copy |
| Gender terminology updates | **Blocked** — awaiting specific wording |
| Narcolepsy screen sensitivity | **Blocked** — awaiting Danny's clinical input |
| Validation study data structure | **Blocked** — awaiting lab format specs |
