# Active Context: GhostCheck - Subscription Audit Tool

## Current State

**Project Status**: ✅ Phase 1 MVP Complete

GhostCheck is a subscription audit tool that identifies unused subscriptions ("ghosts") by comparing payment data with usage patterns.

## Recently Completed

- [x] Base Next.js 16 setup with App Router
- [x] TypeScript configuration with strict mode
- [x] Tailwind CSS 4 integration
- [x] ESLint configuration
- [x] Memory bank documentation
- [x] Recipe system for common features
- [x] GhostCheck Phase 1 MVP ("Financial Detective")

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/types/subscriptions.ts` | TypeScript types for subscriptions | ✅ |
| `src/lib/data.ts` | Mock transaction & subscription data | ✅ |
| `src/lib/analytics.ts` | Clustering, ghost scoring, renewal logic | ✅ |
| `src/components/StatusBadge.tsx` | Ghost/Warning/Healthy status badges | ✅ |
| `src/components/DashboardCards.tsx` | Total Bleed, Stat Cards, Renewal Countdown | ✅ |
| `src/components/SubscriptionList.tsx` | All subscriptions list with status | ✅ |
| `src/app/page.tsx` | Main dashboard | ✅ |

## Features Implemented

### Phase 1: Financial Detective (MVP)
- **Transaction Clustering**: Groups similar merchants (e.g., "ADOBE *PHOTOG" + "ADOBE *CREATIVE")
- **Renewal Countdown**: Shows subscriptions renewing in next 48 hours
- **The Total Bleed**: Annual cost dashboard ($1,400/year in mock data)
- **Ghost Detection**: Uses decay function Score = Usage_Days(Last_30) / Cost_Per_Month
- **Vampire Alert**: Highlights unused subscriptions with potential savings

## Current Focus

Working application with mock data. Next steps:
1. Add real Plaid API integration for transaction data
2. Add browser extension for usage tracking
3. Add email receipt scraping

## Session History

| Date | Changes |
|------|---------|
| Initial | Template created with base setup |
| Mar 2026 | Built GhostCheck Phase 1 MVP |

## Pending Improvements

- [ ] Add Plaid API integration
- [ ] Add browser extension for usage tracking
- [ ] Add email receipt scraper
- [ ] Add direct cancellation deep links
- [ ] Add virtual card integration (Privacy.com)
