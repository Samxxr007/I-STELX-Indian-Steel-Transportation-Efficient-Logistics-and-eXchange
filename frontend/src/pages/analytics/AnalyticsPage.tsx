import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { KpiCard } from '../../components/common/KpiCard';
import {
  BarChart3,
  TrendingUp,
  Weight,
  Clock,
  CheckCircle2,
  Anchor,
  Layers,
  Ship,
  DollarSign
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics()
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Compiling enterprise fleet analytics and historical performance indicators...
      </div>
    );
  }

  const { metrics, monthly_cargo, cost_by_route, port_performance } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-[#063B68]" />
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            Strategic Logistics Analytics & Fleet KPIs
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Comprehensive multi-voyage performance analytics, freight accuracy, route costs, and port waiting benchmarks.
        </p>
      </div>

      {/* 4 TOP PERFORMANCE METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Total Cargo Discharged"
          value="1.84M MT"
          subtitle="FY 2026-27 YTD"
          change="+14% YoY"
          icon={Weight}
          iconColor="text-[#063B68]"
          bgColor="bg-[#EBF4FC]"
        />
        <KpiCard
          title="Average Freight Cost"
          value={`$${metrics.average_freight_cost_usd} / MT`}
          subtitle="All dry bulk routes"
          change="₹2,062 / MT Landed"
          icon={DollarSign}
          iconColor="text-[#0867B2]"
          bgColor="bg-[#E2EDF9]"
        />
        <KpiCard
          title="ML Forecast Accuracy"
          value={`${metrics.freight_forecast_accuracy_pct}%`}
          subtitle="XGB-Ridge Ensemble"
          change="MAE: $0.34/MT"
          icon={TrendingUp}
          iconColor="text-[#00843D]"
          bgColor="bg-[#E6F4EA]"
        />
        <KpiCard
          title="Fleet Capacity Utilization"
          value={`${metrics.vessel_capacity_utilization_pct}%`}
          subtitle="Panamax & Capesize"
          change="87.5% On-Time"
          icon={Ship}
          iconColor="text-[#FF7A00]"
          bgColor="bg-[#FFF4E5]"
        />
      </div>

      {/* MONTHLY CARGO MOVEMENT & ROUTE COSTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Monthly Cargo Movement Stacked Bar (7 cols) */}
        <div className="lg:col-span-7 istelx-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="font-heading font-bold text-sm text-[#063B68]">
              Monthly Steel Raw Material Inbound Movement ('000 MT)
            </h3>
            <span className="text-xs font-mono text-[#64748B]">Last 6 Months</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly_cargo} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} unit="k" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderRadius: '8px', fontSize: '11px', border: '1px solid #CBD5E1' }}
                  formatter={(val: any) => [`${val}k MT`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="coking_coal" name="Coking Coal" fill="#063B68" stackId="a" />
                <Bar dataKey="iron_ore" name="Iron Ore" fill="#FF7A00" stackId="a" />
                <Bar dataKey="limestone" name="Limestone & Dolomite" fill="#00843D" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cost by Route Share (5 cols) */}
        <div className="lg:col-span-5 istelx-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h3 className="font-heading font-bold text-sm text-[#063B68]">
              Logistics Cost by Major Sea Corridor
            </h3>
            <span className="text-xs font-mono text-[#0867B2] font-bold">₹ Landed</span>
          </div>

          <div className="space-y-3">
            {cost_by_route.map((item: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs">
                <div className="flex justify-between font-bold text-[#063B68]">
                  <span>{item.route}</span>
                  <span>₹{item.avg_cost_cr} Cr / voyage</span>
                </div>
                <div className="flex justify-between text-[#64748B]">
                  <span>Volume: {item.volume_mt.toLocaleString()} MT</span>
                  <span>Avg Rate: ${item.avg_rate_usd}/MT</span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#0867B2] h-full" style={{ width: `${item.share_pct * 2.2}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PORT PERFORMANCE & CONGESTION BENCHMARKS TABLE */}
      <div className="istelx-card p-6 space-y-4">
        <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
          Major Port Discharge Rates & Demurrage Incident Log
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="pb-2 font-bold">Port Terminal</th>
                <th className="pb-2 font-bold">Average Waiting Queue</th>
                <th className="pb-2 font-bold">Handling Throughput</th>
                <th className="pb-2 font-bold">Demurrage Incidents (FY)</th>
                <th className="pb-2 font-bold text-right">Performance Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {port_performance.map((p: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]">
                  <td className="py-2.5 font-bold text-[#063B68]">{p.port}</td>
                  <td className="py-2.5 font-mono font-bold text-[#D92D20]">{p.avg_waiting_hrs} hours</td>
                  <td className="py-2.5 font-medium">{p.handling_rate_tpd.toLocaleString()} MT / day</td>
                  <td className="py-2.5">
                    <span className={`px-2 py-0.5 rounded font-mono font-bold ${
                      p.demurrage_incidents > 3 ? 'bg-[#FEECEB] text-[#D92D20]' : 'bg-[#E6F4EA] text-[#00843D]'
                    }`}>
                      {p.demurrage_incidents} Occurrences
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-[#00843D]">
                    {p.demurrage_incidents <= 1 ? 'Grade A (Optimal)' : (p.demurrage_incidents <= 3 ? 'Grade B (Standard)' : 'Grade C (Constrained)')}
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
