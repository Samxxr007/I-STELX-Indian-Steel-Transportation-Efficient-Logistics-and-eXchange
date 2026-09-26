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
  AlertTriangle
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-[#00843D] animate-pulse" />
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              Maritime Control Tower & Live Fleet Tracking
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Realtime simulated AIS coordinate stream, vessel speeds, headings, and destination geofencing zones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="badge-green text-xs font-bold flex items-center gap-1.5 py-1 px-3">
            <span className="w-2 h-2 rounded-full bg-[#00843D] animate-ping" />
            <span>Simulated AIS Stream Active</span>
          </span>
        </div>
      </div>

      {/* Control Tower Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Interactive Map (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
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

        {/* Right Active Fleet Telemetry Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="istelx-card p-4 space-y-3 bg-white">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-1.5 font-heading font-bold text-sm text-[#063B68]">
                <Ship className="w-4 h-4 text-[#0867B2]" />
                <span>Tracked Vessels ({fleet.length})</span>
              </div>
              <span className="text-[10px] font-mono text-[#64748B]">Updated: Just now</span>
            </div>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter vessels or cargo..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs"
              />
            </div>

            {/* List of Vessels */}
            <div className="space-y-2 max-h-[480px] overflow-y-auto divide-y divide-[#F1F5F9]">
              {filtered.map(s => {
                const isSelected = selectedShipment?.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedShipment(s)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#EBF4FC] border border-[#0867B2] shadow-xs'
                        : 'hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-heading font-bold text-xs text-[#063B68]">
                          {s.vessel_name || 'Vessel'}
                        </div>
                        <div className="text-[10px] text-[#64748B] font-mono">
                          {s.shipment_code} • IMO {s.vessel_imo || '9876543'}
                        </div>
                      </div>
                      <StatusBadge status={s.status} size="sm" />
                    </div>

                    <div className="grid grid-cols-3 gap-1 my-2 text-[10px] bg-white/80 p-1.5 rounded border border-[#E2E8F0] text-center">
                      <div>
                        <span className="text-[#64748B] block">Speed</span>
                        <span className="font-mono font-bold text-[#102A43]">{s.current_speed_knots} kts</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Heading</span>
                        <span className="font-mono font-bold text-[#00843D]">{s.current_heading}°</span>
                      </div>
                      <div>
                        <span className="text-[#64748B] block">Progress</span>
                        <span className="font-mono font-bold text-[#FF7A00]">{s.progress_pct}%</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-[#475569]">
                      <span className="truncate">{s.origin_port} → {s.destination_port}</span>
                      <span className="font-bold text-[#063B68] flex-shrink-0">ETA: {s.current_eta}</span>
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
