export interface DigitalTwinHold {
  hold_number: number;
  hold_id: string; // e.g. "H01"
  hold_code: string; // e.g. "HOLD 01"
  capacity_mt: number;
  allocated_mt: number;
  loaded_mt: number;
  discharged_mt: number;
  onboard_mt: number;
  utilization_pct: number;
  fill_height_ratio: number;
  status: 'EMPTY' | 'LOADING' | 'LOADED' | 'DISCHARGING' | 'ALERT';
  cargo_type: string;
  batch_id: string;
  origin: string;
  destination: string;
  temperature_c: number;
  humidity_pct: number;
  vibration_level: string;
  has_alert: boolean;
}

export interface DigitalTwinBatch {
  batch_id: string;
  cargo_type: string;
  quantity_mt: number;
  holds: string[];
  supplier: string;
  origin: string;
  destination: string;
  loading_date: string;
  status: string;
  qr_code: string;
  rfid_tag: string;
}

export interface JourneyTimelineStage {
  stage: string;
  timestamp: string;
  location: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'UPCOMING';
  details: string;
}

export interface SensorReadingHistory {
  time: string;
  temperature_c: number;
  humidity_pct: number;
  vibration_g: number;
  weight_mt: number;
}

export interface SensorAlert {
  hold: string;
  severity: 'WARNING' | 'CRITICAL' | 'INFO';
  parameter: string;
  value: string;
  threshold: string;
  timestamp: string;
  message: string;
}

export interface DigitalTwinSensors {
  temperature_c: number;
  humidity_pct: number;
  vibration: string;
  hatch_status: string;
  weight_mt: number;
  is_simulated: boolean;
  data_badge: string;
  active_devices_count: number;
  history_24h: SensorReadingHistory[];
  alerts: SensorAlert[];
}

export interface DigitalTwinSummary {
  total_cargo_mt: number;
  loaded_mt: number;
  onboard_mt: number;
  discharged_mt: number;
  holds_loaded_count: number;
  total_holds: number;
  voyage_progress_pct: number;
  utilization_overall_pct: number;
  shipment_status: string;
}

export interface DigitalTwinVessel {
  id: number;
  name: string;
  imo: string;
  vessel_type: string;
  dwt: number;
  capacity_mt: number;
  loa_m: number;
  beam_m: number;
  draft_m: number;
  flag: string;
  holds_count: number;
}

export interface DigitalTwinShipment {
  id: number;
  shipment_code: string;
  cargo_type: string;
  quantity_mt: number;
  origin_port: string;
  destination_port: string;
  status: string;
  progress_pct: number;
  departure_time: string;
  scheduled_eta: string;
  current_eta: string;
  eta_variance_hours: number;
  risk_level: string;
  current_lat: number;
  current_lng: number;
  current_speed_knots: number;
  current_heading: number;
}

export interface DigitalTwinEvent {
  event_id: string;
  event_type: string;
  location: string;
  quantity_mt: number;
  timestamp: string;
  source: string;
  description: string;
}

export interface DigitalTwinData {
  shipment: DigitalTwinShipment;
  vessel: DigitalTwinVessel;
  summary: DigitalTwinSummary;
  holds: DigitalTwinHold[];
  batches: DigitalTwinBatch[];
  journey_timeline: JourneyTimelineStage[];
  sensors: DigitalTwinSensors;
  events: DigitalTwinEvent[];
  simulation_mode: 'IDLE' | 'LOADING' | 'DISCHARGING';
  is_simulated: boolean;
}
