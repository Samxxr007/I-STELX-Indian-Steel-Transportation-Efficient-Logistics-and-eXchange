import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CostBreakdown } from '../../types';
import {
  DollarSign,
  Calculator,
  Layers,
  ArrowRight,
  Info,
  CheckCircle2,
  TrendingDown,
  Ship,
  FileSpreadsheet
} from 'lucide-react';

export const CostIntelligencePage: React.FC = () => {
  const [quantity, setQuantity] = useState(80000);
  const [freightRate, setFreightRate] = useState(24.30);
  const [originPort, setOriginPort] = useState('Hay Point');
  const [destinationPort, setDestinationPort] = useState('Visakhapatnam');
  const [vesselType, setVesselType] = useState('Panamax');
  const [waitingDays, setWaitingDays] = useState(1.5);

  const [costData, setCostData] = useState<CostBreakdown | null>(null);
  const [loading, setLoading] = useState(false);

  const calculateCost = async () => {
    setLoading(true);
    try {
      const res = await api.calculateCost({
        quantity_mt: quantity,
        freight_rate_usd_mt: freightRate,
        origin_port: originPort,
        destination_port: destinationPort,
        vessel_type: vesselType,
        port_waiting_days: waitingDays
      });
      setCostData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateCost();
  }, [quantity, freightRate, originPort, destinationPort, vesselType, waitingDays]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
          Maritime Landed Cost Intelligence
        </h1>
        <p className="text-xs text-[#64748B] mt-0.5">
          Detailed landed logistics cost accounting: Ocean freight, port dues, stevedoring, demurrage risk, and bunker consumption in INR Crores (₹ Cr).
        </p>
      </div>

      {/* Calculator Inputs & Cost Output Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Parameters (5 cols) */}
        <div className="lg:col-span-5 istelx-card p-5 space-y-4">
          <div className="flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
            <Calculator className="w-4 h-4 text-[#FF7A00]" />
            <h2 className="font-heading font-bold text-sm text-[#063B68]">
              Voyage & Tariff Parameters
            </h2>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Cargo Volume (MT)
              </label>
              <input
                type="number"
                step={1000}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#102A43]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                Base Freight Rate ($/MT)
              </label>
              <input
                type="number"
                step={0.1}
                value={freightRate}
                onChange={(e) => setFreightRate(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#063B68]"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Vessel Class
                </label>
                <select
                  value={vesselType}
                  onChange={(e) => setVesselType(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
                >
                  <option value="Panamax">Panamax</option>
                  <option value="Capesize">Capesize</option>
                  <option value="Supramax">Supramax</option>
                  <option value="Handysize">Handysize</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Port Wait (Days)
                </label>
                <input
                  type="number"
                  step={0.5}
                  value={waitingDays}
                  onChange={(e) => setWaitingDays(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#D92D20]"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Origin Port
                </label>
                <input
                  type="text"
                  value={originPort}
                  onChange={(e) => setOriginPort(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
                  Destination Port
                </label>
                <input
                  type="text"
                  value={destinationPort}
                  onChange={(e) => setDestinationPort(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Landed Cost Breakdown Card (7 cols) */}
        <div className="lg:col-span-7 istelx-card p-6 bg-white space-y-5">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <h2 className="font-heading font-extrabold text-base text-[#063B68]">
              Landed Cost Accounting Breakdown
            </h2>
            <span className="font-mono text-xs font-bold text-[#0867B2] bg-[#EBF4FC] px-2.5 py-0.5 rounded">
              FX: 1 USD = ₹86.50 INR
            </span>
          </div>

          {costData && (
            <div className="space-y-4">
              {/* Total Banner */}
              <div className="bg-gradient-to-r from-[#063B68] via-[#0867B2] to-[#063B68] text-white p-4 rounded-xl flex items-center justify-between shadow-md">
                <div>
                  <div className="text-xs uppercase tracking-wider text-[#FF7A00] font-bold">
                    Total Landed Voyage Cost
                  </div>
                  <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white mt-1">
                    ₹{costData.total_cost_cr.toFixed(2)} Cr
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-[#CBD5E1]">Landed Cost / MT</div>
                  <div className="font-mono font-bold text-xl sm:text-2xl text-white mt-1">
                    ₹{costData.cost_per_mt_inr.toFixed(0)} / MT
                  </div>
                </div>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-semibold text-[#102A43]">1. Base Ocean Freight (${freightRate}/MT)</span>
                  <span className="font-mono font-bold text-[#063B68]">₹{costData.ocean_freight_cr.toFixed(2)} Cr</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-semibold text-[#102A43]">2. Port Charges & Pilotage Dues</span>
                  <span className="font-mono font-bold text-[#063B68]">₹{costData.port_charges_cr.toFixed(2)} Cr</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-semibold text-[#102A43]">3. Stevedoring & Terminal Handling</span>
                  <span className="font-mono font-bold text-[#063B68]">₹{costData.handling_charges_cr.toFixed(2)} Cr</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-semibold text-[#102A43]">4. Estimated Demurrage Risk Allowance ({waitingDays}d wait)</span>
                  <span className="font-mono font-bold text-[#D92D20]">₹{costData.estimated_demurrage_cr.toFixed(2)} Cr</span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="font-semibold text-[#102A43]">5. Bunker Fuel Consumption & Other Operational Costs</span>
                  <span className="font-mono font-bold text-[#063B68]">₹{(costData.fuel_bunker_impact_cr + costData.other_operational_cr).toFixed(2)} Cr</span>
                </div>
              </div>

              {/* Assumptions list */}
              <div className="pt-2">
                <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Info className="w-3.5 h-3.5 text-[#0867B2]" />
                  <span>Model Assumptions & Governance</span>
                </div>
                <ul className="text-xs space-y-1 text-[#475569] bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
                  {costData.assumptions.map((assump, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#0867B2] flex-shrink-0" />
                      <span>{assump}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
