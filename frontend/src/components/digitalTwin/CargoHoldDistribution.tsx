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
    <div className="istelx-card bg-white p-5 border border-[#CBD5E1] shadow-md">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#EBF4FC] text-[#0867B2]">
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#063B68]">
              Cargo Hold Stowage & Weight Distribution
            </h3>
            <p className="text-xs text-[#64748B]">
              Balanced longitudinal mass distribution across five Panamax holds (click row to focus 3D hold)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#063B68] bg-[#F1F5F9] px-2.5 py-1 rounded-lg">
          5 / 5 HOLDS MONITORED
        </span>
      </div>

      {/* 5 Horizontal Progress Rows */}
      <div className="space-y-3">
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
                  ? 'border-[#FF7A00] bg-[#FFF8F0] shadow-sm ring-2 ring-[#FF7A00]/20'
                  : 'border-[#E2E8F0] bg-[#F8FAFC] hover:border-[#CBD5E1] hover:bg-white'
              }`}
            >
              {/* Hold Name & Cargo Tag */}
              <div className="flex items-center gap-3 sm:w-44 flex-shrink-0">
                <div
                  className={`w-9 h-9 rounded-lg font-black text-xs flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-[#FF7A00] text-white shadow-xs'
                      : 'bg-[#063B68] text-white'
                  }`}
                >
                  H0{hold.hold_number}
                </div>
                <div>
                  <div className="font-heading font-bold text-sm text-[#063B68] flex items-center gap-1.5">
                    <span>{hold.hold_code}</span>
                    {hold.has_alert && (
                      <AlertTriangle className="w-3.5 h-3.5 text-[#D92D20] animate-pulse" />
                    )}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">
                    {hold.cargo_type} • {hold.batch_id}
                  </div>
                </div>
              </div>

              {/* Progress Bar & Weight */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-[#102A43]">
                    {loaded.toLocaleString()} / {capacity.toLocaleString()} MT
                  </span>
                  <span className="font-mono font-bold text-[#0867B2]">
                    {pct.toFixed(1)}%
                  </span>
                </div>

                <div className="w-full h-2.5 bg-[#E2E8F0] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-700 ease-out ${
                      hold.has_alert
                        ? 'bg-gradient-to-r from-[#D92D20] to-[#FF7A00]'
                        : isSelected
                        ? 'bg-gradient-to-r from-[#FF7A00] to-[#F59E0B]'
                        : 'bg-gradient-to-r from-[#063B68] to-[#0867B2]'
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
