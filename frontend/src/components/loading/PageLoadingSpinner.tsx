import React from 'react';
import { Logo } from '../brand/Logo';

interface PageLoadingSpinnerProps {
  message?: string;
  subMessage?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PageLoadingSpinner: React.FC<PageLoadingSpinnerProps> = ({
  message = 'Loading I-STELX Intelligence...',
  subMessage = 'Connecting to real-time maritime telemetry',
  size = 'md'
}) => {
  const logoSize = size === 'sm' ? 'md' : size === 'lg' ? '2xl' : 'xl';

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center select-none">
      <div className="relative mb-4">
        {/* Glowing radar ring */}
        <div className="absolute -inset-4 rounded-full border border-[#0867B2]/30 animate-ping opacity-40 pointer-events-none" />
        <Logo size={logoSize} showText={false} animated={true} />
      </div>

      <p className="font-heading font-bold text-base text-[#063B68] animate-pulse mb-1">
        {message}
      </p>
      {subMessage && (
        <p className="text-xs text-[#64748B] font-mono">
          {subMessage}
        </p>
      )}
    </div>
  );
};

export default PageLoadingSpinner;
