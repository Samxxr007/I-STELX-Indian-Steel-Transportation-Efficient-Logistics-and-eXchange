import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  animated?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  animated = false,
  className = ''
}) => {
  const sizeMap = {
    sm: { icon: 32, text: 'text-lg', subtext: 'text-[9px]' },
    md: { icon: 44, text: 'text-xl', subtext: 'text-[10px]' },
    lg: { icon: 64, text: 'text-2xl', subtext: 'text-xs' },
    xl: { icon: 96, text: 'text-3xl', subtext: 'text-sm' },
    '2xl': { icon: 140, text: 'text-4xl', subtext: 'text-base' }
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      <div 
        className="relative flex-shrink-0 flex items-center justify-center"
        style={{ width: currentSize.icon, height: currentSize.icon }}
      >
        <img
          src="/logo.png"
          alt="I-STELX Logo"
          className={`w-full h-full object-contain rounded-full shadow-xs ${
            animated ? 'transition-transform duration-700 hover:scale-105 filter drop-shadow-md' : ''
          }`}
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-extrabold tracking-wider text-[#063B68] leading-none ${currentSize.text}`}>
              I-STELX
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00]" />
          </div>
          <span className={`font-sans font-semibold tracking-tight text-[#0867B2] uppercase leading-tight ${currentSize.subtext}`}>
            Indian Steel Logistics & eXchange
          </span>
        </div>
      )}
    </div>
  );
};

