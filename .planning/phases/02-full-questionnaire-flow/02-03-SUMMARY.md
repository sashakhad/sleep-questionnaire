---
phase: 02-full-questionnaire-flow
plan: 03
status: complete
completed: 2026-03-02
---

# Summary: sections-nightmares-report.cy.ts

## What Was Done

Created `cypress/e2e/sections-nightmares-report.cy.ts` with 7 describe blocks covering the final 7 questionnaire sections (nightmares, chronotype, sleep-hygiene, bedroom, lifestyle, mental-health, report) using the `/dev` route with pre-filled mock data. This completes full Phase 2 coverage of all 16 sections.

## Tasks Completed

### Task 1: Nightmares, Chronotype, and Sleep Hygiene sections
- Created `cypress/e2e/sections-nightmares-report.cy.ts`
- Nightmares: 6 tests verifying dream recall checkbox (checked), dream recall info alert (remembersDreams=true), "Understanding Dreams vs Nightmares" definitions, nightmare frequency and trauma fields (hasNightmares=true), less-frequent nightmares info (nightmaresPerWeek=1, <2), and no "Possible Nightmare Disorder" warning
- Chronotype: 8 tests verifying preference radio (morning/night/flexible options), preference strength field (late chronotype), shift work checkbox (unchecked), past shift work years field (shiftWork=false), time zone travel checkbox, work/school time field (late preference), and Night Owl Chronotype warning
- Sleep Hygiene: 5 tests verifying supplements checklist (Melatonin/Benadryl/Magnesium), prescription meds checklist (Benzodiazepines/Z-drugs/Orexin blockers), stimulants and nicotine fields, and no prescription medication warning (prescriptionMeds=[])

### Task 2: Bedroom, Lifestyle, Mental Health, and Report sections (appended)
- Bedroom: 5 tests verifying all four rating sliders, overall score display (7.0 "Good, but room for improvement"), and no poor environment, light, or noise warnings (all scores ≥4)
- Lifestyle: 6 tests verifying caffeine section with time field (caffeinePerDay=2, ≥1), alcohol section, exercise section with duration and end time (exerciseDaysPerWeek=3), late caffeine warning (lastCaffeineTime=14:00), and no high caffeine/alcohol warnings
- Mental Health: 8 tests verifying worry/anxiety checkboxes, cancel activities radio group, medical conditions checklist, mental health conditions checklist, sleep-related anxiety warning (worriesAffectSleep+anxietyInBed=true), significant sleep impact warning (cancelsAfterPoorSleep='1-2week'), and sleep effort paradox alert (timeInBedTrying=true)
- Report: 3 tests verifying section title, report content renders without error, and no Continue button on final section

## Bugs Fixed

- **Same checkbox `.siblings()` issue as plan 02-02** — Fixed `cy.contains('label', text).siblings(...)` to use `closest('[data-slot="form-item"]').find('button[role="checkbox"]')` for dream recall and shift work checkboxes.

## Results

- 41/41 tests passing
- Full Phase 2 complete: all 16 questionnaire sections have E2E rendering tests
- Combined Phase 2 total: 94/94 tests passing (24 + 29 + 41)

## Commits

- `test(02-03): add nightmares through report section rendering tests` — 6c74a92
- `fix(02-02,02-03): fix checkbox state assertions to use correct DOM traversal` — e3d27b0
