# Questions for Danny — Retainer Round 1

**Context**: Following the [April 16, 2026 call](correspondence/meetings/2026-04-16-sasha-danny-algorithm-dev.md),
three priorities were agreed: algorithm refinement, report language, and
backend security. This document captures the open questions that require
Danny's (or his clinical colleagues') input before we can implement them.
Items marked **actionable now** are already underway or complete.

**Updated 2026-07-04 (Round 5):** B1 (COMISA) and B3 (sleep meds) are approved.
B2 pain/CF split, B5 insomnia–DSPD differential, narcolepsy EDS gate, D1/D2,
and Part 2–3 sleep-health recommendations are implemented with flagged
interpretations — see [Round 5 changes](correspondence/feedback/2026-07-04/CHANGES-IMPLEMENTED.md).

---

## 1. Algorithm — Fibromyalgia vs Chronic Fatigue Differentiation

### Current state

**Updated after 2026-07-04 feedback:** chronic fatigue and pain-related sleep
disturbance are mutually exclusive. Chronic fatigue requires pain qualifier plus
tiredness >= 7 **and** fatigue >= 7. Pain-related requires pain qualifier plus
2+ symptoms when CF is not active. `jointMusclePain` has no severity field and
is treated as an unqualified pain anchor (flagged).

**Updated after 2026-06-16 feedback:** the algorithm still has a single combined
`screenChronicFatigue` screen, but it no longer fires from insomnia alone.

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
  efficiency, and daytime symptom counts. Mild insomnia now requires **2+**
  daytime symptoms (Round 5).
- **Updated after 2026-07-04 feedback:** formal insomnia-vs-DSPD differential
  with `insomniaPrimaryOverDSPD`, DSPD-primary report sentences, and stricter
  delayed chronotype trigger (moderate+ evening preference, mid-sleep > 3:30 AM,
  weekend shift >= 1 h). Ambiguous cases default to circadian attribution.
- **Updated after 2026-06-16 feedback:** Delayed Sleep Phase Disorder (DSPD)
  can recontextualize insomnia in the report.
- RLS can similarly recontextualize insomnia as likely related to probable RLS.
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

- Replace the current display-level relabeling with a more formal circadian
  decision tree if Danny provides exact criteria.
- Add `hasCircadianRhythmDisorder` (and sub-types if needed) to
  `FullReportResult`.
- Replace or augment the DSPD "informational" block in
  [ReportSection.tsx](../src/components/questionnaire/sections/ReportSection.tsx)
  with a proper disorder section when flagged.
- Add matching scenarios and a new decision-tree card on the tuning
  dashboard.

---

## 3. Report Language — Thin Sections

**Updated after 2026-06-16 feedback:** several report sections now have expanded
copy based on Danny's latest comments, including insomnia, COMISA, chronic
fatigue, medication-related disturbance, sleep hygiene, delayed sleep phase,
insufficient sleep, and SomnaHealth Services.

Remaining thin or lower-confidence sections:

- **Insomnia** (non-COMISA case)
- **OSA** (non-COMISA case)
- **RLS**
- **Nightmare disorder** (we just added a separate Bad Dreams block)
- **Delayed Sleep Phase**
- **Sleep Hygiene Issues** — title only, no concrete bullets

### What Danny still needs to provide

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

### 5a. COMISA criteria sign-off

**Resolved (Round 5):** B1 approved — no further changes.

Round 4 feedback made clear that COMISA was over-triggering. The current
implementation requires objective insomnia evidence (SOL, WASO, or sleep
efficiency) in addition to sleep-disordered breathing.

### 5b. Medication-related disturbance sign-off

**Resolved (Round 5):** B3 approved — no further changes.

Round 4 feedback made clear that melatonin-only use should not trigger
medication-related sleep disturbance.

### 5c. Narcolepsy screen refinement

**Partially addressed (Round 5):** Symptom path now requires EDS score >= 7
plus REM-intrusion (cataplexy, sleep paralysis, or hypnagogic hallucinations).
Prior diagnosis path unchanged. Separate Idiopathic Hypersomnia presentation
not added — source marked "??".

**Still open:** Confirm REM-intrusion item list and whether IH deserves its own
report block.

### 5d. Round 5 interpretation sign-offs

Please confirm these Round 5 implementation choices:

1. **D2 nap term:** we use `/7` (daily average) instead of Danny's `/5`.
2. **D1 / B5 weekend shift:** `>= 1 hour` later mid-sleep on free days.
3. **B5 mid-sleep wording:** interpreted as weekend mid-sleep >= 1 h later than weekday.
4. **B2 `jointMusclePain`:** kept as pain qualifier without severity threshold.
5. **Part 3 fatigue frequency:** no day-count question — ratings only for insufficient-sleep signs.
6. **Timing variability:** `lightsOutVaries` (> 1 h) OR mid-sleep shift >= 1 h as proxy.
   Note on sensitivity: a 1-hour weekend shift is very common (even our baseline
   test fixture trips it), so most respondents will see the variability block and
   few will qualify for the "we are impressed" healthy-sleeper copy. Confirm this
   is the intended sensitivity or whether the shift cutoff should be higher.
7. **RLS popup:** full triad required (was any-of-three).
8. **Insufficient-answers rule:** 4 core sleep times + at least one daytime rating.
9. **Website links:** placeholders for Seven Sleep Health Principles and insufficient-sleep copy.

### 5e. Validation study data structure

Danny mentioned his colleague's sleep lab could run 1,000 patients through
the questionnaire and run a validation study against actual diagnoses.

**Question for Danny:** what data format would the lab need? We already
export to CSV. Should we add:

- A compact "algorithm verdict" column set (flags + severities) for easy
  comparison with the sleep lab's diagnoses?
- An anonymized "scoring breakdown" dump?
- A stable patient identifier that the lab can use to cross-reference?

### 5f. AI Solutions partnership

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
| Round 5 sleep-health recommendations | **Actionable — done** — healthy-sleeper copy, subclinical flags, owl/lark/crow labels |
| Round 5 insomnia–DSPD–narcolepsy differential | **Partially addressed** — implemented; mid-sleep wording and ambiguous cases need sign-off |
| Fibromyalgia vs CFS differentiation | **Partially addressed** — B2 mutual exclusion implemented; still awaiting clinical split criteria |
| Insomnia vs circadian rhythm differentiation | **Partially addressed** — B5 differential implemented; formal circadian decision tree still open |
| Thin report section language | **Partially addressed** — 2026-06-16 and 2026-07-04 copy implemented; remaining thin sections need final review |
| Gender terminology updates | **Blocked** — awaiting specific wording |
| COMISA over-triggering | **Resolved (Round 5)** — B1 approved |
| Medication-related sleep disturbance | **Resolved (Round 5)** — B3 approved |
| Narcolepsy screen sensitivity | **Partially addressed (Round 5)** — EDS >= 7 + REM intrusion; IH block still open |
| Validation study data structure | **Blocked** — awaiting lab format specs |
