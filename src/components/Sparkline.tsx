'use client';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
}

export function Sparkline({ data, width = 80, height = 24 }: SparklineProps) {
  if (!data || data.length === 0) {
    return (
      <div style={{ width, height }} className="bg-slate-100 rounded flex items-center justify-center text-xs text-slate-400">
        No data
      </div>
    );
  }

  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const isDeclining = data.length >= 2 && data[data.length - 1] < data[0];
  const strokeColor = isDeclining ? '#ef4444' : '#22c55e';
  const fillColor = isDeclining ? '#fef2f2' : '#f0fdf4';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`gradient-${isDeclining ? 'red' : 'green'}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
          <stop offset="100%" stopColor={strokeColor} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#gradient-${isDeclining ? 'red' : 'green'})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={width}
        cy={height - ((data[data.length - 1] - min) / range) * height}
        r="3"
        fill={strokeColor}
      />
    </svg>
  );
}

interface UsageTrendProps {
  usageHistory?: number[];
  lastUsedDate?: string;
}

export function UsageTrend({ usageHistory, lastUsedDate }: UsageTrendProps) {
  const data = usageHistory || [];
  
  if (data.length === 0) {
    const daysSince = lastUsedDate 
      ? Math.floor((new Date('2026-03-18').getTime() - new Date(lastUsedDate).getTime()) / (1000 * 60 * 60 * 24))
      : 999;
    
    return (
      <div className="flex items-center gap-2">
        <Sparkline data={[0, 0, 0, 0]} />
        <span className="text-xs text-red-500">
          {daysSince === 999 ? 'No usage data' : `${daysSince}d since last use`}
        </span>
      </div>
    );
  }

  const isDeclining = data.length >= 2 && data[data.length - 1] < data[0];
  const declinePercent = data[0] > 0 
    ? Math.round(((data[0] - data[data.length - 1]) / data[0]) * 100)
    : 0;

  return (
    <div className="flex items-center gap-2">
      <Sparkline data={data} />
      {isDeclining && (
        <span className="text-xs text-red-500 font-medium">
          -{declinePercent}%
        </span>
      )}
    </div>
  );
}
