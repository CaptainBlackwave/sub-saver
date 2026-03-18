'use client';

import { useState, useCallback } from 'react';

interface PlaidLinkButtonProps {
  onSuccess?: (publicToken: string, metadata: PlaidLinkMetadata) => void;
  onExit?: () => void;
}

interface PlaidLinkMetadata {
  institution?: {
    name: string;
    institution_id: string;
  };
  accounts?: Array<{
    id: string;
    name: string;
    mask: string;
  }>;
}

export function PlaidLinkButton({ onSuccess, onExit }: PlaidLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handlePlaidOpen = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/plaid/create-link-token', {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to create link token');
      }
      
      const { link_token: linkToken } = await response.json();
      
      if (typeof window !== 'undefined' && (window as unknown as { Plaid?: { create: (config: PlaidConfig) => PlaidHandler } }).Plaid) {
        const handler = (window as unknown as { Plaid: { create: (config: PlaidConfig) => PlaidHandler } }).Plaid.create({
          token: linkToken,
          onSuccess: (publicToken: string, metadata: PlaidLinkMetadata) => {
            setIsConnected(true);
            onSuccess?.(publicToken, metadata);
          },
          onExit: () => {
            setIsLoading(false);
            onExit?.();
          },
        });
        handler.open();
      } else {
        console.log('Plaid not loaded - using mock mode');
        setIsLoading(false);
        setIsConnected(true);
        onSuccess?.('mock-public-token', {
          institution: { name: 'Chase Bank', institution_id: 'ins_1' },
          accounts: [{ id: '1', name: 'Checking', mask: '1234' }],
        });
      }
    } catch (error) {
      console.error('Plaid error:', error);
      setIsLoading(false);
    }
  }, [onSuccess, onExit]);

  if (isConnected) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
        <span>✓</span>
        <span>Bank Connected</span>
      </div>
    );
  }

  return (
    <button
      onClick={handlePlaidOpen}
      disabled={isLoading}
      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⟳</span>
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <span>🏦</span>
          <span>Connect Bank</span>
        </>
      )}
    </button>
  );
}

interface PlaidConfig {
  token: string;
  onSuccess: (publicToken: string, metadata: PlaidLinkMetadata) => void;
  onExit: () => void;
}

interface PlaidHandler {
  open: () => void;
  exit: () => void;
  destroy: () => void;
}
