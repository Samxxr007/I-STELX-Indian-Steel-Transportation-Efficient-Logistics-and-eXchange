import React from 'react';
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
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const workflowSteps = [
    { num: '01', title: 'Cargo Requirement', desc: 'Specify volume, cargo grade, origin & laycan window' },
    { num: '02', title: 'Freight Intelligence', desc: 'Predict 7/15/30-day forward rates via ML ensemble' },
    { num: '03', title: 'Vessel Optimization', desc: 'Match Panamax/Capesize fleet capacity and position' },
    { num: '04', title: 'Port Compatibility', desc: 'Verify draft, LOA, beam and berth constraints' },
    { num: '05', title: 'Cost Intelligence', desc: 'Compute landed ocean freight, port dues & demurrage in ₹ Cr' },
    { num: '06', title: 'AI Charter Advisor', desc: 'Receive explainable trade-off scoring and fixture guidance' },
    { num: '07', title: 'Live Tracking Tower', desc: 'Realtime AIS telemetry, speed, heading & geofences' },
    { num: '08', title: 'ETA & Risk Alerts', desc: 'Predict schedule variance and port queue disruptions' },
    { num: '09', title: 'Planned vs Actual', desc: 'Audit final landed variance, duration & demurrage' },
  ];

  const capabilities = [
    {
      icon: TrendingUp,
      title: 'ML Freight Forecasting',
      desc: 'Predict dry bulk freight trends using chronologically split Ridge & Random Forest ensembles with uncertainty bounds.'
    },
    {
      icon: Ship,
      title: 'Fleet & Vessel Optimizer',
      desc: 'Screen Handysize to Capesize bulk carriers against capacity needs, laycan positioning, and fuel efficiency metrics.'
    },
    {
      icon: Anchor,
      title: 'Port Compatibility Engine',
      desc: 'Automated validation of vessel draft, beam, LOA and DWT against Visakhapatnam, Paradip, Haldia, Dhamra and global hubs.'
    },
    {
      icon: Radio,
      title: 'Maritime Control Tower',
      desc: 'Realtime AIS telemetry simulation, waypoint interpolation, and geofence boundary crossing triggers.'
    },
    {
      icon: Clock,
      title: 'ETA Intelligence',
      desc: 'Continuous voyage ETA recalculation integrating rolling speed averages, Bay of Bengal weather, and destination berth queues.'
    },
    {
      icon: AlertTriangle,
      title: 'Multimodal Risk & Alerts',
      desc: 'Proactive early-warning alerts for schedule delays, port congestion spikes, freight index volatility, and demurrage exposure.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F5F8FC] text-[#102A43] flex flex-col font-sans">
      {/* PUBLIC HEADER */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#CBD5E1] px-6 lg:px-12 py-3.5 flex items-center justify-between shadow-2xs">
        <NavLink to="/" className="flex items-center gap-2">
          <Logo size="md" />
        </NavLink>

        <nav className="hidden md:flex items-center gap-8 text-xs font-bold uppercase tracking-wider text-[#475569]">
          <a href="#capabilities" className="hover:text-[#0867B2] transition-colors">Platform</a>
          <a href="#workflow" className="hover:text-[#0867B2] transition-colors">How It Works</a>
          <a href="#intelligence" className="hover:text-[#0867B2] transition-colors">Intelligence</a>
          <a href="#tracking" className="hover:text-[#0867B2] transition-colors">Tracking</a>
          <a href="#metrics" className="hover:text-[#0867B2] transition-colors">Metrics</a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="px-4 py-2 rounded-lg text-xs font-bold text-[#063B68] hover:bg-[#EBF4FC] transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/register')}
            className="px-4 py-2 rounded-lg bg-[#063B68] hover:bg-[#0867B2] text-white text-xs font-bold transition-all shadow-xs hover:shadow-md cursor-pointer flex items-center gap-1.5"
          >
            <span>Create Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 px-6 lg:px-12 border-b border-[#CBD5E1]/60 bg-gradient-to-b from-white via-[#F5F8FC] to-[#EBF2FA]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBF4FC] border border-[#CBD5E1] text-xs font-bold text-[#0867B2]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#00843D]" />
              <span>National Maritime Steel Logistics Intelligence Framework</span>
            </div>

            <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#063B68] tracking-tight leading-[1.1]">
              Intelligent Maritime Logistics for Indian Steel
            </h1>

            <p className="text-base sm:text-lg text-[#475569] font-medium leading-relaxed max-w-2xl">
              Forecast bulk dry freight. Optimize vessel fixtures. Track every voyage in real time. Minimize port demurrage and make data-driven chartering decisions.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3.5 rounded-lg bg-[#063B68] hover:bg-[#0867B2] text-white font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center gap-2 cursor-pointer"
              >
                <span>Login to Command Center</span>
                <ArrowRight className="w-4 h-4 text-[#FF7A00]" />
              </button>
              <button
                onClick={() => navigate('/requirements/new')}
                className="px-6 py-3.5 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#063B68] border border-[#CBD5E1] font-bold text-sm transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
              >
                <span>Create Cargo Requirement</span>
              </button>
            </div>

            {/* Quick stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#CBD5E1]/80 max-w-lg">
              <div>
                <div className="font-heading font-extrabold text-2xl text-[#063B68]">1.84M MT</div>
                <div className="text-xs text-[#64748B] font-medium">Steel Cargo Monitored</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-[#FF7A00]">94.2%</div>
                <div className="text-xs text-[#64748B] font-medium">ML Forecast Accuracy</div>
              </div>
              <div>
                <div className="font-heading font-extrabold text-2xl text-[#00843D]">₹4.82 Cr</div>
                <div className="text-xs text-[#64748B] font-medium">Demurrage Savings</div>
              </div>
            </div>
          </div>

          {/* Right Maritime Graphic Visualization */}
          <div className="lg:col-span-5 relative">
            <div className="istelx-card p-6 bg-white shadow-2xl border border-[#CBD5E1] rounded-2xl relative overflow-hidden">
              {/* Top Card Badge */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00843D] animate-ping" />
                  <span className="font-heading font-bold text-xs text-[#063B68] uppercase tracking-wider">
                    Bay of Bengal Fleet Stream
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#EBF4FC] text-[#0867B2] px-2 py-0.5 rounded">
                  LIVE AIS TELEMETRY
                </span>
              </div>

              {/* Central Map Illustration */}
              <div className="h-64 rounded-xl bg-[#EAF2FB] border border-[#CBD5E1] relative flex items-center justify-center overflow-hidden">
                <svg viewBox="0 0 400 240" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="0" y1="120" x2="400" y2="120" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="0" y1="180" x2="400" y2="180" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="100" y1="0" x2="100" y2="240" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="200" y1="0" x2="200" y2="240" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />
                  <line x1="300" y1="0" x2="300" y2="240" stroke="#CBD5E1" strokeWidth="0.5" strokeDasharray="3 3" />

                  {/* Stylized India Coastline */}
                  <path
                    d="M 60 10 L 140 10 C 130 50, 115 100, 110 140 C 105 170, 90 210, 80 230 L 10 230"
                    fill="none"
                    stroke="#063B68"
                    strokeWidth="3"
                  />

                  {/* Ports */}
                  <circle cx="120" cy="90" r="5" fill="#FF7A00" />
                  <text x="130" y="93" fontSize="10" fontWeight="bold" fill="#063B68">Visakhapatnam (INVTZ)</text>

                  <circle cx="130" cy="65" r="4" fill="#063B68" />
                  <text x="138" y="68" fontSize="9" fontWeight="bold" fill="#063B68">Paradip (INPRT)</text>

                  <circle cx="100" cy="150" r="4" fill="#00843D" />
                  <text x="108" y="153" fontSize="9" fontWeight="bold" fill="#063B68">Chennai (INMAA)</text>

                  {/* Route Polyline */}
                  <path
                    d="M 360 210 Q 280 180, 200 130 T 120 90"
                    fill="none"
                    stroke="#FF7A00"
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />

                  {/* Vessel Position Marker */}
                  <circle cx="210" cy="132" r="8" fill="#0867B2" opacity="0.3" className="animate-ping" />
                  <circle cx="210" cy="132" r="5" fill="#0867B2" stroke="#FFFFFF" strokeWidth="1.5" />
                  <text x="215" y="125" fontSize="9" fontWeight="bold" fill="#063B68">MV STEEL VOYAGER</text>
                  <text x="215" y="145" fontSize="8" fill="#475569">12.8 kts • 68% Voyage</text>
                </svg>
              </div>

              {/* Bottom Telemetry snippet */}
              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                <div>
                  <span className="text-[#64748B]">Active Cargo: </span>
                  <span className="font-bold text-[#063B68]">80,000 MT Coking Coal</span>
                </div>
                <div className="font-mono font-bold text-[#00843D]">
                  ETA 28 Oct (On-Track)
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW I-STELX WORKS (9-STEP WORKFLOW) */}
      <section id="workflow" className="py-20 px-6 lg:px-12 bg-white border-b border-[#CBD5E1]">
        <div className="max-w-7xl mx-auto text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold tracking-widest text-[#0867B2] uppercase">
              End-to-End Maritime Workflow
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#063B68]">
              How I-STELX Delivers Operational Certainty
            </h2>
            <p className="text-sm text-[#64748B]">
              From raw material demand creation to final port discharge audit, I-STELX connects all phases into a unified decision support pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workflowSteps.map((step, idx) => (
              <div
                key={idx}
                className="istelx-card istelx-card-hover p-6 text-left border border-[#E2E8F0] rounded-xl relative flex flex-col justify-between"
              >
                <div>
                  <div className="font-mono font-extrabold text-2xl text-[#FF7A00] mb-2">
                    {step.num}
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#063B68] mb-1.5">
                    {step.title}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">
                    {step.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#F1F5F9] flex items-center gap-1 text-[11px] font-bold text-[#0867B2]">
                  <span>Step {step.num} of 09</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLATFORM CAPABILITIES */}
      <section id="capabilities" className="py-20 px-6 lg:px-12 bg-[#F5F8FC]">
        <div className="max-w-7xl mx-auto space-y-12 text-center">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold tracking-widest text-[#FF7A00] uppercase">
              Integrated Capabilities
            </span>
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#063B68]">
              Enterprise Maritime Logistics Intelligence
            </h2>
            <p className="text-sm text-[#64748B]">
              Built purposefully for steel-sector bulk raw material chartering, demurrage prevention, and vessel tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
            {capabilities.map((cap, idx) => {
              const Icon = cap.icon;
              return (
                <div key={idx} className="istelx-card p-6 rounded-xl border border-[#CBD5E1] bg-white space-y-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EBF4FC] text-[#063B68] flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-base text-[#063B68]">{cap.title}</h3>
                  <p className="text-xs text-[#64748B] leading-relaxed">{cap.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-auto bg-[#042848] text-white py-12 px-6 lg:px-12 border-t border-[#0867B2]/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Logo size="md" showText={false} />
            <div>
              <div className="font-heading font-bold text-base text-white">I-STELX</div>
              <div className="text-[10px] text-[#94A3B8]">Indian Steel Transportation, Efficient Logistics & eXchange</div>
            </div>
          </div>

          <div className="text-xs text-[#94A3B8] text-center md:text-right">
            <div>© 2026 I-STELX Maritime Logistics Intelligence System. All Rights Reserved.</div>
            <div className="text-[10px] text-[#FF7A00] mt-1 font-mono">
              Predict • Optimize • Track • Deliver
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
