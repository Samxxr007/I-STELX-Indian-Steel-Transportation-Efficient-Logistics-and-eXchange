import React, { useState } from 'react';
import {
  Play,
  RotateCcw,
  AlertTriangle,
  Anchor,
  Navigation,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowDownCircle,
  Truck
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
    <div className="istelx-card bg-[#042848] text-white p-4 sm:p-5 rounded-2xl border border-[#0867B2] shadow-xl">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#0867B2]/40 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#FF7A00] text-white shadow-xs">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-heading font-extrabold text-sm sm:text-base text-white flex items-center gap-2">
              <span>DEMO SIMULATION CONTROL PANEL</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0867B2] text-white">
                DEV / DEMO MODE
              </span>
            </h4>
            <p className="text-[11px] text-[#94A3B8]">
              Trigger real-time cargo operations and environmental scenarios connected to backend state
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-[#FF7A00] font-bold">
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
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#0867B2] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4 text-[#94A3B8]" />
          <span>RESET</span>
        </button>

        {/* 2. START LOADING */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('loading', () => onStartLoading())}
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#00843D] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Play className="w-4 h-4 text-[#00843D]" />
          <span>START LOADING</span>
        </button>

        {/* 3. DEPART */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('depart', () => onStartLoading(5))}
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#0867B2] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Anchor className="w-4 h-4 text-[#38BDF8]" />
          <span>DEPART</span>
        </button>

        {/* 4. SIMULATE VOYAGE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('voyage', () => onStartLoading(5))}
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#0867B2] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Navigation className="w-4 h-4 text-[#FF7A00]" />
          <span>SIMULATE VOYAGE</span>
        </button>

        {/* 5. TRIGGER SENSOR ALERT */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('alert', () => onTriggerAlert(!hasAlert))}
          className={`p-2 rounded-xl text-xs font-bold transition-all border flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50 ${
            hasAlert
              ? 'bg-[#D92D20] text-white border-red-500 shadow-md'
              : 'bg-[#063B68] hover:bg-[#D92D20] text-white border-[#0867B2]/50'
          }`}
        >
          <AlertTriangle className={`w-4 h-4 ${hasAlert ? 'text-white' : 'text-[#FF7A00]'}`} />
          <span>{hasAlert ? 'RESOLVE ALERT' : 'TRIGGER ALERT'}</span>
        </button>

        {/* 6. ARRIVE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('arrive', () => onStartDischarge(0))}
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#0867B2] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <Anchor className="w-4 h-4 text-[#F59E0B]" />
          <span>ARRIVE</span>
        </button>

        {/* 7. START DISCHARGE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('discharge', () => onStartDischarge())}
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#FF7A00] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <ArrowDownCircle className="w-4 h-4 text-[#FF7A00]" />
          <span>START DISCHARGE</span>
        </button>

        {/* 8. COMPLETE */}
        <button
          disabled={!!loadingAction}
          onClick={() => handleAction('complete', () => onStartDischarge(5))}
          className="p-2 rounded-xl bg-[#063B68] hover:bg-[#00843D] text-white text-xs font-bold transition-all border border-[#0867B2]/50 flex flex-col items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4 text-[#00843D]" />
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
