import { 
  User, CargoRequirement, Vessel, Port, FreightForecast, 
  CostBreakdown, AICharterAdvice, Shipment, AlertItem, DashboardKPIs 
} from '../types';

const API_BASE = '/api/v1';

const getHeaders = () => {
  const token = localStorage.getItem('istelx_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(payload: { email: string; password: string }): Promise<{ access_token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Login failed' }));
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async register(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async forgotPassword(email: string): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return res.json();
  },

  async resetPassword(payload: { email: string; otp: string; new_password: string }): Promise<any> {
    const res = await fetch(`${API_BASE}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Reset failed');
    }
    return res.json();
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
    const res = await fetch(`${API_BASE}/dashboard`, { headers: getHeaders() });
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Requirements
  async getRequirements(): Promise<CargoRequirement[]> {
    const res = await fetch(`${API_BASE}/requirements`, { headers: getHeaders() });
    return res.json();
  },

  async getRequirement(id: number): Promise<CargoRequirement> {
    const res = await fetch(`${API_BASE}/requirements/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async createRequirement(payload: Partial<CargoRequirement>): Promise<CargoRequirement> {
    const res = await fetch(`${API_BASE}/requirements`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async analyzeRequirement(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/requirements/${id}/analyze`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  // Freight
  async getFreightForecast(origin: string, destination: string, vesselType: string, cargoType: string): Promise<FreightForecast> {
    const params = new URLSearchParams({
      origin,
      destination,
      vessel_type: vesselType,
      cargo_type: cargoType
    });
    const res = await fetch(`${API_BASE}/freight/forecast?${params}`, { headers: getHeaders() });
    return res.json();
  },

  // Vessels
  async getVessels(): Promise<Vessel[]> {
    const res = await fetch(`${API_BASE}/vessels`, { headers: getHeaders() });
    return res.json();
  },

  async optimizeVessels(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/vessels/optimize`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Ports
  async getPorts(): Promise<Port[]> {
    const res = await fetch(`${API_BASE}/ports`, { headers: getHeaders() });
    return res.json();
  },

  async checkPortCompatibility(portId: number, vesselId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/ports/check-compatibility`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ port_id: portId, vessel_id: vesselId })
    });
    return res.json();
  },

  // Cost
  async calculateCost(payload: any): Promise<CostBreakdown> {
    const res = await fetch(`${API_BASE}/cost/calculate`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Charter Advisor & Approvals
  async getCharterAdvice(requirementId: number, vesselId: number): Promise<AICharterAdvice> {
    const res = await fetch(`${API_BASE}/charter/advice`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ requirement_id: requirementId, vessel_id: vesselId })
    });
    return res.json();
  },

  async saveCharterScenario(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/charter/scenarios/save`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async approveCharter(scenarioId: number, comments?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/charter/approve`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ scenario_id: scenarioId, comments })
    });
    return res.json();
  },

  // Shipments & Tracking
  async getShipments(status?: string, search?: string): Promise<Shipment[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    if (search) params.append('search', search);
    const res = await fetch(`${API_BASE}/shipments?${params}`, { headers: getHeaders() });
    return res.json();
  },

  async getShipmentDetail(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/shipments/${id}`, { headers: getHeaders() });
    return res.json();
  },

  async createShipment(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/shipments/create`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  async completeShipment(id: number): Promise<any> {
    const res = await fetch(`${API_BASE}/shipments/${id}/complete`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  async getFleetTracking(): Promise<{ fleet: Shipment[]; ports: Port[]; disclaimer: string }> {
    const res = await fetch(`${API_BASE}/tracking/fleet`, { headers: getHeaders() });
    return res.json();
  },

  async getEtaIntelligence(shipmentId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/eta/${shipmentId}`, { headers: getHeaders() });
    return res.json();
  },

  // Alerts
  async getAlerts(category?: string, severity?: string): Promise<AlertItem[]> {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (severity) params.append('severity', severity);
    const res = await fetch(`${API_BASE}/alerts?${params}`, { headers: getHeaders() });
    return res.json();
  },

  async acknowledgeAlert(alertId: number): Promise<any> {
    const res = await fetch(`${API_BASE}/alerts/${alertId}/acknowledge`, {
      method: 'POST',
      headers: getHeaders()
    });
    return res.json();
  },

  // Simulation
  async runWhatIf(payload: any): Promise<any> {
    const res = await fetch(`${API_BASE}/simulation/run`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(payload)
    });
    return res.json();
  },

  // Analytics & Reports
  async getAnalytics(): Promise<any> {
    const res = await fetch(`${API_BASE}/analytics/metrics`, { headers: getHeaders() });
    return res.json();
  },

  // Admin
  async getAdminUsers(): Promise<User[]> {
    const res = await fetch(`${API_BASE}/admin/users`, { headers: getHeaders() });
    return res.json();
  },

  async updateUserStatus(userId: number, status?: string, role?: string): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/status`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ status, role })
    });
    return res.json();
  },

  async getSystemHealth(): Promise<any> {
    const res = await fetch(`${API_BASE}/admin/system-health`, { headers: getHeaders() });
    return res.json();
  }
};
