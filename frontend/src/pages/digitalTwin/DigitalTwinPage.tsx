import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { digitalTwinService } from '../../services/digitalTwinService';
import { api } from '../../services/api';
import { DigitalTwinData, DigitalTwinHold } from '../../types/digitalTwin';
import { Shipment, Port } from '../../types';

// Digital Twin Components
import { DigitalTwinViewer } from '../../components/digitalTwin/DigitalTwinViewer';
import { HoldDetailsPanel } from '../../components/digitalTwin/HoldDetailsPanel';
import { CargoSummaryCards } from '../../components/digitalTwin/CargoSummaryCards';
import { CargoHoldDistribution } from '../../components/digitalTwin/CargoHoldDistribution';
import { CargoJourneyTimeline } from '../../components/digitalTwin/CargoJourneyTimeline';
import { CargoManifest } from '../../components/digitalTwin/CargoManifest';
import { SensorPanel } from '../../components/digitalTwin/SensorPanel';
import { SensorCharts } from '../../components/digitalTwin/SensorCharts';
import { DigitalTwinAlert } from '../../components/digitalTwin/DigitalTwinAlert';
import { DemoControlPanel } from '../../components/digitalTwin/DemoControlPanel';
import { VesselMap } from '../../components/tracking/VesselMap';
import { StatusBadge } from '../../components/common/StatusBadge';

// Icons
import {
  Box,
  Radio,
  Columns,
  RefreshCw,
  Ship,
  MapPin,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

type ViewMode = '3D_TWIN' | 'LIVE_MAP' | 'SPLIT_VIEW';

export const DigitalTwinPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  // Data states
  const shipmentIdentifier = id || 'SHP-2026-0018';
  const [data, setData] = useState<DigitalTwinData | null>(null);
  const [selectedHold, setSelectedHold] = useState<DigitalTwinHold | null>(null);
  const [ports, setPorts] = useState<Port[]>([]);
  const [activeTab, setActiveTab] = useState<ViewMode>('3D_TWIN');

  // Loading & error states
  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Ref to hold current selected hold number for syncing
  const selectedHoldNumRef = useRef<number | null>(null);

  // Fetch full digital twin state
  const loadData = useCallback(async (isSilent = false) => {
    if (!isSilent) setIsRefreshing(true);
    try {
      setError(null);
      const res = await digitalTwinService.getShipmentDigitalTwin(shipmentIdentifier);
      setData(res);

      // Preserve or set selected hold
      if (res.holds && res.holds.length > 0) {
        if (selectedHoldNumRef.current) {
          const match = res.holds.find(h => h.hold_number === selectedHoldNumRef.current);
          if (match) {
            setSelectedHold(match);
          } else {
            setSelectedHold(res.holds[2] || res.holds[0]);
            selectedHoldNumRef.current = res.holds[2]?.hold_number || 1;
          }
        } else {
          // Default to HOLD 03
          const hold3 = res.holds.find(h => h.hold_number === 3) || res.holds[0];
          setSelectedHold(hold3);
          selectedHoldNumRef.current = hold3.hold_number;
        }
      }
    } catch (err: any) {
      console.error('Digital twin load error:', err);
      if (!data) {
        setError(err.message || 'Unable to load Digital Twin data.');
      }
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [shipmentIdentifier]);

  // Load master ports for VesselMap
  useEffect(() => {
    api.getPorts().then(setPorts).catch(() => {});
  }, []);

  // Multi-step loading splash animation
  useEffect(() => {
    if (loading) {
      const timer1 = setTimeout(() => setLoadingStep(1), 300);
      const timer2 = setTimeout(() => setLoadingStep(2), 700);
      const timer3 = setTimeout(() => setLoadingStep(3), 1100);
      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
      };
    }
  }, [loading]);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // WebSocket / Safe Polling for real-time updates
  useEffect(() => {
    const disconnectWs = digitalTwinService.connectCargoWebSocket(shipmentIdentifier, (wsData) => {
      if (wsData) {
        loadData(true);
      }
    });

    const pollInterval = setInterval(() => {
      loadData(true);
    }, 4000);

    return () => {
      disconnectWs();
      clearInterval(pollInterval);
    };
  }, [shipmentIdentifier, loadData]);

  const handleSelectHold = (hold: DigitalTwinHold) => {
    setSelectedHold(hold);
    selectedHoldNumRef.current = hold.hold_number;
  };

  const handleSelectHoldNumber = (holdNumber: number) => {
    if (!data?.holds) return;
    const target = data.holds.find(h => h.hold_number === holdNumber);
    if (target) {
      handleSelectHold(target);
    }
  };

  // Convert digital twin data to Shipment object for VesselMap
  const mapShipment: Shipment | null = data ? {
    id: data.shipment.id,
    shipment_code: data.shipment.shipment_code,
    vessel_id: data.vessel.id,
    vessel_name: data.vessel.name,
    vessel_imo: data.vessel.imo,
    vessel_type: data.vessel.vessel_type,
    cargo_type: data.shipment.cargo_type,
    quantity_mt: data.shipment.quantity_mt,
    origin_port: data.shipment.origin_port,
    destination_port: data.shipment.destination_port,
    departure_time: data.shipment.departure_time,
    scheduled_eta: data.shipment.scheduled_eta,
    current_eta: data.shipment.current_eta,
    eta_variance_hours: data.shipment.eta_variance_hours || 0,
    status: (data.shipment.status as any) || 'IN TRANSIT',
    progress_pct: data.shipment.progress_pct,
    current_lat: data.shipment.current_lat || 14.2,
    current_lng: data.shipment.current_lng || 84.5,
    current_speed_knots: data.shipment.current_speed_knots || 12.8,
    current_heading: data.shipment.current_heading || 295.0,
    total_distance_nm: 4200,
    remaining_distance_nm: 1350,
    planned_cost_cr: 12.4,
    actual_cost_cr: 12.1,
    risk_level: (data.shipment.risk_level as any) || 'LOW',
    route_waypoints: [
      [-21.28, 149.3], // Hay Point
      [-10.0, 130.0],  // Timor Sea
      [5.5, 95.0],     // Malacca Strait exit
      [14.2, 84.5],    // Current position
      [17.68, 83.21]   // Visakhapatnam Port
    ]
  } : null;

  // Simulation Handlers
  const handleStartLoading = async (step?: number) => {
    await digitalTwinService.startLoadingSimulation(data?.shipment.shipment_code || 'SHP-2026-0018', step);
    await loadData(true);
  };

  const handleStartDischarge = async (step?: number) => {
    await digitalTwinService.startDischargeSimulation(data?.shipment.shipment_code || 'SHP-2026-0018', step);
    await loadData(true);
  };

  const handleTriggerAlert = async (trigger: boolean) => {
    await digitalTwinService.triggerSensorAlert(data?.shipment.shipment_code || 'SHP-2026-0018', trigger);
    await loadData(true);
  };

  const handleResetSimulation = async () => {
    await handleStartLoading(5);
    await handleTriggerAlert(false);
  };

  // 1. INITIALIZING LOADING STATE
  if (loading && !data) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center text-center p-6 bg-[#021024] text-white">
        <div className="bg-[#063B68]/50 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl max-w-sm w-full flex flex-col items-center">
          <div className="w-16 h-16 rounded-2xl bg-[#063B68] text-white flex items-center justify-center shadow-xl mb-4 border border-[#0867B2]">
            <Box className="w-8 h-8 text-[#FF7A00] animate-bounce" />
          </div>

          <span className="text-xs font-mono font-bold tracking-widest text-[#38BDF8] uppercase">
            I-STELX MARITIME TWIN
          </span>
          <h2 className="font-heading font-black text-xl text-white mt-1 mb-3">
            INITIALIZING SPATIAL TWIN
          </h2>

          <div className="space-y-1.5 text-xs text-[#A0C4E2] font-medium min-h-[32px]">
            {loadingStep === 0 && <p className="animate-fade-in">Loading 3D vessel geometry...</p>}
            {loadingStep === 1 && <p className="animate-fade-in text-[#38BDF8]">Calibrating cargo holds...</p>}
            {loadingStep >= 2 && <p className="animate-fade-in text-[#34D399]">Streaming real-time telemetry...</p>}
          </div>

          <div className="w-48 h-1.5 bg-white/10 rounded-full overflow-hidden mt-4 border border-white/15">
            <div className="h-full bg-gradient-to-r from-[#0867B2] to-[#FF7A00] animate-pulse w-full" />
          </div>
        </div>
      </div>
    );
  }

  // 2. ERROR STATE
  if (error && !data) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6 bg-[#021024] text-white">
        <div className="bg-[#063B68]/50 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-2xl max-w-md w-full flex flex-col items-center">
          <div className="p-4 rounded-full bg-red-500/20 text-red-400 mb-3 border border-red-500/40">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h3 className="font-heading font-bold text-xl text-white mb-1">
            Unable to load Digital Twin
          </h3>
          <p className="text-xs text-[#A0C4E2] mb-4">{error}</p>
          <button
            onClick={() => loadData()}
            className="px-4 py-2 bg-[#FF7A00] hover:bg-[#FF7A00]/80 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Connection</span>
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const hasHold3Alert = data.sensors?.alerts?.some(a => a.hold.includes('03')) || data.holds.some(h => h.hold_number === 3 && h.has_alert);

  return (
    <div className="relative min-h-screen text-white">
      {/* 
        ========================================================================
        1. GLOBAL LAYOUT STRUCTURE: EDGE-TO-EDGE THREE.JS CANVAS (z-index: 0)
        Fills the entire right side of the screen right of the dark navy sidebar
        ========================================================================
      */}
      {activeTab === '3D_TWIN' && (
        <div className="fixed inset-0 lg:left-64 top-16 z-0 pointer-events-auto">
          <DigitalTwinViewer
            holds={data.holds}
            selectedHold={selectedHold}
            onSelectHold={handleSelectHold}
            isSimulating={data.simulation_mode !== 'IDLE'}
            isEdgeToEdge={true}
          />
        </div>
      )}

      {/*
        ========================================================================
        2. FLOATING UI LAYER (z-index: 10)
        All data panels sit on a z-index: 10 layer above the 3D canvas
        Transparent background allows interacting directly with 3D Canvas
        ========================================================================
      */}
      <div className="relative z-10 pointer-events-none p-4 sm:p-6 space-y-5 pb-16">
        {/* 1. PAGE HEADER & VOYAGE SUMMARY BANNER (Frosted Glass Panel) */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#063B68]/40 backdrop-blur-md p-4 sm:p-5 rounded-xl border border-white/20 shadow-xl pointer-events-auto">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-white/10 border border-white/20 text-[#38BDF8] shadow-xs">
                <Box className="w-5 h-5 text-[#FF7A00]" />
              </div>
              <div>
                <h1 className="font-heading font-black text-2xl lg:text-3xl text-[#FFFFFF] tracking-tight">
                  3D Cargo Digital Twin
                </h1>
                <p className="text-xs text-[#A0C4E2] mt-0.5">
                  Spatial computing environment for maritime steel logistics & live hold telemetry.
                </p>
              </div>
            </div>

            {/* Shipment Key Badges Bar */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 text-xs">
              <span className="font-mono font-bold text-[#FFFFFF] bg-white/10 px-2.5 py-1 rounded-lg border border-white/20">
                {data.shipment.shipment_code}
              </span>
              <span className="font-semibold text-[#FFFFFF] flex items-center gap-1.5">
                <Ship className="w-3.5 h-3.5 text-[#38BDF8]" />
                <strong>{data.vessel.name}</strong>
              </span>
              <span className="text-[#A0C4E2]">({data.vessel.vessel_type})</span>
              <span className="text-white/30">•</span>
              <span className="text-[#A0C4E2]">
                Cargo: <strong className="text-[#FFFFFF]">{data.shipment.quantity_mt?.toLocaleString()} MT {data.shipment.cargo_type}</strong>
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[#A0C4E2] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#34D399]" />
                <span className="text-[#FFFFFF]">{data.shipment.origin_port} → {data.shipment.destination_port}</span>
              </span>
              <span className="text-white/30">•</span>
              <span className="text-[#A0C4E2] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF7A00]" />
                <span>ETA: <strong className="text-[#FFFFFF]">{data.shipment.current_eta}</strong></span>
              </span>
            </div>
          </div>

          {/* Right Status Badge & Refresh Button */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] text-[#A0C4E2] font-bold uppercase tracking-wider">Voyage Progress</div>
              <div className="text-base font-heading font-black text-[#38BDF8]">
                {data.shipment.progress_pct}%
              </div>
            </div>

            <StatusBadge status={data.shipment.status} />

            <button
              onClick={() => loadData()}
              className={`p-2 rounded-xl border border-white/20 bg-white/10 hover:bg-white/20 text-[#FFFFFF] transition-all cursor-pointer ${
                isRefreshing ? 'animate-spin' : ''
              }`}
              title="Refresh Digital Twin Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2. HOLD CONDITION ALERT BANNER */}
        {data.sensors?.alerts && data.sensors.alerts.length > 0 && (
          <div className="pointer-events-auto">
            <DigitalTwinAlert
              alerts={data.sensors.alerts}
              onAlertClick={(holdCode) => {
                const hNum = parseInt(holdCode.replace(/\D/g, ''), 10) || 3;
                handleSelectHoldNumber(hNum);
              }}
            />
          </div>
        )}

        {/* 3. NAVIGATION VIEW TABS: 3D DIGITAL TWIN | LIVE MAP | SPLIT VIEW */}
        <div className="flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-2 bg-[#063B68]/40 backdrop-blur-md p-1.5 rounded-xl border border-white/20 shadow-xl">
            <button
              onClick={() => setActiveTab('3D_TWIN')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === '3D_TWIN'
                  ? 'bg-[#FF7A00] text-white shadow-md shadow-[#FF7A00]/40'
                  : 'text-[#A0C4E2] hover:text-white hover:bg-white/10'
              }`}
            >
              <Box className="w-4 h-4 text-white" />
              <span>3D DIGITAL TWIN</span>
            </button>

            <button
              onClick={() => setActiveTab('LIVE_MAP')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'LIVE_MAP'
                  ? 'bg-[#0867B2] text-white shadow-md'
                  : 'text-[#A0C4E2] hover:text-white hover:bg-white/10'
              }`}
            >
              <Radio className="w-4 h-4 text-[#34D399]" />
              <span>LIVE MAP</span>
            </button>

            <button
              onClick={() => setActiveTab('SPLIT_VIEW')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'SPLIT_VIEW'
                  ? 'bg-[#0867B2] text-white shadow-md'
                  : 'text-[#A0C4E2] hover:text-white hover:bg-white/10'
              }`}
            >
              <Columns className="w-4 h-4 text-[#38BDF8]" />
              <span>SPLIT VIEW</span>
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#A0C4E2] bg-[#063B68]/40 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 hidden md:inline shadow-xl">
            Panamax Class: LOA {data.vessel.loa_m}m • Beam {data.vessel.beam_m}m
          </span>
        </div>

        {/* 4. MAIN INTERACTIVE VIEWER AREA */}
        {/* CASE A: 3D DIGITAL TWIN (Spatial Window + Floating Hold Details Panel) */}
        {activeTab === '3D_TWIN' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 8 Cols: Unobstructed Spatial Viewport for direct 3D interaction */}
            <div className="lg:col-span-8 min-h-[460px] pointer-events-none flex flex-col justify-end">
              {/* Note: Click, drag, rotate and zoom interact directly with the background Canvas */}
            </div>

            {/* Right 4 Cols: Floating Glass Hold Details Panel */}
            <div className="lg:col-span-4 pointer-events-auto">
              <HoldDetailsPanel
                holds={data.holds}
                selectedHold={selectedHold}
                onSelectHold={handleSelectHold}
              />
            </div>
          </div>
        )}

        {/* CASE B: LIVE MAP VIEW */}
        {activeTab === 'LIVE_MAP' && mapShipment && (
          <div className="pointer-events-auto bg-[#063B68]/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
            <VesselMap
              shipments={[mapShipment]}
              ports={ports}
              selectedShipmentId={mapShipment.id}
              height="620px"
              center={[mapShipment.current_lat, mapShipment.current_lng]}
              zoom={5}
            />
          </div>
        )}

        {/* CASE C: SPLIT VIEW */}
        {activeTab === 'SPLIT_VIEW' && mapShipment && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 pointer-events-auto">
            {/* Left: Live Map (50%) */}
            <div className="lg:col-span-6 bg-[#063B68]/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Radio className="w-4 h-4 text-[#34D399] animate-ping" />
                  <span>LIVE AIS VESSEL POSITION</span>
                </span>
                <span className="text-[10px] font-mono text-[#A0C4E2]">
                  {mapShipment.current_lat.toFixed(2)}°N, {mapShipment.current_lng.toFixed(2)}°E
                </span>
              </div>
              <VesselMap
                shipments={[mapShipment]}
                ports={ports}
                selectedShipmentId={mapShipment.id}
                height="520px"
                center={[mapShipment.current_lat, mapShipment.current_lng]}
                zoom={5}
              />
            </div>

            {/* Right: 3D Vessel & Cargo Holds (50%) */}
            <div className="lg:col-span-6 bg-[#063B68]/40 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-xl flex flex-col">
              <div className="mb-3 flex items-center justify-between text-xs font-bold text-white">
                <span className="flex items-center gap-1.5">
                  <Box className="w-4 h-4 text-[#FF7A00]" />
                  <span>3D VESSEL & CARGO HOLDS</span>
                </span>
                <span className="text-[10px] font-mono text-[#A0C4E2]">
                  {selectedHold ? selectedHold.hold_code : 'HOLD 03'} SELECTED
                </span>
              </div>
              <DigitalTwinViewer
                holds={data.holds}
                selectedHold={selectedHold}
                onSelectHold={handleSelectHold}
                height="520px"
                isSimulating={data.simulation_mode !== 'IDLE'}
                isEdgeToEdge={false}
              />
            </div>
          </div>
        )}

        {/* 
          ========================================================================
          5. REFINED DOCKED BOTTOM GLASS PANELS
          Floating glass cards docked to the bottom layer over the 3D scene
          ========================================================================
        */}
        <div className="pointer-events-auto space-y-5 pt-2">
          {/* 5. SUMMARY KPI CARDS */}
          <CargoSummaryCards summary={data.summary} />

          {/* 6. DEMO SIMULATION CONTROL PANEL */}
          <DemoControlPanel
            shipmentCode={data.shipment.shipment_code}
            onStartLoading={handleStartLoading}
            onStartDischarge={handleStartDischarge}
            onTriggerAlert={handleTriggerAlert}
            onReset={handleResetSimulation}
            hasAlert={hasHold3Alert}
            simulationMode={data.simulation_mode}
          />

          {/* 7. CARGO HOLD DISTRIBUTION & SENSORS ROW */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-6">
              <CargoHoldDistribution
                holds={data.holds}
                selectedHoldNumber={selectedHold ? selectedHold.hold_number : null}
                onSelectHold={handleSelectHold}
              />
            </div>

            <div className="lg:col-span-6">
              <SensorPanel sensors={data.sensors} />
            </div>
          </div>

          {/* 8. SENSOR 24H CHARTS */}
          <SensorCharts history={data.sensors?.history_24h || []} />

          {/* 9. CARGO MANIFEST TABLE */}
          <CargoManifest
            batches={data.batches}
            holds={data.holds}
            selectedHoldNumber={selectedHold ? selectedHold.hold_number : null}
            onSelectHoldNumber={handleSelectHoldNumber}
          />

          {/* 10. CARGO JOURNEY TIMELINE */}
          <CargoJourneyTimeline timeline={data.journey_timeline} />
        </div>
      </div>
    </div>
  );
};
