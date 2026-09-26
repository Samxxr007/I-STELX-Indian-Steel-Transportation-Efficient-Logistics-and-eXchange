import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import {
  FileText,
  Ship,
  Anchor,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Play,
  Save,
  Clock,
  Compass,
  Cpu
} from 'lucide-react';

export const NewRequirementPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    cargo_type: 'Coking Coal',
    quantity_mt: 80000,
    origin_country: 'Australia',
    origin_port: 'Hay Point',
    destination_port: 'Visakhapatnam',
    delivery_date: '2026-10-28',
    laycan_start: '2026-10-05',
    laycan_end: '2026-10-14',
    preferred_vessel_type: 'Panamax',
    notes: 'Prime hard coking coal for blast furnace blend at Vizag plant. Strict laycan compliance required.'
  });

  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState('');

  const analysisStepsList = [
    'Validating Cargo Specification & Quantity...',
    'Querying ML Freight Rate Prediction Model...',
    'Screening Available Fleet & Laycan Positions...',
    'Evaluating Destination Port Draft & Berth Constraints...',
    'Calculating Landed Ocean Freight, Dues & Demurrage...',
    'Running Multi-Criteria AI Charter Advisor Scoring...'
  ];

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setAnalyzing(true);
    setAnalysisStep(0);
    setAnalysisResult(null);

    try {
      // 1. Create Requirement first
      const req = await api.createRequirement(form);

      // 2. Step through analysis animation
      for (let i = 0; i < analysisStepsList.length; i++) {
        setAnalysisStep(i);
        await new Promise((r) => setTimeout(r, 450));
      }

      // 3. Call backend analyze API
      const result = await api.analyzeRequirement(req.id);
      setAnalysisResult(result);
    } catch (err: any) {
      setError(err.message || 'Analysis pipeline failed.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSaveDraft = async () => {
    try {
      await api.createRequirement(form);
      navigate('/requirements');
    } catch (err: any) {
      setError(err.message || 'Failed to save draft.');
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
            New Cargo Transport Requirement
          </h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Define raw material dry bulk demand specifications for AI-driven chartering and route analysis.
          </p>
        </div>

        <button
          onClick={() => navigate('/requirements')}
          className="text-xs font-semibold text-[#0867B2] hover:underline"
        >
          View All Requirements →
        </button>
      </div>

      {error && (
        <div className="p-3 bg-[#FEECEB] border border-[#FCCECE] rounded-lg text-xs font-semibold text-[#D92D20]">
          {error}
        </div>
      )}

      {/* Main Requirement Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 istelx-card p-6 space-y-5">
          <form onSubmit={handleAnalyze} className="space-y-4">
            {/* Cargo Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Cargo Material Type *
                </label>
                <select
                  value={form.cargo_type}
                  onChange={(e) => setForm({ ...form, cargo_type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
                >
                  <option value="Coking Coal">Coking Coal (Prime Hard Metallurgical)</option>
                  <option value="Thermal Coal">Thermal Coal (Steam Coal)</option>
                  <option value="Iron Ore">Iron Ore (Fines / Lumps / Pellets)</option>
                  <option value="Limestone">Limestone (Flux Grade)</option>
                  <option value="Dolomite">Dolomite</option>
                  <option value="Manganese Ore">Manganese Ore</option>
                  <option value="Other Bulk Cargo">Other Bulk Raw Cargo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Cargo Volume (Metric Tonnes - MT) *
                </label>
                <input
                  type="number"
                  required
                  min={10000}
                  step={1000}
                  value={form.quantity_mt}
                  onChange={(e) => setForm({ ...form, quantity_mt: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-bold text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Ports & Origin */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Origin Country *
                </label>
                <select
                  value={form.origin_country}
                  onChange={(e) => setForm({ ...form, origin_country: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                >
                  <option value="Australia">Australia</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Oman">Oman</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Brazil">Brazil</option>
                  <option value="India (Coastal)">India (Domestic Coastal)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Origin Terminal / Port *
                </label>
                <select
                  value={form.origin_port}
                  onChange={(e) => setForm({ ...form, origin_port: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
                >
                  <option value="Hay Point">Hay Point (Australia)</option>
                  <option value="Newcastle">Newcastle (Australia)</option>
                  <option value="Gladstone">Gladstone (Australia)</option>
                  <option value="Port Hedland">Port Hedland (Australia)</option>
                  <option value="Richards Bay">Richards Bay (South Africa)</option>
                  <option value="Salalah">Salalah (Oman)</option>
                  <option value="Mormugao">Mormugao (Goa, India)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Destination Indian Port *
                </label>
                <select
                  value={form.destination_port}
                  onChange={(e) => setForm({ ...form, destination_port: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
                >
                  <option value="Visakhapatnam">Visakhapatnam (INVTZ)</option>
                  <option value="Paradip">Paradip (INPRT)</option>
                  <option value="Haldia">Haldia (INHAL - River Draft)</option>
                  <option value="Dhamra">Dhamra (INDHR - Capesize)</option>
                  <option value="Gangavaram">Gangavaram (INGGV - Deepwater)</option>
                  <option value="Chennai">Chennai (INMAA)</option>
                  <option value="Mormugao">Mormugao (INMRM)</option>
                </select>
              </div>
            </div>

            {/* Dates & Laycan Window */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Laycan Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.laycan_start}
                  onChange={(e) => setForm({ ...form, laycan_start: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Laycan End Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.laycan_end}
                  onChange={(e) => setForm({ ...form, laycan_end: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Required Delivery Date *
                </label>
                <input
                  type="date"
                  required
                  value={form.delivery_date}
                  onChange={(e) => setForm({ ...form, delivery_date: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-medium text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Preferred Vessel & Notes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Preferred Vessel Class
                </label>
                <select
                  value={form.preferred_vessel_type}
                  onChange={(e) => setForm({ ...form, preferred_vessel_type: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#063B68] focus:border-[#0867B2] focus:bg-white transition-colors"
                >
                  <option value="Panamax">Panamax (70,000 - 85,000 DWT)</option>
                  <option value="Capesize">Capesize (120,000 - 200,000 DWT)</option>
                  <option value="Supramax">Supramax (50,000 - 65,000 DWT)</option>
                  <option value="Handysize">Handysize (30,000 - 45,000 DWT)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#475569] mb-1.5">
                  Operational Notes & Discharge Berth Instructions
                </label>
                <input
                  type="text"
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-lg text-xs text-[#102A43] focus:border-[#0867B2] focus:bg-white transition-colors"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E2E8F0]">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-lg border border-[#CBD5E1] bg-white hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Save className="w-3.5 h-3.5" />
                <span>SAVE AS DRAFT</span>
              </button>

              <button
                type="submit"
                disabled={analyzing}
                className="px-6 py-2.5 rounded-lg bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-xs transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 text-[#FF7A00]" />
                <span>{analyzing ? 'RUNNING PIPELINE...' : 'ANALYZE REQUIREMENT'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Right Help / Benchmark Card */}
        <div className="lg:col-span-4 space-y-4">
          <div className="istelx-card p-5 bg-[#F8FAFC] border border-[#CBD5E1] space-y-3">
            <div className="flex items-center gap-2 text-[#063B68]">
              <Cpu className="w-4 h-4 text-[#FF7A00]" />
              <h3 className="font-heading font-bold text-sm">6-Step Intelligent Evaluation</h3>
            </div>
            <p className="text-xs text-[#64748B] leading-relaxed">
              When you click <span className="font-bold text-[#063B68]">Analyze Requirement</span>, the platform runs:
            </p>
            <ul className="text-xs space-y-2 text-[#475569]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                <span>Freight Rate ML Prediction (7/15/30d)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                <span>Vessel Capacity & Laycan Availability</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                <span>Port Constraints (Draft, LOA, Beam)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                <span>Landed Cost Breakdown (₹ Cr)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00843D] flex-shrink-0" />
                <span>AI Charter Advisor Explainability</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* ANALYSIS PROGRESS OVERLAY / DISPLAY */}
      {analyzing && (
        <div className="istelx-card p-6 bg-white border border-[#0867B2] shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-[#FF7A00] animate-spin" />
              <h3 className="font-heading font-bold text-base text-[#063B68]">
                Executing Multimodal Freight & Compatibility Engine
              </h3>
            </div>
            <span className="font-mono text-xs text-[#0867B2] font-bold">
              Step {analysisStep + 1} of 6
            </span>
          </div>

          <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#063B68] via-[#0867B2] to-[#FF7A00] h-full transition-all duration-300"
              style={{ width: `${((analysisStep + 1) / 6) * 100}%` }}
            />
          </div>

          <div className="text-xs font-semibold text-[#063B68] animate-pulse">
            {analysisStepsList[analysisStep]}
          </div>
        </div>
      )}

      {/* ANALYSIS RESULTS SECTION */}
      {analysisResult && (
        <div className="istelx-card p-6 bg-white border border-[#00843D] shadow-xl space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <span className="badge-green text-xs font-bold mb-1">
                ✓ REQUIREMENT ANALYSIS COMPLETE
              </span>
              <h2 className="font-heading font-extrabold text-xl text-[#063B68] mt-1">
                Analysis Results: {analysisResult.requirement_code}
              </h2>
              <p className="text-xs text-[#64748B]">
                {analysisResult.quantity_mt.toLocaleString()} MT {analysisResult.cargo_type} ({analysisResult.origin_port} → {analysisResult.destination_port})
              </p>
            </div>

            <button
              onClick={() => navigate('/charter-advisor', { state: { requirement_id: analysisResult.requirement_id } })}
              className="px-5 py-2.5 bg-[#FF7A00] hover:bg-[#e66e00] text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <span>Open AI Charter Advisor</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="text-xs text-[#64748B] font-semibold">Current Freight Rate</div>
              <div className="font-heading font-extrabold text-2xl text-[#063B68] mt-1">
                ${analysisResult.freight_intelligence.current_rate_usd_mt} / MT
              </div>
              <div className="text-xs font-bold text-[#FF7A00] mt-1">
                Market Trend: {analysisResult.freight_intelligence.trend} (30d Forecast: ${analysisResult.freight_intelligence.forecast_30d_usd_mt})
              </div>
            </div>

            <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
              <div className="text-xs text-[#64748B] font-semibold">Destination Port Limits</div>
              <div className="font-heading font-extrabold text-2xl text-[#063B68] mt-1">
                {analysisResult.destination_port_info.max_draft_m} m Draft
              </div>
              <div className="text-xs text-[#64748B] mt-1">
                Avg Port Waiting: <span className="font-bold text-[#D92D20]">{analysisResult.destination_port_info.waiting_time_hours} hrs</span> ({analysisResult.destination_port_info.congestion})
              </div>
            </div>

            <div className="bg-[#EBF4FC] p-4 rounded-xl border border-[#CBD5E1]">
              <div className="text-xs text-[#0867B2] font-semibold">Top Ranked Vessel</div>
              <div className="font-heading font-extrabold text-xl text-[#063B68] mt-1">
                {analysisResult.top_recommended_vessel?.vessel_name || 'MV STEEL VOYAGER'}
              </div>
              <div className="text-xs font-bold text-[#00843D] mt-1 flex items-center gap-1">
                <span>Score: {analysisResult.top_recommended_vessel?.recommendation_score} / 100</span>
                <span>• {analysisResult.top_recommended_vessel?.port_status}</span>
              </div>
            </div>
          </div>

          {/* Vessel Rankings Table */}
          <div>
            <h3 className="font-heading font-bold text-sm text-[#063B68] mb-3">
              Fleet Compatibility & Scoring Ranking
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#E2E8F0] text-[#64748B] uppercase tracking-wider text-[10px]">
                    <th className="pb-2 font-bold">Vessel</th>
                    <th className="pb-2 font-bold">Class</th>
                    <th className="pb-2 font-bold">Capacity</th>
                    <th className="pb-2 font-bold">Draft</th>
                    <th className="pb-2 font-bold">Port Check</th>
                    <th className="pb-2 font-bold">Est Landed Cost</th>
                    <th className="pb-2 font-bold">Score</th>
                    <th className="pb-2 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F1F5F9]">
                  {analysisResult.vessel_rankings.map((v: any) => (
                    <tr key={v.vessel_id} className="hover:bg-[#F8FAFC]">
                      <td className="py-2.5 font-bold text-[#063B68]">
                        {v.vessel_name}
                      </td>
                      <td className="py-2.5 font-medium">{v.vessel_type}</td>
                      <td className="py-2.5">{v.capacity_mt.toLocaleString()} MT</td>
                      <td className="py-2.5">{v.draft_m} m</td>
                      <td className="py-2.5">
                        <StatusBadge status={v.port_status} />
                      </td>
                      <td className="py-2.5 font-bold text-[#102A43]">
                        ₹{v.expected_cost_cr} Cr
                      </td>
                      <td className="py-2.5 font-bold text-[#0867B2]">
                        {v.recommendation_score} / 100
                      </td>
                      <td className="py-2.5 text-right">
                        <button
                          onClick={() => navigate('/charter-advisor', { state: { requirement_id: analysisResult.requirement_id, vessel_id: v.vessel_id } })}
                          className="px-2.5 py-1 bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-[11px] rounded transition-colors cursor-pointer"
                        >
                          Select
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
