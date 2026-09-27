import React from 'react';
import { DigitalTwinHold } from '../../types/digitalTwin';
import { StatusBadge } from '../common/StatusBadge';
import { AlertTriangle, Layers } from 'lucide-react';

interface CargoHoldDistributionProps {
  holds: DigitalTwinHold[];
  selectedHoldNumber: number | null;
  onSelectHold: (hold: DigitalTwinHold) => void;
}

export const CargoHoldDistribution: React.FC<CargoHoldDistributionProps> = ({
  holds,
  selectedHoldNumber,
  onSelectHold
}) => {
  return (
    <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 sm:p-5 text-white">
      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-[#38BDF8]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#FFFFFF]">
              Cargo Hold Stowage & Weight Distribution
            </h3>
            <p className="text-xs text-[#A0C4E2]">
              Balanced longitudinal mass distribution across five Panamax holds (click row to focus 3D hold)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#A0C4E2] bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg">
          5 / 5 HOLDS MONITORED
        </span>
      </div>

      {/* 5 Horizontal Progress Rows */}
      <div className="space-y-2.5">
        {holds.map((hold) => {
          const isSelected = selectedHoldNumber === hold.hold_number;
          const capacity = hold.capacity_mt > 0 ? hold.capacity_mt : 17000;
          const loaded = hold.loaded_mt || 0;
          const pct = Math.min(100, Math.max(0, (loaded / capacity) * 100));

          return (
            <div
              key={hold.hold_id || hold.hold_number}
              onClick={() => onSelectHold(hold)}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                isSelected
                  ? 'border-[#FF7A00] bg-white/15 shadow-lg ring-2 ring-[#FF7A00]/40'
                  : 'border-white/10 bg-white/5 hover:border-white/25 hover:bg-white/10'
              }`}
            >
              {/* Hold Name & Cargo Tag */}
              <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center transition-colors border ${
                    isSelected
                      ? 'bg-[#FF7A00] text-white border-white shadow-md'
                      : 'bg-white/10 text-white border-white/20'
                  }`}
                >
                  H0{hold.hold_number}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-[#FFFFFF] flex items-center gap-1.5">
                    <span>{hold.hold_code}</span>
                    {hold.has_alert && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#A0C4E2] truncate">
                    {hold.cargo_type} • {hold.batch_id}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Weight */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-[#FFFFFF]">
                    {loaded.toLocaleString()} / {capacity.toLocaleString()} MT
                  </span>
                  <span className="font-mono font-bold text-[#38BDF8]">
                    {pct.toFixed(1)}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/10">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      hold.has_alert
                        ? 'bg-gradient-to-r from-red-500 to-amber-500'
                        : isSelected
                        ? 'bg-gradient-to-r from-[#FF7A00] to-amber-400'
                        : 'bg-gradient-to-r from-[#0867B2] to-[#38BDF8]'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {/* Status Badge */}
              <div className="sm:w-28 flex justify-end flex-shrink-0">
                <StatusBadge status={hold.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
