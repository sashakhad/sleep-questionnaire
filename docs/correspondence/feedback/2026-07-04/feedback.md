# SleepQ Feedback - 2026-07-04

Source: `docs/correspondence/feedback/2026-07-04/response-7.4.docx`
(original: `/Users/sashamusic/Downloads/response 7.4 dl.docx`)

This file converts Danny's 7/4 response document into a readable implementation reference. It responds to the Round 4 sign-off items and adds a substantial new block of requirements (healthy-sleeper verbiage, subclinical sleep-health recommendations, and explicit thresholds for several domains). The document is text-only (no screenshots).

Clinician wording, thresholds, and report copy are preserved verbatim where they carry clinical meaning. Typos in the source are left intact and flagged where they may need clarification.

---

## Part 1 — Sign-offs and tweaks on Round 4 items

### B1 — COMISA / OSA

**Approved.** No change requested.

### B2 — Pain-related sleep problem (minor tweak)

Refine the split between a pain-only sleep problem and chronic fatigue / fibromyalgia:

- **Sleep-related pain problem only:** pain > 4 nights/week (or above 4 on a 0-10 scale) **plus** fatigue < 7 **and** tiredness < 7.
- **Chronic Fatigue or Fibromyalgia syndromes:** pain > 4 **plus** tiredness ≥ 7 **and** fatigue ≥ 7.

> Verbatim: "pain >4/week/ or above 4 on a scale of 10 plus and <7 fatigue and < 7 tiredness can stay as sleep related pain problems only. Pain>4 plus >/=7 tiredness and fatigue can be -- Chronic Fatigue or Fibromyalgia syndromes."

_Note: cross-check against the "Modify chronic fatigue" line in Part 3 (fatigue 7+ on >4 days/week) for consistency._

### B3 — Sleep medication

**Approved.** No change requested.

### B5 — Add differential for insomnia vs. DSPD (and narcolepsy)

Add a three-way differential across **insomnia**, **DSPD**, and **narcolepsy**.

- **Narcolepsy requires:** EDS ≥ 7.

**Probable Insomnia** path:
- Anchor question: "I've tried, but I cannot fall asleep during the day."
- Report: "Based on your responses, you have some symptoms of DSPD but are more likely struggling with insomnia."

**Probable DSPD** path:
- Insomnia differential: wake at night ≤ 1; weekday mid-sleep time vs. midday(?) sleep time ≥ 1 hour.
- Narcolepsy differential: EDS ≤ 5.
- Report: "Based on your response, you have some symptoms of insomnia, but are most likely struggling with DSPD."

> Verbatim: "Probable DSPD / Insomnia differential - Wake at night </=1, Midsleep time weekday < Midday sleep time >/= 1hour. / EDS </=5 narcolepsy differential."

_Clarify: "Midsleep time weekday < Midday sleep time >/= 1hour" is ambiguous — confirm the intended weekday-vs-weekend mid-sleep comparison and direction._

### D1 — Circadian rhythm / DSPD trigger

Fire the DSPD/circadian output when **all** of:
- Chronotype preference is greater than a mild evening preference, **and**
- Mid-sleep time > 3:30 AM, **and**
- Weekday mid-sleep time − weekend mid-sleep time (difference).

> Verbatim: "fire when chronotype preference - >mild evening preference, Mid-sleep time>330am and weekday mid-sleeptime-weekend mid-sleeptime sleeptime"

_Clarify: the weekday−weekend mid-sleep term has no threshold/operator in the source — confirm the cutoff (e.g., ≥ 1 hour) and direction._

### D2 — Average 24-hour sleep (calculation)

Total sleep formula:

```
Total sleep = (naps #/week × approximate nap time / 5)
            + ((weekday hours/night × 5 + weeknight × 2) / 7)
```

> Verbatim: "Total sleep=(naps # week x approximate naptime / 5) + ((weekday hours/nightx5 +weeknightx2)/7)"

_Clarify: the second term uses "weekday hours/night × 5" and "weeknight × 2" — the ×2 term is presumably weekend nights. Confirm weekday vs. weekend labeling so the weighting is right._

### D3 — Clinical sign-off on new thresholds

Danny notes the above resolves the outstanding Round 4 sign-off request. Recap of what still needs confirmation (from our Round 4 note):

> Items B1, B2, B3 were implemented with our best clinical interpretation to stop the over-triggering. Please confirm the exact criteria (or adjust): the COMISA objective-insomnia gate, the chronic-fatigue pain-anchored rule, and the medication list + 3-nights/week cutoff. The narcolepsy screen sensitivity is also still open for input.

---

## Part 2 — New: Sleep health recommendations (subclinical / healthy sleepers)

Danny flags that there is currently almost no verbiage for optimizing sleep health in subclinical presentations, and considers this essential. These recommendations are provided **whether or not** the respondent has a sleep disorder.

**Report verbiage — option 1 (Healthy Sleeper):**

> We are impressed with your general sleep health. We have not identified any sleep disorders or domains in which you need guidance on your sleep health. We still encourage you to go to these links on our website to learn basics about maintaining exceptional sleep health that you can share with friends and family. Much of this information is captured in our Seven Sleep Health Principles (website link). We can guarantee that you will find much of this information both novel and fascinating.

**Report verbiage — option 2 (has symptoms / areas to improve):**

> We have identified symptoms of a sleep disorder and some areas in which you can improve your sleep. Much of this information is captured in our Seven Sleep Health Principles (website link). We can guarantee that you will find much of this information both novel and fascinating.

### Pop-up — age under 25

> Between 9 and 25 years of age there is a biological tendency to stay up later and wake up later. This results in difficulty waking in the morning, sleeping late on weekends and may conflict with school or work schedules. In your sleep report you will receive information on this sleep problem and guidance on next steps to improve your sleep health and quality of life.

---

## Part 3 — Key domain algorithms, thresholds, and report copy

### Signs of insufficient sleep

Trigger when **either**:
- Average TST < 6.5 hours on > 1 night/week, **or**
- Average TST ≥ 6.5 hours and < 8 hours on ≥ 4 days/week **with** daytime tiredness ≥ 5, fatigue > 4, **or** sleepiness > 4.

**Report:**

> Optimal sleep is more than 6.5 hours and when sleep is less than 8 hours a night and there are signs of daytime tiredness and attention problems it is optimal to increase total sleep time. There are individual differences in sleep need and it is important to know and follow your needs. You can try increasing your sleep time for a week and observe the quality of your sleep and changes in your daytime functioning. Please go to our website [] for more information on determining optimal sleep duration for you.

### Sleep timing variability (following your internal body clock)

Trigger when **either**:
- Mid-sleep time varies > 44 minutes on week nights, and/or ≥ 1 hour average difference between weeknights and weekends, **or**
- Bedtime varies by > 1 hour/night on week nights.

**Report:**

> Regular timing of your sleep schedule is even more important than optimal sleep duration. Your schedule suggests that there is a moderate to high level of variability in your sleep timing. You can try a more regular sleep schedule for a week and see how you feel. Please go to our website for more information on optimizing your sleep timing based on your natural preference, called chronotype and general sleep habits.

### Chronotype preferences

- **Evening chronotype (owl):** avg mid-sleep time > 4:00 AM on weeknights **and** > 5:00 AM on weekend nights.
- **Morning chronotype (lark):** avg mid-sleep time < 1:00 AM on weeknights.
- **Centered chronotype (crow):** all others.

**Report:**

> Based on your schedule you appear to be [an evening chronotype, owl-like, with a preference for a later bedtime and later wake time; a morning chronotype, lark-like, with a preference for an earlier bedtime and earlier wake time; or a central, "crow-like" chronotype]. Whatever type you fall into, it is always important to strive for a regular sleep schedule with less than 30 minutes change night-to-night on weekdays and less than one hour on weekends. When your weeknight sleep time differs from your weekend sleep time you have social jetlag. More information on healthy sleep timing, chronotypes and circadian rhythms are on our website.

---

## Part 4 — Additional adjustments and open items

- **EDS definitions:** split at `< 7` and `≥ 7`. Double-check the calculations.
- **Insomnia — daytime criteria:** require 2+ (and possibly change thresholds).
- **RLS core disorder:** same as pop-up. Narcolepsy vs. IH — include cataplexy(?) and other REM intrusion symptoms.
- **Modify chronic fatigue:** fatigue 7+ on > 4 days/week.
- **Insufficient answers threshold:** when too few questions are answered, show a message such as: "Thank you for completing the questionnaire. You did not answer a sufficient number of questions for us to generate an accurate report."
- **Restless legs:** cut the introductory description of Restless Legs Syndrome; it should only appear in the pop-up.

---

## Open questions to confirm with Danny

1. **B5 differential:** exact meaning of "Midsleep time weekday < Midday sleep time >/= 1hour" (weekday vs. weekend comparison and direction).
2. **D1 DSPD trigger:** threshold/operator for the weekday−weekend mid-sleep difference term.
3. **D2 formula:** confirm weekday vs. weekend labeling in the second term (the `×5` / `×2` split).
4. **B2 vs. chronic fatigue:** reconcile B2 ("fatigue ≥ 7 and tiredness ≥ 7") with Part 3 ("fatigue 7+ on > 4 days/week") — is the day-count required in both, and is tiredness ≥ 7 also required?
5. **Insomnia daytime criteria:** which specific thresholds change, beyond requiring 2+.
6. **Narcolepsy vs. IH:** which REM-intrusion items (cataplexy, sleep paralysis, hypnagogic hallucinations) to add and how they gate the differential.
7. **Website links:** several report blocks reference "[]" / "(website link)" placeholders to be filled in.
