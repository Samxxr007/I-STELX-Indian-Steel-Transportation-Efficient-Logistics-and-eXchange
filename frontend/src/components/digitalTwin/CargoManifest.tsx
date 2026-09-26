import React from 'react';
import { DigitalTwinBatch, DigitalTwinHold } from '../../types/digitalTwin';
import { StatusBadge } from '../common/StatusBadge';
import { FileText, QrCode, Tag, ArrowRight } from 'lucide-react';

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
  // Synthesize flat manifest rows matching the required columns
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
    <div className="istelx-card bg-white p-5 border border-[#CBD5E1] shadow-md">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-[#EBF4FC] text-[#0867B2]">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-extrabold text-base text-[#063B68]">
              Cargo Manifest & Commercial Batches
            </h3>
            <p className="text-xs text-[#64748B]">
              Bill of Lading manifest breakdown with batch verification & hold allocation (click row to select 3D hold)
            </p>
          </div>
        </div>

        <span className="text-xs font-mono font-bold text-[#0867B2] bg-[#EBF4FC] px-2.5 py-1 rounded-lg">
          {rows.length} HOLD ALLOCATIONS
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#CBD5E1] text-[#475569] uppercase font-bold text-[10px] tracking-wider">
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
          <tbody className="divide-y divide-[#E2E8F0]">
            {rows.map((r, idx) => {
              const isSelected = selectedHoldNumber === r.holdNumber;
              return (
                <tr
                  key={idx}
                  onClick={() => onSelectHoldNumber(r.holdNumber)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FFF8F0] font-semibold text-[#063B68]'
                      : 'hover:bg-[#F8FAFC] text-[#1E293B]'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#0867B2]" />
                      <span className="font-mono font-bold text-[#0867B2]">{r.batch}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        isSelected
                          ? 'bg-[#FF7A00] text-white shadow-xs'
                          : 'bg-[#063B68] text-white'
                      }`}
                    >
                      {r.holdCode}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div>
                      <span className="font-semibold">{r.cargo}</span>
                      <span className="block text-[10px] text-[#64748B]">{r.supplier}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono">
                    {r.allocated?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#00843D] font-bold">
                    {r.loaded?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#64748B]">
                    {r.discharged?.toLocaleString()}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-[#063B68] font-bold">
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
                      className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#0867B2] hover:text-white rounded text-[10px] font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
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
