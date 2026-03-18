import { analyzeSubscriptions } from '../lib/analytics';
import { TotalBleedCard, StatCard, RenewalCountdown } from '../components/DashboardCards';
import { SubscriptionList } from '../components/SubscriptionList';

export default function Home() {
  const stats = analyzeSubscriptions();
  
  const tierSavings = stats.subscriptions
    .filter(s => s.suggestedTier)
    .reduce((sum, s) => sum + (s.suggestedTier?.savings || 0), 0);
  
  const ghostSavings = stats.subscriptions
    .filter(s => s.status === 'ghost')
    .reduce((sum, s) => sum + s.monthlyCost * 12, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-slate-800 to-slate-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800">GhostCheck</h1>
                <p className="text-xs text-slate-500">Find & kill unused subscriptions</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 text-sm rounded-lg flex items-center gap-1.5">
                <span>📧</span> Gmail: Not connected
              </span>
              <span className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm rounded-lg">
                Mock Data
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <TotalBleedCard stats={stats} />
          <StatCard 
            title="Monthly Bleed" 
            value={`$${stats.totalMonthly.toFixed(2)}`}
            subtitle="This month"
            icon="📉"
          />
          <StatCard 
            title="Ghost Subscriptions" 
            value={stats.ghostCount}
            subtitle="Not used in 30+ days"
            icon="👻"
          />
          <StatCard 
            title="Potential Savings" 
            value={`$${(ghostSavings + tierSavings * 12).toFixed(0)}`}
            subtitle="$/year if optimized"
            icon="💰"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SubscriptionList subscriptions={stats.subscriptions} />
          </div>
          <div>
            <RenewalCountdown subscriptions={stats.upcomingRenewals} />
            
            <div className="mt-6 bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
              <h3 className="text-lg font-semibold text-slate-800 mb-3">💀 Vampire Alert</h3>
              {stats.ghostCount > 0 ? (
                <div className="space-y-2">
                  {stats.subscriptions
                    .filter(s => s.status === 'ghost')
                    .map(ghost => (
                      <div key={ghost.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{ghost.name}</span>
                        <span className="font-semibold text-red-600">${(ghost.monthlyCost * 12).toFixed(0)}/yr</span>
                      </div>
                    ))}
                  <div className="pt-2 mt-2 border-t border-red-200">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800">Cancel Savings</span>
                      <span className="text-red-600">${ghostSavings.toFixed(0)}/yr</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">No ghost subscriptions detected!</p>
              )}
            </div>

            {tierSavings > 0 && (
              <div className="mt-6 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-3">⬇️ Tier Optimization</h3>
                <div className="space-y-2">
                  {stats.subscriptions
                    .filter(s => s.suggestedTier && s.status !== 'ghost')
                    .map(sub => (
                      <div key={sub.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-700">{sub.name}</span>
                        <span className="font-semibold text-amber-600">-${sub.suggestedTier?.savings}/mo</span>
                      </div>
                    ))}
                  <div className="pt-2 mt-2 border-t border-amber-200">
                    <div className="flex items-center justify-between font-bold">
                      <span className="text-slate-800">Downgrade Savings</span>
                      <span className="text-amber-600">${(tierSavings * 12).toFixed(0)}/yr</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 bg-slate-800 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">🔌 Data Sources</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Bank Transactions</span>
                  <span className="text-green-400">✓ Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Gmail Activity</span>
                  <span className="text-amber-400">Setup Required</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Browser Extension</span>
                  <span className="text-slate-400">Not installed</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
