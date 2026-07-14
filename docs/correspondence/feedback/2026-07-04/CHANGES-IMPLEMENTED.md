# Round 5 Feedback (7/4) — Changes Implemented

This is the change log for the **July 4 feedback only**. Each item lists what you asked for, what we changed, and a link to see it live. The 7/4 response was text-only (no annotated screenshots).

**Status tags:** <span class="review-tag review-tag--done">Done</span> built and covered by automated tests &nbsp; <span class="review-tag review-tag--signoff">Needs your sign-off</span> built using our best clinical interpretation — please confirm the rule &nbsp; <span class="review-tag review-tag--deferred">Deferred</span> needs a specific rule from you before we build it

> **How to use the links:** Each link opens the relevant page with sample data already filled in (the `/dev` or `/review` routes, for review only — the real questionnaire at `/` is unchanged for patients). For diagnostic-logic items, the **[Algorithm Viewer](/review)** shows every rule, the patient's value, the threshold used, and whether each criterion was met.

---

## B. Algorithm and report logic

<a id="b1"></a>

### B1 — COMISA / OSA

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Approved. No change requested.

**What changed:** No code changes this round.

---

<a id="b2"></a>

### B2 — Pain-related sleep problem vs chronic fatigue / fibromyalgia

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "pain >4/week/ or above 4 on a scale of 10 plus and <7 fatigue and < 7 tiredness can stay as sleep related pain problems only. Pain>4 plus >/=7 tiredness and fatigue can be -- Chronic Fatigue or Fibromyalgia syndromes."

**What changed:** Chronic fatigue and pain-related sleep disturbance are now **mutually exclusive**. Chronic fatigue requires a pain qualifier (pain severity >= 5 when pain affects sleep, or joint/muscle pain) **plus** tiredness >= 7 **and** fatigue >= 7. Pain-related requires the pain qualifier plus 2+ symptoms and fires only when chronic fatigue does not. `jointMusclePain` has no severity field — we kept it as an unqualified pain anchor.

![After: Chronic fatigue active, pain-related suppressed](/review/round-5/after/b2.png)

**Where to see it:** [Report — chronic-fatigue scenario](/review?scenario=chronic-fatigue)

---

<a id="b3"></a>

### B3 — Sleep medication

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Approved. No change requested.

**What changed:** No code changes this round.

---

<a id="b5-dspd"></a>

### B5 — Insomnia vs DSPD differential (DSPD-primary path)

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "Probable DSPD / Insomnia differential - Wake at night </=1, Midsleep time weekday < Midday sleep time >/= 1hour. / EDS </=5 narcolepsy differential." Report: "Based on your response, you have some symptoms of insomnia, but are most likely struggling with DSPD."

**What changed:** When insomnia and delayed chronotype co-occur, we compute `dspdDifferentialMet` (night wakeups <= 1, weekend mid-sleep >= 1 h later than weekday, EDS <= 5). If met and the insomnia anchor (`triedCannotNapDuringDay`) is false, the report attributes symptoms to DSPD with your verbatim sentence. Ambiguous cases default to circadian attribution (same as Round 4). We interpreted "Midsleep time weekday < Midday sleep time >/= 1hour" as weekend mid-sleep >= 1 h later than weekday.

![After: DSPD-primary differential sentence](/review/round-5/after/b5-dspd.png)

**Where to see it:** [Report — dspd-differential-dspd-primary](/review?scenario=dspd-differential-dspd-primary)

---

<a id="b5-insomnia"></a>

### B5 — Insomnia vs DSPD differential (insomnia-primary path)

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** Anchor: "I've tried, but I cannot fall asleep during the day." Report: "Based on your responses, you have some symptoms of DSPD but are more likely struggling with insomnia."

**What changed:** New questionnaire checkbox `triedCannotNapDuringDay`. When the insomnia anchor is true, delayed chronotype is present, and the DSPD differential is **not** met, `insomniaPrimaryOverDSPD` fires and the report appends your verbatim sentence. The separate Delayed Sleep Phase issue block is suppressed in this case.

![After: Insomnia-primary differential sentence](/review/round-5/after/b5-insomnia.png)

**Where to see it:** [Report — dspd-differential-insomnia-primary](/review?scenario=dspd-differential-insomnia-primary)

---

<a id="b5-narcolepsy"></a>

### B5 / Part 4 — Narcolepsy gate (EDS >= 7 + REM intrusion)

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "Narcolepsy requires: EDS ≥ 7." Include cataplexy and other REM intrusion symptoms. Separate IH presentation marked "??" in source.

**What changed:** Prior diagnosis still positive regardless. Symptom path now requires EDS score >= 7 **and** at least one of: cataplexy (`weaknessWhenExcited`), sleep paralysis, or new hypnagogic hallucinations checkbox. Combined "Narcolepsy or Idiopathic Hypersomnia" heading retained; separate IH block not added pending your guidance.

**Where to see it:** [Daytime page](/dev?section=daytime) — hallucinations question; [Report — narcolepsy-screen](/review?scenario=narcolepsy-screen)

---

<a id="d1"></a>

### D1 — Stricter DSPD / delayed chronotype trigger

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** Fire when chronotype preference > mild evening preference, mid-sleep > 3:30 AM, and weekday mid-sleep − weekend mid-sleep difference.

**What changed:** `chronotypeType === 'delayed'` now requires **all three**: moderate-or-strong late preference, scheduled mid-sleep after 3:30 AM (adjusted), and weekend mid-sleep **> 1 h** later than weekday (strict greater-than; Danny confirmed 7/14).

**Where to see it:** [Algorithm Viewer](/review) — inspect delayed chronotype scenarios

---

<a id="d2"></a>

### D2 — Average 24-hour sleep including naps

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "Total sleep=(naps # week x approximate naptime / 5) + ((weekday hours/nightx5 +weeknightx2)/7)"

**What changed:** New `avg24HourSleep` metric: weekly average TST plus nap hours. Nap term uses `/5` because the naps query is weekdays-only (Danny confirmed 7/14). `weeklyAvgTST` unchanged; syndrome/EDS gates still use weekly average.

**Where to see it:** [Algorithm Viewer](/review) — metrics panel on any scenario with planned naps

---

<a id="part2-healthy"></a>

### Part 2 — Sleep Health Recommendations (healthy sleeper copy)

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Option 1 (healthy sleeper): "We are impressed with your general sleep health…" Option 2 when symptoms present. Always shown whether or not a disorder is identified.

**What changed:** New always-visible **Sleep Health Recommendations** card on web and PDF (after Recommendations). Uses `isHealthySleeper` to choose option 1 vs 2. "No Major Sleep Issues Detected" fallback now keys off `isHealthySleeper` instead of a long inline negation list.

![After: Healthy sleeper Sleep Health Recommendations](/review/round-5/after/part2-healthy.png)

**Where to see it:** [Report — healthy-sleeper](/review?scenario=healthy-sleeper)

---

<a id="part3-signs"></a>

### Part 3 — Signs of insufficient sleep (subclinical)

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** Trigger when TST < 6.5 h on >1 night/week, or TST 6.5–8 h on >=4 days/week with tiredness >= 5, fatigue > 4, or sleepiness > 4. Include report copy on optimal sleep duration.

**What changed:** `hasInsufficientSleepSigns` flag and sub-block in Sleep Health Recommendations. Mapped ">1 night/week" to scheduled/unscheduled TST blocks; ">=4 days/week" to the 5-night scheduled block; ratings >= 5 for tiredness/fatigue/sleepiness. Suppressed when insufficient-sleep **syndrome** already fires to avoid duplicate messaging.

![After: Insufficient sleep signs sub-block](/review/round-5/after/part3-signs.png)

**Where to see it:** [Report — insufficient-sleep-signs](/review?scenario=insufficient-sleep-signs)

---

<a id="part3-timing"></a>

### Part 3 — Sleep timing variability

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** Mid-sleep varies > 44 min on week nights and/or >= 1 h weekday–weekend difference, or bedtime varies > 1 h/night on week nights.

**What changed:** `hasSleepTimingVariability` when `|midSleepTimeChange| >= 1 hour` or `lightsOutVaries` (question reworded to "> 1 hour"). Per-night mid-sleep variance is not measurable from our single weekly schedule — `lightsOutVaries` is the proxy.

**Where to see it:** [Report — insufficient-sleep-signs](/review?scenario=insufficient-sleep-signs) (timing variability sub-block when shift >= 1 h)

---

<a id="part3-chronotype"></a>

### Part 3 — Owl / lark / crow chronotype labels

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Evening/owl (> 4 AM weekday and > 5 AM weekend mid-sleep), morning/lark (< 1 AM weekday), centered/crow (others). Include chronotype education paragraph in report.

**What changed:** `chronotypeLabel` strings updated to "Evening chronotype (owl-like preference)", "Morning chronotype (lark-like preference)", and "Centered chronotype (crow-like preference)". **Your Chronotype** sub-block always appears in Sleep Health Recommendations with Danny's education copy.

![After: Chronotype copy in Sleep Health Recommendations](/review/round-5/after/part3-chronotype.png)

**Where to see it:** Any [report preview](/review?scenario=healthy-sleeper)

---

<a id="insomnia-2plus"></a>

### Part 4 — Insomnia mild daytime criteria (2+)

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Insomnia — daytime criteria: require 2+"

**What changed:** Mild insomnia now requires 2+ daytime symptoms (moderate-to-severe unchanged at 2+). Several scenarios updated — e.g. `osa-risk-factors` no longer gets incidental mild insomnia.

**Where to see it:** [Algorithm Viewer](/review) — compare `sleep-onset-insomnia-mild` vs `osa-risk-factors`

---

<a id="insufficient-answers"></a>

### Part 4 — Insufficient answers threshold

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "Thank you for completing the questionnaire. You did not answer a sufficient number of questions for us to generate an accurate report."

**What changed:** Patient-facing `/` route blocks report generation when core sleep times are missing or all three daytime ratings are null. Review/dev routes exempt.

![After: Insufficient answers message](/review/round-5/after/insufficient-answers.png)

**Where to see it:** Complete the [patient questionnaire](/) with only demographics filled, then Generate Report

---

## A. Questionnaire pages

<a id="form-daytime"></a>

### New daytime questions + naps per week

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** B5 insomnia anchor; REM-intrusion item for narcolepsy; nap count for 24 h sleep formula.

**What changed:** Added "I've tried, but I cannot fall asleep during the day" and hypnagogic hallucinations checkbox. Surfaced `napsPerWeek` when planned nap days > 0.

![After: New daytime questions](/review/round-5/after/form-daytime.png)

**Where to see it:** [Daytime page](/dev?section=daytime)

---

<a id="form-scheduled"></a>

### Lights-out variability wording (> 1 hour)

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Bedtime varies by > 1 hour/night on week nights (Part 3 timing variability).

**What changed:** `lightsOutVaries` label now reads "Does your lights out time vary by more than 1 hour?"

**Where to see it:** [Work/School Nights page](/dev?section=scheduled-sleep)

---

<a id="form-rls"></a>

### Restless legs — cut intro, triad-only popup

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "cut the introductory description of Restless Legs Syndrome; it should only appear in the pop-up." "RLS core disorder same as pop-up."

**What changed:** Removed always-on RLS intro alert. Educational text moved into the warning alert, which now requires the full triad (trouble lying still + urge to move + movement relieves).

![After: RLS triad popup without intro](/review/round-5/after/form-rls.png)

**Where to see it:** [Restless Legs page](/dev?section=restless-legs) — check all three symptoms

---

<a id="form-under25"></a>

### Under-25 demographics popup

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Between 9 and 25 years of age there is a biological tendency to stay up later and wake up later…"

**What changed:** Alert shows for ages 12–24 (form minimum age is 12). Danny's copy used verbatim.

![After: Under-25 popup](/review/round-5/after/form-under25.png)

**Where to see it:** [Demographics page](/dev?section=demographics) — set birth year for age < 25

---

## Decisions flagged for your review

| Topic | Our implementation | Status (7/14) |
| --- | --- | --- |
| D2 nap term | `/5` (weekdays-only naps) | Confirmed |
| D1 weekend shift | strict `> 1 hour` | Confirmed |
| B5 mid-sleep comparison | Weekend > 1 h later than weekday | Confirmed with D1 |
| B5 ambiguous cases | Default to DSPD attribution | Same as Round 4 |
| B2 `jointMusclePain` | Unqualified pain anchor | No severity question exists |
| Part 3 fatigue frequency | Ratings only (no day-count field) | Open if you want a frequency question |
| Timing variability | `lightsOutVaries` OR mid-sleep shift >= 1 h | Per-night variance not collected; sensitivity note still open |
| RLS popup | Full triad required | Was any-of-three in Round 4 |
| Narcolepsy vs IH | Combined heading kept | Confirmed |
| Insufficient-answers rule | 4 core times + any daytime rating | Minimal detectable threshold |
| Website links | Placeholders remain (`website link` / `[]`) | Site not set up yet — your web developer can replace these markers |
