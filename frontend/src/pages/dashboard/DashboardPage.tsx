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
  Layers
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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

  return (
    <div className="space-y-6">
      {/* Top Welcome & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              Logistics Command Center
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#EBF4FC] text-[#0867B2] font-semibold text-xs border border-[#CBD5E1]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00843D]" />
              SAIL Fleet Control Tower
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Predict freight trends, optimize vessel fixtures, track active voyages, and prevent port demurrage.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => loadDashboardData()}
            className="p-2 rounded-lg bg-white border border-[#CBD5E1] text-[#475569] hover:text-[#063B68] hover:bg-[#F8FAFC] transition-colors cursor-pointer shadow-2xs"
            title="Refresh Live Telemetry"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => navigate('/requirements/new')}
            className="px-3.5 py-2 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-bold text-xs rounded-lg transition-all shadow-xs hover:shadow-md flex items-center gap-1.5 cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Cargo Requirement</span>
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
          bgColor="bg-[#EBF4FC]"
          onClick={() => navigate('/shipments')}
        />
        <KpiCard
          title="Vessels At Sea"
          value={kpis.vessels_at_sea}
          subtitle="Live tracked fleet"
          change="8 Live AIS"
          icon={Ship}
          iconColor="text-[#063B68]"
          bgColor="bg-[#E2EDF9]"
          onClick={() => navigate('/tracking')}
        />
        <KpiCard
          title="Cargo In Transit"
          value={`${(kpis.cargo_in_transit_mt / 1000).toFixed(0)}k MT`}
          subtitle="Raw bulk materials"
          change="52% Coking Coal"
          icon={Weight}
          iconColor="text-[#FF7A00]"
          bgColor="bg-[#FFF4E5]"
        />
        <KpiCard
          title="Arriving This Week"
          value={kpis.arriving_this_week}
          subtitle="East coast ports"
          change="4 berthing"
          icon={CalendarCheck}
          iconColor="text-[#00843D]"
          bgColor="bg-[#E6F4EA]"
        />
        <KpiCard
          title="Freight Exposure"
          value={`₹${kpis.freight_exposure_cr} Cr`}
          subtitle="Committed landed cost"
          change="₹16.43 Cr / fix"
          icon={DollarSign}
          iconColor="text-[#063B68]"
          bgColor="bg-[#EBF4FC]"
          onClick={() => navigate('/cost')}
        />
        <KpiCard
          title="Active Alerts"
          value={kpis.active_alerts}
          subtitle="Requires attention"
          change="2 Critical"
          isPositive={false}
          icon={AlertTriangle}
          iconColor="text-[#D92D20]"
          bgColor="bg-[#FEECEB]"
          onClick={() => navigate('/alerts')}
        />
      </div>

      {/* MAIN SECTION: LIVE VESSEL MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ship className="w-4 h-4 text-[#063B68]" />
            <h2 className="font-heading font-bold text-base text-[#063B68]">
              Live Maritime Control Tower (Bay of Bengal & Indian Ocean)
            </h2>
          </div>
          <button
            onClick={() => navigate('/tracking')}
            className="text-xs font-bold text-[#0867B2] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Full Control Tower View</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <VesselMap
          shipments={shipments}
          ports={ports}
          height="520px"
          center={[12.0, 85.0]}
          zoom={4}
        />
      </div>

      {/* SECOND ROW: Freight Market Trend & Port Congestion */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Freight Market Trend (5 cols) */}
        <div className="lg:col-span-5 istelx-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[#FF7A00]" />
              <h3 className="font-heading font-bold text-sm text-[#063B68]">
                Freight Market Signal (Panamax Dry Bulk)
              </h3>
            </div>
            <span className="badge-orange text-[10px] font-bold">
              {marketTrend?.trend_direction || 'UPWARD'}
            </span>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#64748B] font-medium">Hay Point → East Coast India</div>
              <div className="font-heading font-extrabold text-3xl text-[#063B68] mt-1">
                ${marketTrend?.current_rate_usd_mt || 24.30}
                <span className="text-xs font-normal text-[#64748B]"> / MT</span>
              </div>
              <div className="text-xs font-semibold text-[#FF7A00] mt-1 flex items-center gap-1">
                <span>30-Day Forecast:</span>
                <span className="font-bold">${marketTrend?.forecast_30d_usd_mt || 25.90} / MT</span>
                <span>({marketTrend?.weekly_change_pct || '+3.8%'})</span>
              </div>
            </div>

            <div className="text-right space-y-1 text-xs">
              <div className="bg-white px-2.5 py-1 rounded border border-[#CBD5E1]">
                <div className="text-[10px] text-[#64748B]">BDI Index</div>
                <div className="font-mono font-bold text-[#102A43]">{marketTrend?.bdi_index || 1845}</div>
              </div>
              <div className="bg-white px-2.5 py-1 rounded border border-[#CBD5E1]">
                <div className="text-[10px] text-[#64748B]">VLSFO Bunker</div>
                <div className="font-mono font-bold text-[#102A43]">${marketTrend?.bunker_vlsfo_usd || 624.50}</div>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#475569] leading-relaxed">
            Market Intelligence: Pacific dry bulk indices are trending upward (+3.8% 15-day forward momentum). Early fixture execution locks in lower baseline freight exposure.
          </div>

          <button
            onClick={() => navigate('/freight')}
            className="w-full py-2 bg-[#EBF4FC] hover:bg-[#d9ecfa] text-[#0867B2] font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Open Freight ML Forecasting Model</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Port Congestion & Waiting Index (7 cols) */}
        <div className="lg:col-span-7 istelx-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
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
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
                  <th className="pb-2 font-bold">Port Name</th>
                  <th className="pb-2 font-bold">Max Draft</th>
                  <th className="pb-2 font-bold">Berths</th>
                  <th className="pb-2 font-bold">Avg Queue</th>
                  <th className="pb-2 font-bold">Congestion</th>
                  <th className="pb-2 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {ports.filter(p => p.is_indian_port).map(p => (
                  <tr key={p.id} className="hover:bg-[#F8FAFC]">
                    <td className="py-2.5 font-bold text-[#063B68]">
                      {p.name} <span className="text-[10px] text-[#64748B] font-mono">({p.code})</span>
                    </td>
                    <td className="py-2.5 font-medium">{p.max_draft_m} m</td>
                    <td className="py-2.5 font-medium">{p.berths_count}</td>
                    <td className="py-2.5 font-semibold font-mono text-[#D92D20]">
                      {p.waiting_time_hours} hrs
                    </td>
                    <td className="py-2.5">
                      <StatusBadge status={p.current_congestion_level} />
                    </td>
                    <td className="py-2.5 text-right">
                      <span className="text-[11px] font-semibold text-[#00843D]">Operational</span>
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
        {/* Active Shipments & Upcoming Arrivals (8 cols) */}
        <div className="lg:col-span-8 istelx-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
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
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
                  <th className="pb-2 font-bold">Shipment ID</th>
                  <th className="pb-2 font-bold">Vessel</th>
                  <th className="pb-2 font-bold">Cargo & Volume</th>
                  <th className="pb-2 font-bold">Route</th>
                  <th className="pb-2 font-bold">ETA</th>
                  <th className="pb-2 font-bold">Progress</th>
                  <th className="pb-2 font-bold text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {shipments.map(s => (
                  <tr
                    key={s.id}
                    onClick={() => navigate(`/shipments/${s.id}`)}
                    className="hover:bg-[#F8FAFC] cursor-pointer"
                  >
                    <td className="py-2.5 font-mono font-bold text-[#0867B2]">
                      {s.shipment_code}
                    </td>
                    <td className="py-2.5 font-semibold text-[#102A43]">
                      {s.vessel_name || 'Vessel'}
                    </td>
                    <td className="py-2.5">
                      <span className="font-medium">{s.quantity_mt?.toLocaleString()} MT</span>
                      <span className="text-[10px] text-[#64748B] block">{s.cargo_type}</span>
                    </td>
                    <td className="py-2.5 text-[#475569]">
                      {s.origin_port} → {s.destination_port}
                    </td>
                    <td className="py-2.5 font-medium">
                      <div>{s.current_eta}</div>
                      {s.eta_variance_hours > 6 && (
                        <span className="text-[10px] text-[#D92D20] font-bold">+{s.eta_variance_hours.toFixed(1)}h Delay</span>
                      )}
                    </td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                          <div className="bg-[#0867B2] h-full" style={{ width: `${s.progress_pct}%` }} />
                        </div>
                        <span className="font-mono text-[10px] text-[#64748B]">{s.progress_pct}%</span>
                      </div>
                    </td>
                    <td className="py-2.5 text-right">
                      <StatusBadge status={s.status} />
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
          <div className="istelx-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <h3 className="font-heading font-bold text-sm text-[#063B68]">
                In-Transit Cargo Breakdown
              </h3>
              <span className="text-[10px] font-mono text-[#64748B]">620k MT Total</span>
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
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {cargoDist.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color || '#0867B2'} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${Number(value).toLocaleString()} MT`, 'Volume']}
                    contentStyle={{ borderRadius: '8px', fontSize: '11px', border: '1px solid #CBD5E1' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#F1F5F9]">
              {cargoDist.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate text-[#475569]">{item.name} ({item.pct}%)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts Feed */}
          <div className="istelx-card p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-2.5">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-[#D92D20]" />
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
                <div key={a.id} className="p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#063B68]">
                      {a.category}
                    </span>
                    <StatusBadge status={a.severity} size="sm" />
                  </div>
                  <p className="text-xs text-[#102A43] font-medium leading-snug">{a.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
