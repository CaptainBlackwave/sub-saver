# Active Context: GhostCheck - Subscription Audit Tool

## Current State

**Project Status**: ✅ Phase 4 Complete

GhostCheck is a subscription audit tool that identifies unused subscriptions ("ghosts") by comparing payment data with usage patterns.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] GhostCheck Phase 1 MVP ("Financial Detective")
- [x] Phase 2: Kill buttons, tier optimization, retention risk
- [x] Phase 3: Sparklines, Zombie Alerts, Category Stack, Found Money
- [x] Phase 4: Trial Shield, Smart Negotiator, Health Score, Goal Tracker

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/types/subscriptions.ts` | TypeScript types for subscriptions | ✅ |
| `src/lib/data.ts` | Mock transaction & subscription data | ✅ |
| `src/lib/analytics.ts` | Clustering, ghost scoring, renewal logic | ✅ |
| `src/components/StatusBadge.tsx` | Ghost/Warning/Healthy status badges | ✅ |
| `src/components/DashboardCards.tsx` | Total Bleed, Stat Cards, Renewal Countdown | ✅ |
| `src/components/SubscriptionList.tsx` | All subscriptions list with status | ✅ |
| `src/components/Sparkline.tsx` | Usage trend visualization | ✅ |
| `src/components/ActionButtons.tsx` | Kill & Downgrade buttons | ✅ |
| `src/components/TrialShield.tsx` | Trial tracking & Goal tracker | ✅ |
| `src/components/SmartNegotiator.tsx` | AI negotiation script generator | ✅ |
| `src/app/page.tsx` | Main dashboard | ✅ |
| `src/app/api/email-usage/route.ts` | Gmail API placeholder | ✅ |

## Features Implemented

### Phase 1: Financial Detective (MVP)
- **Transaction Clustering**: Groups similar merchants
- **Renewal Countdown**: Shows subscriptions renewing in next 48 hours
- **The Total Bleed**: Annual cost dashboard
- **Ghost Detection**: Uses decay function Score = Usage_Days / Cost_Per_Month
- **Vampire Alert**: Highlights unused subscriptions

### Phase 2: Executioner
- **Kill this Ghost button**: Opens direct cancellation URL
- **Tier Optimization**: Suggests cheaper plans
- **Retention Risk Score**: Predicts which subs are about to become ghosts

### Phase 3: Hardening
- **Usage Sparklines**: 60-day usage trend visualization
- **Zombie Alert**: Detects charges after cancellation
- **The Stack**: Category spending breakdown
- **Found Money**: Tracks savings from cancelled subscriptions

### Phase 4: Autonomous
- **Trial Shield**: Tracks free trials with expiry alerts (Claude Pro, Figma)
- **Smart Negotiator**: Generates custom negotiation scripts for high-churn-risk subs
- **Portfolio Health Score**: Single metric (S = 100 × (1 - Wasted/Total))
- **Goal Tracker**: Progress bar toward savings goals (Vacation Fund: $2,000)

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| Mar 2026 | Built GhostCheck Phase 1 MVP |
| Mar 2026 | Phase 2: Kill buttons, tier optimization |
| Mar 2026 | Phase 3: Sparklines, Zombie Alerts, Stack View |
| Mar 2026 | Phase 4: Trial Shield, Negotiator, Health Score |

## Pending Improvements

- [ ] Add Plaid API integration
- [ ] Add Gmail OAuth flow
- [ ] Add browser extension for usage tracking
- [ ] Add virtual card integration (Privacy.com)
- [ ] Add push notifications
