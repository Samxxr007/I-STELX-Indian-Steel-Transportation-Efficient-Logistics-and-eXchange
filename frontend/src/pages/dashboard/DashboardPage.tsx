import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { DashboardKPIs, Shipment, Port, AlertItem } from '../../types';
import { KpiCard } from '../../components/common/KpiCard';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VesselMap } from '../../components/tracking/VesselMap';
import {
  Package,
  Ship,
  Weight,
  CalendarCheck,
  DollarSign,
  AlertTriangle,
  TrendingUp,
  Anchor,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  PlusCircle,
  Activity,
  Layers,
  CheckCircle2,
  Clock,
  Filter
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterCargo, setFilterCargo] = useState<string>('ALL');

  const [kpis, setKpis] = useState<DashboardKPIs>({
    active_shipments: 14,
    vessels_at_sea: 8,
    cargo_in_transit_mt: 620000,
    arriving_this_week: 4,
    freight_exposure_cr: 142.5,
    active_alerts: 6
  });

  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [ports, setPorts] = useState<Port[]>([]);
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [cargoDist, setCargoDist] = useState<any[]>([]);
  const [marketTrend, setMarketTrend] = useState<any>(null);

  const loadDashboardData = async () => {
    try {
      const [dash, portsData] = await Promise.all([
        api.getDashboard(),
        api.getPorts()
      ]);
      setKpis(dash.kpis);
      setShipments(dash.shipments);
      setAlerts(dash.alerts);
      setCargoDist(dash.cargo_distribution || []);
      setMarketTrend(dash.market_trend);
      setPorts(portsData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 8000);
    return () => clearInterval(interval);
  }, []);

  // Filtered shipments for Map and Table
  const filteredShipments = shipments.filter(s => {
    if (filterCargo === 'ALL') return true;
    if (filterCargo === 'DELAYED') return s.eta_variance_hours > 6.0;
    return s.cargo_type?.toUpperCase().includes(filterCargo);
  });

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              Logistics Command Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-sky-50 text-[#0867B2] font-semibold text-xs border border-sky-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              SAIL Fleet Control Tower
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Real-time Bay of Bengal & Indian Ocean maritime tracking, freight forecasting, and demurrage prevention.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDashboardData()}
            className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#063B68] hover:bg-slate-50 transition-colors cursor-pointer shadow-2xs group"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button
            onClick={() => navigate('/requirements/new')}
            className="px-4 py-2.5 bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white font-bold text-xs rounded-xl transition-all shadow-md shadow-[#FF7A00]/20 hover:shadow-lg flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Cargo Demand</span>
          </button>
        </div>
      </div>

      {/* 6 ENTERPRISE KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4">
        <KpiCard
          title="Active Shipments"
          value={kpis.active_shipments}
          subtitle="All active voyages"
          change="+2 this month"
          icon={Package}
          iconColor="text-[#0867B2]"
          bgColor="bg-sky-50"
          onClick={() => navigate('/shipments')}
        />
        <KpiCard
          title="Vessels At Sea"
          value={kpis.vessels_at_sea}
          subtitle="Live tracked fleet"
          change="8 Live AIS"
          icon={Ship}
          iconColor="text-[#063B68]"
          bgColor="bg-slate-100"
          onClick={() => navigate('/tracking')}
        />
        <KpiCard
          title="Cargo In Transit"
          value={`${(kpis.cargo_in_transit_mt / 1000).toFixed(0)}k MT`}
          subtitle="Raw bulk materials"
          change="52% Coking Coal"
          icon={Weight}
          iconColor="text-[#FF7A00]"
          bgColor="bg-amber-50"
        />
        <KpiCard
          title="Arriving This Week"
          value={kpis.arriving_this_week}
          subtitle="East coast ports"
          change="4 berthing"
          icon={CalendarCheck}
          iconColor="text-emerald-700"
          bgColor="bg-emerald-50"
        />
        <KpiCard
          title="Freight Exposure"
          value={`₹${kpis.freight_exposure_cr} Cr`}
          subtitle="Committed landed cost"
          change="₹16.43 Cr / fix"
          icon={DollarSign}
          iconColor="text-[#063B68]"
          bgColor="bg-sky-50"
          onClick={() => navigate('/cost')}
        />
        <KpiCard
          title="Active Alerts"
          value={kpis.active_alerts}
          subtitle="Requires attention"
          change="2 Critical"
          isPositive={false}
          icon={AlertTriangle}
          iconColor="text-rose-600"
          bgColor="bg-rose-50"
          onClick={() => navigate('/alerts')}
        />
      </div>

      {/* MAIN SECTION: LIVE VESSEL MAP WITH INTERACTIVE CONTROLS */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-[#063B68]" />
            <h2 className="font-heading font-bold text-base text-[#063B68]">
              Live Maritime Control Tower (Bay of Bengal & Indian Ocean)
            </h2>
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-500 mr-1">
              <Filter className="w-3 h-3" />
              <span>Filter:</span>
            </div>
            {['ALL', 'COAL', 'IRON ORE', 'DELAYED'].map(f => (
              <button
                key={f}
                onClick={() => setFilterCargo(f)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  filterCargo === f
                    ? 'bg-[#063B68] text-white shadow-2xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
            <button
              onClick={() => navigate('/tracking')}
              className="text-xs font-bold text-[#0867B2] hover:underline flex items-center gap-1 ml-2 cursor-pointer"
            >
              <span>Full Control Tower</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
          <VesselMap
            shipments={filteredShipments}
            ports={ports}
            height="520px"
            center={[12.0, 85.0]}
            zoom={4}
          />
        </div>
      </div>

      {/* SECOND ROW: Freight Market Trend & Port Congestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Freight Market Trend (5 cols) */}
        <div className="lg:col-span-5 istelx-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF7A00]" />
              <h3 className="font-heading font-bold text-sm text-[#063B68]">
                Freight Market Signal (Panamax Dry Bulk)
              </h3>
            </div>
            <StatusBadge status={marketTrend?.trend_direction || 'UPWARD'} size="sm" />
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                Hay Point → East Coast India
              </div>
              <div className="font-heading font-extrabold text-3xl text-[#063B68] mt-1 tabular-nums">
                ${marketTrend?.current_rate_usd_mt || 24.30}
                <span className="text-xs font-normal text-slate-500"> / MT</span>
              </div>
              <div className="text-xs font-semibold text-[#FF7A00] mt-1 flex items-center gap-1">
                <span>30-Day Forecast:</span>
                <span className="font-bold tabular-nums">${marketTrend?.forecast_30d_usd_mt || 25.90} / MT</span>
                <span className="text-emerald-600 font-mono">({marketTrend?.weekly_change_pct || '+3.8%'})</span>
              </div>
            </div>

            <div className="text-right space-y-1.5 text-xs">
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-semibold">BDI Index</div>
                <div className="font-mono font-bold text-slate-900 tabular-nums">
                  {marketTrend?.bdi_index || 1845}
                </div>
              </div>
              <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                <div className="text-[10px] text-slate-500 font-semibold">VLSFO Bunker</div>
                <div className="font-mono font-bold text-slate-900 tabular-nums">
                  ${marketTrend?.bunker_vlsfo_usd || 624.50}
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-600 leading-relaxed">
            Market Intelligence: Pacific dry bulk indices are trending upward (+3.8% 15-day forward momentum). Early fixture execution locks in lower baseline freight exposure before seasonal monsoon spikes.
          </div>

          <button
            onClick={() => navigate('/freight')}
            className="w-full py-2.5 bg-sky-50 hover:bg-sky-100 text-[#0867B2] font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-sky-200"
          >
            <span>Open Freight ML Forecasting Model</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Port Congestion & Waiting Index (7 cols) */}
        <div className="lg:col-span-7 istelx-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Anchor className="w-4 h-4 text-[#0867B2]" />
              <h3 className="font-heading font-bold text-sm text-[#063B68]">
                Major Indian Steel Ports - Draft & Congestion Matrix
              </h3>
            </div>
            <button
              onClick={() => navigate('/ports')}
              className="text-xs font-semibold text-[#0867B2] hover:underline"
            >
              Port Database →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5 font-bold">Port Name</th>
                  <th className="pb-2.5 font-bold">Max Draft</th>
                  <th className="pb-2.5 font-bold">Berths</th>
                  <th className="pb-2.5 font-bold">Avg Queue</th>
                  <th className="pb-2.5 font-bold">Congestion</th>
                  <th className="pb-2.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {ports.filter(p => p.is_indian_port).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 font-bold text-[#063B68]">
                      {p.name} <span className="text-[10px] text-slate-400 font-mono">({p.code})</span>
                    </td>
                    <td className="py-3 font-medium">{p.max_draft_m} m</td>
                    <td className="py-3 font-medium">{p.berths_count}</td>
                    <td className="py-3 font-semibold font-mono text-rose-600">
                      {p.waiting_time_hours} hrs
                    </td>
                    <td className="py-3">
                      <StatusBadge status={p.current_congestion_level} size="sm" />
                    </td>
                    <td className="py-3 text-right">
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Operational
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* THIRD ROW: Upcoming Arrivals & Cargo Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Active Shipments Table (8 cols) */}
        <div className="lg:col-span-8 istelx-card p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-[#063B68]" />
              <h3 className="font-heading font-bold text-sm text-[#063B68]">
                Active Steel Raw Material Shipments
              </h3>
            </div>
            <button
              onClick={() => navigate('/shipments')}
              className="text-xs font-semibold text-[#0867B2] hover:underline"
            >
              View All Shipments →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs tabular-nums">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                  <th className="pb-2.5 font-bold">Shipment ID</th>
                  <th className="pb-2.5 font-bold">Vessel</th>
                  <th className="pb-2.5 font-bold">Cargo & Volume</th>
                  <th className="pb-2.5 font-bold">Route</th>
                  <th className="pb-2.5 font-bold">ETA</th>
                  <th className="pb-2.5 font-bold">Progress</th>
                  <th className="pb-2.5 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredShipments.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => navigate(`/shipments/${s.id}`)}
                    className="hover:bg-slate-50 cursor-pointer transition-colors group"
                  >
                    <td className="py-3 font-mono font-bold text-[#0867B2] group-hover:underline">
                      {s.shipment_code}
                    </td>
                    <td className="py-3 font-semibold text-slate-900">
                      {s.vessel_name || 'Vessel'}
                    </td>
                    <td className="py-3">
                      <span className="font-medium text-slate-800">{s.quantity_mt?.toLocaleString()} MT</span>
                      <span className="text-[10px] text-slate-400 block">{s.cargo_type}</span>
                    </td>
                    <td className="py-3 text-slate-600">
                      {s.origin_port} → {s.destination_port}
                    </td>
                    <td className="py-3 font-medium">
                      <div>{s.current_eta}</div>
                      {s.eta_variance_hours > 6 && (
                        <span className="text-[10px] text-rose-600 font-bold block">
                          +{s.eta_variance_hours.toFixed(1)}h Delay
                        </span>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-[#0867B2] to-[#FF7A00] h-full rounded-full"
                            style={{ width: `${s.progress_pct}%` }}
                          />
                        </div>
                        <span className="font-mono text-[10px] text-slate-500">{s.progress_pct}%</span>
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={s.status} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cargo Distribution & Critical Alerts (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Cargo Distribution Chart */}
          <div className="istelx-card p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-heading font-bold text-sm text-[#063B68]">
                In-Transit Cargo Breakdown
              </h3>
              <span className="text-[10px] font-mono text-slate-500 font-bold">620k MT Total</span>
            </div>

            <div className="h-44 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={cargoDist}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={46}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {cargoDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#0867B2'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} MT`, 'Volume']}
                    contentStyle={{ borderRadius: '10px', fontSize: '11px', border: '1px solid #CBD5E1', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-100">
              {cargoDist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-slate-600">{item.name} ({item.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts Feed */}
          <div className="istelx-card p-6 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <h3 className="font-heading font-bold text-sm text-[#063B68]">
                  Critical Alerts
                </h3>
              </div>
              <button
                onClick={() => navigate('/alerts')}
                className="text-[11px] font-bold text-[#0867B2] hover:underline"
              >
                All Alerts →
              </button>
            </div>

            <div className="space-y-2.5">
              {alerts.slice(0, 3).map(a => (
                <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 hover:border-slate-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B68]">
                      {a.category}
                    </span>
                    <StatusBadge status={a.severity} size="sm" />
                  </div>
                  <p className="text-xs text-slate-800 font-medium leading-snug">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
