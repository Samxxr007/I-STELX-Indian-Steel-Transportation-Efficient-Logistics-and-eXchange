import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { Vessel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Ship,
  Search,
  Filter,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  Layers,
  Compass,
  Gauge
} from 'lucide-react';

export const VesselOptimizerPage: React.FC = () => {
  const navigate = useNavigate();
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedVessels, setSelectedVessels] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getVessels()
      .then(setVessels)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: number) => {
    setSelectedVessels(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : (prev.length < 3 ? [...prev, id] : prev)
    );
  };

  const filtered = vessels.filter(v => {
    if (classFilter !== 'ALL' && v.vessel_type !== classFilter) return false;
    if (statusFilter !== 'ALL' && v.availability_status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      v.name.toLowerCase().includes(q) ||
      v.imo.toLowerCase().includes(q) ||
      v.vessel_type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Dry Bulk Vessel Optimizer & Fleet Master
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Evaluate Handysize, Supramax, Panamax, and Capesize carriers for deadweight capacity, draft clearance, and laycan suitability.
          </p>
        </div>

        {selectedVessels.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-[#063B68]">
              {selectedVessels.length} vessel{selectedVessels.length > 1 ? 's' : ''} selected
            </span>
            <button
              onClick={() => navigate('/charter-advisor', { state: { vessel_id: selectedVessels[0] } })}
              className="px-4 py-2 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-bold text-xs rounded-lg transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <span>Run AI Charter Advisor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="istelx-card p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
        <div className="sm:col-span-5 relative">
          <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search Vessel Name, IMO, Class..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
          />
        </div>

        <div className="sm:col-span-4 flex items-center gap-1.5 overflow-x-auto">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Class:</span>
          {['ALL', 'Panamax', 'Capesize', 'Supramax', 'Handysize'].map(c => (
            <button
              key={c}
              onClick={() => setClassFilter(c)}
              className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                classFilter === c
                  ? 'bg-[#063B68] text-white'
                  : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="sm:col-span-3 flex items-center gap-1.5 justify-end">
          <span className="text-[11px] font-bold text-[#64748B] uppercase">Status:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-semibold text-[#063B68]"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="COMMITTED">Committed</option>
          </select>
        </div>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(v => {
          const isSelected = selectedVessels.includes(v.id);
          return (
            <div
              key={v.id}
              className={`istelx-card istelx-card-hover p-5 space-y-4 rounded-xl relative transition-all ${
                isSelected ? 'border-[#0867B2] ring-2 ring-[#0867B2]/20' : ''
              }`}
            >
              {/* Top info */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-base text-[#063B68]">
                      {v.name}
                    </h3>
                  </div>
                  <div className="text-xs font-mono text-[#64748B]">
                    IMO {v.imo} • Flag: {v.flag} • Built {v.year_built}
                  </div>
                </div>
                <StatusBadge status={v.availability_status} />
              </div>

              {/* Vessel specs badge grid */}
              <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-center text-xs">
                <div>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">Class / DWT</div>
                  <div className="font-bold text-[#063B68]">{v.vessel_type}</div>
                  <div className="font-mono text-[10px] text-[#475569]">{v.dwt.toLocaleString()} DWT</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">Max Draft</div>
                  <div className="font-bold text-[#102A43]">{v.draft_m} m</div>
                  <div className="text-[10px] text-[#64748B]">Beam: {v.beam_m}m</div>
                </div>

                <div>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">Design Speed</div>
                  <div className="font-bold text-[#00843D]">{v.speed_knots} kts</div>
                  <div className="text-[10px] text-[#64748B]">{v.fuel_consumption_tpd} tpd</div>
                </div>
              </div>

              {/* Current position & availability */}
              <div className="text-xs space-y-1 text-[#475569]">
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Current Location:</span>
                  <span className="font-semibold text-[#102A43]">{v.current_location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#64748B]">Charter Daily Hire:</span>
                  <span className="font-mono font-bold text-[#063B68]">${v.daily_charter_rate_usd.toLocaleString()} / day</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => toggleSelect(v.id)}
                  className={`px-3 py-1.5 rounded text-xs font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#0867B2] text-white'
                      : 'bg-[#F1F5F9] text-[#063B68] hover:bg-[#E2E8F0]'
                  }`}
                >
                  {isSelected ? '✓ Selected' : '+ Compare'}
                </button>

                <button
                  onClick={() => navigate('/charter-advisor', { state: { vessel_id: v.id } })}
                  className="px-3.5 py-1.5 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>Select for Charter</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
