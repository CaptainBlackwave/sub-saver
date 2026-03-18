# GhostCheck - Subscription Audit Tool

Find and eliminate unused subscriptions before they become ghosts.

![GhostCheck Dashboard](https://via.placeholder.com/800x400?text=GhostCheck+Dashboard)

## Features

### Phase 1: Financial Detective
- **Transaction Clustering** - Groups similar merchants (e.g., "ADOBE *PHOTOG" + "ADOBE *CREATIVE")
- **Renewal Countdown** - Shows subscriptions renewing in next 48 hours
- **The Total Bleed** - Annual cost dashboard showing total subscription spend
- **Ghost Detection** - Uses decay function to identify unused subscriptions
- **Vampire Alert** - Highlights subscriptions with potential savings

### Phase 2: Executioner
- **Kill this Ghost** - One-click cancellation deep-links
- **Tier Optimization** - Suggests cheaper plans (e.g., Adobe Photography: $35/mo savings)
- **Retention Risk Score** - Predicts which subs are about to become ghosts

### Phase 3: Hardening
- **Usage Sparklines** - 60-day usage trend visualization
- **Zombie Alert** - Detects charges after cancellation
- **The Stack** - Category spending breakdown with insights
- **Found Money** - Tracks savings from cancelled subscriptions

### Phase 4: Autonomous
- **Trial Shield** - Tracks free trials with expiry alerts
- **Smart Negotiator** - AI-powered negotiation script generator
- **Portfolio Health Score** - Single metric: `S = 100 × (1 - Wasted/Total)`
- **Goal Tracker** - Progress bar toward savings goals

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
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

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── email-usage/       # Gmail API placeholder
│   ├── page.tsx              # Main dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ActionButtons.tsx     # Kill & Downgrade buttons
│   ├── DashboardCards.tsx     # Total Bleed, Stat Cards
│   ├── SmartNegotiator.tsx    # Negotiation script generator
│   ├── Sparkline.tsx          # Usage trend visualization
│   ├── StatusBadge.tsx        # Status indicators
│   ├── SubscriptionList.tsx   # Subscription list
│   └── TrialShield.tsx        # Trial tracking & Goal tracker
├── lib/
│   ├── analytics.ts           # Clustering, scoring, analytics
│   └── data.ts               # Mock transaction data
└── types/
    └── subscriptions.ts       # TypeScript interfaces
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

## API Integrations (Coming Soon)

- **Plaid** - Bank transaction data
- **Gmail** - Email activity tracking
- **Browser Extension** - Usage monitoring

## License

MIT

---

Built with 🔮 by GhostCheck
