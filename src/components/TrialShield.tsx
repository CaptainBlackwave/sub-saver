'use client';

import { TrialSubscription } from '../types/subscriptions';

interface TrialShieldProps {
  trials: TrialSubscription[];
}

export function TrialShield({ trials }: TrialShieldProps) {
  if (trials.length === 0) return null;

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">🛡️ Trial Shield</h3>
        <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
          {trials.length} Active
        </span>
      </div>
      <div className="space-y-3">
        {trials.map(trial => (
          <div key={trial.id} className="p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                  {trial.logo}
                </div>
                <span className="font-medium text-slate-800">{trial.name}</span>
              </div>
              <span className={`text-sm font-bold ${trial.daysUntilExpiry <= 2 ? 'text-red-600' : 'text-green-600'}`}>
                {trial.daysUntilExpiry === 0 ? 'Expires today!' : 
                 trial.daysUntilExpiry === 1 ? '1 day left' : 
                 `${trial.daysUntilExpiry} days left`}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                ${trial.monthlyCostAfterTrial}/mo after trial
              </span>
              <div className="flex gap-2">
                <button className="px-2 py-1 text-xs bg-green-600 hover:bg-green-700 text-white rounded">
                  Keep
                </button>
                <button className="px-2 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-700 rounded">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface GoalTrackerProps {
  goalName: string;
  targetAmount: number;
  currentAmount: number;
  percentComplete: number;
  ghostsNeeded: number;
}

export function GoalTracker({ goalName, targetAmount, currentAmount, percentComplete, ghostsNeeded }: GoalTrackerProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">🎯 Goal Tracker</h3>
      
      <div className="mb-4">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-slate-600">{goalName}</span>
          <span className="font-semibold text-slate-800">${currentAmount} / ${targetAmount}</span>
        </div>
        <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
            style={{ width: `${percentComplete}%` }}
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">
          {percentComplete}% complete
        </span>
        <span className="text-indigo-600 font-medium">
          Kill {ghostsNeeded} more ghost{ghostsNeeded !== 1 ? 's' : ''} to reach goal
        </span>
      </div>
      
      <div className="mt-4 pt-4 border-t border-indigo-200">
        <div className="flex items-center justify-center gap-2 text-indigo-600">
          <span>💎</span>
          <span className="text-sm font-medium">
            {percentComplete >= 100 ? '🎉 Goal reached!' : 'Keep hunting ghosts!'}
          </span>
        </div>
      </div>
    </div>
  );
}
