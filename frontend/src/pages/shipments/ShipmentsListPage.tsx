import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Shipment } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Package,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Ship,
  Clock,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const ShipmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getShipments()
      .then(setShipments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = shipments.filter(s => {
    if (statusFilter !== 'ALL') {
      if (statusFilter === 'DELAYED') {
        if (s.eta_variance_hours <= 6.0) return false;
      } else if (!s.status.includes(statusFilter)) {
        return false;
      }
    }
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const vName = s.vessel_name?.toLowerCase() || '';
    return (
      s.shipment_code.toLowerCase().includes(q) ||
      s.cargo_type.toLowerCase().includes(q) ||
      vName.includes(q) ||
      s.origin_port.toLowerCase().includes(q) ||
      s.destination_port.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Shipment Operations & Fleet Tracking
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Active voyages, departure status, telemetry, ETA predictions, and completion records.
          </p>
        </div>

        <button
          onClick={() => navigate('/tracking')}
          className="px-4 py-2 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Ship className="w-4 h-4 text-[#FF7A00]" />
          <span>Open Live Control Tower Map</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="istelx-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Shipment ID, Vessel, Cargo, Port..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'IN TRANSIT', 'APPROACHING PORT', 'DELAYED', 'COMPLETED'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
                statusFilter === st
                  ? 'bg-[#063B68] text-white'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Shipments Table */}
      <div className="istelx-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Shipment Code</th>
                <th className="py-3 px-4 font-bold">Assigned Vessel</th>
                <th className="py-3 px-4 font-bold">Cargo & Volume</th>
                <th className="py-3 px-4 font-bold">Route & Distance</th>
                <th className="py-3 px-4 font-bold">Current ETA</th>
                <th className="py-3 px-4 font-bold">Progress</th>
                <th className="py-3 px-4 font-bold">Landed Cost</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map(s => (
                <tr
                  key={s.id}
                  onClick={() => navigate(`/shipments/${s.id}`)}
                  className="hover:bg-[#F8FAFC] cursor-pointer"
                >
                  <td className="py-3 px-4 font-mono font-bold text-[#0867B2]">
                    {s.shipment_code}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-[#063B68]">{s.vessel_name || 'Vessel'}</div>
                    <div className="text-[10px] text-[#64748B] font-mono">{s.vessel_type || 'Panamax'}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-[#102A43]">{s.quantity_mt.toLocaleString()} MT</span>
                    <span className="text-[10px] text-[#64748B] block">{s.cargo_type}</span>
                  </td>
                  <td className="py-3 px-4 text-[#475569]">
                    <div>{s.origin_port} → {s.destination_port}</div>
                    <div className="text-[10px] text-[#94A3B8] font-mono">{s.remaining_distance_nm.toFixed(0)} NM remaining</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-[#102A43]">{s.current_eta}</div>
                    {s.eta_variance_hours > 6 ? (
                      <span className="text-[10px] font-bold text-[#D92D20]">+{s.eta_variance_hours.toFixed(1)}h Delay</span>
                    ) : (
                      <span className="text-[10px] font-semibold text-[#00843D]">On Schedule</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#0867B2] h-full" style={{ width: `${s.progress_pct}%` }} />
                      </div>
                      <span className="font-mono text-[10px] text-[#475569]">{s.progress_pct}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-[#063B68]">
                    ₹{s.planned_cost_cr} Cr
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={s.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/shipments/${s.id}`);
                      }}
                      className="px-2.5 py-1 bg-[#EBF4FC] hover:bg-[#0867B2] hover:text-white text-[#0867B2] font-bold text-[11px] rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Voyage View</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
