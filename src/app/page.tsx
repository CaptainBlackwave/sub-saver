'use client';

import { useState } from 'react';
import { analyzeSubscriptions, detectZombieCharges } from '../lib/analytics';
import { TotalBleedCard, StatCard, RenewalCountdown } from '../components/DashboardCards';
import { SubscriptionList } from '../components/SubscriptionList';
import { TrialShield, GoalTracker } from '../components/TrialShield';
import { OnboardingEmptyState } from '../components/OnboardingEmptyState';

export default function Home() {
  const [isOnboarded, setIsOnboarded] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('ghostcheck_onboarded') === 'true';
  });

  const handleOnboardingComplete = () => {
    localStorage.setItem('ghostcheck_onboarded', 'true');
    setIsOnboarded(true);
  };

  if (!isOnboarded) {
    return <OnboardingEmptyState onComplete={handleOnboardingComplete} />;
  }

  const stats = analyzeSubscriptions();
  const zombieAlerts = detectZombieCharges();
  
  const tierSavings = stats.subscriptions
    .filter(s => s.suggestedTier)
    .reduce((sum, s) => sum + (s.suggestedTier?.savings || 0), 0);
  
  const ghostSavings = stats.subscriptions
    .filter(s => s.status === 'ghost')
    .reduce((sum, s) => sum + s.monthlyCost * 12, 0);

  const potentialTotalSavings = ghostSavings + tierSavings * 12;

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
              <button 
                onClick={() => {
                  localStorage.removeItem('ghostcheck_onboarded');
                  setIsOnboarded(false);
                }}
                className="px-3 py-1.5 text-slate-500 hover:text-slate-700 text-sm"
              >
                Reconnect
              </button>
              <span className="px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg flex items-center gap-1.5">
                <span>✓</span> Connected
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-8">
          <div className="md:col-span-2">
            <TotalBleedCard stats={stats} />
          </div>
          <StatCard 
            title="Health Score" 
            value={stats.healthScore}
            subtitle={stats.healthScore >= 70 ? 'Excellent' : stats.healthScore >= 40 ? 'Needs work' : 'Critical'}
            icon="💚"
          />
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
            title="Found Money" 
            value={`$${stats.foundMoneyTotal.toFixed(0)}`}
            subtitle="Already saved"
            icon="🎯"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <SubscriptionList subscriptions={stats.subscriptions} />
          </div>
          <div>
            <RenewalCountdown subscriptions={stats.upcomingRenewals} />
            
            {zombieAlerts.length > 0 && (
              <div className="mt-6 bg-gradient-to-br from-red-100 to-red-50 rounded-xl p-6 border-2 border-red-300">
                <h3 className="text-lg font-semibold text-red-800 mb-3">🧟 Zombie Alert!</h3>
                <div className="space-y-3">
                  {zombieAlerts.map((alert, idx) => (
                    <div key={idx} className="bg-white rounded-lg p-3 border border-red-200">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-slate-800">{alert.subscriptionName}</span>
                        <span className="font-bold text-red-600">${alert.originalCharge.toFixed(2)}</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        Charged {alert.daysSinceCancel} days after cancel
                      </div>
                      <button className="mt-2 w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg">
                        Dispute Charge
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            <div className="mt-6 bg-white rounded-xl p-6 border border-slate-200">
              <h3 className="text-lg font-semibold text-slate-800 mb-4">📊 The Stack</h3>
              <div className="space-y-3">
                {stats.categorySpending.map(cat => (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-slate-700">{cat.category}</span>
                      <span className="font-semibold text-slate-800">${cat.totalMonthly.toFixed(0)}/mo</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-slate-800 rounded-full"
                        style={{ width: `${(cat.totalMonthly / stats.totalMonthly) * 100}%` }}
                      />
                    </div>
                    {cat.insight && (
                      <p className="text-xs text-slate-500 mt-1">{cat.insight}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <TrialShield trials={stats.trials} />

            <GoalTracker 
              goalName={stats.goalProgress.goalName}
              targetAmount={stats.goalProgress.targetAmount}
              currentAmount={stats.goalProgress.currentAmount}
              percentComplete={stats.goalProgress.percentComplete}
              ghostsNeeded={stats.goalProgress.ghostsNeeded}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
