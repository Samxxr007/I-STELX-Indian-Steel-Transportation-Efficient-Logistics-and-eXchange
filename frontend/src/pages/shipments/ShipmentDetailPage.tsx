import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { StatusBadge } from '../../components/common/StatusBadge';
import { VesselMap } from '../../components/tracking/VesselMap';
import {
  Package,
  Ship,
  MapPin,
  Clock,
  Compass,
  Gauge,
  DollarSign,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  Check,
  Download,
  ShieldCheck,
  Activity
} from 'lucide-react';

export const ShipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [shipment, setShipment] = useState<any>(null);
  const [ports, setPorts] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<
    'OVERVIEW' | 'TRACKING' | 'CARGO' | 'VESSEL' | 'COST' | 'ETA' | 'EVENTS' | 'ALERTS' | 'DOCUMENTS'
  >('OVERVIEW');
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      const [sData, pData] = await Promise.all([
        api.getShipmentDetail(Number(id)),
        api.getPorts()
      ]);
      setShipment(sData);
      setPorts(pData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleCompleteShipment = async () => {
    if (!id) return;
    setCompleting(true);
    try {
      await api.completeShipment(Number(id));
      await fetchDetail();
    } catch (err) {
      console.error(err);
    } finally {
      setCompleting(false);
    }
  };

  if (loading || !shipment) {
    return (
      <div className="p-12 text-center text-xs text-[#64748B]">
        Loading comprehensive shipment voyage dossier...
      </div>
    );
  }

  const tabs = [
    { id: 'OVERVIEW', label: 'Overview' },
    { id: 'TRACKING', label: 'Live Tracking' },
    { id: 'CARGO', label: 'Cargo Details' },
    { id: 'VESSEL', label: 'Vessel Telemetry' },
    { id: 'COST', label: 'Cost Breakdown' },
    { id: 'ETA', label: 'ETA Variance' },
    { id: 'EVENTS', label: 'Voyage Timeline' },
    { id: 'ALERTS', label: 'Alerts' },
    { id: 'DOCUMENTS', label: 'Documents' }
  ] as const;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/shipments')}
            className="p-2 rounded-lg bg-white border border-[#CBD5E1] text-[#063B68] hover:bg-[#F8FAFC] cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-heading font-extrabold text-2xl lg:text-3xl text-[#063B68] tracking-tight">
                {shipment.shipment_code}
              </h1>
              <StatusBadge status={shipment.status} size="md" />
            </div>
            <p className="text-xs text-[#64748B] mt-0.5">
              {shipment.quantity_mt.toLocaleString()} MT {shipment.cargo_type} • {shipment.origin_port} → {shipment.destination_port}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {shipment.status !== 'COMPLETED' && (
            <button
              onClick={handleCompleteShipment}
              disabled={completing}
              className="px-4 py-2 bg-[#00843D] hover:bg-emerald-700 text-white font-bold text-xs rounded-lg transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{completing ? 'Completing...' : 'MARK VOYAGE COMPLETED'}</span>
            </button>
          )}

          <button
            onClick={() => navigate('/reports')}
            className="px-3.5 py-2 bg-white border border-[#CBD5E1] hover:bg-[#F8FAFC] text-[#063B68] font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Generate Voyage Report</span>
          </button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="border-b border-[#CBD5E1] bg-white rounded-t-xl px-4 flex items-center gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-3.5 text-xs font-bold border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'border-[#0867B2] text-[#0867B2]'
                : 'border-transparent text-[#64748B] hover:text-[#102A43]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT: OVERVIEW */}
      {activeTab === 'OVERVIEW' && (
        <div className="space-y-6">
          {/* Key Voyage Stat Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="istelx-card p-4 bg-white">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Assigned Vessel</span>
              <div className="font-heading font-extrabold text-lg text-[#063B68] mt-1">{shipment.vessel?.name}</div>
              <div className="text-xs text-[#64748B] font-mono">IMO {shipment.vessel?.imo} • {shipment.vessel?.vessel_type}</div>
            </div>

            <div className="istelx-card p-4 bg-white">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Current Telemetry ETA</span>
              <div className="font-heading font-extrabold text-lg text-[#063B68] mt-1">{shipment.current_eta}</div>
              <div className="text-xs text-[#D92D20] font-bold">
                {shipment.eta_variance_hours > 0 ? `+${shipment.eta_variance_hours}h Variance` : 'On Schedule'}
              </div>
            </div>

            <div className="istelx-card p-4 bg-white">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Distance Remaining</span>
              <div className="font-heading font-extrabold text-lg text-[#0867B2] mt-1">
                {shipment.remaining_distance_nm.toFixed(0)} NM
              </div>
              <div className="text-xs text-[#64748B]">Total: {shipment.total_distance_nm} NM ({shipment.progress_pct}%)</div>
            </div>

            <div className="istelx-card p-4 bg-white">
              <span className="text-[10px] uppercase font-bold text-[#64748B]">Committed Landed Cost</span>
              <div className="font-heading font-extrabold text-lg text-[#063B68] mt-1">₹{shipment.planned_cost_cr} Cr</div>
              <div className="text-xs text-[#00843D] font-semibold">Variance: +1.7% within tolerance</div>
            </div>
          </div>

          {/* Map Preview on Overview */}
          <div className="istelx-card p-5 space-y-3">
            <h3 className="font-heading font-bold text-sm text-[#063B68]">
              Live Track & Sea Corridor Position
            </h3>
            <VesselMap
              shipments={[shipment]}
              ports={ports}
              selectedShipmentId={shipment.id}
              height="380px"
              center={[shipment.current_lat || 12.0, shipment.current_lng || 85.0]}
              zoom={5}
            />
          </div>
        </div>
      )}

      {/* TAB CONTENT: TRACKING */}
      {activeTab === 'TRACKING' && (
        <div className="istelx-card p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <div>
              <h3 className="font-heading font-bold text-base text-[#063B68]">
                Interactive Sea Lane Navigation
              </h3>
              <p className="text-xs text-[#64748B]">Realtime AIS coordinate telemetry & waypoint corridor</p>
            </div>
            <span className="font-mono text-xs font-bold text-[#0867B2] bg-[#EBF4FC] px-2.5 py-1 rounded">
              Position: {shipment.current_lat.toFixed(3)}°N, {shipment.current_lng.toFixed(3)}°E
            </span>
          </div>

          <VesselMap
            shipments={[shipment]}
            ports={ports}
            selectedShipmentId={shipment.id}
            height="500px"
            center={[shipment.current_lat || 12.0, shipment.current_lng || 85.0]}
            zoom={5}
          />
        </div>
      )}

      {/* TAB CONTENT: CARGO */}
      {activeTab === 'CARGO' && (
        <div className="istelx-card p-6 space-y-4 bg-white">
          <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
            Raw Material Cargo Manifest
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] font-bold block uppercase text-[10px]">Commodity Grade</span>
              <span className="font-bold text-sm text-[#063B68]">{shipment.cargo_type} (Prime Hard Metallurgical)</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] font-bold block uppercase text-[10px]">Total Bill of Lading Quantity</span>
              <span className="font-bold text-sm text-[#063B68]">{shipment.quantity_mt.toLocaleString()} Metric Tonnes</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] font-bold block uppercase text-[10px]">Loading Terminal</span>
              <span className="font-semibold text-[#102A43]">{shipment.origin_port} Bulk Coal Berth #2</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] font-bold block uppercase text-[10px]">Discharge Destination</span>
              <span className="font-semibold text-[#102A43]">{shipment.destination_port} Port (General Cargo / Coal Berth)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: EVENTS / TIMELINE */}
      {activeTab === 'EVENTS' && (
        <div className="istelx-card p-6 bg-white space-y-6">
          <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
            Official Voyage Chronology & Event Log
          </h3>

          <div className="relative pl-6 space-y-6 border-l-2 border-[#CBD5E1]">
            {shipment.events?.map((evt: any) => (
              <div key={evt.id} className="relative group">
                {/* Dot */}
                <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-2 border-[#0867B2] flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0867B2]" />
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-[#E2E8F0] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-heading font-bold text-xs text-[#063B68]">
                      {evt.event_type.replace(/_/g, ' ')}
                    </span>
                    <span className="font-mono text-[10px] text-[#64748B]">{evt.timestamp}</span>
                  </div>
                  <p className="text-xs text-[#102A43] leading-relaxed">{evt.description}</p>
                  {evt.location_name && (
                    <div className="text-[11px] font-semibold text-[#0867B2] flex items-center gap-1 pt-1">
                      <MapPin className="w-3 h-3" />
                      <span>{evt.location_name}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: DOCUMENTS */}
      {activeTab === 'DOCUMENTS' && (
        <div className="istelx-card p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
            Voyage & Commercial Documents
          </h3>
          <div className="space-y-2">
            {shipment.documents?.map((doc: any, idx: number) => (
              <div key={idx} className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#0867B2]" />
                  <div>
                    <div className="font-bold text-[#102A43]">{doc.name}</div>
                    <div className="text-[10px] text-[#64748B]">{doc.size} • {doc.date}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="badge-green text-[10px] font-bold">{doc.status}</span>
                  <button className="p-1.5 rounded text-[#0867B2] hover:bg-[#EBF4FC] cursor-pointer">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: ALERTS */}
      {activeTab === 'ALERTS' && (
        <div className="istelx-card p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
            Active Voyage Alerts
          </h3>
          <div className="space-y-3">
            {shipment.alerts?.map((a: any) => (
              <div key={a.id} className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#063B68] uppercase">{a.category}</span>
                  <StatusBadge status={a.severity} />
                </div>
                <p className="font-semibold text-[#102A43]">{a.message}</p>
                {a.evidence && (
                  <p className="text-[11px] text-[#64748B] bg-white p-2 rounded border border-[#E2E8F0] mt-1">
                    <span className="font-bold">Evidence: </span>{a.evidence}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: COST */}
      {activeTab === 'COST' && (
        <div className="istelx-card p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
            Landed Cost Summary
          </h3>
          <div className="p-4 bg-gradient-to-r from-[#063B68] to-[#0867B2] text-white rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-[#FF7A00] uppercase font-bold">Planned vs Current Landed Cost</div>
              <div className="font-heading font-extrabold text-3xl mt-1">₹{shipment.planned_cost_cr} Cr</div>
            </div>
            <div className="text-right text-xs text-[#CBD5E1]">
              <div>Target Freight: $24.30 / MT</div>
              <div>Demurrage Allowance: ₹0.12 Cr</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: ETA */}
      {activeTab === 'ETA' && (
        <div className="istelx-card p-6 bg-white space-y-4">
          <h3 className="font-heading font-bold text-base text-[#063B68] border-b pb-3">
            ETA Intelligence & Delay Analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Scheduled Arrival</span>
              <span className="font-bold text-sm text-[#063B68]">{shipment.scheduled_eta}</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Predicted Live ETA</span>
              <span className="font-bold text-sm text-[#0867B2]">{shipment.current_eta}</span>
            </div>
            <div className="p-3 bg-[#F8FAFC] rounded-lg border">
              <span className="text-[#64748B] block text-[10px] uppercase font-bold">Schedule Variance</span>
              <span className="font-bold text-sm text-[#D92D20]">+{shipment.eta_variance_hours} Hours</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
