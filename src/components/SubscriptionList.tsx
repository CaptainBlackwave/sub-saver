import { ClusteredSubscription } from '../types/subscriptions';
import { StatusBadge } from './StatusBadge';
import { getDaysUntilRenewal } from '../lib/analytics';

function getDaysSinceLastUse(lastUsedDate?: string): number {
  if (!lastUsedDate) return 999;
  const now = new Date('2026-03-18');
  const lastUsed = new Date(lastUsedDate);
  return Math.floor((now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24));
}

export function SubscriptionList({ subscriptions }: { subscriptions: ClusteredSubscription[] }) {
  const sortedSubs = [...subscriptions].sort((a, b) => {
    const statusOrder = { ghost: 0, warning: 1, active: 2, healthy: 3 };
    return statusOrder[a.status] - statusOrder[b.status];
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
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className="font-bold text-slate-800">${sub.monthlyCost}</div>
                    <div className="text-xs text-slate-500">per month</div>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="text-slate-500">
                  Last used: {daysSinceUse === 999 ? 'Unknown' : daysSinceUse === 0 ? 'Today' : `${daysSinceUse} days ago`}
                </span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-500">
                  Renews in {daysUntilRenewal} days
                </span>
                {sub.status === 'ghost' && (
                  <>
                    <span className="text-slate-400">•</span>
                    <span className="text-red-600 font-medium">
                      ${(sub.monthlyCost * 12).toFixed(2)}/year wasted!
                    </span>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
