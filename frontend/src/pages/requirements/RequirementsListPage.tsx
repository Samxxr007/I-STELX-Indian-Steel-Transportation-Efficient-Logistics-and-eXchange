import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { CargoRequirement } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PlusCircle, Search, FileText, ArrowRight, Play, Filter } from 'lucide-react';

export const RequirementsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<CargoRequirement[]>([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRequirements()
      .then(setRequirements)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = requirements.filter(r => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      r.requirement_code.toLowerCase().includes(q) ||
      r.cargo_type.toLowerCase().includes(q) ||
      r.origin_port.toLowerCase().includes(q) ||
      r.destination_port.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Cargo Requirements Management
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Bulk raw material demand specifications, laycan fixtures, and charter planning records.
          </p>
        </div>

        <button
          onClick={() => navigate('/requirements/new')}
          className="px-4 py-2 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-all shadow-xs flex items-center gap-2 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4 text-[#FF7A00]" />
          <span>New Cargo Requirement</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="istelx-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Requirement Code, Cargo, Port..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs font-semibold text-[#64748B] flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          {['ALL', 'DRAFT', 'ANALYZED', 'PENDING_APPROVAL', 'CHARTERED'].map(st => (
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

      {/* Requirements Table */}
      <div className="istelx-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4 font-bold">Requirement ID</th>
                <th className="py-3 px-4 font-bold">Cargo Type</th>
                <th className="py-3 px-4 font-bold">Quantity</th>
                <th className="py-3 px-4 font-bold">Route</th>
                <th className="py-3 px-4 font-bold">Laycan Window</th>
                <th className="py-3 px-4 font-bold">Target Vessel</th>
                <th className="py-3 px-4 font-bold">Status</th>
                <th className="py-3 px-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filtered.map(r => (
                <tr key={r.id} className="hover:bg-[#F8FAFC]">
                  <td className="py-3 px-4 font-mono font-bold text-[#063B68]">
                    {r.requirement_code}
                  </td>
                  <td className="py-3 px-4 font-semibold text-[#102A43]">
                    {r.cargo_type}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    {r.quantity_mt.toLocaleString()} MT
                  </td>
                  <td className="py-3 px-4 text-[#475569]">
                    {r.origin_port} → {r.destination_port}
                  </td>
                  <td className="py-3 px-4 font-mono text-[#64748B]">
                    {r.laycan_start} to {r.laycan_end}
                  </td>
                  <td className="py-3 px-4 font-medium text-[#0867B2]">
                    {r.preferred_vessel_type || 'Panamax'}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={r.status} />
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => navigate('/charter-advisor', { state: { requirement_id: r.id } })}
                      className="px-2.5 py-1 bg-[#EBF4FC] hover:bg-[#0867B2] hover:text-white text-[#0867B2] font-bold text-[11px] rounded transition-colors inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Charter Advisor</span>
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
