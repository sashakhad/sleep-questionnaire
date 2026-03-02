# Coding Conventions

**Analysis Date:** 2026-03-01

## Naming Patterns

**Files:**
- `PascalCase.tsx` for React components (`QuestionnaireForm.tsx`, `DaytimeSection.tsx`, `CheckboxField.tsx`)
- `camelCase.ts` or `kebab-case.ts` for library/utility modules (`auth.ts`, `diagnosis-algorithms.ts`)
- `*.test.ts` / `*.test.tsx` for Jest unit tests, placed in `__tests__/` subdirectory
- `*.cy.ts` for Cypress E2E tests in `cypress/e2e/`
- `*.stories.tsx` for Storybook stories in `src/stories/`

**Functions:**
- `camelCase` for all functions and methods
- `handleEventName` pattern for event handlers (`handleSubmit`, `handleSectionChange`)
- Function declarations preferred over arrow functions for components (per workspace rules)

**Variables:**
- `camelCase` for variables and parameters
- `UPPER_SNAKE_CASE` for exported constants (`THRESHOLDS`, `EDS_WEIGHTS`, `SESSION_COOKIE_NAME`)
- No underscore prefix for private members

**Types:**
- `PascalCase` for interfaces and type aliases (`QuestionnaireData`, `SeverityLevel`, `EDSResult`)
- No `I` prefix on interfaces
- `PascalCase` for Zod schema exports (`daytimeSchema`, `questionnaireSchema` — exception: camelCase for schemas)

## Code Style

**Formatting:**
- Prettier 3.x with `.prettierrc.json`
- 100 character line length (`printWidth: 100`)
- Single quotes for strings (`singleQuote: true`)
- JSX single quotes (`jsxSingleQuote: true`)
- Semicolons required (`semi: true`)
- 2-space indentation (`tabWidth: 2`)
- Trailing commas: ES5 (`trailingComma: "es5"`)
- Arrow function parens: avoid when single param (`arrowParens: "avoid"`)
- Tailwind class sorting via `prettier-plugin-tailwindcss`

**Linting:**
- ESLint 9.x with flat config (`eslint.config.mjs`)
- Extends `eslint-config-next`, `next/core-web-vitals`, `next/typescript`
- Key rules enforced:
  - `@typescript-eslint/no-explicit-any: error` — no `any` types
  - `@typescript-eslint/no-unused-vars: error` (args with `_` prefix ignored)
  - `prefer-const: error`
  - `no-var: error`
  - `no-console: warn` (allows `console.warn` and `console.error`)
  - `eqeqeq: error` — always use `===`
  - `no-eval: error`, `no-implied-eval: error`

## Import Organization

**Order:**
1. External packages (`react`, `next`, `zod`, etc.)
2. Internal modules via `@/` alias (`@/components/ui/button`, `@/lib/utils`)
3. Relative imports (`./form-fields/CheckboxField`, `../sections/`)
4. Type imports (`import type { Metadata }`)

**Path Aliases:**
- `@/*` maps to `./src/*` (configured in `tsconfig.json`)
- `@/components/*`, `@/lib/*`, `@/types/*`, `@/validations/*` all resolve to `src/`

## Error Handling

**Patterns:**
- API routes: try/catch wrapping all logic, `console.error` before returning error response
- Error responses: `NextResponse.json({ error: string }, { status: N })`
- Zod errors: detected by `error.name === 'ZodError'`, return 400
- Client components: check `response.ok`, set local error state string

**Error Types:**
- No custom Error subclasses — plain `Error` with descriptive messages
- Async functions use try/catch, not `.catch()` chains

## TypeScript Patterns

**Strict Mode:**
- `strict: true` in `tsconfig.json`
- `noUncheckedIndexedAccess: true` — array access returns `T | undefined`
- `exactOptionalPropertyTypes: true` — optional props must be explicitly `undefined`

**Type Assertions:**
- Minimal casting; `as unknown as object` used in Prisma `rawData` field (necessary for JSON type)
- `as` casts avoided except where required by library types

**Generics:**
- Form field components use generic `name` parameter tied to `QuestionnaireFormData` keys
- `UseFormReturn<QuestionnaireFormData>` passed as `form` prop to section components

## React Patterns

**Components:**
- Function declarations (not arrow functions) per workspace rules
- `'use client'` directive for interactive components with state/effects
- Props interfaces defined inline above component (`interface XProps {}`)
- Destructured props with defaults where applicable

**Form Pattern:**
- React Hook Form with `zodResolver` for all forms
- Single `useForm<QuestionnaireFormData>` instance in `QuestionnaireForm` passed down to sections
- `<Form>`, `<FormField>`, `<FormItem>`, `<FormLabel>`, `<FormControl>`, `<FormMessage>` from shadcn/ui

**Conditional Rendering:**
- `&&` for simple conditional rendering
- Ternary for two-branch conditions
- `cn()` utility for conditional Tailwind classes

## Comments

**When to Comment:**
- Explain clinical thresholds and algorithm rationale (`diagnosis-algorithms.ts` has extensive JSDoc)
- Document non-obvious business rules
- `IMPORTANT:` prefix for critical notes (e.g., threshold constants for clinical staff)
- Avoid obvious comments

**JSDoc/TSDoc:**
- Used in `diagnosis-algorithms.ts` for public functions
- Section headers with `// ===...===` dividers used in large files

**TODO Comments:**
- Not currently present in codebase

## Module Design

**Exports:**
- Named exports for all components and utilities
- No default exports except Next.js page components (required by framework)
- `export function` for components, `export const` for constants and schemas

**Barrel Files:**
- Not used — imports are direct to file paths

---

*Convention analysis: 2026-03-01*
*Update when patterns change*
