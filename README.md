# GhostCheck - Subscription Audit Tool

Find and eliminate unused subscriptions before they become ghosts.

![GhostCheck Dashboard](https://via.placeholder.com/800x400?text=GhostCheck+Dashboard)

## Features

### Phase 1: Financial Detective (MVP)
- **Transaction Clustering** - Groups similar merchants (e.g., "ADOBE *PHOTOG" + "ADOBE *CREATIVE")
- **Renewal Countdown** - Shows subscriptions renewing in next 48 hours
- **The Total Bleed** - Annual cost dashboard showing total subscription spend
- **Ghost Detection** - Uses decay function to identify unused subscriptions
- **Vampire Alert** - Highlights subscriptions with potential savings

### Phase 2: Executioner
- **Kill this Ghost** - One-click cancellation deep-links to service websites
- **Tier Optimization** - Suggests cheaper plans (e.g., Adobe Photography: $35/mo savings)
- **Retention Risk Score** - Predicts which subs are about to become ghosts

### Phase 3: Hardening
- **Usage Sparklines** - 60-day usage trend visualization on each card
- **Zombie Alert** - Detects charges after cancellation
- **The Stack** - Category spending breakdown with insights
- **Found Money** - Tracks savings from cancelled subscriptions

### Phase 4: Autonomous
- **Trial Shield** - Tracks free trials with expiry alerts
- **Smart Negotiator** - AI-powered negotiation script generator (OpenAI/Anthropic)
- **Portfolio Health Score** - Single metric: `S = 100 × (1 - Wasted/Total)`
- **Goal Tracker** - Progress bar toward savings goals

### Phase 5: Integrations
- **Plaid** - Bank transaction sync
- **Google OAuth** - Gmail email activity tracking
- **Drizzle Database** - Persistent storage for users, subscriptions, events, goals, trials
- **Vercel CRON Jobs** - Daily zombie alert checks

### Phase 6: Go-Live
- **Cold Start Onboarding** - Welcome flow for new users
- **Loading States** - Progress indicators during bank sync
- **Environment Documentation** - Complete `.env.example`
- **Testing Guide** - Plaid Sandbox credentials & test scenarios

### Phase 7: Production Ready
- **NextAuth.js** - Google OAuth authentication
- **AES-256-GCM Encryption** - Token security at rest
- **Sonner Toasts** - Error notifications
- **Sentry** - Error monitoring
- **Legal Pages** - Privacy Policy & Terms of Service

### Phase 8: Production Database
- **Turso (libSQL)** - Cloud database for production
- **Multi-Tenant Isolation** - User-scoped database queries
- **Database Branching** - Separate dev/prod databases

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Turso (libSQL) + Drizzle ORM |
| Auth | NextAuth.js (Google OAuth) |
| Security | AES-256-GCM Encryption |
| Hosting | Vercel |
| Package Manager | Bun |

## Getting Started

```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build

# Run linting
bun run lint

# Run type checking
bun run typecheck
```

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
# Required for production
cp .env.example .env.local
```

| Variable | Description |
|----------|-------------|
| `PLAID_CLIENT_ID` | Plaid API client ID |
| `PLAID_SECRET` | Plaid API secret |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `AUTH_SECRET` | NextAuth.js secret |
| `ENCRYPTION_SECRET` | 32-byte token encryption key |
| `TURSO_CONNECTION_URL` | Turso database URL |
| `TURSO_AUTH_TOKEN` | Turso auth token |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `SENTRY_DSN` | Sentry DSN (optional) |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth.js routes
│   │   ├── cron/zombie-alerts/  # Daily zombie check
│   │   ├── email-usage/        # Gmail API
│   │   ├── negotiate/           # LLM negotiation
│   │   └── plaid/              # Plaid integration
│   ├── auth/
│   │   ├── signin/             # Sign-in page
│   │   └── error/              # Error page
│   ├── privacy/                 # Privacy Policy
│   ├── terms/                  # Terms of Service
│   ├── page.tsx                # Main dashboard
│   └── layout.tsx              # Root layout
├── components/
│   ├── ActionButtons.tsx        # Kill & Downgrade buttons
│   ├── DashboardCards.tsx       # Total Bleed, Stat Cards
│   ├── OnboardingEmptyState.tsx # Welcome flow
│   ├── PlaidLink.tsx           # Bank connection
│   ├── SmartNegotiator.tsx     # AI negotiation
│   ├── Sparkline.tsx           # Usage trends
│   ├── StatusBadge.tsx         # Status indicators
│   ├── SubscriptionList.tsx     # Subscription list
│   ├── TrialShield.tsx         # Trial tracking
│   └── ui/toaster.tsx          # Toast notifications
├── db/
│   ├── index.ts                # Database client
│   ├── schema.ts               # Table definitions
│   └── migrate.ts             # Migration runner
├── lib/
│   ├── analytics.ts            # Clustering, scoring
│   ├── data.ts                # Mock data
│   ├── db-queries.ts          # Multi-tenant queries
│   ├── encryption.ts           # AES-256 token encryption
│   └── toast.ts               # Toast utilities
├── types/
│   └── subscriptions.ts       # TypeScript interfaces
├── auth.ts                     # NextAuth config
└── sentry.client.config.ts     # Sentry config
```

## Multi-Tenant Data Isolation

All database queries are scoped to the authenticated user:

```typescript
// ❌ WRONG - Returns all subscriptions (security hole)
const subs = await db.select().from(subscriptions);

// ✅ CORRECT - Returns only user's subscriptions
const subs = await db
  .select()
  .from(subscriptions)
  .where(eq(subscriptions.userId, userId));
```

The `src/lib/db-queries.ts` module provides helper functions:
- `getCurrentUserId()` - Gets authenticated user from session
- `getUserSubscriptions(userId)` - User-scoped subscription query
- `createSubscription(data)` - Auto-assigns userId
- `updateSubscription(id, userId, data)` - Filters by both id AND userId
- `deleteSubscription(id, userId)` - Prevents cross-user deletion

## Architecture

### Ghost Detection Algorithm

```
Score = Usage_Days(Last_30) / Cost_Per_Month
```

- Score = 0 → Pure Ghost
- Score < 0.3 → Warning
- Score > 0.7 → Healthy

### Retention Risk Score

```
Risk = (Usage(31-60) - Usage(1-30)) / Usage(31-60)
```

### Portfolio Health Score

```
S = 100 × (1 - Wasted_Spend / Total_Spend)
```

### Token Encryption

Tokens (Plaid access tokens, Google refresh tokens) are encrypted using AES-256-GCM:

```
Ciphertext = Encrypt(Plaintext, Secret_Key + IV)
```

## Database Setup (Turso)

```bash
# 1. Create a Turso database
brew install/turso/turso
turso db create ghostcheck

# 2. Get connection URL
turso db show ghostcheck

# 3. Use branching for development
turo db branch create dev ghostcheck

# 4. Set environment variables
export TURSO_CONNECTION_URL="libsql://ghostcheck.turso.io"
export TURSO_AUTH_TOKEN="your-token"
```

## Testing

See [TESTING.md](./TESTING.md) for:
- Plaid Sandbox credentials
- Google OAuth test user setup
- CRON job manual triggers
- Integration checklist

## Production Checklist

- [ ] Set up Turso database with branching (dev/prod)
- [ ] Generate ENCRYPTION_SECRET with `openssl rand -base64 32`
- [ ] Configure AUTH_SECRET with `openssl rand -base64 32`
- [ ] Apply for Plaid Production access
- [ ] Add test users in Google Cloud Console
- [ ] Set up Sentry project for error monitoring

## API Integrations

### Plaid
- Connects to bank accounts via Plaid Link
- Fetches transactions via `/api/plaid/transactions`
- Sandbox mode available for testing
- Production access requires Privacy Policy

### Gmail
- OAuth flow for email access
- Scans for subscription-related emails
- Extracts only timestamps (never reads body)

### LLM (Smart Negotiator)
- Uses OpenAI GPT-4 or Anthropic Claude
- Generates custom retention negotiation scripts
- Falls back to template if no API key

## Privacy

- We never read email body content
- Tokens are encrypted at rest using AES-256-GCM
- Multi-tenant isolation prevents data leaks
- No sensitive data stored in plain text
- See [Privacy Policy](./src/app/privacy/page.tsx)

## License

MIT

---

Built with 🔮 by GhostCheck
