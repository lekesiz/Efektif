# Efektif

AI-powered career orientation platform. Students take psychometric tests (RIASEC, Big Five, Work Values), receive AI-analyzed results, get matched to careers, and build admission dossiers with counselor guidance.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Monorepo | Turborepo + pnpm |
| Frontend | Next.js 15 (App Router), Tailwind CSS, Radix UI |
| Backend | Hono (REST + tRPC) |
| Database | PostgreSQL (Neon) + Drizzle ORM |
| Auth | Better Auth (email/password + OAuth) |
| AI | Anthropic Claude (Haiku + Sonnet) |
| PDF | React-PDF |
| Email | Resend |
| Payments | Stripe |
| i18n | next-intl (FR, EN, TR) |
| Hosting | Vercel |

## Project Structure

```
efektif/
├── apps/
│   ├── web/          # Next.js 15 frontend
│   └── api/          # Hono API server
├── packages/
│   ├── shared/       # Constants, types, questions, career-matcher
│   ├── db/           # Drizzle schema & migrations
│   ├── ai/           # Prompt templates & sanitization
│   ├── pdf/          # React-PDF report templates
│   └── email/        # Resend email templates
└── tooling/
    ├── tsconfig/     # Shared TypeScript configs
    └── eslint/       # Shared ESLint configs
```

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10
- Docker (optional, for local PostgreSQL & Redis)

### Installation

```bash
# Clone the repository
git clone https://github.com/lekesiz/efektif.git
cd efektif

# Install dependencies
pnpm install
```

### Environment Setup

Create `.env.local` files in each app:

```bash
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:3001

# apps/api/.env.local
DATABASE_URL=postgresql://efektif:efektif_dev@localhost:5432/efektif
REDIS_URL=redis://localhost:6379
ANTHROPIC_API_KEY=your_key_here
RESEND_API_KEY=your_key_here
STRIPE_SECRET_KEY=your_key_here
BETTER_AUTH_SECRET=your_secret_here
```

### Local Development

```bash
# Start PostgreSQL and Redis (Docker)
docker compose up -d

# Push database schema
pnpm db:push

# Seed sample data
pnpm db:seed

# Start all apps in development mode
pnpm dev
```

The web app runs at `http://localhost:3000` and the API at `http://localhost:3001`.

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in dev mode |
| `pnpm build` | Build all packages and apps |
| `pnpm lint` | Lint all packages |
| `pnpm check` | TypeScript type checking |
| `pnpm test` | Run all unit tests |
| `pnpm test:e2e` | Run end-to-end tests |
| `pnpm format` | Format code with Prettier |
| `pnpm db:generate` | Generate Drizzle migrations |
| `pnpm db:migrate` | Run database migrations |
| `pnpm db:push` | Push schema to database |
| `pnpm db:studio` | Open Drizzle Studio |
| `pnpm db:seed` | Seed sample data |

## Testing

Unit tests use Vitest. Run them per package or all at once:

```bash
# All tests
pnpm test

# Specific package
pnpm --filter @efektif/shared test
pnpm --filter @efektif/ai test
```

## Deployment

The app deploys to Vercel. Push to `main` triggers automatic deployment.

### Required Environment Variables (Vercel)

- `DATABASE_URL` - Neon PostgreSQL connection string
- `ANTHROPIC_API_KEY` - Claude API key
- `RESEND_API_KEY` - Resend email API key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret
- `BETTER_AUTH_SECRET` - Auth session secret
- `NEXT_PUBLIC_APP_URL` - Production URL

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Run `pnpm check && pnpm lint && pnpm test`
4. Open a pull request

## License

Proprietary - All rights reserved.
