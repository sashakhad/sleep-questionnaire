---
phase: 02-full-questionnaire-flow
plan: 02
status: complete
completed: 2026-03-02
---

# Summary: sections-sleep-parasomnia.cy.ts

## What Was Done

Created `cypress/e2e/sections-sleep-parasomnia.cy.ts` with 5 describe blocks covering the middle batch of questionnaire sections (scheduled-sleep, unscheduled-sleep, breathing-disorders, restless-legs, parasomnia) using the `/dev` route with pre-filled mock data.

## Tasks Completed

### Task 1: Scheduled Sleep and Unscheduled Sleep sections
- Created `cypress/e2e/sections-sleep-parasomnia.cy.ts`
- Scheduled Sleep: 10 tests verifying all form fields (lights-out time, varies radio, time to fall asleep, night wakeups, minutes awake, wake/get-out-of-bed times, early wakeup days, alarm clock), hidden wakeup reasons (nightWakeups=2, not >2), and no AM/PM warning for 23:00 bedtime
- Unscheduled Sleep: 4 tests verifying section title, natural sleep patterns info box, all form fields, and hidden wakeup reasons (nightWakeups=1)

### Task 2: Breathing Disorders, Restless Legs, and Parasomnia sections (appended)
- Breathing Disorders: 5 tests verifying all symptom checkboxes, snoring checked with mock data, dry mouth visible+checked (mouthBreathes=true), and breathing disorder warning alert
- Restless Legs: 5 tests verifying section title, RLS info alert, all symptom checkboxes, no RLS warning (all symptoms false), and no leg cramp frequency field (legCramps=false)
- Parasomnia: 5 tests verifying section title, unusual behaviors alert, night behavior checkboxes, hidden follow-up questions (nightBehaviors=[]), and bedwetting checkbox

## Bugs Fixed

- **Checkbox state assertions using `.siblings()`** — Changed from `cy.contains('label', text).siblings('button[role="checkbox"]')` to `cy.contains(text).closest('[data-slot="form-item"]').find('button[role="checkbox"]')` because `CheckboxField` wraps the checkbox in `FormControl` (not as a direct sibling of the label).

## Results

- 29/29 tests passing
- No modifications to existing test files

## Commits

- `test(02-02): add scheduled-sleep through parasomnia section rendering tests` — 3cf06c3
- `fix(02-02,02-03): fix checkbox state assertions to use correct DOM traversal` — e3d27b0
