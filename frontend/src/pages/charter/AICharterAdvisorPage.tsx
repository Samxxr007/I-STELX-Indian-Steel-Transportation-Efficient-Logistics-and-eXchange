import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { AICharterAdvice, CargoRequirement, Vessel, Port } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  Brain,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Save,
  SlidersHorizontal,
  Check,
  FileCheck,
  Building,
  Anchor,
  Ship,
  Info,
  DollarSign
} from 'lucide-react';

export const AICharterAdvisorPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState<CargoRequirement[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [selectedReqId, setSelectedReqId] = useState<number>(1);
  const [selectedVesselId, setSelectedVesselId] = useState<number>(1);
  
  const [advice, setAdvice] = useState<AICharterAdvice | null>(null);
  const [loading, setLoading] = useState(true);
  const [savedScenarioId, setSavedScenarioId] = useState<number | null>(null);
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);
  const [approvedFixture, setApprovedFixture] = useState<any>(null);
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    Promise.all([api.getRequirements(), api.getVessels()]).then(([rData, vData]) => {
      setRequirements(rData);
      setVessels(vData);

      const navState = location.state as any;
      if (navState?.requirement_id) {
        setSelectedReqId(navState.requirement_id);
      } else if (rData.length > 0) {
        setSelectedReqId(rData[0].id);
      }

      if (navState?.vessel_id) {
        setSelectedVesselId(navState.vessel_id);
      } else if (vData.length > 0) {
        setSelectedVesselId(vData[0].id);
      }
    }).catch(console.error);
  }, [location.state]);

  const fetchAdvice = async () => {
    if (!selectedReqId || !selectedVesselId) return;
    setLoading(true);
    try {
      const res = await api.getCharterAdvice(selectedReqId, selectedVesselId);
      setAdvice(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, [selectedReqId, selectedVesselId]);

  const handleSaveScenario = async () => {
    if (!advice) return;
    try {
      const res = await api.saveCharterScenario({
        requirement_id: selectedReqId,
        vessel_id: selectedVesselId,
        freight_rate_usd_mt: 24.30,
        ocean_freight_cr: 15.52,
        port_charges_cr: 0.38,
        handling_cr: 0.24,
        demurrage_cr: 0.12,
        fuel_other_cr: 0.17,
        total_cost_cr: advice.expected_cost_cr,
        risk_level: advice.risk_level,
        recommendation_score: advice.recommendation_score,
        advisor_signal: advice.planning_signal,
        why_reasons: advice.why_reasons,
        is_port_compatible: advice.port_compatible
      });
      setSavedScenarioId(res.scenario_id);
      setApprovalModalOpen(true);
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveFixture = async () => {
    setApproving(true);
    try {
      const res = await api.approveCharter(savedScenarioId || 1, 'Commercial fixture approved based on AI Charter Advisor recommendation.');
      setApprovedFixture(res);
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(false);
    }
  };

  const handleCreateShipment = async () => {
    if (!approvedFixture) return;
    try {
      const shipRes = await api.createShipment({
        requirement_id: selectedReqId,
        vessel_id: selectedVesselId,
        scheduled_eta: '28 Oct 08:00',
        current_eta: '28 Oct 21:30',
        planned_cost_cr: advice?.expected_cost_cr || 16.43
      });
      navigate(`/shipments/${shipRes.shipment_id}`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-[#0867B2]" />
            <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
              AI Charter Advisor & Decision Support
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Explainable multi-criteria trade-off engine synthesizing freight forecasts, vessel positioning, port bathymetry, and landed costs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate('/simulator', { state: { cost_cr: advice?.expected_cost_cr } })}
            className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#0867B2]" />
            <span>RUN WHAT-IF SENSITIVITY</span>
          </button>
        </div>
      </div>

      {/* SELECTION BAR */}
      <div className="istelx-card p-4 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F8FAFC]">
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Target Cargo Requirement:
          </label>
          <select
            value={selectedReqId}
            onChange={(e) => setSelectedReqId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
          >
            {requirements.map(r => (
              <option key={r.id} value={r.id}>
                {r.requirement_code}: {r.quantity_mt.toLocaleString()} MT {r.cargo_type} ({r.origin_port} → {r.destination_port})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-1">
            Candidate Vessel:
          </label>
          <select
            value={selectedVesselId}
            onChange={(e) => setSelectedVesselId(Number(e.target.value))}
            className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68]"
          >
            {vessels.map(v => (
              <option key={v.id} value={v.id}>
                {v.name} ({v.vessel_type}, {v.dwt.toLocaleString()} DWT) — {v.availability_status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ADVISOR RECOMMENDATION CARD */}
      {advice && (
        <div className="space-y-6">
          {/* Hero Recommendation Banner */}
          <div className="istelx-card p-6 bg-gradient-to-r from-[#063B68] via-[#0867B2] to-[#063B68] text-white shadow-xl rounded-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#FF7A00] text-white font-extrabold text-[11px] uppercase tracking-wider">
                    AI Planning Signal
                  </span>
                  <span className="text-xs text-[#CBD5E1] font-mono">
                    {advice.route} • {advice.quantity_mt.toLocaleString()} MT {advice.cargo_type}
                  </span>
                </div>

                <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                  {advice.planning_signal}
                </h2>

                <p className="text-xs text-[#E2E8F0] max-w-2xl leading-relaxed">
                  Recommended Vessel: <span className="font-bold text-[#FF7A00]">{advice.vessel_name}</span> ({advice.vessel_type}) • Expected Landed Cost: <span className="font-bold text-white">₹{advice.expected_cost_cr} Cr</span>
                </p>
              </div>

              {/* Recommendation Score Gauge Badge */}
              <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 self-start md:self-auto flex-shrink-0">
                <div className="text-center">
                  <div className="text-[10px] uppercase tracking-widest text-[#FF7A00] font-bold">
                    Advisor Score
                  </div>
                  <div className="font-heading font-extrabold text-3xl sm:text-4xl text-white">
                    {advice.recommendation_score}
                    <span className="text-sm font-normal text-[#CBD5E1]">/100</span>
                  </div>
                  <div className="text-[10px] text-[#00843D] bg-white/90 px-2 py-0.5 rounded font-bold mt-1">
                    {advice.risk_level} RISK
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EXPLAINABILITY "WHY?" JUSTIFICATION SECTION */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 istelx-card p-6 bg-white space-y-5">
              <div className="border-b border-[#E2E8F0] pb-3 flex items-center justify-between">
                <h3 className="font-heading font-extrabold text-base text-[#063B68]">
                  Explainable Decision Rationale (Why This Fixture?)
                </h3>
                <span className="text-xs font-mono font-bold text-[#0867B2]">
                  {advice.why_reasons.length} Positive Drivers
                </span>
              </div>

              {/* Positive Validations */}
              <div className="space-y-3">
                {advice.why_reasons.map((r, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#E6F4EA]/40 border border-[#C4E7D0] flex items-start gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-[#00843D] flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#102A43] leading-relaxed">
                      {r}
                    </span>
                  </div>
                ))}

                {/* Cautions / Watchpoints */}
                {advice.cautions.map((c, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-lg bg-[#FFF4E5] border border-[#FFE0B2] flex items-start gap-3"
                  >
                    <AlertTriangle className="w-5 h-5 text-[#FF7A00] flex-shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-[#7A3E00] leading-relaxed">
                      {c}
                    </span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={handleSaveScenario}
                  className="px-5 py-2.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Save className="w-3.5 h-3.5 text-[#0867B2]" />
                  <span>SAVE SCENARIO</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    handleSaveScenario();
                    setApprovalModalOpen(true);
                  }}
                  className="px-6 py-2.5 rounded-lg bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
                >
                  <FileCheck className="w-4 h-4 text-[#FF7A00]" />
                  <span>REQUEST CHARTER APPROVAL</span>
                </button>
              </div>
            </div>

            {/* Right Summary Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="istelx-card p-5 bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
                <h4 className="font-heading font-bold text-sm text-[#063B68]">
                  Fixture Parameters Summary
                </h4>
                <div className="space-y-2 text-xs divide-y divide-[#E2E8F0]">
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#64748B]">Requirement:</span>
                    <span className="font-semibold text-[#102A43]">{advice.quantity_mt.toLocaleString()} MT {advice.cargo_type}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#64748B]">Market Trend:</span>
                    <span className="font-bold text-[#FF7A00]">{advice.market_signal}</span>
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#64748B]">Port Clearance:</span>
                    <StatusBadge status={advice.port_compatibility_status} size="sm" />
                  </div>
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[#64748B]">Expected Landed Cost:</span>
                    <span className="font-mono font-bold text-[#063B68]">₹{advice.expected_cost_cr} Cr</span>
                  </div>
                </div>
              </div>

              {/* Disclaimer Notice */}
              <div className="p-4 rounded-xl bg-[#FFF4E5] border border-[#FFE0B2] text-xs text-[#7A3E00] leading-relaxed">
                <div className="font-bold mb-1 flex items-center gap-1.5">
                  <Info className="w-4 h-4 text-[#FF7A00]" />
                  <span>Decision Support Governance</span>
                </div>
                {advice.disclaimer}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CHARTER APPROVAL WORKFLOW MODAL */}
      {approvalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-[#CBD5E1] w-full max-w-xl overflow-hidden">
            <div className="p-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-[#00843D]" />
                <h3 className="font-heading font-extrabold text-base text-[#063B68]">
                  Charter Fixture Approval & Authorization
                </h3>
              </div>
              <button
                onClick={() => setApprovalModalOpen(false)}
                className="text-xs text-[#64748B] hover:text-[#102A43]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {approvedFixture ? (
                <div className="text-center space-y-3 py-4">
                  <div className="w-14 h-14 rounded-full bg-[#E6F4EA] text-[#00843D] flex items-center justify-center mx-auto">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-extrabold text-xl text-[#063B68]">
                    Charter Fixture Approved: {approvedFixture.charter_code}
                  </h4>
                  <p className="text-xs text-[#475569] max-w-md mx-auto leading-relaxed">
                    Commercial authorization granted by <span className="font-bold">Vikramaditya Sharma (Head of Chartering)</span>. The voyage is ready for live shipment initialization.
                  </p>
                  
                  <div className="pt-4 flex items-center justify-center gap-3">
                    <button
                      onClick={handleCreateShipment}
                      className="px-6 py-2.5 bg-[#00843D] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Ship className="w-4 h-4" />
                      <span>INITIALIZE SHIPMENT & TRACK VOYAGE</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs text-[#475569] leading-relaxed">
                    Review fixture commitment parameters before executing authorization:
                  </p>

                  <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Cargo Volume:</span>
                      <span className="font-semibold">{advice?.quantity_mt.toLocaleString()} MT {advice?.cargo_type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Assigned Vessel:</span>
                      <span className="font-bold text-[#063B68]">{advice?.vessel_name} ({advice?.vessel_type})</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Voyage Landed Cost:</span>
                      <span className="font-mono font-bold text-[#063B68]">₹{advice?.expected_cost_cr} Cr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748B]">Approving Officer:</span>
                      <span className="font-semibold">Head of Chartering (Vikramaditya Sharma)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      onClick={() => setApprovalModalOpen(false)}
                      className="px-4 py-2 border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleApproveFixture}
                      disabled={approving}
                      className="px-6 py-2 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs rounded-lg transition-colors shadow-md flex items-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4 text-[#FF7A00]" />
                      <span>{approving ? 'Authorizing...' : 'EXECUTE APPROVAL'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
