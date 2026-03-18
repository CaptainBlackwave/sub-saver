interface KillButtonProps {
  cancelUrl?: string;
  subscriptionName: string;
}

export function KillButton({ cancelUrl, subscriptionName }: KillButtonProps) {
  if (!cancelUrl) return null;

  const handleKill = () => {
    window.open(cancelUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleKill}
      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
    >
      <span>💀</span>
      <span>Kill</span>
    </button>
  );
}

interface DowngradeButtonProps {
  tier?: { name: string; price: number; savings: number };
  websiteUrl?: string;
}

export function DowngradeButton({ tier, websiteUrl }: DowngradeButtonProps) {
  if (!tier || !websiteUrl) return null;

  const handleDowngrade = () => {
    window.open(websiteUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleDowngrade}
      className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-700 text-sm font-medium rounded-lg transition-colors flex items-center gap-1.5"
    >
      <span>⬇️</span>
      <span>Downgrade to {tier.name} (-${tier.savings}/mo)</span>
    </button>
  );
}
