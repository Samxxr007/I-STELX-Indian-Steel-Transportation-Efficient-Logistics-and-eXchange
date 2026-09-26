import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'sm',
  className = ''
}) => {
  const norm = status?.toUpperCase() || 'UNKNOWN';

  let badgeClass = 'badge-gray';

  if (
    norm.includes('ON TIME') || 
    norm.includes('COMPATIBLE') || 
    norm.includes('COMPLETED') || 
    norm.includes('AVAILABLE') || 
    norm.includes('APPROVED') || 
    norm.includes('SUCCESS') ||
    norm.includes('OPERATIONAL')
  ) {
    badgeClass = 'badge-green';
  } else if (
    norm.includes('WARNING') || 
    norm.includes('MODERATE') || 
    norm.includes('PENDING') || 
    norm.includes('MEDIUM') ||
    norm.includes('POTENTIAL DELAY')
  ) {
    badgeClass = 'badge-orange';
  } else if (
    norm.includes('CRITICAL') || 
    norm.includes('DELAYED') || 
    norm.includes('RESTRICTED') || 
    norm.includes('HIGH') || 
    norm.includes('SEVERE') ||
    norm.includes('REJECTED')
  ) {
    badgeClass = 'badge-red';
  } else if (
    norm.includes('IN TRANSIT') || 
    norm.includes('ACTIVE') || 
    norm.includes('PROCESSING') || 
    norm.includes('APPROACHING') || 
    norm.includes('LOADING') || 
    norm.includes('CHARTERED') ||
    norm.includes('ANALYZED')
  ) {
    badgeClass = 'badge-blue';
  }

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium rounded-full',
    md: 'text-xs px-2.5 py-1 font-semibold rounded-md',
    lg: 'text-sm px-3 py-1.5 font-bold rounded-md'
  };

  return (
    <span className={`inline-flex items-center gap-1.5 ${badgeClass} ${sizeClasses[size]} ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
      <span>{status}</span>
    </span>
  );
};
