'use client';

import { useState, useCallback } from 'react';

interface PlaidLinkButtonProps {
  onSuccess?: (publicToken: string, metadata: PlaidLinkMetadata) => void;
  onExit?: () => void;
  isRepairMode?: boolean;
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

export function PlaidLinkButton({ onSuccess, onExit, isRepairMode = false }: PlaidLinkButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handlePlaidOpen = useCallback(async () => {
    setIsLoading(true);
    
    try {
      const endpoint = isRepairMode 
        ? '/api/plaid/update-link-token' 
        : '/api/plaid/create-link-token';
      
      const response = await fetch(endpoint, {
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
  }, [onSuccess, onExit, isRepairMode]);

  if (isConnected && !isRepairMode) {
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
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 ${
        isRepairMode 
          ? 'bg-amber-100 hover:bg-amber-200 text-amber-700' 
          : 'bg-slate-800 hover:bg-slate-700 text-white'
      }`}
    >
      {isLoading ? (
        <>
          <span className="animate-spin">⟳</span>
          <span>{isRepairMode ? 'Repairing...' : 'Connecting...'}</span>
        </>
      ) : (
        <>
          <span>{isRepairMode ? '🔧' : '🏦'}</span>
          <span>{isRepairMode ? 'Repair Connection' : 'Connect Bank'}</span>
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

export function PlaidConnectionStatus({ 
  status, 
  onRepair 
}: { 
  status: 'connected' | 'needs_repair' | 'error';
  onRepair?: () => void;
}) {
  if (status === 'connected') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 text-sm rounded-lg">
        <span>✓</span>
        <span>Bank Connected</span>
      </div>
    );
  }

  if (status === 'needs_repair') {
    return (
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-100 text-amber-700 text-sm rounded-lg">
          <span>⚠️</span>
          <span>Re-authentication needed</span>
        </div>
        <button
          onClick={onRepair}
          className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-sm rounded-lg transition-colors"
        >
          Repair
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-sm rounded-lg">
      <span>✕</span>
      <span>Connection Error</span>
    </div>
  );
}
