import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Logo } from '../../components/brand/Logo';
import {
  ArrowRight,
  TrendingUp,
  Ship,
  Anchor,
  Radio,
  Clock,
  AlertTriangle,
  BarChart3,
  ShieldCheck,
  CheckCircle2,
  Database,
  Layers,
  Compass,
  Cpu,
  Calculator,
  ChevronRight,
  Activity,
  SlidersHorizontal,
  ExternalLink,
  Shield
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  // Interactive ROI Calculator State
  const [cargoVolumeMt, setCargoVolumeMt] = useState<number>(2500000);
  const [avgDemurrageRate, setAvgDemurrageRate] = useState<number>(18500);
  const [activeStep, setActiveStep] = useState<number>(0);

  // Computed savings
  const estimatedDemurrageDaysSaved = Math.round((cargoVolumeMt / 75000) * 1.8);
  const demurrageSavingsUsd = estimatedDemurrageDaysSaved * avgDemurrageRate;
  const demurrageSavingsInrCr = ((demurrageSavingsUsd * 86.5) / 10000000).toFixed(2);
  const freightOptimizationPct = 4.2;
  const freightSavingsInrCr = (
    (cargoVolumeMt * 24.5 * 86.5 * (freightOptimizationPct / 100)) /
    10000000
  ).toFixed(2);

  const marketTicker = [
    { label: 'Baltic Dry Index (BDI)', value: '1,845', change: '+2.4%', up: true },
    { label: 'Capesize C5 (WAUS-Qingdao)', value: '$9.42/MT', change: '+1.1%', up: true },
    { label: 'Panamax P3A (Pacific R/V)', value: '$13,850/day', change: '+3.8%', up: true },
    { label: 'Coking Coal (Hay Point → Vizag)', value: '$24.30/MT', change: '-0.8%', up: false },
    { label: 'Singapore VLSFO Bunker', value: '$624.50/MT', change: '+0.5%', up: true }
  ];

  const workflowSteps = [
    {
      num: '01',
      title: 'Cargo Demand Creation',
      tag: 'Requirement',
      desc: 'Specify raw steel bulk volume, grade (Coking Coal, Iron Ore, Limestone), loading port & target laycan window.',
      detail: 'Integrates with enterprise ERP to prevent blast furnace feed starvation and optimize shipment batch sizes.'
    },
    {
      num: '02',
      title: 'ML Freight Forecasting',
      tag: 'Ridge & RF Ensemble',
      desc: 'Predict 7, 15, and 30-day forward spot rates with confidence intervals and Baltic Dry correlation.',
      detail: 'Historical feature store tracks bunker prices, commodity indices, and seasonal monsoon volatility.'
    },
    {
      num: '03',
      title: 'Fleet & Vessel Matching',
      tag: 'Panamax / Capesize',
      desc: 'Filter available commercial bulk carriers against cargo batch size, laycan feasibility, and ballast speed.',
      detail: 'Evaluates deadweight tonnage (DWT), gear specifications, and fuel consumption curves.'
    },
    {
      num: '04',
      title: 'Port Compatibility Engine',
      tag: 'Draft & LOA Check',
      desc: 'Instant verification of vessel draft, beam, LOA and tide against Visakhapatnam, Paradip, Haldia, Dhamra.',
      detail: 'Eliminates deadweight rejection penalties and ensures draft safety margins at critical Indian berths.'
    },
    {
      num: '05',
      title: 'Landed Cost Intelligence',
      tag: '₹ Cr Financial Model',
      desc: 'Calculate total ocean freight, port tariffs, canal dues, pilotage, and projected demurrage exposure.',
      detail: 'Provides line-item breakdown in both USD and INR Crores for transparent charter negotiation.'
    },
    {
      num: '06',
      title: 'AI Charter Advisor',
      tag: 'Fixture Recommendation',
      desc: 'Receive explainable multi-criteria scoring balancing cost, laycan risk, vessel reliability, and carbon emissions.',
      detail: 'Generates structured charter fixture summaries ready for executive committee authorization.'
    },
    {
      num: '07',
      title: 'Live Maritime Control Tower',
      tag: 'Realtime AIS Stream',
      desc: 'Live voyage telemetry across Bay of Bengal, Malacca Strait, and Indian Ocean with automated geofencing.',
      detail: 'Continuous monitoring of vessel speed over ground (SOG), heading, and voyage route waypoints.'
    },
    {
      num: '08',
      title: 'Dynamic ETA & Queue Prediction',
      tag: 'Demurrage Shield',
      desc: 'Predict destination berth queues and dynamic arrival times based on speed variations and weather.',
      detail: 'Sends early-warning alert notifications when vessel risks missing contractual laycan or faces congestion.'
    },
    {
      num: '09',
      title: 'Planned vs Actual Audit',
      tag: 'Discharge Reconciliation',
      desc: 'Post-voyage audit comparing planned duration, fuel burn, landed cost, and demurrage against actuals.',
      detail: 'Feeds audited voyage metrics back into the machine learning training pipeline for continuous improvement.'
    }
  ];

  const capabilities = [
    {
      icon: TrendingUp,
      title: 'Ensemble Freight Prediction',
      desc: 'Chronologically split machine learning models (Ridge regression + Random Forest) forecast forward dry bulk spot rates with 94.2% historical directional accuracy.',
      tag: 'ML Intelligence'
    },
    {
      icon: Ship,
      title: 'Dry Bulk Fleet Optimizer',
      desc: 'Screen Handymax, Supramax, Ultramax, Panamax, and Capesize tonnage against strict steel manufacturing laycan windows and port limitations.',
      tag: 'Fleet Optimization'
    },
    {
      icon: Anchor,
      title: 'Berth Compatibility Engine',
      desc: 'Real-time database of Indian major ports validating tidal windows, maximum permissible draft, LOA, beam, and unloader discharge rates.',
      tag: 'Port Operations'
    },
    {
      icon: Radio,
      title: 'Maritime Control Tower',
      desc: 'Live AIS satellite telemetry tracking vessel coordinates, actual speed, weather routing, and automated geofence boundary alerts.',
      tag: 'Live Tracking'
    },
    {
      icon: Clock,
      title: 'Demurrage Risk Prevention',
      desc: 'Continuous ETA recalculation and berth waiting time estimation helps charterers adjust vessel steaming speed to avoid expensive anchorage demurrage.',
      tag: 'Cost Control'
    },
    {
      icon: Cpu,
      title: 'Explainable AI Fixtures',
      desc: 'Charter recommendation algorithms present transparent trade-off weights: cost index, reliability score, and environmental carbon intensity (CII).',
      tag: 'Decision Support'
    }
  ];

  const trustedPorts = [
    'Visakhapatnam Port Authority (VPA)',
    'Paradip Port Authority (PPA)',
    'Syama Prasad Mookerjee Port, Kolkata (SMPK)',
    'Dhamra Port (DPCL)',
    'Gopalpur Port (GPL)',
    'Deendayal Port Authority, Kandla'
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-slate-800 flex flex-col font-sans selection:bg-[#0867B2] selection:text-white">
      {/* 1. PUBLIC STICKY HEADER */}
      <header className="sticky top-0 z-50 bg-[#02172D]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 lg:px-12 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3">
            <Logo size="md" showText={false} />
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl text-white tracking-wider">
                  I-STELX
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#FF7A00]/20 border border-[#FF7A00]/40 text-[#FF7A00] text-[10px] font-mono font-bold">
                  NATIONAL PLATFORM
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-wider text-sky-300 font-semibold hidden md:block">
                Indian Steel Logistics & eXchange
              </span>
            </div>
          </NavLink>

          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-slate-300">
            <a href="#workflow" className="hover:text-white transition-colors">9-Step Architecture</a>
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#calculator" className="hover:text-white transition-colors">Demurrage Calculator</a>
            <a href="#ports" className="hover:text-white transition-colors">Indian Ports</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white text-xs font-bold transition-all shadow-md shadow-[#FF7A00]/20 hover:shadow-lg cursor-pointer flex items-center gap-1.5"
            >
              <span>Command Center</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. REALTIME MARKET TICKER BAR */}
      <div className="bg-[#031A33] border-b border-white/10 py-2 px-4 overflow-x-auto whitespace-nowrap text-xs text-slate-300 select-none">
        <div className="max-w-7xl mx-auto flex items-center gap-6 sm:gap-8 justify-between">
          <div className="flex items-center gap-2 flex-shrink-0 text-sky-400 font-bold uppercase text-[10px] tracking-wider">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#FF7A00]" />
            <span>Market Live Feed</span>
          </div>
          <div className="flex items-center gap-6 sm:gap-8 overflow-x-auto">
            {marketTicker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 flex-shrink-0 font-medium text-[11px]">
                <span className="text-slate-400">{item.label}:</span>
                <span className="text-white font-mono font-bold tabular-nums">{item.value}</span>
                <span
                  className={`font-mono text-[10px] font-bold ${
                    item.up ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {item.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 3. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#02172D] via-[#042442] to-[#063B68] text-white pt-16 pb-24 px-4 sm:px-8 lg:px-12 border-b border-white/10 maritime-grid-dark">
        {/* Ambient subtle light circles */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#0867B2]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-sky-200 backdrop-blur-md shadow-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>National Dry Bulk Logistics & Charter Decision Support Platform</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.08]">
              Intelligent Maritime Logistics for Indian Steel
            </h1>

            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Forecast dry bulk freight rates with machine learning. Optimize vessel fixtures against port draft limitations. Track live Bay of Bengal voyages and eliminate costly port demurrage.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white font-bold text-sm transition-all shadow-lg shadow-[#FF7A00]/25 hover:shadow-xl flex items-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
              >
                <span>Launch Command Center</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/requirements/new')}
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white border border-white/20 font-bold text-sm transition-all backdrop-blur-md flex items-center gap-2 cursor-pointer"
              >
                <span>Create Cargo Requirement</span>
                <ChevronRight className="w-4 h-4 text-sky-300" />
              </button>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-xl">
              <div>
                <div className="font-heading font-extrabold text-3xl text-white tabular-nums">
                  1.84M MT
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">
                  Raw Steel Cargo Tracked
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-3xl text-[#FF7A00] tabular-nums">
                  94.2%
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">
                  ML Freight Accuracy
                </div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-3xl text-emerald-400 tabular-nums">
                  ₹4.82 Cr
                </div>
                <div className="text-xs text-slate-300 font-medium mt-0.5">
                  Demurrage Avoided
                </div>
              </div>
            </div>
          </div>

          {/* Right Maritime Graphic Visualization: Interactive Console Card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel-dark p-6 rounded-2xl border border-white/15 relative overflow-hidden shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </div>
                  <span className="font-heading font-bold text-xs text-white uppercase tracking-wider">
                    Bay of Bengal Fleet Stream
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#0867B2]/40 text-sky-300 px-2.5 py-0.5 rounded-full border border-sky-400/30">
                  SATELLITE AIS LIVE
                </span>
              </div>

              {/* Central Map Illustration with Animated Radar */}
              <div className="h-64 rounded-xl bg-[#02182D] border border-white/10 relative flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 240" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#0867B2" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#0867B2" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="#0867B2" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="100" y1="0" x2="100" y2="240" stroke="#0867B2" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="200" y1="0" x2="200" y2="240" stroke="#0867B2" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />
                  <line x1="300" y1="0" x2="300" y2="240" stroke="#0867B2" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.3" />

                  {/* Stylized East Coast India coastline */}
                  <path
                    d="M 60 10 L 140 10 C 130 50, 115 100, 110 140 C 105 170, 90 210, 80 230 L 10 230"
                    fill="none"
                    stroke="#0867B2"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    opacity="0.8"
                  />

                  {/* Port Coordinates */}
                  <circle cx="120" cy="90" r="5" fill="#FF7A00" />
                  <circle cx="120" cy="90" r="8" fill="#FF7A00" opacity="0.3" className="animate-ping" />
                  <text x="132" y="93" fontSize="10" fontWeight="bold" fill="#FFFFFF">Visakhapatnam (INVTZ)</text>

                  <circle cx="130" cy="65" r="4" fill="#38BDF8" />
                  <text x="140" y="68" fontSize="9" fontWeight="bold" fill="#CBD5E1">Paradip (INPRT)</text>

                  <circle cx="100" cy="150" r="4" fill="#10B981" />
                  <text x="110" y="153" fontSize="9" fontWeight="bold" fill="#CBD5E1">Chennai (INMAA)</text>

                  {/* Voyage Route Polyline */}
                  <path
                    d="M 370 210 Q 280 170, 205 130 T 120 90"
                    fill="none"
                    stroke="#FF7A00"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />

                  {/* Active Vessel Marker */}
                  <circle cx="205" cy="130" r="10" fill="#0867B2" opacity="0.4" className="animate-ping" />
                  <circle cx="205" cy="130" r="6" fill="#38BDF8" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="215" y="125" fontSize="10" fontWeight="bold" fill="#38BDF8">MV STEEL VOYAGER</text>
                  <text x="215" y="142" fontSize="9" fill="#94A3B8">12.8 kts • Heading 248° • SOG</text>
                </svg>
              </div>

              {/* Bottom Telemetry Card Details */}
              <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Cargo Manifest
                  </span>
                  <span className="font-bold text-white text-xs">80,000 MT Coking Coal</span>
                  <span className="text-[10px] text-sky-300 block">Hay Point → Vizag (VPA)</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
                    Berth ETA & Status
                  </span>
                  <span className="font-mono font-bold text-emerald-400 text-xs">
                    28 OCT 14:30 UTC
                  </span>
                  <span className="text-[10px] text-emerald-300 font-semibold block">
                    Safe Draft Clearance: +2.1m
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ENTERPRISE TRUST & STAKEHOLDER STRIP */}
      <section className="bg-white border-b border-slate-200 py-6 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
            <Shield className="w-4 h-4 text-[#063B68]" />
            <span>Built for Major Indian Maritime Hubs:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
            {trustedPorts.map((port, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                {port}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 9-STEP END-TO-END MARITIME WORKFLOW */}
      <section id="workflow" className="py-20 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold tracking-widest text-[#0867B2] uppercase">
              End-to-End Decision Architecture
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#063B68] tracking-tight">
              The 9-Phase Maritime Logistics Workflow
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              From raw material demand requisition to final discharge demurrage audit, I-STELX integrates predictive AI with real-time operations into one cohesive operational cockpit.
            </p>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {workflowSteps.map((step, idx) => {
              const isSelected = activeStep === idx;
              return (
                <div
                  key={idx}
                  onClick={() => setActiveStep(idx)}
                  className={`istelx-card istelx-card-hover p-6 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#0867B2] ring-2 ring-[#0867B2]/20 shadow-md bg-sky-50/30'
                      : 'border-slate-200 bg-white'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-mono font-extrabold text-2xl text-[#FF7A00]">
                        {step.num}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                        {step.tag}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#063B68] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#0867B2]">
                      Phase {step.num} of 09
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#0867B2]" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Step Deep-Dive Callout */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-[#063B68] to-[#0867B2] text-white text-left flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#FF7A00]">
                Active Phase Inspection: {workflowSteps[activeStep].num} — {workflowSteps[activeStep].title}
              </span>
              <p className="text-sm text-slate-200 font-medium">
                {workflowSteps[activeStep].detail}
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-[#063B68] font-bold text-xs transition-colors flex-shrink-0 cursor-pointer shadow-sm"
            >
              Explore In Platform
            </button>
          </div>
        </div>
      </section>

      {/* 6. PLATFORM CAPABILITIES */}
      <section id="capabilities" className="py-20 px-4 sm:px-8 lg:px-12 bg-[#F5F8FC] border-b border-slate-200">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-3xl mx-auto">
            <span className="text-xs font-extrabold tracking-widest text-[#FF7A00] uppercase">
              Core Intelligence Modules
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#063B68] tracking-tight">
              Enterprise Maritime Logistics Intelligence
            </h2>
            <p className="text-sm text-slate-500">
              Engineered specifically for steel manufacturers, bulk shippers, and chartering desks handling coal, iron ore, and flux.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div
                  key={idx}
                  className="istelx-card istelx-card-hover p-6 rounded-2xl border border-slate-200 bg-white space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#EBF4FC] text-[#063B68] flex items-center justify-center border border-[#0867B2]/20">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {cap.tag}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#063B68]">
                      {cap.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cap.desc}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center gap-1 text-xs font-bold text-[#0867B2]">
                    <span>Learn more</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. INTERACTIVE DEMURRAGE & FREIGHT ROI CALCULATOR */}
      <section id="calculator" className="py-20 px-4 sm:px-8 lg:px-12 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <Calculator className="w-3.5 h-3.5" />
              <span>Charter Economics Calculator</span>
            </div>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#063B68]">
              Quantify Demurrage & Freight Savings
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Estimate your annual demurrage penalty prevention and spot freight savings enabled by I-STELX predictive scheduling.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#F8FAFC] to-[#EDF2F7] border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-8 shadow-md">
            {/* Left Controls */}
            <div className="md:col-span-6 space-y-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Annual Steel Bulk Import Volume</span>
                  <span className="font-mono text-[#063B68] font-extrabold text-sm">
                    {(cargoVolumeMt / 1000000).toFixed(2)}M MT
                  </span>
                </div>
                <input
                  type="range"
                  min={500000}
                  max={10000000}
                  step={250000}
                  value={cargoVolumeMt}
                  onChange={(e) => setCargoVolumeMt(Number(e.target.value))}
                  className="w-full accent-[#0867B2] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>0.5M MT</span>
                  <span>5.0M MT</span>
                  <span>10.0M MT</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-2">
                  <span>Charter Demurrage Rate ($/day)</span>
                  <span className="font-mono text-[#063B68] font-extrabold text-sm">
                    ${avgDemurrageRate.toLocaleString()}/day
                  </span>
                </div>
                <input
                  type="range"
                  min={12000}
                  max={35000}
                  step={1000}
                  value={avgDemurrageRate}
                  onChange={(e) => setAvgDemurrageRate(Number(e.target.value))}
                  className="w-full accent-[#FF7A00] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>$12,000 (Handymax)</span>
                  <span>$22,000 (Panamax)</span>
                  <span>$35,000 (Capesize)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-[#063B68]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Based on Port Congestion Queueing Models</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Average Indian East Coast coal anchorage waiting is 36–54 hours. I-STELX dynamic speed optimization recovers 1.8 demurrage days per voyage.
                </p>
              </div>
            </div>

            {/* Right Computed Values */}
            <div className="md:col-span-6 flex flex-col justify-between p-6 rounded-xl bg-[#063B68] text-white">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#FF7A00]">
                Projected Annual Impact
              </span>

              <div className="space-y-4 my-4">
                <div>
                  <div className="text-xs text-slate-300">Demurrage Penalties Prevented</div>
                  <div className="font-heading font-extrabold text-3xl sm:text-4xl text-emerald-400 tabular-nums">
                    ₹{demurrageSavingsInrCr} Cr
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    ~{estimatedDemurrageDaysSaved} ship days of anchorage demurrage saved
                  </div>
                </div>

                <div className="pt-3 border-t border-white/10">
                  <div className="text-xs text-slate-300">Freight Arbitrage Savings</div>
                  <div className="font-heading font-extrabold text-2xl text-white tabular-nums">
                    ₹{freightSavingsInrCr} Cr
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">
                    Via timing forward laycan with ML spot forecast
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/cost')}
                className="w-full py-3 rounded-lg bg-gradient-to-r from-[#FF7A00] to-amber-500 hover:from-amber-500 hover:to-[#FF7A00] text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>Run Detailed Landed Cost Calculation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="mt-auto bg-[#02172D] text-white py-12 px-4 sm:px-8 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <Logo size="md" showText={false} />
              <div>
                <div className="font-heading font-extrabold text-lg text-white">I-STELX</div>
                <div className="text-xs text-slate-400">
                  Indian Steel Transportation, Efficient Logistics & eXchange
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A specialized digital intelligence and decision support platform engineered for bulk maritime logistics in the Indian steel sector, aligning with Sagarmala and the National Logistics Policy.
            </p>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Modules
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><NavLink to="/freight" className="hover:text-white transition-colors">Freight Intelligence</NavLink></li>
              <li><NavLink to="/vessels" className="hover:text-white transition-colors">Vessel Optimizer</NavLink></li>
              <li><NavLink to="/ports" className="hover:text-white transition-colors">Port Compatibility</NavLink></li>
              <li><NavLink to="/tracking" className="hover:text-white transition-colors">Live AIS Tracking</NavLink></li>
              <li><NavLink to="/charter-advisor" className="hover:text-white transition-colors">AI Charter Advisor</NavLink></li>
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
              Governance & Access
            </div>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><NavLink to="/login" className="hover:text-white transition-colors">Enterprise Sign In</NavLink></li>
              <li><NavLink to="/register" className="hover:text-white transition-colors">Request Account</NavLink></li>
              <li><span className="text-slate-500">Security & RBAC Controls</span></li>
              <li><span className="text-slate-500">Ministry of Steel Guidelines</span></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>© 2026 I-STELX Platform. All Rights Reserved. National Maritime Framework.</div>
          <div className="flex items-center gap-3 font-mono text-[11px] text-[#FF7A00]">
            <span>Predict</span>
            <span>•</span>
            <span>Optimize</span>
            <span>•</span>
            <span>Track</span>
            <span>•</span>
            <span>Deliver</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
