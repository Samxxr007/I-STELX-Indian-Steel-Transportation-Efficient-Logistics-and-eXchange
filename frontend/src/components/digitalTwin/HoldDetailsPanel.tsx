import React from 'react';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { StatusBadge } from '../common/StatusBadge';
import {
  Layers,
  Thermometer,
  Droplets,
  Activity,
  AlertTriangle,
  Scale
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
      <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-5 flex flex-col items-center justify-center text-center text-[#A0C4E2]">
        <Layers className="w-8 h-8 text-[#A0C4E2] mb-2 animate-bounce" />
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
    <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 sm:p-5 flex flex-col justify-between text-white transition-all">
      {/* Header & Hold Selector Tabs */}
      <div>
        <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-[#38BDF8]">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-[#FFFFFF] leading-tight flex items-center gap-2">
                <span>{activeHold.hold_code}</span>
                {activeHold.has_alert && (
                  <span className="bg-red-500/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-300 animate-pulse">
                    <AlertTriangle className="w-3 h-3 text-white" />
                    <span>ALERT</span>
                  </span>
                )}
              </h3>
              <span className="text-[11px] text-[#A0C4E2] font-medium">
                Hold Bay Position #{activeHold.hold_number}
              </span>
            </div>
          </div>
          <StatusBadge status={activeHold.status} />
        </div>

        {/* Hold Quick Selector Strip */}
        <div className="flex items-center gap-1 mb-3.5 p-1 bg-white/5 rounded-xl border border-white/10">
          {holds.map((h) => {
            const isCurrent = h.hold_number === activeHold.hold_number;
            return (
              <button
                key={h.hold_number}
                onClick={() => onSelectHold(h)}
                className={`flex-1 py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  isCurrent
                    ? 'bg-[#FF7A00] text-[#FFFFFF] shadow-md shadow-[#FF7A00]/30 font-black'
                    : 'text-[#A0C4E2] hover:bg-white/10 hover:text-[#FFFFFF]'
                }`}
              >
                <span>H0{h.hold_number}</span>
                {h.has_alert && <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />}
              </button>
            );
          })}
        </div>

        {/* Hold Fill Progress Bar */}
        <div className="space-y-1.5 mb-3.5 p-3 rounded-xl bg-white/5 border border-white/10">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#A0C4E2] flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-[#38BDF8]" /> Hold Utilization
            </span>
            <span className="font-mono font-black text-sm text-[#FFFFFF]">
              {utilization.toFixed(1)}%
            </span>
          </div>

          <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div
              className={`h-full rounded-full transition-all duration-700 ease-out ${
                activeHold.has_alert
                  ? 'bg-gradient-to-r from-red-500 to-amber-500'
                  : 'bg-gradient-to-r from-[#0867B2] to-[#38BDF8]'
              }`}
              style={{ width: `${Math.min(100, Math.max(0, utilization))}%` }}
            />
          </div>

          <div className="flex justify-between text-[10px] text-[#A0C4E2] pt-0.5">
            <span>0 MT</span>
            <span className="font-mono font-medium">Capacity: {capacity.toLocaleString()} MT</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3.5">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#A0C4E2] uppercase font-bold block mb-0.5">Cargo</span>
            <span className="font-bold text-[#FFFFFF] truncate block">{activeHold.cargo_type}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#A0C4E2] uppercase font-bold block mb-0.5">Batch</span>
            <span className="font-mono font-bold text-[#38BDF8] truncate block">{activeHold.batch_id}</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#A0C4E2] uppercase font-bold block mb-0.5">Capacity</span>
            <span className="font-mono font-bold text-[#FFFFFF]">{capacity.toLocaleString()} MT</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#A0C4E2] uppercase font-bold block mb-0.5">Loaded</span>
            <span className="font-mono font-bold text-[#34D399]">{loaded.toLocaleString()} MT</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#A0C4E2] uppercase font-bold block mb-0.5">Discharged</span>
            <span className="font-mono font-bold text-[#CBD5E1]">{discharged.toLocaleString()} MT</span>
          </div>

          <div className="p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-[#A0C4E2] uppercase font-bold block mb-0.5">Onboard</span>
            <span className="font-mono font-bold text-[#38BDF8]">{onboard.toLocaleString()} MT</span>
          </div>
        </div>

        {/* Hold IoT Telemetry Readings */}
        <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
          <div className="text-[11px] font-bold text-[#A0C4E2] uppercase tracking-wider flex items-center justify-between">
            <span>Hold Sensors (Simulated)</span>
            <span className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-[#A0C4E2]">2s Tick</span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/5 p-2 rounded-lg border border-white/10">
              <div className="text-[10px] text-[#A0C4E2] flex items-center justify-center gap-1">
                <Thermometer className="w-3 h-3 text-[#FF7A00]" /> Temp
              </div>
              <div className="font-mono font-bold text-[#FFFFFF] mt-0.5">
                {activeHold.temperature_c}°C
              </div>
            </div>

            <div className={`p-2 rounded-lg border ${
              activeHold.has_alert ? 'bg-red-500/20 border-red-400' : 'bg-white/5 border-white/10'
            }`}>
              <div className="text-[10px] text-[#A0C4E2] flex items-center justify-center gap-1">
                <Droplets className={`w-3 h-3 ${activeHold.has_alert ? 'text-red-400 animate-bounce' : 'text-[#38BDF8]'}`} /> Humidity
              </div>
              <div className={`font-mono font-bold mt-0.5 ${activeHold.has_alert ? 'text-red-300 font-black' : 'text-[#FFFFFF]'}`}>
                {activeHold.humidity_pct}%
              </div>
            </div>

            <div className="bg-white/5 p-2 rounded-lg border border-white/10">
              <div className="text-[10px] text-[#A0C4E2] flex items-center justify-center gap-1">
                <Activity className="w-3 h-3 text-[#34D399]" /> Vibration
              </div>
              <div className="font-mono font-bold text-[#FFFFFF] mt-0.5">
                {activeHold.vibration_level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Route & Origin Tag */}
      <div className="pt-3 border-t border-white/15 mt-3 flex items-center justify-between text-[11px] text-[#A0C4E2]">
        <span>Origin: <strong className="text-[#FFFFFF]">{activeHold.origin}</strong></span>
        <span>Dest: <strong className="text-[#FFFFFF]">{activeHold.destination}</strong></span>
      </div>
    </div>
  );
};
