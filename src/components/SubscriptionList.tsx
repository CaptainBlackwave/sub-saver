'use client';

import { ClusteredSubscription } from '../types/subscriptions';
import { StatusBadge } from './StatusBadge';
import { KillButton, DowngradeButton } from './ActionButtons';
import { UsageTrend } from './Sparkline';
import { SmartNegotiatorButton } from './SmartNegotiator';
import { getDaysUntilRenewal } from '../lib/analytics';

function getDaysSinceLastUse(lastUsedDate?: string): number {
  if (!lastUsedDate) return 999;
  const now = new Date('2026-03-18');
  const lastUsed = new Date(lastUsedDate);
  return Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));
}

function RiskIndicator({ score }: { score: number }) {
  if (score === 0) return null;
  
  const color = score > 0.5 ? 'text-red-600' : score > 0.25 ? 'text-amber-600' : 'text-green-600';
  const label = score > 0.5 ? 'High churn risk' : score > 0.25 ? 'Declining usage' : 'Stable';
  
  return (
    <span className={`${color} flex items-center gap-1`}>
      <span className="text-xs">📉</span>
      {label}
    </span>
  );
}

export function SubscriptionList({ subscriptions }: { subscriptions: ClusteredSubscription[] }) {
  const sortedSubs = [...subscriptions].sort((a, b) => {
    const statusOrder: Record<string, number> = { zombie: 0, ghost: 1, warning: 2, pending_cancel: 3, active: 4, healthy: 5 };
    return (statusOrder[a.status] ?? 4) - (statusOrder[b.status] ?? 4);
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800">📋 All Subscriptions</h3>
      </div>
      <div className="divide-y divide-slate-100">
        {sortedSubs.map(sub => {
          const daysSinceUse = getDaysSinceLastUse(sub.lastUsedDate);
          const daysUntilRenewal = getDaysUntilRenewal(sub.nextBillingDate);
          const showActions = sub.status === 'ghost' || sub.suggestedTier;
          
          return (
            <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                    {sub.logo}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">{sub.name}</div>
                    <div className="text-sm text-slate-500">{sub.category}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <UsageTrend usageHistory={sub.usageHistory} lastUsedDate={sub.lastUsedDate} />
                  <div className="text-right">
                    <div className="font-bold text-slate-800">${sub.monthlyCost}</div>
                    <div className="text-xs text-slate-500">per month</div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm flex-wrap">
                <span className="text-slate-500">
                  Last used: {daysSinceUse === 999 ? 'Unknown' : daysSinceUse === 0 ? 'Today' : `${daysSinceUse} days ago`}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">
                  Renews in {daysUntilRenewal} days
                </span>
                {sub.riskScore > 0 && (
                  <>
                    <span className="text-slate-400">•</span>
                    <RiskIndicator score={sub.riskScore} />
                  </>
                )}
                {sub.status === 'ghost' && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-red-600 font-medium">
                      ${(sub.monthlyCost * 12).toFixed(2)}/year wasted!
                    </span>
                  </>
                )}
              </div>
              {showActions && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                  {sub.status === 'ghost' && (
                    <KillButton cancelUrl={sub.cancelUrl} subscriptionName={sub.name} />
                  )}
                  {sub.suggestedTier && sub.status !== 'ghost' && (
                    <DowngradeButton tier={sub.suggestedTier} websiteUrl={sub.websiteUrl} />
                  )}
                  {sub.riskScore >= 0.25 && sub.status !== 'ghost' && (
                    <SmartNegotiatorButton subscription={sub} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
