interface StatusBadgeProps {
  status: 'active' | 'ghost' | 'warning' | 'healthy';
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const styles: Record<string, string> = {
    ghost: 'bg-red-100 text-red-700 border-red-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    healthy: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    active: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  const labels: Record<string, string> = {
    ghost: '👻 Ghost',
    warning: '⚠️ Warning',
    healthy: '✓ Healthy',
    active: 'Active',
  };

  return (
    <span className={`${styles[status]} px-2 py-1 text-xs font-medium rounded-full border`}>
      {labels[status]}
    </span>
  );
}
