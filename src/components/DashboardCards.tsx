import { DashboardStats } from '../types/subscriptions';
import { getDaysUntilRenewal } from '../lib/analytics';

export function TotalBleedCard({ stats }: { stats: DashboardStats }) {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-slate-300 text-sm font-medium">Annual Total Bleed</h2>
        <span className="text-red-400 text-sm">💸 Money leaving</span>
      </div>
      <div className="text-4xl font-bold mb-4">${stats.totalAnnual.toLocaleString()}</div>
      <div className="flex items-center gap-4 text-sm text-slate-400">
        <span>${stats.totalMonthly.toFixed(2)}/month</span>
        <span className="text-slate-600">•</span>
        <span>{stats.subscriptionCount} subscriptions</span>
      </div>
    </div>
  );
}

export function StatCard({ title, value, subtitle, icon }: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-500 text-sm">{title}</span>
        <span className="text-lg">{icon}</span>
      </div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      {subtitle && <div className="text-xs text-slate-400 mt-1">{subtitle}</div>}
    </div>
  );
}

export function RenewalCountdown({ subscriptions }: { subscriptions: DashboardStats['upcomingRenewals'] }) {
  if (subscriptions.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">⏰ Renewal Countdown</h3>
        <p className="text-slate-500 text-sm">No renewals in the next 48 hours</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">⏰ Renewal Countdown</h3>
      <div className="space-y-3">
        {subscriptions.map(sub => {
          const days = getDaysUntilRenewal(sub.nextBillingDate);
          return (
            <div key={sub.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold">
                  {sub.logo}
                </div>
                <div>
                  <div className="font-medium text-slate-800">{sub.name}</div>
                  <div className="text-xs text-slate-500">${sub.monthlyCost}/month</div>
                </div>
              </div>
              <div className="text-right">
                <div className={`font-bold ${days <= 1 ? 'text-red-600' : 'text-amber-600'}`}>
                  {days === 0 ? 'Today!' : days === 1 ? 'Tomorrow' : `${days} days`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
