import React from 'react';
import { DigitalTwinBatch, DigitalTwinHold } from '../../types/digitalTwin';
import { StatusBadge } from '../common/StatusBadge';
import { FileText, Tag, ArrowRight } from 'lucide-react';

interface CargoManifestProps {
  batches: DigitalTwinBatch[];
  holds: DigitalTwinHold[];
  selectedHoldNumber: number | null;
  onSelectHoldNumber: (holdNumber: number) => void;
}

export const CargoManifest: React.FC<CargoManifestProps> = ({
  batches,
  holds,
  selectedHoldNumber,
  onSelectHoldNumber
}) => {
  const rows = holds.map((hold) => {
    const parentBatch = batches.find((b) => b.batch_id === hold.batch_id);
    return {
      batch: hold.batch_id,
      holdCode: hold.hold_code,
      holdNumber: hold.hold_number,
      cargo: hold.cargo_type,
      allocated: hold.allocated_mt || hold.capacity_mt,
      loaded: hold.loaded_mt,
      discharged: hold.discharged_mt,
      onboard: hold.onboard_mt,
      status: hold.status,
      supplier: parentBatch?.supplier || 'Mining Consortium',
      qr: parentBatch?.qr_code || `QR-${hold.batch_id}`
    };
  });

  return (
    <div className="bg-[#063B68]/40 backdrop-blur-md border border-white/20 shadow-xl rounded-xl p-4 sm:p-5 text-white">
      <div className="flex items-center justify-between border-b border-white/15 pb-3 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-[#38BDF8]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#FFFFFF]">
              Cargo Manifest & Commercial Batches
            </h3>
            <p className="text-xs text-[#A0C4E2]">
              Bill of Lading manifest breakdown with batch verification & hold allocation (click row to focus 3D hold)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#A0C4E2] bg-white/10 border border-white/15 px-2.5 py-1 rounded-lg">
          {rows.length} HOLD ALLOCATIONS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-white/5 border-b border-white/15 text-[#A0C4E2] uppercase font-bold text-[10px] tracking-wider">
              <th className="py-2.5 px-3">Batch ID</th>
              <th className="py-2.5 px-3">Hold</th>
              <th className="py-2.5 px-3">Cargo Type</th>
              <th className="py-2.5 px-3 text-right">Allocated (MT)</th>
              <th className="py-2.5 px-3 text-right">Loaded (MT)</th>
              <th className="py-2.5 px-3 text-right">Discharged (MT)</th>
              <th className="py-2.5 px-3 text-right">Onboard (MT)</th>
              <th className="py-2.5 px-3 text-center">Status</th>
              <th className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r, idx) => {
              const isSelected = selectedHoldNumber === r.holdNumber;
              return (
                <tr
                  key={idx}
                  onClick={() => onSelectHoldNumber(r.holdNumber)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-white/15 font-semibold text-white'
                      : 'hover:bg-white/5 text-[#E2E8F0]'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#38BDF8]" />
                      <span className="font-mono font-bold text-[#38BDF8]">{r.batch}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                        isSelected
                          ? 'bg-[#FF7A00] text-white border-white shadow-md'
                          : 'bg-white/10 text-white border-white/20'
                      }`}
                    >
                      {r.holdCode}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div>
                      <span className="font-semibold text-white">{r.cargo}</span>
                      <span className="block text-[10px] text-[#A0C4E2]">{r.supplier}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-white">
                    {r.allocated?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#34D399] font-bold">
                    {r.loaded?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#A0C4E2]">
                    {r.discharged?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#38BDF8] font-bold">
                    {r.onboard?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-center">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-3 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectHoldNumber(r.holdNumber);
                      }}
                      className="px-2.5 py-1 bg-white/10 hover:bg-[#0867B2] text-[#FFFFFF] rounded-lg text-[10px] font-bold transition-all inline-flex items-center gap-1 cursor-pointer border border-white/15"
                    >
                      <span>Focus 3D</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
