import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Shipment, Port } from '../../types';
import { VesselMap } from '../../components/tracking/VesselMap';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Radio,
  Ship,
  Compass,
  Gauge,
  Clock,
  Layers,
  Search,
  RefreshCw,
  Anchor,
  ShieldCheck,
  AlertTriangle,
  Box,
  ExternalLink,
  Activity,
  Wind
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const LiveTrackingPage: React.FC = () => {
  const [fleet, setFleet] = useState<Shipment[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTracking = async () => {
    try {
      const data = await api.getFleetTracking();
      setFleet(data.fleet);
      setPorts(data.ports);
      if (data.fleet.length > 0 && !selectedShipment) {
        setSelectedShipment(data.fleet[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTracking();
    const interval = setInterval(fetchTracking, 4000);
    return () => clearInterval(interval);
  }, []);

  const filtered = fleet.filter(s => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const vName = s.vessel_name?.toLowerCase() || '';
    return s.shipment_code.toLowerCase().includes(q) || vName.includes(q) || s.cargo_type.toLowerCase().includes(q);
  });

  const totalDwt = fleet.reduce((acc, s) => acc + (s.quantity_mt || 0), 0);
  const delayedCount = fleet.filter(s => s.eta_variance_hours > 6.0).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              Maritime Control Tower & Live Fleet Tracking
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time simulated AIS coordinate stream, vessel speeds, headings, and destination geofencing zones.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shadow-2xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>AIS Stream Active (4s Sync)</span>
          </span>
        </div>
      </div>

      {/* Fleet Telemetry Summary Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Active Fleet</div>
            <div className="font-heading font-extrabold text-xl text-[#063B68] tabular-nums mt-0.5">{fleet.length} Vessels</div>
          </div>
          <Ship className="w-5 h-5 text-[#0867B2]" />
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Tonnage</div>
            <div className="font-heading font-extrabold text-xl text-[#063B68] tabular-nums mt-0.5">{(totalDwt / 1000).toFixed(0)}k MT</div>
          </div>
          <Anchor className="w-5 h-5 text-[#FF7A00]" />
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Avg Steaming Speed</div>
            <div className="font-heading font-extrabold text-xl text-[#063B68] tabular-nums mt-0.5">12.4 kts</div>
          </div>
          <Gauge className="w-5 h-5 text-emerald-600" />
        </div>

        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Delay Exceptions</div>
            <div className={`font-heading font-extrabold text-xl tabular-nums mt-0.5 ${delayedCount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {delayedCount} Delayed
            </div>
          </div>
          <AlertTriangle className={`w-5 h-5 ${delayedCount > 0 ? 'text-rose-500' : 'text-slate-400'}`} />
        </div>
      </div>

      {/* Control Tower Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
            <VesselMap
              shipments={fleet}
              ports={ports}
              selectedShipmentId={selectedShipment?.id}
              onSelectShipment={(s) => setSelectedShipment(s)}
              height="620px"
              center={selectedShipment ? [selectedShipment.current_lat, selectedShipment.current_lng] : [12.0, 85.0]}
              zoom={selectedShipment ? 5 : 4}
            />
          </div>
        </div>

        {/* Right Active Fleet Telemetry Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="istelx-card p-5 space-y-3.5 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2 font-heading font-bold text-sm text-[#063B68]">
                <Ship className="w-4 h-4 text-[#0867B2]" />
                <span>Tracked Vessels ({fleet.length})</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Live AIS
              </span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Filter vessels or cargo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-hidden focus:border-[#0867B2] focus:bg-white transition-colors"
              />
            </div>

            {/* List of Vessels */}
            <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
              {filtered.map(s => {
                const isSelected = selectedShipment?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedShipment(s)}
                    className={`p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-sky-50/80 border-[#0867B2] shadow-xs ring-1 ring-[#0867B2]/30'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-heading font-bold text-xs text-[#063B68]">
                          {s.vessel_name || 'Vessel'}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                          {s.shipment_code} • IMO {s.vessel_imo || '9876543'}
                        </div>
                      </div>
                      <StatusBadge status={s.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-3 gap-1 my-2.5 text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-200 text-center tabular-nums">
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-semibold">Speed</span>
                        <span className="font-mono font-bold text-slate-800">{s.current_speed_knots} kts</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-semibold">Heading</span>
                        <span className="font-mono font-bold text-emerald-700">{s.current_heading}°</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase font-semibold">Progress</span>
                        <span className="font-mono font-bold text-[#FF7A00]">{s.progress_pct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-600 mb-2">
                      <span className="truncate">{s.origin_port} → {s.destination_port}</span>
                      <span className="font-bold text-[#063B68] flex-shrink-0">ETA: {s.current_eta}</span>
                    </div>

                    {/* Quick 3D Digital Twin Link */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 font-medium">
                        {s.quantity_mt?.toLocaleString()} MT {s.cargo_type}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/shipments/${s.id}/digital-twin`);
                        }}
                        className="inline-flex items-center gap-1 text-[10px] font-bold text-[#0867B2] hover:text-[#063B68] hover:underline"
                      >
                        <Box className="w-3 h-3" />
                        <span>3D Twin</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
