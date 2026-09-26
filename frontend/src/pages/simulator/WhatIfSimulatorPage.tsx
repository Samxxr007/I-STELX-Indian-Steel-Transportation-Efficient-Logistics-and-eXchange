import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  SlidersHorizontal,
  TrendingUp,
  Clock,
  DollarSign,
  AlertTriangle,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  ShieldAlert
} from 'lucide-react';

export const WhatIfSimulatorPage: React.FC = () => {
  const location = useLocation();

  const [freightChange, setFreightChange] = useState(0); // -20 to +20
  const [fuelChange, setFuelChange] = useState(0);       // -20 to +30
  const [portDelay, setPortDelay] = useState(0);         // 0 to 7 days
  const [speedChange, setSpeedChange] = useState(0);     // -20 to +10
  const [congestion, setCongestion] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [vesselAvail, setVesselAvail] = useState<'AVAILABLE' | 'DELAYED'>('AVAILABLE');

  const [simResult, setSimResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runWhatIf({
        base_cost_cr: 16.43,
        freight_rate_pct_change: freightChange,
        fuel_cost_pct_change: fuelChange,
        port_delay_days: portDelay,
        vessel_speed_pct_change: speedChange,
        port_congestion: congestion,
        vessel_availability: vesselAvail
      });
      setSimResult(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [freightChange, fuelChange, portDelay, speedChange, congestion, vesselAvail]);

  const handleReset = () => {
    setFreightChange(0);
    setFuelChange(0);
    setPortDelay(0);
    setSpeedChange(0);
    setCongestion('MEDIUM');
    setVesselAvail('AVAILABLE');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-6 h-6 text-[#0867B2]" />
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              Voyage What-If Scenario Simulator
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Test market shocks, port bottlenecks, fuel volatility, and vessel speed adjustments against baseline fixtures.
          </p>
        </div>

        <button
          onClick={handleReset}
          className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#FF7A00]" />
          <span>Reset to Base Parameters</span>
        </button>
      </div>

      {/* Interactive Controls & Live Diff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Scenario Sliders (5 cols) */}
        <div className="lg:col-span-5 istelx-card p-5 space-y-5 bg-white">
          <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
            <h2 className="font-heading font-bold text-sm text-[#063B68]">
              Simulation Stress Controls
            </h2>
            <span className="text-[10px] font-mono text-[#0867B2] font-bold bg-[#EBF4FC] px-2 py-0.5 rounded">
              Active Parameters
            </span>
          </div>

          {/* 1. Freight Rate Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#102A43]">Freight Rate Shift:</span>
              <span className={`font-mono font-bold ${freightChange > 0 ? 'text-[#D92D20]' : 'text-[#00843D]'}`}>
                {freightChange > 0 ? `+${freightChange}%` : `${freightChange}%`}
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={20}
              step={1}
              value={freightChange}
              onChange={(e) => setFreightChange(Number(e.target.value))}
              className="w-full accent-[#0867B2] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8]">
              <span>-20% (Softening)</span>
              <span>Baseline ($24.30)</span>
              <span>+20% (Spike)</span>
            </div>
          </div>

          {/* 2. Fuel / Bunker Shock */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#102A43]">Bunker Fuel Cost Shift:</span>
              <span className={`font-mono font-bold ${fuelChange > 0 ? 'text-[#D92D20]' : 'text-[#00843D]'}`}>
                {fuelChange > 0 ? `+${fuelChange}%` : `${fuelChange}%`}
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={30}
              step={1}
              value={fuelChange}
              onChange={(e) => setFuelChange(Number(e.target.value))}
              className="w-full accent-[#FF7A00] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8]">
              <span>-20%</span>
              <span>Baseline ($624)</span>
              <span>+30%</span>
            </div>
          </div>

          {/* 3. Port Queue Delay */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#102A43]">Destination Berth Queue Delay:</span>
              <span className="font-mono font-bold text-[#D92D20]">
                +{portDelay} Days
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={7}
              step={0.5}
              value={portDelay}
              onChange={(e) => setPortDelay(Number(e.target.value))}
              className="w-full accent-[#D92D20] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8]">
              <span>0 Days (Nominal)</span>
              <span>3.5 Days</span>
              <span>7 Days (Severe Demurrage)</span>
            </div>
          </div>

          {/* 4. Vessel Speed Adjust */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-[#102A43]">Vessel Sailing Speed:</span>
              <span className="font-mono font-bold text-[#063B68]">
                {speedChange > 0 ? `+${speedChange}% (Sprint)` : (speedChange < 0 ? `${speedChange}% (Eco Speed)` : 'Design (13.5 kt)')}
              </span>
            </div>
            <input
              type="range"
              min={-20}
              max={10}
              step={1}
              value={speedChange}
              onChange={(e) => setSpeedChange(Number(e.target.value))}
              className="w-full accent-[#063B68] cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-[#94A3B8]">
              <span>-20% (Slow Steaming)</span>
              <span>Nominal</span>
              <span>+10%</span>
            </div>
          </div>

          {/* 5. Congestion & Availability Dropdowns */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Port Congestion:
              </label>
              <select
                value={congestion}
                onChange={(e: any) => setCongestion(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-semibold"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High (+1.5d)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Vessel Status:
              </label>
              <select
                value={vesselAvail}
                onChange={(e: any) => setVesselAvail(e.target.value)}
                className="w-full px-2.5 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded text-xs font-semibold"
              >
                <option value="AVAILABLE">Available</option>
                <option value="DELAYED">Positioning Delayed</option>
              </select>
            </div>
          </div>
        </div>

        {/* SIDE-BY-SIDE COMPARISON (BASE vs SCENARIO) (7 cols) */}
        {simResult && (
          <div className="lg:col-span-7 space-y-6">
            <div className="istelx-card p-6 bg-white space-y-5">
              <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
                <h3 className="font-heading font-bold text-base text-[#063B68]">
                  Base Case vs Simulated Scenario Diff
                </h3>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  simResult.delta.cost_diff_cr > 0 ? 'bg-[#FEECEB] text-[#D92D20]' : 'bg-[#E6F4EA] text-[#00843D]'
                }`}>
                  Cost Delta: {simResult.delta.cost_diff_cr > 0 ? `+₹${simResult.delta.cost_diff_cr} Cr` : `₹${simResult.delta.cost_diff_cr} Cr`} ({simResult.delta.cost_diff_pct}%)
                </span>
              </div>

              {/* Side by Side Comparison Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* BASE CASE */}
                <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#475569] pb-1 border-b">
                    BASE CASE FIXTURE
                  </div>
                  <div>
                    <span className="text-[10px] text-[#64748B] block">Total Landed Cost</span>
                    <span className="font-heading font-extrabold text-2xl text-[#063B68]">
                      ₹{simResult.base.total_cost_cr.toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Expected ETA:</span>
                      <span className="font-medium text-[#102A43]">{simResult.base.eta_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Total Duration:</span>
                      <span className="font-medium">{simResult.base.voyage_duration_days} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Schedule Risk:</span>
                      <span className="badge-green font-bold text-[10px]">{simResult.base.schedule_risk}</span>
                    </div>
                  </div>
                </div>

                {/* SIMULATED SCENARIO */}
                <div className="p-4 rounded-xl bg-[#EBF4FC]/60 border border-[#0867B2] space-y-3 shadow-xs">
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#0867B2] pb-1 border-b border-[#0867B2]/30 flex items-center justify-between">
                    <span>SIMULATED SCENARIO</span>
                    <span className="w-2 h-2 rounded-full bg-[#FF7A00] animate-ping" />
                  </div>
                  <div>
                    <span className="text-[10px] text-[#0867B2] block font-bold">Simulated Landed Cost</span>
                    <span className="font-heading font-extrabold text-2xl text-[#063B68]">
                      ₹{simResult.scenario.total_cost_cr.toFixed(2)} Cr
                    </span>
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Projected ETA:</span>
                      <span className="font-bold text-[#D92D20]">{simResult.scenario.eta_date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Total Duration:</span>
                      <span className="font-bold text-[#102A43]">{simResult.scenario.voyage_duration_days} Days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Schedule Risk:</span>
                      <StatusBadge status={simResult.scenario.schedule_risk + ' RISK'} size="sm" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Actionable Scenario Insights */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#063B68] block">
                  Actionable Scenario Observations:
                </span>
                <div className="space-y-2">
                  {simResult.insights?.map((ins: string, idx: number) => (
                    <div
                      key={idx}
                      className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-2.5 text-xs text-[#102A43]"
                    >
                      <Info className="w-4 h-4 text-[#0867B2] flex-shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{ins}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
