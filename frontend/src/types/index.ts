export type UserRole = 
  | 'ADMIN' 
  | 'Charter Manager' 
  | 'Logistics Manager' 
  | 'Operations Manager' 
  | 'Management Viewer';

export interface User {
  id: number;
  full_name: str;
  email: str;
  phone?: string;
  organization: string;
  department: string;
  designation: string;
  role: UserRole;
  status: string;
  is_active: boolean;
}

export type str = string;

export interface CargoRequirement {
  id: number;
  requirement_code: string;
  cargo_type: string;
  quantity_mt: number;
  origin_country: string;
  origin_port: string;
  destination_port: string;
  delivery_date: string;
  laycan_start: string;
  laycan_end: string;
  preferred_vessel_type?: string;
  notes?: string;
  status: 'DRAFT' | 'ANALYZED' | 'PENDING_APPROVAL' | 'CHARTERED' | 'COMPLETED';
  created_by?: string;
  created_at: string;
}

export interface Vessel {
  id: number;
  name: string;
  imo: string;
  vessel_type: 'Handysize' | 'Supramax' | 'Panamax' | 'Capesize';
  dwt: number;
  capacity_mt: number;
  draft_m: number;
  beam_m: number;
  loa_m: number;
  speed_knots: number;
  current_location: string;
  latitude: number;
  longitude: number;
  heading: number;
  availability_status: 'AVAILABLE' | 'IN_TRANSIT' | 'MAINTENANCE' | 'COMMITTED';
  available_date?: string;
  daily_charter_rate_usd: number;
  fuel_consumption_tpd: number;
  year_built: number;
  flag: string;
}

export interface Port {
  id: number;
  name: string;
  code: string;
  country: string;
  is_indian_port: boolean;
  latitude: number;
  longitude: number;
  max_draft_m: number;
  max_loa_m: number;
  max_beam_m: number;
  max_dwt: number;
  berths_count: number;
  current_congestion_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'SEVERE';
  waiting_time_hours: number;
  port_status: string;
  operational_notes?: string;
}

export interface FreightHistoryPoint {
  date: string;
  rate_usd_per_mt: number;
  bunker_price: number;
  market_index: number;
}

export interface FreightForecastCurvePoint {
  date: string;
  forecast_rate: number;
  lower_bound: number;
  upper_bound: number;
  day_horizon: number;
}

export interface FreightForecast {
  origin: string;
  destination: string;
  vessel_type: string;
  cargo_type: string;
  current_rate: number;
  forecast_7d: number;
  forecast_15d: number;
  forecast_30d: number;
  lower_bound_30d: number;
  upper_bound_30d: number;
  trend: 'UPWARD' | 'DOWNWARD' | 'STABLE';
  confidence_score: number;
  model_version: string;
  last_updated: string;
  metrics: {
    mae: number;
    rmse: number;
    mape_pct: number;
    train_samples: number;
    test_samples: number;
    split_type: string;
  };
  historical: FreightHistoryPoint[];
  forecast_curve: FreightForecastCurvePoint[];
}

export interface CostBreakdown {
  ocean_freight_usd: number;
  ocean_freight_cr: number;
  port_charges_cr: number;
  handling_charges_cr: number;
  estimated_demurrage_cr: number;
  fuel_bunker_impact_cr: number;
  other_operational_cr: number;
  total_cost_cr: number;
  cost_per_mt_inr: number;
  assumptions: string[];
}

export interface AICharterAdvice {
  requirement_id: number;
  vessel_id: number;
  vessel_name: string;
  vessel_type: string;
  cargo_type: string;
  quantity_mt: number;
  route: string;
  market_signal: string;
  port_compatibility_status: string;
  port_compatible: boolean;
  expected_cost_cr: number;
  cost_breakdown?: CostBreakdown;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH';
  recommendation_score: number;
  planning_signal: string;
  why_reasons: string[];
  cautions: string[];
  disclaimer: string;
  port_details?: any;
}

export interface Shipment {
  id: number;
  shipment_code: string;
  vessel_id: number;
  vessel_name?: string;
  vessel_imo?: string;
  vessel_type?: string;
  cargo_type: string;
  quantity_mt: number;
  origin_port: string;
  destination_port: string;
  departure_time: string;
  scheduled_eta: string;
  current_eta: string;
  eta_variance_hours: number;
  status: 'PLANNED' | 'LOADING' | 'DEPARTED' | 'IN TRANSIT' | 'APPROACHING PORT' | 'ARRIVED' | 'DISCHARGING' | 'COMPLETED';
  progress_pct: number;
  current_lat: number;
  current_lng: number;
  current_speed_knots: number;
  current_heading: number;
  total_distance_nm: number;
  remaining_distance_nm: number;
  planned_cost_cr: number;
  actual_cost_cr: number;
  risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  route_waypoints?: [number, number][];
}

export interface AlertItem {
  id: number;
  shipment_id?: number;
  vessel_id?: number;
  category: 'Market Risk' | 'Port Risk' | 'Weather Risk' | 'Schedule Risk' | 'Operational Risk' | 'Data Confidence';
  severity: 'CRITICAL' | 'WARNING' | 'MARKET' | 'INFO' | 'SUCCESS';
  message: string;
  evidence?: string;
  is_read: boolean;
  is_acknowledged: boolean;
  timestamp: string;
}

export interface DashboardKPIs {
  active_shipments: number;
  vessels_at_sea: number;
  cargo_in_transit_mt: number;
  arriving_this_week: number;
  freight_exposure_cr: number;
  active_alerts: number;
}
