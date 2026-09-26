import React from 'react';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { StatusBadge } from '../common/StatusBadge';
import {
  Layers,
  Thermometer,
  Droplets,
  Activity,
  AlertTriangle,
  QrCode,
  Tag,
  Scale,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface HoldDetailsPanelProps {
  holds: DigitalTwinHold[];
  selectedHold: DigitalTwinHold | null;
  onSelectHold: (hold: DigitalTwinHold) => void;
}

export const HoldDetailsPanel: React.FC<HoldDetailsPanelProps> = ({
  holds,
  selectedHold,
  onSelectHold
}) => {
  const activeHold = selectedHold || holds[0] || null;

  if (!activeHold) {
    return (
      <div className="istelx-card p-6 flex flex-col items-center justify-center text-center text-[#64748B]">
        <Layers className="w-8 h-8 text-[#94A3B8] mb-2 animate-bounce" />
        <p className="text-sm font-semibold">Select a Cargo Hold to view telemetry</p>
      </div>
    );
  }

  const capacity = activeHold.capacity_mt || 17000;
  const loaded = activeHold.loaded_mt || 0;
  const discharged = activeHold.discharged_mt || 0;
  const onboard = activeHold.onboard_mt || loaded;
  const utilization = activeHold.utilization_pct || ((loaded / capacity) * 100);

  return (
    <div className="istelx-card bg-white p-4 sm:p-5 flex flex-col justify-between h-full border border-[#CBD5E1] shadow-md">
      {/* Header & Hold Selector Tabs */}
      <div>
        <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-[#063B68] text-white">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-[#063B68] leading-tight flex items-center gap-2">
                <span>{activeHold.hold_code}</span>
                {activeHold.has_alert && (
                  <span className="badge-red text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-[#D92D20]" />
                    <span>ALERT</span>
                  </span>
                )}
              </h3>
              <span className="text-[11px] text-[#64748B] font-medium">
                Hold Bay Position #{activeHold.hold_number}
              </span>
            </div>
          </div>
          <StatusBadge status={activeHold.status} />
        </div>

        {/* Hold Quick Selector Strip */}
        <div className="flex items-center gap-1 mb-4 p-1 bg-[#F1F5F9] rounded-lg">
          {holds.map((h) => {
            const isCurrent = h.hold_number === activeHold.hold_number;
            return (
              <button
                key={h.hold_number}
                onClick={() => onSelectHold(h)}
                className={`flex-1 py-1 px-1.5 rounded-md text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-[#063B68] text-white shadow-xs'
                    : 'text-[#475569] hover:bg-[#E2E8F0]'
                }`}
              >
                <span>H0{h.hold_number}</span>
                {h.has_alert && <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20]" />}
              </button>
            );
          })}
        </div>

        {/* Hold Fill Progress Bar */}
        <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#475569] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#0867B2]" /> Hold Utilization
            </span>
            <span className="font-mono font-black text-sm text-[#063B68]">
              {utilization.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-3 bg-[#E2E8F0] rounded-full overflow-hidden p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                activeHold.has_alert
                  ? 'bg-gradient-to-r from-[#D92D20] to-[#FF7A00]'
                  : 'bg-gradient-to-r from-[#0867B2] to-[#FF7A00]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, utilization))}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#64748B] pt-0.5">
            <span>0 MT</span>
            <span className="font-mono font-medium">Capacity: {capacity.toLocaleString()} MT</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-4">
          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Cargo</span>
            <span className="font-bold text-[#102A43] truncate block">{activeHold.cargo_type}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Batch</span>
            <span className="font-mono font-bold text-[#0867B2] truncate block">{activeHold.batch_id}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Capacity</span>
            <span className="font-mono font-bold text-[#102A43]">{capacity.toLocaleString()} MT</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Loaded</span>
            <span className="font-mono font-bold text-[#00843D]">{loaded.toLocaleString()} MT</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Discharged</span>
            <span className="font-mono font-bold text-[#64748B]">{discharged.toLocaleString()} MT</span>
          </div>

          <div className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
            <span className="text-[10px] text-[#64748B] uppercase font-bold block mb-0.5">Onboard</span>
            <span className="font-mono font-bold text-[#063B68]">{onboard.toLocaleString()} MT</span>
          </div>
        </div>

        {/* Hold IoT Telemetry Readings */}
        <div className="p-3 rounded-xl bg-[#F1F5F9] border border-[#E2E8F0] space-y-2">
          <div className="text-[11px] font-bold text-[#063B68] uppercase tracking-wider flex items-center justify-between">
            <span>Hold Sensors (Simulated)</span>
            <span className="text-[9px] bg-[#E2E8F0] px-1.5 py-0.5 rounded text-[#475569]">2s Tick</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white p-2 rounded-lg border border-[#CBD5E1]">
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-1">
                <Thermometer className="w-3 h-3 text-[#FF7A00]" /> Temp
              </div>
              <div className="font-mono font-bold text-[#102A43] mt-0.5">
                {activeHold.temperature_c}°C
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${
              activeHold.has_alert ? 'bg-[#FEECEB] border-[#FCCECE]' : 'bg-white border-[#CBD5E1]'
            }`}>
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-1">
                <Droplets className={`w-3 h-3 ${activeHold.has_alert ? 'text-[#D92D20]' : 'text-[#0867B2]'}`} /> Humidity
              </div>
              <div className={`font-mono font-bold mt-0.5 ${activeHold.has_alert ? 'text-[#D92D20]' : 'text-[#102A43]'}`}>
                {activeHold.humidity_pct}%
              </div>
            </div>

            <div className="bg-white p-2 rounded-lg border border-[#CBD5E1]">
              <div className="text-[10px] text-[#64748B] flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-[#00843D]" /> Vibration
              </div>
              <div className="font-mono font-bold text-[#102A43] mt-0.5">
                {activeHold.vibration_level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Route & Origin Tag */}
      <div className="pt-3 border-t border-[#E2E8F0] mt-3 flex items-center justify-between text-[11px] text-[#64748B]">
        <span>Origin: <strong className="text-[#102A43]">{activeHold.origin}</strong></span>
        <span>Dest: <strong className="text-[#102A43]">{activeHold.destination}</strong></span>
      </div>
    </div>
  );
};
