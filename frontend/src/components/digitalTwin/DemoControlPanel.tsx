import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  Anchor,
  Navigation,
  CheckCircle2,
  Sliders,
  ArrowDownCircle
} from 'lucide-react';

interface DemoControlPanelProps {
  shipmentCode: string;
  onStartLoading: (step?: number) => Promise<void>;
  onStartDischarge: (step?: number) => Promise<void>;
  onTriggerAlert: (trigger: boolean) => Promise<void>;
  onReset: () => Promise<void>;
  hasAlert: boolean;
  simulationMode: string;
}

export const DemoControlPanel: React.FC<DemoControlPanelProps> = ({
  shipmentCode,
  onStartLoading,
  onStartDischarge,
  onTriggerAlert,
  onReset,
  hasAlert,
  simulationMode
}) => {
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const handleAction = async (name: string, fn: () => Promise<void>) => {
    try {
      setLoadingAction(name);
      await fn();
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 sm:p-5 text-white">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/15 pb-3 mb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/30">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-[#FFFFFF] flex items-center gap-2">
              <span>DEMO SIMULATION CONTROL PANEL</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 border border-white/20 text-[#A0C4E2]">
                SPATIAL DEMO
              </span>
            </h4>
            <p className="text-[11px] text-[#A0C4E2]">
              Trigger real-time cargo operations and environmental scenarios connected to digital twin telemetry
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#FF7A00] font-bold px-2.5 py-1 rounded-lg bg-black/20 border border-white/10">
            Mode: {simulationMode || 'IDLE'}
          </span>
        </div>
      </div>

      {/* Button Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
        {/* 1. RESET */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('reset', onReset)}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFFFF] text-xs font-bold transition-all border border-white/20 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <RotateCcw className="w-4 h-4 text-[#A0C4E2]" />
          <span>RESET</span>
        </button>

        {/* 2. START LOADING */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('loading', () => onStartLoading())}
          className="p-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-[#FFFFFF] text-xs font-bold transition-all border border-emerald-400/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <Play className="w-4 h-4 text-[#34D399]" />
          <span>START LOADING</span>
        </button>

        {/* 3. DEPART */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('depart', () => onStartLoading(5))}
          className="p-2.5 rounded-xl bg-sky-600/30 hover:bg-sky-600/50 text-[#FFFFFF] text-xs font-bold transition-all border border-sky-400/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <Anchor className="w-4 h-4 text-[#38BDF8]" />
          <span>DEPART</span>
        </button>

        {/* 4. SIMULATE VOYAGE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('voyage', () => onStartLoading(5))}
          className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FFFFFF] text-xs font-bold transition-all border border-white/20 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <Navigation className="w-4 h-4 text-[#FF7A00]" />
          <span>SIMULATE VOYAGE</span>
        </button>

        {/* 5. TRIGGER SENSOR ALERT */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('alert', () => onTriggerAlert(!hasAlert))}
          className={`p-2.5 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
            hasAlert
              ? 'bg-red-600 text-[#FFFFFF] border-red-400 shadow-lg shadow-red-600/30 animate-pulse'
              : 'bg-red-950/40 hover:bg-red-600/50 text-[#FFFFFF] border-red-500/30'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${hasAlert ? 'text-white' : 'text-[#FF7A00]'}`} />
          <span>{hasAlert ? 'RESOLVE ALERT' : 'TRIGGER ALERT'}</span>
        </button>

        {/* 6. ARRIVE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('arrive', () => onStartDischarge(0))}
          className="p-2.5 rounded-xl bg-amber-600/30 hover:bg-amber-600/50 text-[#FFFFFF] text-xs font-bold transition-all border border-amber-400/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <Anchor className="w-4 h-4 text-[#FBBF24]" />
          <span>ARRIVE</span>
        </button>

        {/* 7. START DISCHARGE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('discharge', () => onStartDischarge())}
          className="p-2.5 rounded-xl bg-orange-600/30 hover:bg-orange-600/50 text-[#FFFFFF] text-xs font-bold transition-all border border-orange-400/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <ArrowDownCircle className="w-4 h-4 text-[#FB923C]" />
          <span>START DISCHARGE</span>
        </button>

        {/* 8. COMPLETE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('complete', () => onStartDischarge(5))}
          className="p-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/50 text-[#FFFFFF] text-xs font-bold transition-all border border-emerald-400/30 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 hover:shadow-lg"
        >
          <CheckCircle2 className="w-4 h-4 text-[#34D399]" />
          <span>COMPLETE</span>
        </button>
      </div>

      {loadingAction && (
        <div className="mt-3 text-center text-xs font-mono text-[#38BDF8] animate-pulse">
          Executing simulation sequence: {loadingAction.toUpperCase()}...
        </div>
      )}
    </div>
  );
};
