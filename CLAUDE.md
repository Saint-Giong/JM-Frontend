# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DEVision Job Manager Frontend - a Next.js 16 recruitment platform for the SGJM Team. Uses the App Router with React 19.

## Commands

```bash
bun dev          # Start development server (localhost:3000)
bun run build    # Production build
bun lint         # ESLint
bun run ff       # Format with Biome
bun test         # Run Vitest in watch mode
bun test:run     # Run tests once
```

## Architecture

### Route Groups
- `app/(auth)/` - Authentication pages (login, signup, forgot-password). Redirects to `/dashboard` if logged in.
- `app/(dashboard)/` - Protected pages requiring auth. Redirects to `/login` if not authenticated.
- `app/(legal)/` - Public legal pages (terms, privacy)

### Key Directories
- `components/headless/` - Headless UI components with Zustand stores for state (form, combobox, country-phone, button)
- `components/applicant/` - Applicant search and display components
- `components/job/` - Job posting components and forms
- `components/layout/` - App sidebar and mobile navigation
- `hooks/` - Custom React hooks for data fetching and search logic
- `stores/` - Zustand stores (auth with localStorage persistence)
- `lib/` - HTTP client utilities (`http.ts` for HttpClient class, `fetcher.ts` for React Query integration)
- `mocks/` - **All mock data must be placed here** - Centralized location for development mock data

### State Management
- Zustand for global state (auth store with `persist` middleware for localStorage)
- Auth state includes hydration handling to prevent flash of unauthenticated content
- React Query (`@tanstack/react-query`) for server state

### UI Library
Uses `@saint-giong/bamboo-ui` (Shadcn UI compatible, initialized from Shadcn CLI). Import client components from `@saint-giong/bamboo-ui/client` and include `@saint-giong/bamboo-ui/globals.css`.

### Styling
- Tailwind CSS v4 with PostCSS
- Biome handles Tailwind class sorting via `useSortedClasses` rule (use `cn()` utility for class merging)
- Font: Familjen Grotesk

### Path Aliases
`@/*` maps to project root (e.g., `@/components`, `@/hooks`, `@/stores`)

## Code Style

- Biome for formatting (2 spaces, single quotes, trailing commas ES5)
- ESLint with Next.js core-web-vitals and TypeScript configs
- Use Zod for schema validation

## Component Guidelines

### File Organization
- **Keep files small** (~50-150 lines) - Break large components into focused sub-components
- **Co-locate route components** - Page-specific components go in `_components/` folders within route directories
- **Barrel exports** - Use `index.ts` files to re-export components from directories
- **Types file** - Define component-specific types in a `types.ts` file within the component folder

### Headless Component Pattern
**All components must follow the headless component architecture.** This pattern separates state management from presentation, enabling reusability and testability.

Follow the established pattern in `components/headless/`:

1. **stores.ts** - Zustand store factories (e.g., `createComboboxStore<T>()`)
2. **hooks.ts** - Custom hooks that consume stores and return props objects (e.g., `inputProps`, `getOptionProps()`)
3. **types.ts** - Component-specific type definitions
4. **Component.tsx** - Presentational wrapper using React Context to provide store
5. **index.ts** - Barrel exports for clean imports

Example structure:
```
components/headless/combobox/
├── stores.ts      # createComboboxStore<T>()
├── hooks.ts       # useCombobox({ items, filterFn, onSelect })
├── types.ts       # ComboboxItem, ComboboxProps, etc.
├── index.ts       # barrel exports
```

**Best Practices:**
- Keep stores minimal - only essential state and actions
- Hooks should return props objects ready to spread onto elements
- Use React Context to provide store access to child components
- Presentational components should have zero business logic

### Form Components
- Separate form logic into `use-*-form.ts` hooks (see `components/job/form/use-job-form.ts`)
- Form hook returns: `formData`, `errors`, field setters, `handleSubmit`
- Parent component handles submission, child form handles validation/state

### Component Composition
- Extract selectors/pickers into separate components (e.g., `EmploymentTypeSelector`, `SalaryFormatSelector`)
- Use render props or compound components for complex UIs
- Keep presentational components pure - logic lives in hooks

## Coding Patterns

### Conditional Rendering
**Avoid nested ternary operators.** For complex conditional scenarios, use map-based approaches or early returns.

```tsx
// BAD - Nested ternary
{status === 'loading' ? <Spinner /> : status === 'error' ? <Error /> : status === 'empty' ? <Empty /> : <Content />}

// GOOD - Map-based approach
const statusComponents = {
  loading: <Spinner />,
  error: <Error />,
  empty: <Empty />,
  success: <Content />,
} as const;

{statusComponents[status]}

// GOOD - Early returns in component
function StatusDisplay({ status }: { status: Status }) {
  if (status === 'loading') return <Spinner />;
  if (status === 'error') return <Error />;
  if (status === 'empty') return <Empty />;
  return <Content />;
}
```

## Verification Requirements

**After making any code changes, always run the following commands to ensure everything works:**

```bash
bun lint         # Run ESLint - must pass with no errors
bun run build    # Run production build - must complete successfully
```

Both commands must complete without errors before considering a task complete. Fix any lint errors or build failures before finishing.
