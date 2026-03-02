# Testing Patterns

**Analysis Date:** 2026-03-01

## Test Framework

**Runner (Unit/Component):**
- Jest 30.x - Primary unit and component test runner
- Config: `jest.config.js` in project root
- Environment: `jsdom` (browser-like DOM)
- Transform: `ts-jest` with `tsconfig.jest.json`

**Runner (Storybook):**
- Vitest 3.x - Used exclusively for Storybook component tests
- Config: `vitest.config.ts` (Storybook addon integration)
- Browser: Playwright Chromium (headless)

**Runner (E2E):**
- Cypress 14.x - End-to-end tests against running app
- Config: `cypress.config.ts`, `baseUrl: http://localhost:3000`

**Assertion Library:**
- Jest built-in `expect` + `@testing-library/jest-dom` matchers
- Matchers: `toBeInTheDocument`, `toBe`, `toEqual`, `toThrow`, `toMatchObject`

**Run Commands:**
```bash
pnpm test                              # Run all Jest unit tests
pnpm test:watch                        # Watch mode
pnpm test:coverage                     # Coverage report
pnpm test:e2e                          # Cypress headless run
pnpm test:e2e:open                     # Cypress interactive mode
pnpm storybook                         # Storybook dev (includes Vitest)
```

## Test File Organization

**Location:**
- Unit/component tests: `__tests__/` subdirectory co-located with source
  - `src/lib/__tests__/diagnosis-algorithms.test.ts`
  - `src/components/__tests__/ExampleForm.test.tsx`
- E2E tests: `cypress/e2e/*.cy.ts`
- Custom Cypress commands: `cypress/support/commands.ts`

**Naming:**
- Unit tests: `{module-name}.test.ts` or `{ComponentName}.test.tsx`
- E2E tests: `{feature}.cy.ts`

**Structure:**
```
src/
  lib/
    diagnosis-algorithms.ts
    __tests__/
      diagnosis-algorithms.test.ts
  components/
    ExampleForm.tsx
    __tests__/
      ExampleForm.test.tsx
cypress/
  e2e/
    app.cy.ts
    round3-feedback.cy.ts
  support/
    commands.ts
    e2e.ts
```

## Test Structure

**Suite Organization (Jest):**
```typescript
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('ModuleName', () => {
  describe('functionName', () => {
    it('should handle valid input', () => {
      // arrange
      const input = createBaseQuestionnaireData({ /* overrides */ });

      // act
      const result = functionName(input);

      // assert
      expect(result).toMatchObject({ severity: 'mild' });
    });

    it('should throw on invalid input', () => {
      expect(() => functionName(null)).toThrow('...');
    });
  });
});
```

**Patterns:**
- Factory function `createBaseQuestionnaireData(overrides)` for test fixtures (defined in `diagnosis-algorithms.test.ts`)
- `DeepPartial<QuestionnaireFormData>` type used for override parameter
- Explicit arrange/act/assert structure in complex tests

## Mocking

**Framework:**
- Jest built-in mocking
- `@testing-library/user-event` for simulating user interactions in component tests

**What to Mock:**
- External libraries where needed (date-fns `getYear` imported directly in tests)
- No file system or network mocking currently needed (pure function tests)

**What NOT to Mock:**
- Internal pure functions in `diagnosis-algorithms.ts` — tested directly

## Fixtures and Factories

**Test Data Pattern:**
```typescript
// Factory function in test file - used in diagnosis-algorithms.test.ts
function createBaseQuestionnaireData(
  overrides: Partial<DeepPartial<QuestionnaireFormData>> = {}
): QuestionnaireFormData {
  const base: QuestionnaireFormData = {
    intro: { acceptedDisclaimer: true },
    demographics: {
      yearOfBirth: 1985,
      sex: 'male',
      zipcode: '12345',
      weight: 180,
      height: 70,
    },
    // ... all sections with sensible defaults
  };
  return deepMerge(base, overrides); // custom deep merge utility
}
```

**Location:**
- Factory functions defined at top of test file
- No shared fixtures directory (each test file is self-contained)

## Coverage

**Requirements:**
- No enforced coverage threshold
- Coverage tracked for awareness via `pnpm test:coverage`

**Configuration:**
- Coverage provider: `v8` (configured in `jest.config.js`)
- Collected from: `src/**/*.{ts,tsx}` excluding `*.d.ts`, `*.stories.*`, `index.*`
- Excludes: `.next/`, `node_modules/`, `cypress/`

**View Coverage:**
```bash
pnpm test:coverage
open coverage/index.html
```

## Test Types

**Unit Tests (Jest):**
- Scope: Pure functions and React components in isolation
- Primary focus: `diagnosis-algorithms.ts` — comprehensive clinical logic tests
- Examples: `src/lib/__tests__/diagnosis-algorithms.test.ts`
- Speed: Fast (no DB, no network)

**Component Tests (Jest + RTL):**
- Scope: React component rendering and interaction
- Mocking: No external dependencies needed for current tests
- Examples: `src/components/__tests__/ExampleForm.test.tsx`

**Storybook Tests (Vitest):**
- Scope: Visual component stories
- Location: `src/stories/*.stories.tsx`
- Runner: Vitest with Playwright browser

**E2E Tests (Cypress):**
- Scope: Full user flows against running Next.js app
- Custom command: `cy.navigateToSection(section)` → visits `/dev?section={section}`
- Examples:
  - `cypress/e2e/app.cy.ts` — smoke tests (page loads, form exists)
  - `cypress/e2e/round3-feedback.cy.ts` — regression tests for specific client feedback changes

## Common Patterns

**Async Testing (Jest):**
```typescript
it('should handle async operation', async () => {
  const result = await asyncFunction();
  expect(result).toBe('expected');
});
```

**Error Testing (Jest):**
```typescript
it('should throw on invalid input', () => {
  expect(() => parse(null)).toThrow('Cannot parse null');
});
```

**Cypress Section Navigation:**
```typescript
beforeEach(() => {
  cy.navigateToSection('demographics');
});

it('should show birth year selector', () => {
  cy.contains('button', '1990').click();
  cy.get('[data-radix-popper-content-wrapper]').should('be.visible');
});
```

**Snapshot Testing:**
- Not used in this codebase

---

*Testing analysis: 2026-03-01*
*Update when test patterns change*
