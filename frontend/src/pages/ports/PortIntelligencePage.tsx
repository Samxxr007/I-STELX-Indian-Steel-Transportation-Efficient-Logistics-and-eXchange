import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Port, Vessel } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Anchor,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  Layers,
  MapPin,
  Clock,
  ShieldCheck,
  Compass
} from 'lucide-react';

export const PortIntelligencePage: React.FC = () => {
  const [ports, setPorts] = useState<Port[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedPortId, setSelectedPortId] = useState<number>(1);
  const [selectedVesselId, setSelectedVesselId] = useState<number>(1);
  const [compatResult, setCompatResult] = useState<any>(null);
  const [checking, setChecking] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getPorts(), api.getVessels()]).then(([pData, vData]) => {
      setPorts(pData);
      setVessels(vData);
      if (pData.length > 0) setSelectedPortId(pData[0].id);
      if (vData.length > 0) setSelectedVesselId(vData[0].id);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleCheckCompatibility = async () => {
    setChecking(true);
    try {
      const res = await api.checkPortCompatibility(selectedPortId, selectedVesselId);
      setCompatResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setChecking(false);
    }
  };

  const filteredPorts = ports.filter(p => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.country.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Port Intelligence & Compatibility Engine
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Monitor terminal depths, berth LOA allowances, real-time waiting queues, and validate vessel suitability.
          </p>
        </div>
      </div>

      {/* PORT COMPATIBILITY VALIDATION TOOL */}
      <div className="istelx-card p-6 bg-gradient-to-r from-[#F8FAFC] via-white to-[#F8FAFC] border border-[#0867B2]/30 shadow-md space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#0867B2]" />
          <div>
            <h2 className="font-heading font-bold text-base text-[#063B68]">
              Automated Port Compatibility Engine
            </h2>
            <p className="text-xs text-[#64748B]">
              Cross-evaluates vessel draft, beam, length overall (LOA), and DWT against port bathymetry and terminal limits.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Select Target Port:
            </label>
            <select
              value={selectedPortId}
              onChange={(e) => setSelectedPortId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
            >
              {ports.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} Port ({p.code}) — Max Draft: {p.max_draft_m}m
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-5">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1.5">
              Select Bulk Carrier Vessel:
            </label>
            <select
              value={selectedVesselId}
              onChange={(e) => setSelectedVesselId(Number(e.target.value))}
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
            >
              {vessels.map(v => (
                <option key={v.id} value={v.id}>
                  {v.name} ({v.vessel_type}, {v.dwt.toLocaleString()} DWT) — Draft: {v.draft_m}m
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <button
              onClick={handleCheckCompatibility}
              disabled={checking}
              className="w-full py-2 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Play className="w-3.5 h-3.5 text-[#FF7A00]" />
              <span>{checking ? 'Checking...' : 'VALIDATE'}</span>
            </button>
          </div>
        </div>

        {/* Compatibility Result Breakdown */}
        {compatResult && (
          <div className={`p-4 rounded-xl border mt-4 space-y-3 ${
            compatResult.is_compatible ? 'bg-[#E6F4EA]/40 border-[#C4E7D0]' : 'bg-[#FEECEB]/40 border-[#FCCECE]'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {compatResult.is_compatible ? (
                  <CheckCircle2 className="w-5 h-5 text-[#00843D]" />
                ) : (
                  <XCircle className="w-5 h-5 text-[#D92D20]" />
                )}
                <span className="font-heading font-extrabold text-sm text-[#063B68]">
                  {compatResult.overall_summary}
                </span>
              </div>
              <StatusBadge status={compatResult.status} size="md" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] text-xs">
                <div className="text-[10px] text-[#64748B] font-bold uppercase">Draft Clearance</div>
                <div className="font-bold text-[#102A43] mt-0.5">
                  {compatResult.draft_check?.vessel_draft_m}m vs {compatResult.draft_check?.port_max_draft_m}m Limit
                </div>
                <div className={`text-[10px] font-semibold mt-0.5 ${compatResult.draft_check?.passed ? 'text-[#00843D]' : 'text-[#D92D20]'}`}>
                  {compatResult.draft_check?.passed ? `✓ Clearance: +${compatResult.draft_check?.margin_m}m` : `✕ Deficit: ${compatResult.draft_check?.margin_m}m`}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] text-xs">
                <div className="text-[10px] text-[#64748B] font-bold uppercase">Berth Length (LOA)</div>
                <div className="font-bold text-[#102A43] mt-0.5">
                  {compatResult.loa_check?.vessel_loa_m}m vs {compatResult.loa_check?.port_max_loa_m}m Max
                </div>
                <div className={`text-[10px] font-semibold mt-0.5 ${compatResult.loa_check?.passed ? 'text-[#00843D]' : 'text-[#D92D20]'}`}>
                  {compatResult.loa_check?.passed ? `✓ Margin: +${compatResult.loa_check?.margin_m}m` : `✕ Exceeds by ${compatResult.loa_check?.margin_m}m`}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] text-xs">
                <div className="text-[10px] text-[#64748B] font-bold uppercase">Beam & Crane Reach</div>
                <div className="font-bold text-[#102A43] mt-0.5">
                  {compatResult.beam_check?.vessel_beam_m}m vs {compatResult.beam_check?.port_max_beam_m}m
                </div>
                <div className={`text-[10px] font-semibold mt-0.5 ${compatResult.beam_check?.passed ? 'text-[#00843D]' : 'text-[#D92D20]'}`}>
                  {compatResult.beam_check?.passed ? '✓ Fits unloader envelope' : '✕ Exceeds reach'}
                </div>
              </div>

              <div className="p-2.5 bg-white rounded-lg border border-[#CBD5E1] text-xs">
                <div className="text-[10px] text-[#64748B] font-bold uppercase">DWT Displacement</div>
                <div className="font-bold text-[#102A43] mt-0.5">
                  {compatResult.dwt_check?.vessel_dwt.toLocaleString()} MT
                </div>
                <div className={`text-[10px] font-semibold mt-0.5 ${compatResult.dwt_check?.passed ? 'text-[#00843D]' : 'text-[#D92D20]'}`}>
                  {compatResult.dwt_check?.passed ? '✓ Within displacement limit' : '✕ Exceeds limit'}
                </div>
              </div>
            </div>

            <div className="pt-2 text-xs space-y-1">
              <span className="font-bold text-[#063B68] block">Evaluation Justifications:</span>
              {compatResult.reasons?.map((r: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 text-[#475569]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#0867B2]" />
                  <span>{r}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* PORT DATABASE CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-base text-[#063B68]">
            Master Port Directory & Operational Status
          </h2>
          <div className="w-64 relative">
            <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search ports by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#102A43]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPorts.map(p => (
            <div key={p.id} className="istelx-card istelx-card-hover p-5 space-y-3.5 rounded-xl border border-[#CBD5E1]">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading font-extrabold text-base text-[#063B68]">
                      {p.name}
                    </h3>
                    <span className="font-mono text-xs font-bold text-[#0867B2] bg-[#EBF4FC] px-1.5 py-0.5 rounded">
                      {p.code}
                    </span>
                  </div>
                  <div className="text-xs text-[#64748B] flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#FF7A00]" />
                    <span>{p.country} ({p.latitude.toFixed(2)}°N, {p.longitude.toFixed(2)}°E)</span>
                  </div>
                </div>
                <StatusBadge status={p.current_congestion_level + ' CONGESTION'} />
              </div>

              <div className="grid grid-cols-3 gap-2 bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] text-center text-xs">
                <div>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">Max Draft</div>
                  <div className="font-extrabold text-[#063B68] text-sm">{p.max_draft_m} m</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">Max LOA</div>
                  <div className="font-bold text-[#102A43] text-sm">{p.max_loa_m} m</div>
                </div>
                <div>
                  <div className="text-[10px] text-[#64748B] uppercase font-bold">Avg Queue</div>
                  <div className="font-mono font-bold text-[#D92D20] text-sm">{p.waiting_time_hours} hrs</div>
                </div>
              </div>

              {p.operational_notes && (
                <p className="text-xs text-[#475569] leading-relaxed bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0]">
                  <span className="font-bold text-[#063B68]">Operational Notes: </span>
                  {p.operational_notes}
                </p>
              )}

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                <span className="text-[#64748B]">Berths Available: <span className="font-bold text-[#102A43]">{p.berths_count}</span></span>
                <span className="text-[11px] font-bold text-[#00843D]">{p.port_status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
