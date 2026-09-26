import React, { useState, useEffect } from 'react';
import { Logo } from '../brand/Logo';
import { ShieldCheck, Anchor, Compass, Activity, ArrowRight } from 'lucide-react';

interface SplashLoadingScreenProps {
  onComplete: () => void;
  durationMs?: number;
}

const ROTATING_TEXTS = [
  "Initializing secure platform...",
  "Loading freight intelligence & ML models...",
  "Connecting live vessel tracking network...",
  "Querying port constraints & congestion index...",
  "Preparing logistics command center..."
];

export const SplashLoadingScreen: React.FC<SplashLoadingScreenProps> = ({
  onComplete,
  durationMs = 2800
}) => {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgress(pct);

      const tIdx = Math.min(
        ROTATING_TEXTS.length - 1,
        Math.floor((pct / 100) * ROTATING_TEXTS.length)
      );
      setTextIndex(tIdx);

      if (pct >= 100) {
        clearInterval(interval);
        setTimeout(onComplete, 300);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [durationMs, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#F5F8FC] via-[#EBF2FA] to-[#E2EDF9] p-8 select-none overflow-hidden">
      {/* Top subtle maritime badge */}
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CBD5E1] shadow-xs text-xs font-semibold text-[#063B68]">
        <ShieldCheck className="w-3.5 h-3.5 text-[#00843D]" />
        <span>National Maritime Steel Logistics Intelligence Framework</span>
      </div>

      {/* Center Animated Logo & Branding Showcase */}
      <div className="flex flex-col items-center text-center max-w-lg mx-auto my-auto relative">
        {/* Animated Radar Pulse Background Ring */}
        <div className="absolute -inset-12 rounded-full border border-[#0867B2]/20 animate-ping opacity-25 pointer-events-none" />
        <div className="absolute -inset-24 rounded-full border border-[#063B68]/10 pointer-events-none" />

        {/* Official Hero Logo */}
        <div className="transform transition-transform duration-1000 scale-100 hover:scale-105 mb-6">
          <Logo size="2xl" showText={false} animated={true} />
        </div>

        <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#063B68] tracking-tight mb-2">
          I-STELX
        </h1>
        
        <p className="font-heading font-semibold text-sm sm:text-base text-[#0867B2] uppercase tracking-wide mb-1">
          Indian Steel Transportation, Efficient Logistics & eXchange
        </p>
        
        <div className="flex items-center justify-center gap-2 text-xs font-bold text-[#FF7A00] tracking-wider uppercase mb-8">
          <span>Predict</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#063B68]" />
          <span>Optimize</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0867B2]" />
          <span>Track</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00843D]" />
          <span>Deliver</span>
        </div>

        {/* Progress Bar Container */}
        <div className="w-72 sm:w-88 bg-[#E2E8F0] h-2 rounded-full overflow-hidden p-0.5 border border-[#CBD5E1] mb-4 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-[#063B68] via-[#0867B2] to-[#FF7A00] rounded-full transition-all duration-75 ease-out shadow-xs"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Live Rotating Status Text & Percentage */}
        <div className="flex items-center justify-between w-72 sm:w-88 text-xs font-mono text-[#475569]">
          <span className="flex items-center gap-1.5 text-[#063B68] font-sans font-medium animate-pulse">
            <Activity className="w-3.5 h-3.5 text-[#FF7A00]" />
            {ROTATING_TEXTS[textIndex]}
          </span>
          <span className="font-bold text-[#063B68]">{progress}%</span>
        </div>
      </div>

      {/* Bottom Footer & Skip button */}
      <div className="flex flex-col sm:flex-row items-center justify-between w-full max-w-4xl text-xs text-[#64748B] pt-4 border-t border-[#CBD5E1]/60">
        <div className="flex items-center gap-4 mb-2 sm:mb-0">
          <span className="flex items-center gap-1 text-[#063B68]">
            <Anchor className="w-3.5 h-3.5 text-[#0867B2]" />
            Bulk Dry Cargo Intelligence
          </span>
          <span className="flex items-center gap-1 text-[#063B68]">
            <Compass className="w-3.5 h-3.5 text-[#00843D]" />
            Realtime AIS & Geofencing
          </span>
        </div>
        
        <button
          onClick={onComplete}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[#063B68] hover:text-[#FF7A00] hover:bg-white/80 font-medium transition-colors cursor-pointer"
        >
          <span>Enter Command Center</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
