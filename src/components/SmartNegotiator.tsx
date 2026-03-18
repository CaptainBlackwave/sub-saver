'use client';

import { useState } from 'react';
import { ClusteredSubscription, NegotiationScript } from '../types/subscriptions';

interface SmartNegotiatorProps {
  subscription: ClusteredSubscription;
}

export function SmartNegotiatorButton({ subscription }: SmartNegotiatorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [script, setScript] = useState<NegotiationScript | null>(null);

  const handleGenerate = () => {
    const daysSinceUse = subscription.lastUsedDate 
      ? Math.floor((new Date('2026-03-18').getTime() - new Date(subscription.lastUsedDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    const usagePercent = subscription.usageHistory && subscription.usageHistory.length > 0
      ? Math.round((subscription.usageHistory[subscription.usageHistory.length - 1] / 30) * 100)
      : 0;
    
    const newScript: NegotiationScript = {
      subscriptionName: subscription.name,
      script: `Hi, I've been a loyal customer but my usage has decreased significantly. I've only used ${subscription.name} approximately ${usagePercent}% of the time over the past month (last active ${daysSinceUse} days ago). I'd like to continue using the service, but the current price doesn't match my usage pattern. Are there any loyalty discounts, retention offers, or lower-tier plans available?`,
      talkingPoints: [
        `Current usage: Only ~${usagePercent}% of the time`,
        `Last active: ${daysSinceUse} days ago`,
        `Willing to stay if price is adjusted to $${(subscription.monthlyCost * 0.5).toFixed(2)}/mo`,
        `Mention competitor alternatives you're considering`
      ],
      expectedSavings: subscription.monthlyCost * 0.5
    };
    
    setScript(newScript);
    setIsOpen(true);
  };

  if (subscription.riskScore < 0.25) return null;

  return (
    <>
      <button
        onClick={handleGenerate}
        className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
      >
        <span>🤝</span>
        <span>Negotiate</span>
      </button>

      {isOpen && script && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-800">
                🤝 Negotiation Script for {script.subscriptionName}
              </h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">📋 Copy this script:</p>
              <div className="p-4 bg-slate-50 rounded-lg text-sm text-slate-700 leading-relaxed">
                {script.script}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-2">💡 Talking Points:</p>
              <ul className="space-y-1">
                {script.talkingPoints.map((point, idx) => (
                  <li key={idx} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-3 bg-indigo-50 rounded-lg mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-indigo-700">Potential savings:</span>
                <span className="font-bold text-indigo-700">${script.expectedSavings.toFixed(2)}/mo</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(script.script);
                }}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg"
              >
                Copy Script
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
