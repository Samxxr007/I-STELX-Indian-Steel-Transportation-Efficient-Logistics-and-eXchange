import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Clock,
  Gauge,
  Compass,
  AlertTriangle,
  Anchor,
  TrendingDown,
  Info,
  CheckCircle2,
  Ship,
  Layers
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const EtaIntelligencePage: React.FC = () => {
  const [etaData, setEtaData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch ETA intelligence for primary voyage (SHP-2026-0089: MV STEEL VOYAGER)
    api.getEtaIntelligence(1)
      .then(setEtaData)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !etaData) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Calculating real-time hydrodynamic ETA prediction curves...
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Clock className="w-6 h-6 text-[#0867B2]" />
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            ETA Intelligence & Voyage Variance Engine
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-0.5">
          Predict arrival schedule variance integrating telemetry speed averages, remaining nautical distance, weather, and destination port queues.
        </p>
      </div>

      {/* Hero ETA Variance Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="istelx-card p-5 bg-white border border-[#CBD5E1]">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Original Scheduled ETA</span>
          <div className="font-heading font-extrabold text-2xl text-[#063B68] mt-1">
            {etaData.scheduled_eta}
          </div>
          <div className="text-[11px] text-[#64748B] mt-1">
            Fixed at Charter Fixture Agreement
          </div>
        </div>

        <div className="istelx-card p-5 bg-white border border-[#CBD5E1]">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Current Predicted ETA</span>
          <div className="font-heading font-extrabold text-2xl text-[#0867B2] mt-1">
            {etaData.current_eta}
          </div>
          <div className="text-[11px] font-bold text-[#D92D20] mt-1">
            {etaData.variance_display} Schedule Variance
          </div>
        </div>

        <div className="istelx-card p-5 bg-white border border-[#CBD5E1]">
          <span className="text-[11px] font-bold uppercase text-[#64748B]">Speed Telemetry</span>
          <div className="font-heading font-extrabold text-2xl text-[#102A43] mt-1">
            {etaData.speed_telemetry?.current_speed_knots} kts
          </div>
          <div className="text-[11px] text-[#D92D20] font-semibold mt-1">
            {etaData.speed_telemetry?.speed_deficit_pct}% deficit vs design speed (13.5 kt)
          </div>
        </div>

        <div className="istelx-card p-5 bg-[#F8FAFC] border border-[#CBD5E1] flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase text-[#64748B]">Delay Risk Tag</span>
            <div className="mt-1">
              <StatusBadge status={etaData.status} size="md" />
            </div>
          </div>
          <div className="text-[11px] text-[#64748B] font-medium mt-2">
            Remaining Distance: <span className="font-mono font-bold text-[#063B68]">{etaData.distance_remaining_nm.toFixed(0)} NM</span>
          </div>
        </div>
      </div>

      {/* Variance Explanation & Hydrodynamic Drivers */}
      <div className="istelx-card p-6 bg-white space-y-4">
        <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-[#FF7A00]" />
          <span>ETA Variance Explanation & Contributing Factors</span>
        </h3>

        <div className="p-4 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] space-y-3 text-xs leading-relaxed text-[#102A43]">
          <p className="font-medium">
            {etaData.explanation}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-white rounded-lg border border-[#CBD5E1]">
              <span className="font-bold text-[#063B68] block">Weather & Wave Resistance</span>
              <span className="text-[#64748B] text-[11px]">Monsoon swell in Bay of Bengal reduced average sailing speed to 12.6 kts (+7.5h delay impact).</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#CBD5E1]">
              <span className="font-bold text-[#063B68] block">Strait Pilotage & Transit</span>
              <span className="text-[#64748B] text-[11px]">Tidal waiting at Torres Strait prince of wales channel (+2.5h delay impact).</span>
            </div>

            <div className="p-3 bg-white rounded-lg border border-[#CBD5E1]">
              <span className="font-bold text-[#063B68] block">Destination Berth Lineup</span>
              <span className="text-[#64748B] text-[11px]">Visakhapatnam port queue reports 11.4h average waiting for mechanized coal unloader berth (+3.5h delay impact).</span>
            </div>
          </div>
        </div>
      </div>

      {/* ETA MILESTONE PROGRESSION TABLE */}
      <div className="istelx-card p-6 bg-white space-y-4">
        <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
          Voyage ETA Milestone Progression History
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
                <th className="pb-2 font-bold">Voyage Milestone</th>
                <th className="pb-2 font-bold">Predicted ETA</th>
                <th className="pb-2 font-bold">Cumulative Variance</th>
                <th className="pb-2 font-bold">Operational Driver</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {etaData.eta_history?.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-[#F8FAFC]">
                  <td className="py-2.5 font-bold text-[#063B68]">{item.milestone}</td>
                  <td className="py-2.5 font-semibold text-[#102A43]">{item.predicted_eta}</td>
                  <td className="py-2.5 font-mono font-bold text-[#D92D20]">
                    {item.variance_hrs > 0 ? `+${item.variance_hrs.toFixed(1)} hrs` : 'On Schedule'}
                  </td>
                  <td className="py-2.5 text-[#64748B]">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
