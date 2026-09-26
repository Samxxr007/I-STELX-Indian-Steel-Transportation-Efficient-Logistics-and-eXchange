import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = '',
  showDot = true
}) => {
  const norm = status?.toUpperCase() || 'UNKNOWN';

  let badgeStyle = {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-500',
    pulse: false
  };

  if (
    norm.includes('ON TIME') || 
    norm.includes('COMPATIBLE') || 
    norm.includes('COMPLETED') || 
    norm.includes('AVAILABLE') || 
    norm.includes('APPROVED') || 
    norm.includes('SUCCESS') ||
    norm.includes('OPERATIONAL')
  ) {
    badgeStyle = {
      bg: 'bg-emerald-50/90',
      text: 'text-emerald-700',
      border: 'border-emerald-200/80',
      dot: 'bg-emerald-500',
      pulse: false
    };
  } else if (
    norm.includes('WARNING') || 
    norm.includes('MODERATE') || 
    norm.includes('PENDING') || 
    norm.includes('MEDIUM') ||
    norm.includes('POTENTIAL DELAY')
  ) {
    badgeStyle = {
      bg: 'bg-amber-50/90',
      text: 'text-amber-700',
      border: 'border-amber-200/80',
      dot: 'bg-amber-500',
      pulse: true
    };
  } else if (
    norm.includes('CRITICAL') || 
    norm.includes('DELAYED') || 
    norm.includes('RESTRICTED') || 
    norm.includes('HIGH') || 
    norm.includes('SEVERE') ||
    norm.includes('REJECTED')
  ) {
    badgeStyle = {
      bg: 'bg-rose-50/90',
      text: 'text-rose-700',
      border: 'border-rose-200/80',
      dot: 'bg-rose-500',
      pulse: true
    };
  } else if (
    norm.includes('IN TRANSIT') || 
    norm.includes('ACTIVE') || 
    norm.includes('PROCESSING') || 
    norm.includes('APPROACHING') || 
    norm.includes('LOADING') || 
    norm.includes('CHARTERED') ||
    norm.includes('ANALYZED')
  ) {
    badgeStyle = {
      bg: 'bg-sky-50/90',
      text: 'text-sky-700',
      border: 'border-sky-200/80',
      dot: 'bg-sky-500',
      pulse: true
    };
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2.5 py-0.5 font-semibold tracking-wide rounded-full border shadow-2xs',
    md: 'text-xs px-3 py-1 font-semibold tracking-wide rounded-md border shadow-2xs',
    lg: 'text-sm px-3.5 py-1.5 font-bold tracking-wide rounded-lg border shadow-xs'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 transition-colors select-none ${badgeStyle.bg} ${badgeStyle.text} ${badgeStyle.border} ${sizeClasses[size]} ${className}`}
    >
      {showDot && (
        <span className="relative flex h-2 w-2 items-center justify-center">
          {badgeStyle.pulse && (
            <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${badgeStyle.dot}`} />
          )}
          <span className={`relative inline-flex h-1.5 w-1.5 rounded-full ${badgeStyle.dot}`} />
        </span>
      )}
      <span className="truncate">{status}</span>
    </span>
  );
};
