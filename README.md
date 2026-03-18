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

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: Drizzle ORM (SQLite)
- **Auth**: NextAuth.js (Google OAuth)
- **Package Manager**: Bun

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
| `ENCRYPTION_SECRET` | Token encryption key |
| `OPENAI_API_KEY` | OpenAI API key (optional) |
| `SENTRY_DSN` | Sentry DSN (optional) |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth.js routes
│   │   ├── cron/zombie-alerts/   # Daily zombie check
│   │   ├── email-usage/          # Gmail API
│   │   ├── negotiate/            # LLM negotiation
│   │   └── plaid/                # Plaid integration
│   ├── auth/
│   │   ├── signin/               # Sign-in page
│   │   └── error/                # Error page
│   ├── privacy/                  # Privacy Policy
│   ├── terms/                    # Terms of Service
│   ├── page.tsx                 # Main dashboard
│   └── layout.tsx               # Root layout
├── components/
│   ├── ActionButtons.tsx         # Kill & Downgrade buttons
│   ├── DashboardCards.tsx        # Total Bleed, Stat Cards
│   ├── OnboardingEmptyState.tsx  # Welcome flow
│   ├── PlaidLink.tsx            # Bank connection
│   ├── SmartNegotiator.tsx      # AI negotiation
│   ├── Sparkline.tsx             # Usage trends
│   ├── StatusBadge.tsx          # Status indicators
│   ├── SubscriptionList.tsx      # Subscription list
│   ├── TrialShield.tsx           # Trial tracking
│   └── ui/toaster.tsx           # Toast notifications
├── db/
│   ├── index.ts                 # Database client
│   ├── schema.ts                # Table definitions
│   └── migrate.ts               # Migration runner
├── lib/
│   ├── analytics.ts              # Clustering, scoring
│   ├── data.ts                  # Mock data
│   ├── encryption.ts             # AES-256 token encryption
│   └── toast.ts                 # Toast utilities
├── types/
│   └── subscriptions.ts          # TypeScript interfaces
├── auth.ts                       # NextAuth config
└── sentry.client.config.ts       # Sentry config
```

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

## Testing

See [TESTING.md](./TESTING.md) for:
- Plaid Sandbox credentials
- Google OAuth test user setup
- CRON job manual triggers
- Integration checklist

## API Integrations

### Plaid
- Connects to bank accounts via Plaid Link
- Fetches transactions via `/api/plaid/transactions`
- Sandbox mode available for testing

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
- Tokens are encrypted at rest
- No sensitive data stored in plain text
- See [Privacy Policy](./src/app/privacy/page.tsx)

## License

MIT

---

Built with 🔮 by GhostCheck
