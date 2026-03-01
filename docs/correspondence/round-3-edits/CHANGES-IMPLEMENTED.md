# Round 3 Feedback — Changes Implemented

All changes from the "additional comments 2.28" document have been implemented. Each item below includes a direct link to the relevant page so you can verify the change immediately.

> **How to use the links:** Each link takes you directly to the specific page of the questionnaire with sample data pre-filled. A sidebar on the left lets you jump between pages. These links use the `/dev` route which is only for review purposes — the main questionnaire at the root URL (`/`) is unchanged for end users.

---

## 1. Birth Year Range

**Your feedback:** "Youngest respondent would be 12. Please change birth year range — 2014."

**What changed:** The birth year dropdown now caps at 12 years before the current year (currently 2014). This updates automatically each year so it never goes out of date.

**Verify:** [Open Demographics page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=demographics) — click "What year were you born?" and confirm the most recent year available is 2014.

---

## 2. Cut Redundant Sleep Apnea & Restless Legs Questions

**Your feedback:** "Cut additional question regarding sleep apnea and restless legs syndrome. These are redundant with above."

**What changed:** The separate "OBSTRUCTIVE SLEEP APNEA (OSA)" and "RESTLESS LEGS SYNDROME (RLS)" sections with Yes/No questions and all treatment follow-up fields have been removed entirely. The checklist at the top of the page is the only place these are captured now.

**Verify:** [Open Sleep Disorder History page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=sleep-disorder-diagnoses) — you should only see the checklist of disorders and the "Other" text field. No separate OSA or RLS subsections.

---

## 3. Cut Second Planned Nap Question

**Your feedback:** "Cut second planned nap question."

**What changed:** Removed the "I take how many planned naps per week total?" question. Only "I take planned naps how many days per week?" and "How long are my naps typically?" remain.

**Verify:** [Open Daytime Functioning page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=daytime) — scroll to the "Planned Naps" section and confirm the "naps per week total" question is gone.

---

## 4. Add 0-Minute Option to Fall-Asleep Time

**Your feedback:** "Add a 0 minute option to time to fall asleep on weekday and weekends."

**What changed:** Added "0 minutes" as the first option in the fall-asleep duration dropdowns on both the weekday and weekend sleep pages.

**Verify:**
- [Open Work/School Nights page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=scheduled-sleep) — click the "how long does it take you to fall asleep?" dropdown and confirm "0 minutes" is the first option.
- [Open Weekends/Free Days page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=unscheduled-sleep) — same check.

---

## 5. Fix Scrolling Issue Past 10:00

**Your feedback:** "Having trouble scrolling down beyond 10:00."

**What changed:** Fixed the hour dropdown so all 12 hours (1–12) are scrollable without clipping.

**Verify:** [Open Work/School Nights page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=scheduled-sleep) — click any hour dropdown and scroll through all 12 options.

---

## 6. Cut Redundant Narcolepsy Question

**Your feedback:** "Cut redundant narcolepsy question."

**What changed:** Removed the "I have been diagnosed with narcolepsy or hypersomnia" checkbox from the Daytime Functioning page. Narcolepsy diagnosis is now captured through the Sleep Disorder History checklist on page 3.

**Verify:** [Open Daytime Functioning page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=daytime) — scroll past the weakness/cataplexy questions and confirm the narcolepsy checkbox is gone.

---

## 7. AM/PM Defaults and Logical Zone Warnings

**Your feedback:** "Leave default bedtime as PM and default wake time as AM for both weekday and weekends. Is it possible to add an error detector if bedtimes and wake times are not in logical zone?"

**What changed:**
- Bedtime fields now default to PM, wake time fields default to AM.
- If someone accidentally sets their bedtime to AM (daytime hours) or their wake time to PM (nighttime hours), a warning message appears asking them to double-check.

**Verify:** [Open Work/School Nights page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=scheduled-sleep) — select an hour for bedtime, then change the AM/PM to "AM" to see the warning appear.

---

## 8. Conditional Work/School Schedule Question

**Your feedback:** "Please make this question a pop-up if prior was affirmative. Also make schedule start time AM default."

**What changed:** The "what time do you have to be at work/school?" question now only appears when the user selects "early" or "late" chronotype preference (or shift work). It is hidden when "flexible" is selected. The time defaults to AM.

**Verify:** [Open Sleep Preferences page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=chronotype) — select "I have no preference and have a flexible sleep schedule" and confirm the work/school time question disappears. Select "early" or "late" and it reappears.

---

## 9. Cut Redundant Parasomnia Diagnosis

**Your feedback:** "Cut, I have been diagnosed with a parasomnia — p. 9 redundant."

**What changed:** Removed the "I have been diagnosed with a parasomnia" checkbox and all its follow-up fields (parasomnia type, treatment). Parasomnia diagnosis is captured through the Sleep Disorder History checklist on page 3.

**Verify:** [Open Sleep Behaviors page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=parasomnia) — confirm the diagnosis checkbox and follow-up fields are gone.

---

## 10. Cut Nightmare Contributing Factors

**Your feedback:** "Cut questions below and add number of nightmares/week....and suggest nightmare disorder in report if two or more times/week."

**What changed:** Removed the "Contributing Factors" section (TBI, medications, behavioral health, sleep aversion checkboxes). The nightmare frequency question ("How many nights a week do you have nightmares?") remains, and the report flags a possible nightmare disorder when the frequency is 2 or more per week.

**Verify:** [Open Nightmares page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=nightmares) — confirm "Contributing Factors" section is gone. The nightmare frequency question is still visible.

---

## 11. Report Text Updates

**Your feedback:** Updated text for several report sections.

**What changed — Inline Alerts (shown during questionnaire):**

- **Room for Improvement** (Bedroom) — Replaced bullet list with: "We provide several recommendations to improve your sleep by improving the comfort of your bedroom."
  - [Verify on Bedroom page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=bedroom) (set comfort sliders low to trigger the alert)

- **Sleep-Related Anxiety Detected** — Updated to: "It's likely that anxiety and worry are interfering with your ability to surrender to sleep at night..."
  - [Verify on Mental Health page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=mental-health)

- **Sleep Effort Paradox** — Replaced bullet list with: "The harder you try to sleep, the more elusive it becomes. Sleep is a passive process that cannot be forced. We will provide you with some free tips to fall asleep with ease."
  - [Verify on Mental Health page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=mental-health)

- **Significant Sleep Impact on Daily Life** — Updated to: "Based on your answers, your sleep difficulties are significantly impacting your daily functioning. In your personalized sleep report we will provide you with a probable diagnosis and recommendations on next step to address your sleep problems."
  - [Verify on Mental Health page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=mental-health)

- **Mental Health Resources** — Added: "We will provide link to more information in your personalized report."
  - [Verify on Mental Health page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=mental-health)

**What changed — Report (final page):**

- **Mental Health Support Available** (Next Steps) — Updated to: "Your nightmares may be related to trauma and you endorsed symptoms of anxiety. Trauma-related nightmares improve with specialized therapy. Visit our website for resources on finding appropriate mental health support for nightmares and other mental health challenges."

- **SomnaHealth Services** (Resources) — Updated to: "Our team offers sleep education that addresses the specific problems that we have identified in this report. We also have a staff of sleep coaches and board certified sleep doctor who can support you with evidence based treatments including CBT-I and consultation regarding the best treatment approaches..."

- [Verify on Report page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=report) — scroll to "Next Steps" and "Resources" sections.

---

## 12. Remove "Personalized" from Recommendations Header

**Your feedback:** "Cut — personalized — in recommendations (we want the whole report to seem personalized)."

**What changed:** The section header was changed from "Personalized Recommendations" to "Recommendations." The word "personalized" was kept in body text where you explicitly wrote it (e.g., "In your personalized report...").

**Verify:** [Open Report page](https://sleep-questionnaire-sasha-bayans-projects.vercel.app/dev?section=report) — scroll to the recommendations section and confirm the header says "Recommendations" without "Personalized."
