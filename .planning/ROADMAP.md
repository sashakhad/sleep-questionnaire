# Roadmap: Comprehensive Cypress E2E Test Suite

## Overview

Build a comprehensive Cypress end-to-end test suite for the sleep questionnaire application, progressing from shared test infrastructure through section-by-section coverage, validation and conditional logic, client feedback regression, API/report verification, and admin dashboard testing. Each phase delivers a coherent, independently verifiable set of tests that run against the existing app at `http://localhost:3000`.

## Domain Expertise

None

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Test Infrastructure & Navigation** - Shared utilities, custom commands, and navigation test suite
- [ ] **Phase 2: Full Questionnaire Flow** - End-to-end 16-section walkthrough with realistic data
- [ ] **Phase 3: Form Validation** - Required fields, birth year range, and time field format tests
- [ ] **Phase 4: Conditional Logic** - Shift work, work/school, nightmare, pain, and leg cramp conditionals
- [ ] **Phase 5: Client Feedback Regression** - All 12 round-3 feedback items verified
- [ ] **Phase 6: API & Report Tests** - CSV export, PDF generation, and diagnosis report verification
- [ ] **Phase 7: Admin Dashboard** - Admin login flow, response list, and CSV export

## Phase Details

### Phase 1: Test Infrastructure & Navigation
**Goal**: Establish shared test utilities, enhance custom commands, and verify navigation (Previous/Continue buttons, progress bar, section jumping via dev sidebar)
**Depends on**: Nothing (first phase)
**Research**: Unlikely (Cypress already configured, established patterns in existing test files)
**Plans**: 3 plans

Plans:
- [ ] 01-01: Shared test utilities and assertion helpers
- [ ] 01-02: Custom command enhancements (improve `navigateToSection`, add form helpers)
- [ ] 01-03: Navigation test suite (Previous/Continue, progress bar, section jumping)

### Phase 2: Full Questionnaire Flow
**Goal**: Navigate all 16 sections end-to-end with realistic data, verify each section renders correctly
**Depends on**: Phase 1
**Research**: Unlikely (navigating existing UI with established custom commands)
**Plans**: 3 plans

Plans:
- [ ] 02-01: Sections intro through daytime (sections 1-4)
- [ ] 02-02: Sections scheduled-sleep through parasomnia (sections 5-9)
- [ ] 02-03: Sections nightmares through report (sections 10-16)

### Phase 3: Form Validation
**Goal**: Test that required fields block navigation, birth year range is capped, and time field formats are enforced
**Depends on**: Phase 1
**Research**: Unlikely (testing existing Zod validation, standard Cypress assertions)
**Plans**: 3 plans

Plans:
- [ ] 03-01: Intro validation (disclaimer checkbox required)
- [ ] 03-02: Demographics validation (yearOfBirth, sex, zipcode required; birth year range cap)
- [ ] 03-03: Time field format validation across sections

### Phase 4: Conditional Logic
**Goal**: Verify conditional field visibility — shift work questions, work/school time hiding, nightmare follow-ups, pain severity, leg cramp frequency
**Depends on**: Phase 1
**Research**: Unlikely (testing existing conditional UI, standard Cypress visibility assertions)
**Plans**: 4 plans

Plans:
- [ ] 04-01: Shift work conditional questions
- [ ] 04-02: Work/school time conditional (hides when "flexible" chosen)
- [ ] 04-03: Nightmare and parasomnia conditional follow-ups
- [ ] 04-04: Pain severity and leg cramp frequency conditionals

### Phase 5: Client Feedback Regression
**Goal**: Verify all 12 items from `docs/correspondence/round-3-edits/CHANGES-IMPLEMENTED.md` are correctly implemented
**Depends on**: Phase 1
**Research**: Unlikely (verifying documented changes against existing UI, regression testing)
**Plans**: 3 plans

Plans:
- [ ] 05-01: Items 1-4 (birth year range, OSA/RLS removal, planned nap removal, 0-minute fall asleep)
- [ ] 05-02: Items 5-8 (hour picker scrolling, narcolepsy removal, AM/PM defaults and warnings, conditional work/school)
- [ ] 05-03: Items 9-12 (parasomnia diagnosis removal, nightmare factors removal, report text updates, "Personalized" removal)

### Phase 6: API & Report Tests
**Goal**: Test CSV export and PDF generation endpoints via `cy.request()`, and verify diagnosis report renders correct sections based on mock data
**Depends on**: Phase 2
**Research**: Unlikely (cy.request() is standard Cypress, testing existing API routes and report rendering)
**Plans**: 3 plans

Plans:
- [ ] 06-01: CSV export endpoint (GET /api/responses/csv — headers, content-type, format)
- [ ] 06-02: PDF generation endpoint (POST /api/generate-pdf — content-type, response blob)
- [ ] 06-03: Report generation (pre-fill mock data, verify diagnosis sections and updated text)

### Phase 7: Admin Dashboard
**Goal**: Test admin login flow, paginated response list, and CSV download from admin panel
**Depends on**: Phase 1
**Research**: Unlikely (testing existing admin UI with HMAC session auth, patterns established in earlier phases)
**Plans**: 3 plans

Plans:
- [ ] 07-01: Admin login flow (HMAC session auth)
- [ ] 07-02: Admin response list (pagination, data display)
- [ ] 07-03: Admin CSV export (download from admin panel)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Test Infrastructure & Navigation | 0/3 | Not started | - |
| 2. Full Questionnaire Flow | 0/3 | Not started | - |
| 3. Form Validation | 0/3 | Not started | - |
| 4. Conditional Logic | 0/4 | Not started | - |
| 5. Client Feedback Regression | 0/3 | Not started | - |
| 6. API & Report Tests | 0/3 | Not started | - |
| 7. Admin Dashboard | 0/3 | Not started | - |
