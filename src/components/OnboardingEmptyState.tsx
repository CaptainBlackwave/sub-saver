'use client';

import { useState } from 'react';
import { PlaidLinkButton } from './PlaidLink';

interface OnboardingProps {
  onComplete?: () => void;
}

export function OnboardingEmptyState({ onComplete }: OnboardingProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<string | null>(null);

  const handleBankConnect = () => {
    setIsConnecting(true);
    setConnectionStep('Connecting to your bank...');
    
    setTimeout(() => {
      setConnectionStep('Securely scanning 30 days of transaction history...');
    }, 1500);
    
    setTimeout(() => {
      setConnectionStep('Identifying recurring subscriptions...');
    }, 3000);
    
    setTimeout(() => {
      setIsConnecting(false);
      setConnectionStep(null);
      onComplete?.();
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <span className="text-white font-bold text-3xl">G</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-3">Welcome to GhostCheck</h1>
          <p className="text-lg text-slate-600">
            Find and eliminate unused subscriptions before they become ghosts.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Connect your data sources</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">🏦</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">Bank Account</div>
                    <div className="text-sm text-slate-500">Sync transactions to find subscriptions</div>
                  </div>
                </div>
                {isConnecting ? (
                  <div className="px-4 py-2 bg-slate-200 text-slate-600 rounded-lg text-sm">
                    {connectionStep || 'Initializing...'}
                  </div>
                ) : (
                  <button
                    onClick={handleBankConnect}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    Connect
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xl">📧</span>
                  </div>
                  <div>
                    <div className="font-medium text-slate-800">Gmail Account</div>
                    <div className="text-sm text-slate-500">Track usage from receipts & activity</div>
                  </div>
                </div>
                <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                  Connect
                </button>
              </div>
            </div>

            {isConnecting && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="animate-spin w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full" />
                  <span className="text-blue-700 font-medium">{connectionStep}</span>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <span>🔒</span>
                <span>Your data is encrypted and never shared. We only read what is necessary.</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-200">
            <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Bank-level security
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Read-only access
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-500">✓</span> Cancel anytime
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-slate-500">
          <p>By connecting, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
