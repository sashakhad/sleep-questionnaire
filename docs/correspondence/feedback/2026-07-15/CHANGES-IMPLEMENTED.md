# Round 6 Feedback (7/15) — Changes Implemented

This is the change log for Danny’s **July 15 glitch report**. Short round: validation + mobile time-picker UX.

**Status tags:** <span class="review-tag review-tag--done">Done</span>

> Links open on `/dev` with sample data (review only). Relative links work on whatever build you are viewing.

---

<a id="sol-zero"></a>

### Sleep onset / WASO “0 minutes” blocked the report

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** “answer of 0 for sleep onset latency generates an error… the report did not generate.”

**What changed:** The UI already offered “0 minutes” (since Round 3), but the server schema rejected `'0'`, so Generate Report returned 400. Zod, TypeScript types, and the tuning profile options now accept `'0'` for SOL and WASO (and related minute-increment fields).

**Where to see it:** [Work/School Nights](/dev?section=scheduled-sleep) — pick “0 minutes” for time to fall asleep; no field error. Generate a report on the patient flow (`/`) with SOL = 0 and it should succeed.

---

<a id="time-picker"></a>

### Time picker window stayed open / caffeine & exercise clocks felt glitchy

<span class="review-tag review-tag--done">Done</span>

**Your feedback:** “when times are selected, the window stays up… the clock mechanism for caffeine and exercise were a bit glitchy.”

**What changed:** On mobile, the shared time popover (sleep times, caffeine, exercise) now closes automatically once hour, minute, and AM/PM are all set. Same control is used for caffeine and exercise end times.

**Where to see it:** [Lifestyle](/dev?section=lifestyle) (set caffeine ≥ 1 or exercise days > 0) or any sleep time field on a phone-width viewport.
