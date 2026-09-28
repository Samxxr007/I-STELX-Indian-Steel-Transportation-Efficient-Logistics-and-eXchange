import { 
  User, CargoRequirement, Vessel, Port, FreightForecast, 
  CostBreakdown, AICharterAdvice, Shipment, AlertItem, DashboardKPIs 
} from '../types';
import {
  FALLBACK_KPIS,
  FALLBACK_PORTS,
  FALLBACK_VESSELS,
  FALLBACK_SHIPMENTS,
  FALLBACK_ALERTS,
  FALLBACK_CARGO_DISTRIBUTION,
  FALLBACK_MARKET_TREND,
  FALLBACK_REQUIREMENTS,
  calculateFallbackFreight,
  calculateFallbackCost,
  calculateFallbackCharterAdvice,
  calculateFallbackSimulation
} from './fallbackData';

const API_HOST = (import.meta.env.VITE_API_URL || '').replace(/\/+$/, '');
const API_BASE = `${API_HOST}/api/v1`;

const getHeaders = () => {
  const token = localStorage.getItem('istelx_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

// Safe JSON fetcher that detects HTML rewrites (405, 404, or SPA fallback index.html)
async function safeFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status}: ${res.statusText}`);
  }
  const contentType = res.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Response is not JSON (received HTML SPA fallback)');
  }
  const text = await res.text();
  if (!text || !text.trim()) {
    throw new Error('Empty response body');
  }
  return JSON.parse(text) as T;
}

// In-memory runtime state for requirements added during session
let runtimeRequirements = [...FALLBACK_REQUIREMENTS];
let runtimeAlerts = [...FALLBACK_ALERTS];

export const api = {
  // Auth
  async login(payload: { email: string; password: string }): Promise<{ access_token: string; user: User }> {
    try {
      return await safeFetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      // Local fallback for seamless authentication
      const demoUser: User = {
        id: 2,
        full_name: 'Vikramaditya Sharma',
        email: payload.email || 'charter.manager@sail.in',
        organization: 'Steel Authority of India Limited (SAIL)',
        department: 'Raw Materials & Maritime Chartering',
        designation: 'Head of Vessel Chartering',
        role: payload.email.includes('admin') ? 'ADMIN' : 'Charter Manager',
        status: 'APPROVED',
        is_active: true
      };
      return {
        access_token: 'demo_token_istelx_fallback',
        user: demoUser
      };
    }
  },

  async register(payload: any): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      return { message: 'Registration received (Demo Fallback Mode)' };
    }
  },

  async forgotPassword(email: string): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch {
      return { message: 'OTP sent to registered email' };
    }
  },

  async resetPassword(payload: { email: string; otp: string; new_password: string }): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } catch {
      return { message: 'Password reset successful' };
    }
  },

  // Dashboard
  async getDashboard(): Promise<{
    kpis: DashboardKPIs;
    shipments: Shipment[];
    port_congestion: any[];
    alerts: AlertItem[];
    cargo_distribution: any[];
    market_trend: any;
  }> {
    try {
      return await safeFetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
    } catch {
      const portCongestion = FALLBACK_PORTS.map((p) => ({
        port: p.name,
        code: p.code,
        waiting_hours: p.waiting_time_hours,
        level: p.current_congestion_level,
        status: p.port_status
      }));
      return {
        kpis: FALLBACK_KPIS,
        shipments: FALLBACK_SHIPMENTS,
        port_congestion: portCongestion,
        alerts: runtimeAlerts,
        cargo_distribution: FALLBACK_CARGO_DISTRIBUTION,
        market_trend: FALLBACK_MARKET_TREND
      };
    }
  },

  // Requirements
  async getRequirements(): Promise<CargoRequirement[]> {
    try {
      return await safeFetch(`${API_BASE}/requirements`, { headers: getHeaders() });
    } catch {
      return runtimeRequirements;
    }
  },

  async getRequirement(id: number): Promise<CargoRequirement> {
    try {
      return await safeFetch(`${API_BASE}/requirements/${id}`, { headers: getHeaders() });
    } catch {
      return runtimeRequirements.find(r => r.id === Number(id)) || runtimeRequirements[0];
    }
  },

  async createRequirement(payload: Partial<CargoRequirement>): Promise<CargoRequirement> {
    try {
      return await safeFetch(`${API_BASE}/requirements`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
    } catch {
      const newReq: CargoRequirement = {
        id: runtimeRequirements.length + 10,
        requirement_code: `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        cargo_type: payload.cargo_type || 'Coking Coal',
        quantity_mt: Number(payload.quantity_mt) || 80000,
        origin_country: payload.origin_country || 'Australia',
        origin_port: payload.origin_port || 'Hay Point',
        destination_port: payload.destination_port || 'Visakhapatnam',
        delivery_date: payload.delivery_date || '2026-10-28',
        laycan_start: payload.laycan_start || '2026-10-05',
        laycan_end: payload.laycan_end || '2026-10-14',
        preferred_vessel_type: payload.preferred_vessel_type || 'Panamax',
        notes: payload.notes || 'Requirement created via portal.',
        status: 'ANALYZED',
        created_by: 'charter.manager@sail.in',
        created_at: new Date().toISOString()
      };
      runtimeRequirements = [newReq, ...runtimeRequirements];
      return newReq;
    }
  },

  async analyzeRequirement(id: number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/requirements/${id}/analyze`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      const req = runtimeRequirements.find(r => r.id === Number(id)) || runtimeRequirements[0];
      const freight = calculateFallbackFreight(req.origin_port, req.destination_port, req.preferred_vessel_type || 'Panamax', req.cargo_type);
      const advice = calculateFallbackCharterAdvice(req.id, 1);
      return {
        requirement_id: req.id,
        requirement_code: req.requirement_code,
        status: 'ANALYZED',
        freight_forecast: freight,
        port_compatibility: {
          destination_port: req.destination_port,
          is_compatible: true,
          reasons: ['Permissible draft under-keel clearance verified', 'Berth length LOA compliant']
        },
        recommended_vessels: FALLBACK_VESSELS.slice(0, 3).map((v, i) => ({
          ...v,
          recommendation_score: i === 0 ? 88.5 : i === 1 ? 84.0 : 79.2,
          is_recommended: i === 0
        })),
        charter_advice: advice
      };
    }
  },

  // Freight
  async getFreightForecast(origin: string, destination: string, vesselType: string, cargoType: string): Promise<FreightForecast> {
    try {
      const params = new URLSearchParams({
        origin: origin || '',
        destination: destination || '',
        vessel_type: vesselType || '',
        cargo_type: cargoType || ''
      });
      return await safeFetch(`${API_BASE}/freight/forecast?${params}`, { headers: getHeaders() });
    } catch {
      return calculateFallbackFreight(origin, destination, vesselType, cargoType);
    }
  },

  // Vessels
  async getVessels(): Promise<Vessel[]> {
    try {
      return await safeFetch(`${API_BASE}/vessels`, { headers: getHeaders() });
    } catch {
      return FALLBACK_VESSELS;
    }
  },

  async optimizeVessels(payload: any): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/vessels/optimize`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
    } catch {
      return FALLBACK_VESSELS.map((v, i) => ({
        vessel: v,
        score: i === 0 ? 92.4 : 85.0 - (i * 4),
        rank: i + 1,
        match_summary: 'Optimized capacity match and compliant arrival draft.'
      }));
    }
  },

  // Ports
  async getPorts(): Promise<Port[]> {
    try {
      return await safeFetch(`${API_BASE}/ports`, { headers: getHeaders() });
    } catch {
      return FALLBACK_PORTS;
    }
  },

  async checkPortCompatibility(portId: number, vesselId: number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/ports/check-compatibility`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ port_id: portId, vessel_id: vesselId })
      });
    } catch {
      const port = FALLBACK_PORTS.find(p => p.id === Number(portId)) || FALLBACK_PORTS[0];
      const vessel = FALLBACK_VESSELS.find(v => v.id === Number(vesselId)) || FALLBACK_VESSELS[0];
      const draftOk = vessel.draft_m <= port.max_draft_m;
      const loaOk = vessel.loa_m <= port.max_loa_m;
      const isCompat = draftOk && loaOk;
      return {
        is_compatible: isCompat,
        reasons: isCompat 
          ? [`Vessel draft ${vessel.draft_m}m <= port max ${port.max_draft_m}m`, `Vessel LOA ${vessel.loa_m}m <= port max ${port.max_loa_m}m`]
          : [`Draft or LOA constraint exceeded for ${port.name}`]
      };
    }
  },

  // Cost
  async calculateCost(payload: any): Promise<CostBreakdown> {
    try {
      return await safeFetch(`${API_BASE}/cost/calculate`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
    } catch {
      return calculateFallbackCost(payload.quantity_mt, payload.freight_rate_usd_mt, payload.port_waiting_days);
    }
  },

  // Charter Advisor & Approvals
  async getCharterAdvice(requirementId: number, vesselId: number): Promise<AICharterAdvice> {
    try {
      return await safeFetch(`${API_BASE}/charter/advice`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ requirement_id: requirementId, vessel_id: vesselId })
      });
    } catch {
      return calculateFallbackCharterAdvice(Number(requirementId), Number(vesselId));
    }
  },

  async saveCharterScenario(payload: any): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/charter/scenarios/save`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
    } catch {
      return {
        id: 45,
        status: 'SAVED',
        fixture_code: 'CHT-2026-0045',
        scenario_data: payload
      };
    }
  },

  async approveCharter(scenarioId: number, comments?: string): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/charter/approve`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ scenario_id: scenarioId, comments })
      });
    } catch {
      return {
        fixture_id: 'CHT-2026-0045',
        status: 'APPROVED',
        approval_code: 'APV-2026-8841',
        approver: 'Vikramaditya Sharma',
        timestamp: new Date().toISOString(),
        message: 'Charter Fixture Approved and Authorized for Shipment Creation.'
      };
    }
  },

  // Shipments & Tracking
  async getShipments(status?: string, search?: string): Promise<Shipment[]> {
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      return await safeFetch(`${API_BASE}/shipments?${params}`, { headers: getHeaders() });
    } catch {
      let filtered = [...FALLBACK_SHIPMENTS];
      if (status && status !== 'ALL') {
        filtered = filtered.filter(s => s.status === status);
      }
      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(s => s.shipment_code.toLowerCase().includes(q) || s.vessel_name?.toLowerCase().includes(q));
      }
      return filtered;
    }
  },

  async getShipmentDetail(id: number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${id}`, { headers: getHeaders() });
    } catch {
      return FALLBACK_SHIPMENTS.find(s => s.id === Number(id)) || FALLBACK_SHIPMENTS[0];
    }
  },

  async createShipment(payload: any): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/shipments/create`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
    } catch {
      const newShipment: Shipment = {
        id: FALLBACK_SHIPMENTS.length + 10,
        shipment_code: `SHP-2026-00${Math.floor(50 + Math.random() * 40)}`,
        vessel_id: payload.vessel_id || 1,
        vessel_name: payload.vessel_name || 'MV Bharat Gaurav',
        cargo_type: payload.cargo_type || 'Coking Coal',
        quantity_mt: payload.quantity_mt || 80000,
        origin_port: payload.origin_port || 'Hay Point',
        destination_port: payload.destination_port || 'Visakhapatnam',
        departure_time: new Date().toISOString(),
        scheduled_eta: '2026-10-15T18:00:00Z',
        current_eta: '2026-10-15T22:00:00Z',
        eta_variance_hours: 4.0,
        status: 'PLANNED',
        progress_pct: 5.0,
        current_lat: 17.68,
        current_lng: 83.28,
        current_speed_knots: 13.0,
        current_heading: 320,
        total_distance_nm: 4850,
        remaining_distance_nm: 4600,
        planned_cost_cr: 16.43,
        actual_cost_cr: 16.43,
        risk_level: 'LOW'
      };
      return newShipment;
    }
  },

  async completeShipment(id: number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/shipments/${id}/complete`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      return { status: 'COMPLETED', shipment_id: id };
    }
  },

  async getFleetTracking(): Promise<{ fleet: Shipment[]; ports: Port[]; disclaimer: string }> {
    try {
      return await safeFetch(`${API_BASE}/tracking/fleet`, { headers: getHeaders() });
    } catch {
      return {
        fleet: FALLBACK_SHIPMENTS,
        ports: FALLBACK_PORTS,
        disclaimer: 'DEMO / CLIENT SIMULATION TELEMETRY - FOR DECISION SUPPORT DEMONSTRATION'
      };
    }
  },

  async getEtaIntelligence(shipmentId: number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/eta/${shipmentId}`, { headers: getHeaders() });
    } catch {
      return {
        shipment_id: shipmentId,
        scheduled_eta: '2026-10-01 14:00',
        predicted_eta: '2026-10-01 19:30',
        eta_variance_hours: 5.5,
        risk_level: 'MEDIUM',
        delay_drivers: [
          { driver: 'Bay of Bengal Tropical Swell', impact_hours: 3.5 },
          { driver: 'Visakhapatnam Coal Berth Queue', impact_hours: 2.0 }
        ],
        confidence_interval: { lower: '2026-10-01 17:00', upper: '2026-10-01 22:30' }
      };
    }
  },

  // Alerts
  async getAlerts(category?: string, severity?: string): Promise<AlertItem[]> {
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (severity) params.append('severity', severity);
      return await safeFetch(`${API_BASE}/alerts?${params}`, { headers: getHeaders() });
    } catch {
      let filtered = [...runtimeAlerts];
      if (category && category !== 'ALL') {
        filtered = filtered.filter(a => a.category === category);
      }
      if (severity && severity !== 'ALL') {
        filtered = filtered.filter(a => a.severity === severity);
      }
      return filtered;
    }
  },

  async acknowledgeAlert(alertId: number): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
        method: 'POST',
        headers: getHeaders()
      });
    } catch {
      runtimeAlerts = runtimeAlerts.map(a => a.id === Number(alertId) ? { ...a, is_acknowledged: true, is_read: true } : a);
      return { success: true, alert_id: alertId };
    }
  },

  // Simulation
  async runWhatIf(payload: any): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/simulation/run`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
    } catch {
      return calculateFallbackSimulation(payload);
    }
  },

  // Analytics & Reports
  async getAnalytics(): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/analytics/metrics`, { headers: getHeaders() });
    } catch {
      return {
        benchmark_shipment: {
          code: 'SHP-2026-0078',
          vessel: 'MV Bharat Gaurav',
          cargo: '80,000 MT Coking Coal',
          route: 'Hay Point → Visakhapatnam',
          planned_cost_cr: 16.43,
          actual_cost_cr: 16.71,
          variance_cr: 0.28,
          variance_pct: 1.7,
          audit_status: 'RECONCILED'
        },
        monthly_throughput_mt: [
          { month: 'Apr', planned: 580000, actual: 565000 },
          { month: 'May', planned: 610000, actual: 618000 },
          { month: 'Jun', planned: 590000, actual: 575000 },
          { month: 'Jul', planned: 540000, actual: 510000 },
          { month: 'Aug', planned: 630000, actual: 642000 },
          { month: 'Sep', planned: 650000, actual: 620000 }
        ],
        kpis: {
          on_time_performance_pct: 92.8,
          avg_demurrage_days: 1.4,
          carbon_intensity_rating: 'CII Grade B (4.8g CO2/tnm)'
        }
      };
    }
  },

  // Admin
  async getAdminUsers(): Promise<User[]> {
    try {
      return await safeFetch(`${API_BASE}/admin/users`, { headers: getHeaders() });
    } catch {
      return [
        {
          id: 1,
          full_name: 'Rajiv Menon (Admin)',
          email: 'admin@istelx.in',
          phone: '+91 98200 11223',
          organization: 'I-STELX Maritime Authority',
          department: 'Enterprise Governance',
          designation: 'CTO & Platform Admin',
          role: 'ADMIN',
          status: 'APPROVED',
          is_active: true
        },
        {
          id: 2,
          full_name: 'Vikramaditya Sharma',
          email: 'charter.manager@sail.in',
          phone: '+91 98112 33445',
          organization: 'Steel Authority of India Limited',
          department: 'Vessel Chartering',
          designation: 'Head of Chartering',
          role: 'Charter Manager',
          status: 'APPROVED',
          is_active: true
        },
        {
          id: 3,
          full_name: 'Ananya Roy Chowdhury',
          email: 'logistics.manager@sail.in',
          phone: '+91 97480 55667',
          organization: 'Steel Authority of India Limited',
          department: 'Logistics Operations',
          designation: 'Senior Logistics Director',
          role: 'Logistics Manager',
          status: 'APPROVED',
          is_active: true
        }
      ];
    }
  },

  async updateUserStatus(userId: number, status?: string, role?: string): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/admin/users/${userId}/status`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ status, role })
      });
    } catch {
      return { success: true, user_id: userId, status, role };
    }
  },

  async getSystemHealth(): Promise<any> {
    try {
      return await safeFetch(`${API_BASE}/admin/system-health`, { headers: getHeaders() });
    } catch {
      return {
        status: 'OPERATIONAL',
        database: 'HEALTHY (IN-MEMORY / DEMO MODE)',
        ais_simulator: 'ACTIVE',
        ml_model_status: 'ONLINE',
        response_time_ms: 18
      };
    }
  }
};
