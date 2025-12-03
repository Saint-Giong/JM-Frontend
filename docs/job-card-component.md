# Job Card Component

A headless, composable job card component built with Zustand for state management.

---

## What?

The Job Card component is a **headless UI component** that displays job posting information in the DEVision Job Manager application. It follows the headless component architecture pattern, separating business logic from presentation.

### Key Features

- **Headless Architecture**: Logic and state are decoupled from UI rendering
- **Zustand State Management**: Each card instance has its own scoped Zustand store
- **Composable Parts**: Build custom layouts using primitive components
- **Render Props**: Flexible rendering via render prop pattern
- **Type-Safe**: Full TypeScript support with exported types

### Component Structure

```
components/job/
├── job-card-store.ts      # Zustand store factory
├── job-card-context.tsx   # Provider and hooks
├── job-card-parts.tsx     # Headless UI primitives
├── job-card.tsx           # Default styled composition
└── index.ts               # Public exports
```

### Data Model

```typescript
interface Job {
  id: string;
  title: string;
  description: string;
  status: 'archived' | 'draft' | 'hiring' | 'published';
  applicants: number;
  hasNewApplicants?: boolean;
  postedAt: string;
  deadline: string;
  location: string;
  jobType: string;
  salaryMin: number;
  salaryMax: number;
  currency: string;
  skills: string[];
  tags: string[];
}
```

---

## Why?

### 1. Separation of Concerns

Traditional components tightly couple state, logic, and presentation. This makes them:
- Hard to test
- Difficult to customize
- Prone to prop drilling

**Headless architecture solves this** by exposing behavior through hooks while letting consumers control rendering.

### 2. Zustand over React Context

| Aspect | React Context | Zustand |
|--------|---------------|---------|
| Re-renders | All consumers on any change | Only affected selectors |
| Boilerplate | Provider + Context + hooks | Single store |
| DevTools | Limited | Redux DevTools support |
| Performance | Can cause cascading updates | Optimized subscriptions |

### 3. Composability

Instead of a monolithic component with dozens of props:

```tsx
// Monolithic approach
<JobCard
  showStatus={true}
  showApplicants={true}
  statusPosition="top"
  applicantsBadgeColor="red"
  // ... 20 more props
/>
```

Compose exactly what you need:

```tsx
// Composable approach
<JobCardProvider job={job}>
  <JobCardStatus>{(status) => <MyCustomBadge status={status} />}</JobCardStatus>
  <JobCardTitle />
  <JobCardMeta>{(meta) => <CustomMetaDisplay {...meta} />}</JobCardMeta>
</JobCardProvider>
```

### 4. Reusability

The same headless primitives power:
- Grid view cards
- List view rows
- Modal previews
- Search result items

---

## How?

### Basic Usage

Use the pre-styled `JobCard` component for quick implementation:

```tsx
import { JobCard, type Job } from '@/components/job';

const job: Job = {
  id: '1',
  title: 'Software Engineer',
  description: 'Build amazing products...',
  status: 'published',
  applicants: 25,
  hasNewApplicants: true,
  postedAt: '2 days ago',
  deadline: '30 December 2025',
  location: 'Ho Chi Minh City, Vietnam',
  jobType: 'Full-time',
  salaryMin: 50000,
  salaryMax: 100000,
  currency: 'USD',
  skills: ['React', 'TypeScript'],
  tags: ['Remote', 'Senior'],
};

function MyComponent() {
  return (
    <JobCard
      job={job}
      onEdit={(job) => console.log('Edit:', job.id)}
      onMenuAction={(action, job) => console.log(action, job.id)}
    />
  );
}
```

### Custom Composition

Build a custom card layout using headless primitives:

```tsx
import {
  JobCardProvider,
  JobCardStatus,
  JobCardTitle,
  JobCardDescription,
  JobCardMeta,
  JobCardEditButton,
} from '@/components/job';

function CustomJobCard({ job, onEdit }) {
  return (
    <JobCardProvider job={job} onEdit={onEdit}>
      <div className="custom-card">
        <header>
          <JobCardStatus>
            {(status, label) => (
              <span className={`badge badge-${status}`}>{label}</span>
            )}
          </JobCardStatus>
          <JobCardEditButton className="edit-btn">
            Edit
          </JobCardEditButton>
        </header>

        <JobCardTitle as="h2" className="title" />
        <JobCardDescription className="desc" />

        <JobCardMeta>
          {(meta) => (
            <footer>
              <span>{meta.location}</span>
              <span>{meta.salary.formatted}</span>
            </footer>
          )}
        </JobCardMeta>
      </div>
    </JobCardProvider>
  );
}
```

### Using Zustand Selectors

For optimal performance, use selectors to subscribe to specific state:

```tsx
import { useJobCardStore } from '@/components/job';

function JobApplicantCount() {
  // Only re-renders when applicants change
  const applicants = useJobCardStore((state) => state.job?.applicants);
  const hasNew = useJobCardStore((state) => state.job?.hasNewApplicants);

  return (
    <div>
      {applicants} applicants
      {hasNew && <span className="new-badge" />}
    </div>
  );
}
```

### Available Primitives

| Component | Description |
|-----------|-------------|
| `JobCardProvider` | Wraps children with Zustand store |
| `JobCardRoot` | Container div wrapper |
| `JobCardStatus` | Renders job status badge |
| `JobCardApplicants` | Renders applicant count |
| `JobCardTitle` | Renders job title |
| `JobCardDescription` | Renders job description |
| `JobCardSkills` | Renders skills list |
| `JobCardTags` | Renders tags list |
| `JobCardMeta` | Renders metadata (location, salary, etc.) |
| `JobCardEditButton` | Edit action button |
| `JobCardMenuButton` | Menu action button |

### Available Hooks

| Hook | Description |
|------|-------------|
| `useJobCard()` | Returns `{ job, edit, menuAction }` |
| `useJobCardStore(selector)` | Zustand selector for fine-grained subscriptions |
| `useJobCardContext()` | Optional version that returns `null` outside provider |
| `useJobData()` | Returns raw job data |

---

## Screenshots

### Grid View

> Add screenshot: `docs/screenshots/job-card-grid.png`

![Job Cards Grid View](./screenshots/job-card-grid.png)

*Job cards displayed in a 4-column responsive grid layout*

### Card States

> Add screenshot: `docs/screenshots/job-card-states.png`

![Job Card States](./screenshots/job-card-states.png)

*Different status badges: Archived (dark), Draft (gray), Hiring (lime), Published (green)*

### List View

> Add screenshot: `docs/screenshots/job-card-list.png`

![Job Cards List View](./screenshots/job-card-list.png)

*Job cards displayed in vertical list layout*

### Mobile Responsive

> Add screenshot: `docs/screenshots/job-card-mobile.png`

![Job Cards Mobile](./screenshots/job-card-mobile.png)

*Responsive layout on mobile devices*

---

## Related

- [Frontend Architecture](/docs/architecture.md)
- [Zustand State Management](https://zustand-demo.pmnd.rs/)
- [Headless UI Pattern](https://www.merrickchristensen.com/articles/headless-user-interface-components/)
