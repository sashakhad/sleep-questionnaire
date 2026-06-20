# Round 4 Feedback (6/16) — Changes Implemented

This is the change log for the **June 16 feedback only**. Each item lists what you asked for (with your original annotated screenshot), what we changed, and a link to see it live.

**Status tags:** <span class="review-tag review-tag--done">Done</span> built and covered by automated tests &nbsp; <span class="review-tag review-tag--signoff">Needs your sign-off</span> built using our best clinical interpretation — please confirm the rule &nbsp; <span class="review-tag review-tag--deferred">Deferred</span> needs a specific rule from you before we build it

> **How to use the links:** Each link opens the relevant page with sample data already filled in (the `/dev` route, for review only — the real questionnaire at `/` is unchanged for patients). Links are relative, so they open on whatever version you are viewing (this preview build). For the diagnostic-logic items, the **[Algorithm Viewer](/review)** shows every rule, the patient's value, the threshold used, and whether each criterion was met.
>
> The screenshots under each item are your original 6/16 annotations, kept here so we don't lose that context.

---

## A. Questionnaire pages

<a id="a1"></a>

### A1. BMI shown as a value with ranges, not a label

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Suggest cutting these warnings on the first page. If easy it would be much preferable to show a BMI and the range of definitions rather than labeling." Also: "If BMI is < 18 add to report ... underweight ... eating disorders."

![Your annotated BMI screenshot](/review/round-4/image1.png)

**What changed:** The demographics page now shows the BMI number plus the standard range definitions (Underweight < 18.5 / Normal 18.5–24.9 / Overweight 25–29.9 / Obese ≥ 30) instead of a single category label. The old "BMI and Sleep Apnea Risk" warning box was removed. A short low-BMI note appears when BMI < 18, and the report adds the underweight/eating-disorder statement.

**Where to see it:** [Demographics page](/dev?section=demographics) (set weight/height to produce a BMI under 18 to see the low-BMI note); the report statement shows on the [report page](/dev?section=report).

<a id="a2"></a>

### A2. Bad dreams / nightmares wording and nesting

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "I have bad dreams but not nightmares — change wording and drop 'but not nightmares'." And: "I remember my dreams — nest so only include bad dreams and nightmares if this is affirmative."

![Your annotated bad-dreams wording screenshot](/review/round-4/image2.png)

![Your annotated dream-recall nesting screenshot](/review/round-4/image6.png)

**What changed:** The label now reads "I have bad dreams." The bad-dream and nightmare questions (and their definitions and warnings) only appear after the patient checks "I remember my dreams at least a few nights a week." If dream recall is not endorsed, nothing about bad dreams/nightmares is asked or scored.

**Where to see it:** [Dreams and Nightmares page](/dev?section=nightmares) — uncheck "I remember my dreams" and the section collapses.

<a id="a3"></a>

### A3. Sleep-disordered-breathing warning for mouth breathing + dry mouth

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Add warning for sleep disordered breathing when both mouth breathing and dry mouth."

![Your annotated mouth-breathing + dry-mouth screenshot](/review/round-4/image3.png)

**What changed:** When both "I mouth breathe" and "I frequently wake up with a dry mouth" are checked, the page now shows the sleep-disordered-breathing warning (previously only snoring or breathing pauses triggered it).

**Where to see it:** [Sleep Related Breathing page](/dev?section=breathing-disorders) — check mouth breathing, then dry mouth.

<a id="a4"></a>

### A4. Auto-correct 12–6 bedtimes to AM

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "To prevent a false response, would it be possible to automatically change to am when someone endorses 12–6am for bedtimes?"

![Your annotated bedtime AM/PM screenshot](/review/round-4/image4.png)

**What changed:** On both bedtime fields, selecting an hour of 12–6 now forces AM automatically, so a 12–6 bedtime can no longer be saved as a daytime PM time.

**Where to see it:** [Work/School Nights page](/dev?section=scheduled-sleep) — set bedtime hour to 1 and try to switch it to PM; it stays AM. (Same on the [Weekends page](/dev?section=unscheduled-sleep).)

<a id="a5"></a>

### A5. Caffeine time defaults to AM

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Set caffeine question default to am, not pm."

![Your annotated caffeine time screenshot](/review/round-4/image8.png)

**What changed:** The "final caffeinated beverage" time now defaults to AM.

**Where to see it:** [Lifestyle page](/dev?section=lifestyle) — set caffeine servings to 1+ and the time field defaults to AM.

<a id="a6"></a>

### A6. Supplement & prescription frequency ("3 or more nights a week")

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Add 3 or more nights a week for supplement questions and prescription questions."

![Your annotated medications screenshot](/review/round-4/image7.png)

**What changed:** When a patient selects any sleep supplement or prescription, we now ask how many nights a week they take it. Medication-related sleep disturbance is only flagged when a relevant medication is taken 3+ nights/week.

**Where to see it:** [Sleep Medications page](/dev?section=sleep-hygiene) — check a supplement to reveal the nights-per-week question.

<a id="a7"></a>

### A7. Exercise warning verbiage

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Change warning verbiage to vigorous exercise for more than 45 minutes within 2 hours of bedtime."

![Your annotated exercise warning screenshot](/review/round-4/image9.png)

**What changed:** The late-exercise warning now reads "vigorous exercise for more than 45 minutes within 2 hours of bedtime," and the logic checks exercise duration (> 45 min) ending within 2 hours of bedtime (checked against both weekday and weekend bedtimes).

**Where to see it:** [Lifestyle page](/dev?section=lifestyle) — set exercise duration over 45 and an end time close to bedtime.

<a id="a8"></a>

### A8. "Exercise less than 3x/week" added as a sleep-hygiene item

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Suggest adding in: You exercise less than three times a week. This can be considered a sleep hygiene issue, but is also a general health issue."

**What changed:** Exercising 1–2 days/week now shows an inline note and is included as a sleep-hygiene issue in the report, with the suggestion to discuss increased exercise with a primary care doctor.

**Where to see it:** [Lifestyle page](/dev?section=lifestyle) — set exercise days to 1 or 2.

<a id="a9"></a>

### A9. Tobacco / nicotine health statement

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "If positive for cigarettes or nicotine — add a general health statement in the report. Use of tobacco and nicotine can cause sleep disruption and has significant health risks ..."

**What changed:** Checking the nicotine question shows the health statement inline, and it is also included in the report's sleep-hygiene guidance.

**Where to see it:** [Sleep Medications page](/dev?section=sleep-hygiene) — check "I smoke cigarettes or use nicotine patches."

<a id="a10"></a>

### A10. Excessive caffeine (> 4/day) warning

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "When caffeine use is greater than 4/day add an excessive caffeine use warning that is about the same as the late caffeine warning."

![Your annotated caffeine intake screenshot](/review/round-4/image14.png)

**What changed:** Confirmed the > 4/day "High Caffeine Intake" warning is present in the questionnaire, and the report now includes an excessive-caffeine sleep-hygiene note.

**Where to see it:** [Lifestyle page](/dev?section=lifestyle) — set caffeine servings to 5.

<a id="a11"></a>

### A11. Trimmed the night-owl chronotype pop-up

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "This is right on target, but suggest you make the following cuts to this pop-up warning to keep assessment recs for the report and our website."

![Your annotated chronotype pop-up screenshot](/review/round-4/image12.png)

**What changed:** Removed the "consider consulting with a sleep specialist…" sentence from the night-owl pop-up so the pop-up stays informational and the assessment recommendation lives in the report/website.

**Where to see it:** [Sleep Preferences page](/dev?section=chronotype) — the late-preference pop-up now ends at "More details will be provided in the report…".

---

## B. Diagnostic logic — false positives you flagged

The clearest way to review these is the **[Algorithm Viewer](/review)**, which shows each pathway's criteria, the patient's values, the thresholds, and whether the pathway fired.

<a id="b1"></a>

### B1. COMISA no longer fires on non-restorative sleep alone

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "EDS is ok. COMISA is not. This person should not meet criteria for insomnia symptoms, only sleep apnea." (Same case drove your chronic-fatigue and medication false-positive notes in B2 and B3.)

![Your annotated report — COMISA / chronic fatigue / medication false positives](/review/round-4/image10.png)

![The same patient's sleep metrics — normal sleep latency and efficiency, which argue against COMISA](/review/round-4/image11.png)

**What changed:** COMISA now requires objective insomnia (difficulty falling asleep, staying asleep, or low sleep efficiency) **plus** sleep-disordered breathing. A patient with normal sleep latency/efficiency who only reports non-restorative sleep plus snoring now reads as sleep-disordered breathing, not COMISA.

**Where to see it:** [Algorithm Viewer → COMISA scenario](/review?scenario=comisa).

<a id="b2"></a>

### B2. Chronic fatigue / fibromyalgia raised threshold

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "Symptoms of chronic fatigue are coming up in most cases and threshold should be raised as this is pretty rare… shows up for almost every diagnosis." (Visible in the B1 screenshot above.)

**What changed:** It no longer fires from insomnia alone. It now requires a pain anchor (pain affecting sleep or joint/muscle pain) **plus** at least two fatigue indicators (sleepiness interferes, non-restorative sleep, tiredness ≥ 7, fatigue ≥ 7).

**Where to see it:** [Algorithm Viewer → chronic-fatigue scenario](/review?scenario=chronic-fatigue).

<a id="b3"></a>

### B3. Medication-related no longer fires for melatonin-only

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

**Your feedback:** "Medication related sleep disturbance also should not be listed for this person as they are only taking melatonin." (Visible in the B1 screenshot above.)

**What changed:** Melatonin alone no longer triggers this finding. It now requires a sleep-affecting medication (e.g., sedating antihistamines, benzodiazepines, Z-drugs, sedating antidepressants/antipsychotics) used 3+ nights/week. A prior medical/mental-health diagnosis no longer triggers it on its own without a medication. The report also now lists the patient's actual medications.

**Where to see it:** [Sleep Medications page](/dev?section=sleep-hygiene); the report wording shows on the [report page](/dev?section=report).

<a id="b4"></a>

### B4. Nocturnal leg cramps threshold raised to 3

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Increase threshold nocturnal leg cramps to 3." Also: "They do meet criteria for RLS, but no nocturnal leg cramps."

![Your annotated leg cramps screenshot](/review/round-4/image5.png)

**What changed:** The concern threshold is now 3+ nights/week (was 2). Checking the leg-cramps box without entering a frequency no longer creates a report finding on its own.

**Where to see it:** [Restless Legs page](/dev?section=restless-legs) — set leg cramps to 2 (no warning) vs 3 (warning).

<a id="b5"></a>

### B5. Insomnia re-attributed under DSPD or RLS

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "If delayed sleep phase syndrome is likely … say insomnia symptoms are likely due to a circadian rhythm disorder." And: "The same logic if someone has RLS … attribute to probable RLS."

![Your annotated insufficient-sleep + comorbid delayed sleep phase case metrics](/review/round-4/image15.png)

![Your annotated insufficient-sleep case findings and recommendations](/review/round-4/image16.png)

**What changed:** When a delayed chronotype is present, insomnia is presented as "likely due to a circadian rhythm disorder" and treated as a preliminary assessment/treatment priority. When RLS is present (and DSPD is not), insomnia is attributed to probable RLS. (We chose to relabel rather than hide insomnia, per "I am fine with either.")

**Where to see it:** [Algorithm Viewer](/review); report wording on the [report page](/dev?section=report).

<a id="b6"></a>

### B6. Nightmares/bad dreams only scored when remembered and endorsed

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "Nest so only include bad dreams and nightmares if [dream recall] is affirmative."

**What changed:** Nightmare disorder and bad-dream warnings are only scored when the patient remembers dreams **and** endorses the specific symptom, preventing leftover values from flagging.

**Where to see it:** [Dreams and Nightmares page](/dev?section=nightmares).

<a id="b7"></a>

### B7. EDS + sleep-disordered-breathing comorbidity note

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "When sleep disordered breathing and narcolepsy diagnoses are both present … it is common for people with a disorder of excessive daytime sleepiness to also have sleep disordered breathing or obstructive sleep apnea syndrome."

**What changed:** When excessive daytime sleepiness/narcolepsy and sleep-disordered breathing co-occur, the report adds this comorbidity note. The EDS narrative was also tightened so "insufficient sleep" is only mentioned when it is an actual finding.

**Where to see it:** [Report page](/dev?section=report).

<a id="b8"></a>

### B8. Narcolepsy ↔ ADHD/depression misdiagnosis note

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** "When narcolepsy is probable and they endorse either ADHD or depression … 'it is common to be mis-diagnosed with depression or ADHD.'"

**What changed:** When narcolepsy is probable and the patient endorses ADHD or depression, the report (web and PDF) adds this note advising discussion with the prescribing doctor.

**Where to see it:** [Report page](/dev?section=report).

---

## C. Report wording and metrics

<a id="c1"></a>

### C1. Report copy rewrites

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Recommended edits for insomnia/CBT-I, COMISA, chronic fatigue, medication-related, general sleep hygiene, insufficient sleep, and SomnaHealth Services.

**What changed:** Applied your wording to the web report and the PDF, including: the CBT-I-forward insomnia text, the expanded COMISA explanation, the chronic-fatigue referral language, the medication list, the data-driven sleep-hygiene bullet list (bedroom, bedtime ritual, eat 2h before, exercise 1.5h before, regular bedtime within 30 min, caffeine 10h before, naps ≤ 20 min), the insufficient-sleep EDS sentence, and the SomnaHealth services paragraph.

**Where to see it:** [Report page](/dev?section=report).

<a id="c2"></a>

### C2. Sleep-metrics wording

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** Social Jet Lag "… or a circadian rhythm disorder"; Mid-Sleep Time Change "… and a possible circadian rhythm disorder" (or "… and insufficient nightly sleep" for the insufficient-sleep case).

![Your annotated metrics-wording edits on the delayed sleep phase case](/review/round-4/image13.png)

**What changed:** Updated the Social Jet Lag and Mid-Sleep Time Change explanations accordingly, switching the mid-sleep ending based on whether insufficient sleep is present. We also fixed a display bug where mid-sleep time rendered as e.g. `03:7.5`; it now renders as a proper time.

**Where to see it:** [Report page](/dev?section=report) (Your Sleep Metrics section).

<a id="c3"></a>

### C3. "Personalized Recommendations" → "Recommendations" in the PDF

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** (Carried from prior rounds; the web already said "Recommendations.")

**What changed:** The PDF recommendations header now matches the web ("Recommendations").

**Where to see it:** Download the PDF from the [report page](/dev?section=report).

---

## D. Still needs your input

<a id="d1"></a>

### D1. Delayed sleep phase over-triggering (the narcolepsy case)

<span class="review-tag review-tag--deferred">Deferred</span>

**Your feedback:** "False positive … This individual does not meet criteria for DSPD."

**Why deferred:** Our delayed-chronotype flag currently fires on a late chronotype preference or a late mid-sleep time. Tightening *when* DSPD is flagged needs a specific rule from you (e.g., which combination of mid-sleep time, social jet lag, and reported trouble waking should qualify). Please tell us the criteria and we will implement it. The insomnia re-attribution in B5 is in place regardless.

<a id="d2"></a>

### D2. "Average 24-hour sleep duration (naps included)" metric

<span class="review-tag review-tag--deferred">Deferred</span> <span class="review-tag review-tag--optional">Optional</span>

**Your feedback:** "If not difficult … under school/weekdays — average nightly sleep duration; average 24-hour sleep duration — with naps included."

**Why deferred:** This needs a definition for averaging nap time into a 24-hour total (per day vs per week). Confirm how you'd like naps averaged in and we'll add the metric row.

<a id="d3"></a>

### D3. Clinical sign-off on the new thresholds

<span class="review-tag review-tag--signoff">Needs your sign-off</span>

Items **B1, B2, B3** were implemented with our best clinical interpretation to stop the over-triggering you saw. Please confirm the exact criteria (or adjust): the COMISA objective-insomnia gate, the chronic-fatigue pain-anchored rule, and the medication list + 3-nights/week cutoff. The narcolepsy screen sensitivity is also still open for your input.
