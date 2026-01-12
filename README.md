# DEVision Job Manager - Frontend

The frontend application for the **Job Manager Subsystem** of the DEVision platform, developed by the SGJM Team as part of the EEET2582/ISYS3461 course at RMIT University.

## About SGJM Team

**Saint Giong** (Thánh Gióng) is one of the four immortal heroes in Vietnamese folklore, symbolizing strength, strategic thinking, and community support — values that guide our development approach.

## Frontend Team

| Name | Role | Student ID |
|------|------|------------|
| Vo Hoang Phuc | Frontend Leader | S3926761 |
| Nguyen Le Thuc Quynh | Frontend Developer | S3924993 |

## Links

- **JM Frontend**: [jm.saintgiong.ttr.gg](https://jm.saintgiong.ttr.gg)
- **JM Docs**: [docs.jm.saintgiong.ttr.gg](https://docs.jm.saintgiong.ttr.gg)
- **JM Storybook**: [storybook.saintgiong.ttr.gg](https://storybook.saintgiong.ttr.gg)
- **JA Frontend**: [ja.saintgiong.ttr.gg](https://ja.saintgiong.ttr.gg)

---

## System Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                              Frontend                                    │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │  Next.js 16    │  │  React 19    │  │   Zustand   │  │ React Query │  │
│  │  (App Router)  │  │              │  │ (Auth Store)│  │  (Server)   │  │
│  └───────┬────────┘  └──────────────┘  └─────────────┘  └─────────────┘  │
│          │                                                               │
│          ▼                                                               │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                    API Layer (lib/api, lib/http)                   │  │
│  │  • HttpClient class with type-safe methods                         │  │
│  │  • React Query integration via fetcher utilities                   │  │
│  │  • Development proxy for CORS bypass                               │  │
│  └───────┬────────────────────────────────────────────────────────────┘  │
└──────────┼───────────────────────────────────────────────────────────────┘
           │ REST API
           ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       Backend (JM-CompanyProfileService)                 │
│  ┌────────────────┐  ┌──────────────┐  ┌─────────────┐  ┌─────────────┐  │
│  │ Spring Boot    │  │  Spring JPA  │  │   Kafka     │  │   Eureka    │  │
│  │   3.5.7        │  │ (PostgreSQL) │  │  (Events)   │  │  (Service   │  │
│  │                │  │              │  │             │  │  Discovery) │  │
│  └────────────────┘  └──────────────┘  └─────────────┘  └─────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| [Next.js](https://nextjs.org) | 16.1.1 | React framework with App Router |
| [React](https://react.dev) | 19.2.3 | UI library |
| [React Query](https://tanstack.com/query) | 5.90.12 | Server state management |
| [Zustand](https://zustand.docs.pmnd.rs) | 5.0.9 | Client state management |
| [Tailwind CSS](https://tailwindcss.com) | 4.1.18 | Utility-first CSS |
| [Zod](https://zod.dev) | 4.2.1 | Schema validation |
| [Biome](https://biomejs.dev) | 2.3.10 | Formatting & linting |
| [@saint-giong/bamboo-ui](https://www.npmjs.com/package/@saint-giong/bamboo-ui) | 0.5.1 | UI component library |
| [Stripe](https://stripe.com/) | 20.1.0 | Payment Methods API |

### Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Spring Boot | 3.5.7 | Microservice framework |
| Spring Data JPA | - | Data persistence |
| Spring Security | - | Authentication |
| Spring Kafka | - | Event streaming |
| Spring Cloud | 2025.0.1 | Microservice infrastructure |
| PostgreSQL | - | Primary database |

---

## Core Features

- **Applicant Search** - Advanced filtering by location, education, experience, skills
- **Company Authentication** - SSO-enabled login with Google OAuth
- **Job Posting Management** - Create and manage job postings with skills tagging
- **Payment Processing** - Handle payment transactions
- **Premium Subscriptions** - Manage premium subscription services
- **Profile Management** - Company profile CRUD operations

---

## Directory Structure

```
JM-Frontend/
├── app/                    # Next.js App Router
│   ├── (auth)/             # Auth pages (login, signup, forgot-password)
│   ├── (dashboard)/        # Protected routes (require authentication)
│   └── (legal)/            # Public legal pages
├── components/             # React components
│   ├── headless/           # Headless UI with Zustand state
│   ├── applicant/          # Applicant search components
│   ├── job/                # Job posting components
│   └── layout/             # App navigation & layout
├── hooks/                  # Custom React hooks
│   ├── use-applicant-search.ts
│   ├── use-company.ts
│   └── use-job-list.ts
├── stores/                 # Zustand global stores
│   └── auth.ts             # Auth with localStorage persistence
├── lib/                    # Utilities & API layer
│   ├── api/                # API configuration
│   ├── http.ts             # HTTP client class
│   └── fetcher.ts          # React Query integration
└── mocks/                  # Development mock data
```

---

## Architectural Approaches

### State Management

- **Client State**: Zustand with `persist` middleware for `localStorage`
- **Server State**: React Query for caching, background refetching, and optimistic updates
- **Auth Hydration**: Prevents flash of unauthenticated content on page load

### API Layer

- **HttpClient**: Type-safe wrapper around `fetch` with timeout handling and structured errors
- **Development Proxy**: Routes through `/api/proxy/*` to bypass CORS during development
- **Production**: Direct API calls to configured `NEXT_PUBLIC_API_BASE_URL`

### Component Architecture

- **Headless Pattern**: State logic separated from presentation
- **Co-located Routes**: Page-specific components in `_components/` folders
- **Barrel Exports**: Clean imports via `index.ts` files

### Backend Communication

- **REST API**: Standard CRUD operations via JSON
- **Validation**: Zod schemas (frontend) + Jakarta Validation (backend)
- **Error Handling**: Structured errors with field-level details for form validation

---

## Getting Started

### Prerequisites

- Node.js 18+ or [Bun](https://bun.sh)
- Docker (for backend dependencies)

### Frontend Development

```bash
# Install dependencies
bun install

# Start development server
bun dev:frontend
```

Open [https://localhost:3000](https://localhost:3000) to view the app.

### Backend Development

```bash
bun dev:backend
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start development server (localhost:3000) |
| `bun run build` | Production build |
| `bun lint` | Run ESLint |
| `bun run ff` | Format with Biome |
| `bun test` | Run Vitest in watch mode |
| `bun test:run` | Run tests once |
| `bun test:coverage` | Run tests with coverage |
| `bun run backend:profile` | Start backend with Docker |

---

## Environment Variables

```bash
# .env.local
NODE_TLS_REJECT_UNAUTHORIZED=0NEXT_PUBLIC_USE_MOCK_WS=true
NEXT_PUBLIC_API_BASE_URL=https://localhost:8072
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51Sgfu3PXF4YUJlw8ggSJUVzHBadfKrnOFvIch7BVH2xy76VOyM16N0YQYGpX7LrYfCEKNOs0QDtvujJ5HT528hzA002bfOwKF1
```

---

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest/docs)
- [Zustand Documentation](https://zustand.docs.pmnd.rs)
- [Project Documentation](https://docs.jm.saintgiong.ttr.gg)

---

## Deployment

The frontend is deployed on [Vercel](https://vercel.com). See [vercel.json](./vercel.json) for configuration.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
