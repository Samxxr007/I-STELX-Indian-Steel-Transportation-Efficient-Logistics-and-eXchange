import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Database, Ship, Anchor, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const MasterDataPage: React.FC = () => {
  const [health, setHealth] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'VESSELS' | 'PORTS' | 'ROUTES'>('VESSELS');
  const [vessels, setVessels] = useState<any[]>([]);
  const [ports, setPorts] = useState<any[]>([]);

  useEffect(() => {
    Promise.all([
      api.getSystemHealth(),
      api.getVessels(),
      api.getPorts()
    ]).then(([h, v, p]) => {
      setHealth(h);
      setVessels(v);
      setPorts(p);
    }).catch(console.error);
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-[#063B68]" />
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Master Maritime Data & System Topology
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Enterprise master reference catalogs for bulk carriers, maritime terminals, bathymetric depths, and sea lane waypoints.
        </p>
      </div>

      {/* System Health Top Card */}
      {health && (
        <div className="istelx-card p-5 bg-gradient-to-r from-[#063B68] to-[#0867B2] text-white rounded-xl grid grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-[#CBD5E1] uppercase font-bold">API Gateway Status</span>
            <div className="font-heading font-bold text-base mt-1 text-white">{health.api_gateway}</div>
          </div>
          <div>
            <span className="text-[10px] text-[#CBD5E1] uppercase font-bold">AIS Telemetry Stream</span>
            <div className="font-heading font-bold text-base mt-1 text-[#00843D] bg-white/90 px-2 py-0.5 rounded w-fit">
              {health.ais_telemetry_stream}
            </div>
          </div>
          <div>
            <span className="text-[10px] text-[#CBD5E1] uppercase font-bold">Monitored Vessels</span>
            <div className="font-heading font-bold text-xl mt-1 text-white">{health.active_vessels_tracked} Fleet Units</div>
          </div>
          <div>
            <span className="text-[10px] text-[#CBD5E1] uppercase font-bold">Active Ports</span>
            <div className="font-heading font-bold text-xl mt-1 text-white">{health.major_ports_monitored} Terminals</div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="border-b border-[#CBD5E1] bg-white rounded-t-xl px-4 flex items-center gap-1">
        {(['VESSELS', 'PORTS', 'ROUTES'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-[#0867B2] text-[#0867B2]'
                : 'border-transparent text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            {tab === 'VESSELS' && `Fleet Master (${vessels.length})`}
            {tab === 'PORTS' && `Ports & Terminals (${ports.length})`}
            {tab === 'ROUTES' && 'Major Sea Lanes (5 Waypoint Sets)'}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      {activeTab === 'VESSELS' && (
        <div className="istelx-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b text-[#64748B] uppercase text-[10px]">
              <tr>
                <th className="p-3 font-bold">Vessel Name</th>
                <th className="p-3 font-bold">IMO</th>
                <th className="p-3 font-bold">Class</th>
                <th className="p-3 font-bold">DWT Capacity</th>
                <th className="p-3 font-bold">Draft</th>
                <th className="p-3 font-bold">Beam / LOA</th>
                <th className="p-3 font-bold">Daily Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {vessels.map(v => (
                <tr key={v.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-bold text-[#063B68]">{v.name}</td>
                  <td className="p-3 font-mono text-[#64748B]">{v.imo}</td>
                  <td className="p-3 font-medium">{v.vessel_type}</td>
                  <td className="p-3">{v.dwt.toLocaleString()} MT</td>
                  <td className="p-3 font-bold text-[#102A43]">{v.draft_m} m</td>
                  <td className="p-3 text-[#64748B]">{v.beam_m}m / {v.loa_m}m</td>
                  <td className="p-3 font-mono font-semibold text-[#00843D]">${v.daily_charter_rate_usd.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'PORTS' && (
        <div className="istelx-card overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8FAFC] border-b text-[#64748B] uppercase text-[10px]">
              <tr>
                <th className="p-3 font-bold">Port Name</th>
                <th className="p-3 font-bold">UN/LOCODE</th>
                <th className="p-3 font-bold">Country</th>
                <th className="p-3 font-bold">Max Draft</th>
                <th className="p-3 font-bold">Max LOA</th>
                <th className="p-3 font-bold">Berths</th>
                <th className="p-3 font-bold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {ports.map(p => (
                <tr key={p.id} className="hover:bg-[#F8FAFC]">
                  <td className="p-3 font-bold text-[#063B68]">{p.name}</td>
                  <td className="p-3 font-mono text-[#0867B2]">{p.code}</td>
                  <td className="p-3 text-[#475569]">{p.country}</td>
                  <td className="p-3 font-bold">{p.max_draft_m} m</td>
                  <td className="p-3">{p.max_loa_m} m</td>
                  <td className="p-3">{p.berths_count} Berths</td>
                  <td className="p-3 font-semibold text-[#00843D]">{p.port_status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'ROUTES' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Hay Point (AU) → Visakhapatnam (IN)', distance: '4,650 NM', duration: '16.5 Days', cargo: 'Prime Hard Coking Coal', risk: 'Medium (Monsoon Corridor)' },
            { name: 'Port Hedland (AU) → Gangavaram (IN)', distance: '3,850 NM', duration: '14.8 Days', cargo: 'Iron Ore Fines', risk: 'Low' },
            { name: 'Newcastle (AU) → Haldia (IN)', distance: '5,100 NM', duration: '18.2 Days', cargo: 'Coking Coal', risk: 'High (Hooghly River Draft Limit)' },
            { name: 'Richards Bay (ZA) → Chennai (IN)', distance: '4,400 NM', duration: '15.6 Days', cargo: 'Thermal Coal', risk: 'Low' },
            { name: 'Gladstone (AU) → Dhamra (IN)', distance: '4,800 NM', duration: '16.8 Days', cargo: 'Coking Coal', risk: 'Low (Deep Capesize Terminal)' }
          ].map((r, idx) => (
            <div key={idx} className="istelx-card p-4 space-y-2 border border-[#CBD5E1]">
              <div className="font-heading font-bold text-sm text-[#063B68]">{r.name}</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-[#475569] pt-1">
                <div>Distance: <span className="font-mono font-bold text-[#102A43]">{r.distance}</span></div>
                <div>Sailing: <span className="font-medium text-[#102A43]">{r.duration}</span></div>
                <div>Primary Cargo: <span className="font-medium text-[#102A43]">{r.cargo}</span></div>
                <div>Risk Rating: <span className="font-bold text-[#FF7A00]">{r.risk}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
