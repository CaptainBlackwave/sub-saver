# Active Context: GhostCheck - Subscription Audit Tool

## Current State

**Project Status**: ✅ Phase 3 Complete

GhostCheck is a subscription audit tool that identifies unused subscriptions ("ghosts") by comparing payment data with usage patterns.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] GhostCheck Phase 1 MVP ("Financial Detective")
- [x] Phase 2: Kill buttons, tier optimization, retention risk
- [x] Phase 3: Sparklines, Zombie Alerts, Category Stack, Found Money

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
| `src/app/page.tsx` | Main dashboard | ✅ |
| `src/app/api/email-usage/route.ts` | Gmail API placeholder | ✅ |

## Features Implemented

### Phase 1: Financial Detective (MVP)
- **Transaction Clustering**: Groups similar merchants (e.g., "ADOBE *PHOTOG" + "ADOBE *CREATIVE")
- **Renewal Countdown**: Shows subscriptions renewing in next 48 hours
- **The Total Bleed**: Annual cost dashboard ($1,400/year in mock data)
- **Ghost Detection**: Uses decay function Score = Usage_Days(Last_30) / Cost_Per_Month
- **Vampire Alert**: Highlights unused subscriptions with potential savings

### Phase 2: Executioner
- **Kill this Ghost button**: Opens direct cancellation URL in new tab
- **Tier Optimization**: Suggests cheaper plans (Adobe Photography: $35/mo savings)
- **Retention Risk Score**: Predicts which subs are about to become ghosts

### Phase 3: Hardening
- **Usage Sparklines**: 60-day usage trend visualization on each card
- **Zombie Alert**: Detects charges after cancellation (simulated: Hulu, Gym)
- **The Stack**: Category spending breakdown with insights
- **Found Money**: Tracks actual savings from cancelled subscriptions

## Current Focus

Working application with mock data. Ready for real API integrations:
1. Plaid API for real transaction data
2. Gmail OAuth for email activity
3. Browser extension for usage tracking

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| Mar 2026 | Built GhostCheck Phase 1 MVP |
| Mar 2026 | Phase 2: Kill buttons, tier optimization |
| Mar 2026 | Phase 3: Sparklines, Zombie Alerts, Stack View |

## Pending Improvements

- [ ] Add Plaid API integration
- [ ] Add browser extension for usage tracking
- [ ] Add Gmail OAuth flow
- [ ] Add virtual card integration (Privacy.com)
- [ ] Add push notifications
