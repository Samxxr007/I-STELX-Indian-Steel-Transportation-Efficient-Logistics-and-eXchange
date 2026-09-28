import { 
  DashboardKPIs, Shipment, Port, AlertItem, Vessel, CargoRequirement, 
  FreightForecast, CostBreakdown, AICharterAdvice, User 
} from '../types';
import { DigitalTwinData } from '../types/digitalTwin';

export const FALLBACK_KPIS: DashboardKPIs = {
  active_shipments: 14,
  vessels_at_sea: 8,
  cargo_in_transit_mt: 620000,
  arriving_this_week: 4,
  freight_exposure_cr: 142.5,
  active_alerts: 6
};

export const FALLBACK_PORTS: Port[] = [
  {
    id: 1,
    name: 'Visakhapatnam',
    code: 'INVTZ',
    country: 'India',
    is_indian_port: true,
    latitude: 17.6868,
    longitude: 83.2842,
    max_draft_m: 14.5,
    max_loa_m: 250.0,
    max_beam_m: 35.0,
    max_dwt: 120000.0,
    berths_count: 14,
    current_congestion_level: 'MEDIUM',
    waiting_time_hours: 11.4,
    port_status: 'OPERATIONAL',
    operational_notes: 'Outer harbor accommodates baby Capesize with tidal support; dedicated conveyor for coking coal discharge.'
  },
  {
    id: 2,
    name: 'Paradip',
    code: 'INPRT',
    country: 'India',
    is_indian_port: true,
    latitude: 20.2644,
    longitude: 86.6713,
    max_draft_m: 14.5,
    max_loa_m: 260.0,
    max_beam_m: 38.0,
    max_dwt: 130000.0,
    berths_count: 16,
    current_congestion_level: 'MEDIUM',
    waiting_time_hours: 14.2,
    port_status: 'OPERATIONAL',
    operational_notes: 'Mechanized coal berths operational. Continuous conveyor direct to storage yard.'
  },
  {
    id: 3,
    name: 'Haldia',
    code: 'INHLD',
    country: 'India',
    is_indian_port: true,
    latitude: 22.0232,
    longitude: 88.0641,
    max_draft_m: 8.5,
    max_loa_m: 190.0,
    max_beam_m: 28.0,
    max_dwt: 45000.0,
    berths_count: 8,
    current_congestion_level: 'HIGH',
    waiting_time_hours: 28.0,
    port_status: 'OPERATIONAL',
    operational_notes: 'Draft riverine limitation (8.5m). Requires midstream lighterage at Sandheads for Panamax vessels.'
  },
  {
    id: 4,
    name: 'Dhamra',
    code: 'INDHR',
    country: 'India',
    is_indian_port: true,
    latitude: 20.8172,
    longitude: 86.9744,
    max_draft_m: 18.0,
    max_loa_m: 320.0,
    max_beam_m: 47.0,
    max_dwt: 180000.0,
    berths_count: 4,
    current_congestion_level: 'LOW',
    waiting_time_hours: 5.2,
    port_status: 'OPERATIONAL',
    operational_notes: 'Deep water all-weather port capable of receiving fully-laden Capesize bulk carriers.'
  },
  {
    id: 5,
    name: 'Mumbai JNPT',
    code: 'INBOM',
    country: 'India',
    is_indian_port: true,
    latitude: 18.9499,
    longitude: 72.9515,
    max_draft_m: 13.0,
    max_loa_m: 230.0,
    max_beam_m: 32.5,
    max_dwt: 80000.0,
    berths_count: 10,
    current_congestion_level: 'LOW',
    waiting_time_hours: 7.8,
    port_status: 'OPERATIONAL',
    operational_notes: 'Bulk terminal handles thermal coal and industrial limestone.'
  },
  {
    id: 6,
    name: 'Hay Point',
    code: 'AUHP',
    country: 'Australia',
    is_indian_port: false,
    latitude: -21.2828,
    longitude: 149.3005,
    max_draft_m: 19.5,
    max_loa_m: 350.0,
    max_beam_m: 55.0,
    max_dwt: 250000.0,
    berths_count: 6,
    current_congestion_level: 'LOW',
    waiting_time_hours: 6.5,
    port_status: 'OPERATIONAL',
    operational_notes: 'Major global coking coal export terminal in Queensland. High-speed shiploaders.'
  },
  {
    id: 7,
    name: 'Port Hedland',
    code: 'AUPHE',
    country: 'Australia',
    is_indian_port: false,
    latitude: -20.3167,
    longitude: 118.5760,
    max_draft_m: 19.8,
    max_loa_m: 340.0,
    max_beam_m: 58.0,
    max_dwt: 260000.0,
    berths_count: 19,
    current_congestion_level: 'MEDIUM',
    waiting_time_hours: 13.0,
    port_status: 'OPERATIONAL',
    operational_notes: 'Largest dry bulk iron ore export port in the world. Tidal draft departure windows.'
  },
  {
    id: 8,
    name: 'Richards Bay',
    code: 'ZARCB',
    country: 'South Africa',
    is_indian_port: false,
    latitude: -28.8000,
    longitude: 32.0333,
    max_draft_m: 17.5,
    max_loa_m: 315.0,
    max_beam_m: 47.0,
    max_dwt: 180000.0,
    berths_count: 9,
    current_congestion_level: 'HIGH',
    waiting_time_hours: 22.4,
    port_status: 'OPERATIONAL',
    operational_notes: 'Richards Bay Coal Terminal (RBCT). Premium high-CV thermal coal origin.'
  },
  {
    id: 9,
    name: 'Samarinda',
    code: 'IDSMD',
    country: 'Indonesia',
    is_indian_port: false,
    latitude: -0.5022,
    longitude: 117.1536,
    max_draft_m: 12.0,
    max_loa_m: 225.0,
    max_beam_m: 32.2,
    max_dwt: 65000.0,
    berths_count: 5,
    current_congestion_level: 'MEDIUM',
    waiting_time_hours: 16.0,
    port_status: 'OPERATIONAL',
    operational_notes: 'East Kalimantan thermal coal barge loading anchorage.'
  }
];

export const FALLBACK_VESSELS: Vessel[] = [
  {
    id: 1,
    name: 'MV Bharat Gaurav',
    imo: 'IMO 9821456',
    vessel_type: 'Panamax',
    dwt: 82500,
    capacity_mt: 80000,
    draft_m: 14.2,
    beam_m: 32.26,
    loa_m: 229.0,
    speed_knots: 13.2,
    current_location: 'Bay of Bengal',
    latitude: 14.85,
    longitude: 85.40,
    heading: 340,
    availability_status: 'IN_TRANSIT',
    available_date: '2026-10-02',
    daily_charter_rate_usd: 16400,
    fuel_consumption_tpd: 26.5,
    year_built: 2019,
    flag: 'India'
  },
  {
    id: 2,
    name: 'MV Mahanadi Star',
    imo: 'IMO 9743321',
    vessel_type: 'Panamax',
    dwt: 78000,
    capacity_mt: 75000,
    draft_m: 14.0,
    beam_m: 32.2,
    loa_m: 225.0,
    speed_knots: 12.8,
    current_location: 'Approaching Paradip Outer Anchorage',
    latitude: 19.85,
    longitude: 86.85,
    heading: 325,
    availability_status: 'IN_TRANSIT',
    available_date: '2026-09-30',
    daily_charter_rate_usd: 15800,
    fuel_consumption_tpd: 25.0,
    year_built: 2017,
    flag: 'India'
  },
  {
    id: 3,
    name: 'MV Kalinga Pioneer',
    imo: 'IMO 9891024',
    vessel_type: 'Capesize',
    dwt: 178000,
    capacity_mt: 172000,
    draft_m: 17.8,
    beam_m: 45.0,
    loa_m: 292.0,
    speed_knots: 13.5,
    current_location: 'Indian Ocean South of Sri Lanka',
    latitude: 5.60,
    longitude: 80.80,
    heading: 45,
    availability_status: 'IN_TRANSIT',
    available_date: '2026-10-06',
    daily_charter_rate_usd: 24200,
    fuel_consumption_tpd: 44.0,
    year_built: 2021,
    flag: 'India'
  },
  {
    id: 4,
    name: 'MV Chola Pride',
    imo: 'IMO 9645512',
    vessel_type: 'Supramax',
    dwt: 58000,
    capacity_mt: 55000,
    draft_m: 12.8,
    beam_m: 32.2,
    loa_m: 190.0,
    speed_knots: 12.5,
    current_location: 'Malacca Strait',
    latitude: 2.80,
    longitude: 101.40,
    heading: 310,
    availability_status: 'IN_TRANSIT',
    available_date: '2026-10-04',
    daily_charter_rate_usd: 13900,
    fuel_consumption_tpd: 22.0,
    year_built: 2016,
    flag: 'India'
  },
  {
    id: 5,
    name: 'MV Sagar Kirti',
    imo: 'IMO 9901452',
    vessel_type: 'Panamax',
    dwt: 81000,
    capacity_mt: 78000,
    draft_m: 14.1,
    beam_m: 32.26,
    loa_m: 229.0,
    speed_knots: 0,
    current_location: 'Visakhapatnam Outer Harbor',
    latitude: 17.68,
    longitude: 83.30,
    heading: 0,
    availability_status: 'AVAILABLE',
    available_date: '2026-09-29',
    daily_charter_rate_usd: 16100,
    fuel_consumption_tpd: 26.0,
    year_built: 2020,
    flag: 'India'
  },
  {
    id: 6,
    name: 'MV Deccan Vanguard',
    imo: 'IMO 9812480',
    vessel_type: 'Capesize',
    dwt: 182000,
    capacity_mt: 176000,
    draft_m: 18.1,
    beam_m: 45.0,
    loa_m: 295.0,
    speed_knots: 0,
    current_location: 'Hay Point Anchorage',
    latitude: -21.28,
    longitude: 149.32,
    heading: 0,
    availability_status: 'AVAILABLE',
    available_date: '2026-10-01',
    daily_charter_rate_usd: 24800,
    fuel_consumption_tpd: 45.5,
    year_built: 2022,
    flag: 'Liberia'
  }
];

export const FALLBACK_SHIPMENTS: Shipment[] = [
  {
    id: 1,
    shipment_code: 'SHP-2026-0018',
    vessel_id: 1,
    vessel_name: 'MV Bharat Gaurav',
    vessel_imo: 'IMO 9821456',
    vessel_type: 'Panamax',
    cargo_type: 'Coking Coal',
    quantity_mt: 78500,
    origin_port: 'Hay Point',
    destination_port: 'Visakhapatnam',
    departure_time: '2026-09-18T10:00:00Z',
    scheduled_eta: '2026-10-01T14:00:00Z',
    current_eta: '2026-10-01T19:30:00Z',
    eta_variance_hours: 5.5,
    status: 'IN TRANSIT',
    progress_pct: 76.5,
    current_lat: 14.85,
    current_lng: 85.40,
    current_speed_knots: 13.2,
    current_heading: 340,
    total_distance_nm: 4850,
    remaining_distance_nm: 1140,
    planned_cost_cr: 15.82,
    actual_cost_cr: 16.10,
    risk_level: 'MEDIUM',
    route_waypoints: [
      [-21.28, 149.30],
      [-15.0, 135.0],
      [-8.5, 120.0],
      [-5.5, 106.0],
      [2.5, 96.0],
      [8.5, 87.0],
      [14.85, 85.40],
      [17.68, 83.28]
    ]
  },
  {
    id: 2,
    shipment_code: 'SHP-2026-0024',
    vessel_id: 2,
    vessel_name: 'MV Mahanadi Star',
    vessel_imo: 'IMO 9743321',
    vessel_type: 'Panamax',
    cargo_type: 'Thermal Coal',
    quantity_mt: 74000,
    origin_port: 'Richards Bay',
    destination_port: 'Paradip',
    departure_time: '2026-09-12T06:00:00Z',
    scheduled_eta: '2026-09-29T22:00:00Z',
    current_eta: '2026-09-30T04:00:00Z',
    eta_variance_hours: 6.0,
    status: 'APPROACHING PORT',
    progress_pct: 94.0,
    current_lat: 19.85,
    current_lng: 86.85,
    current_speed_knots: 11.4,
    current_heading: 325,
    total_distance_nm: 4620,
    remaining_distance_nm: 280,
    planned_cost_cr: 14.20,
    actual_cost_cr: 14.45,
    risk_level: 'LOW',
    route_waypoints: [
      [-28.80, 32.03],
      [-20.0, 50.0],
      [-5.0, 70.0],
      [6.0, 80.0],
      [12.0, 84.0],
      [19.85, 86.85],
      [20.26, 86.67]
    ]
  },
  {
    id: 3,
    shipment_code: 'SHP-2026-0031',
    vessel_id: 3,
    vessel_name: 'MV Kalinga Pioneer',
    vessel_imo: 'IMO 9891024',
    vessel_type: 'Capesize',
    cargo_type: 'Iron Ore',
    quantity_mt: 165000,
    origin_port: 'Port Hedland',
    destination_port: 'Dhamra',
    departure_time: '2026-09-22T14:30:00Z',
    scheduled_eta: '2026-10-05T08:00:00Z',
    current_eta: '2026-10-05T10:00:00Z',
    eta_variance_hours: 2.0,
    status: 'IN TRANSIT',
    progress_pct: 54.0,
    current_lat: 5.60,
    current_lng: 80.80,
    current_speed_knots: 13.5,
    current_heading: 45,
    total_distance_nm: 3950,
    remaining_distance_nm: 1820,
    planned_cost_cr: 26.50,
    actual_cost_cr: 26.75,
    risk_level: 'LOW',
    route_waypoints: [
      [-20.31, 118.57],
      [-10.0, 105.0],
      [0.0, 92.0],
      [5.60, 80.80],
      [12.0, 83.5],
      [20.81, 86.97]
    ]
  },
  {
    id: 4,
    shipment_code: 'SHP-2026-0042',
    vessel_id: 4,
    vessel_name: 'MV Chola Pride',
    vessel_imo: 'IMO 9645512',
    vessel_type: 'Supramax',
    cargo_type: 'Limestone',
    quantity_mt: 52000,
    origin_port: 'Samarinda',
    destination_port: 'Haldia',
    departure_time: '2026-09-21T18:00:00Z',
    scheduled_eta: '2026-10-03T16:00:00Z',
    current_eta: '2026-10-04T12:00:00Z',
    eta_variance_hours: 20.0,
    status: 'IN TRANSIT',
    progress_pct: 61.2,
    current_lat: 2.80,
    current_lng: 101.40,
    current_speed_knots: 12.5,
    current_heading: 310,
    total_distance_nm: 2850,
    remaining_distance_nm: 1100,
    planned_cost_cr: 9.80,
    actual_cost_cr: 10.45,
    risk_level: 'HIGH',
    route_waypoints: [
      [-0.50, 117.15],
      [1.2, 104.0],
      [2.80, 101.40],
      [6.0, 95.0],
      [14.0, 90.0],
      [22.02, 88.06]
    ]
  }
];

export const FALLBACK_ALERTS: AlertItem[] = [
  {
    id: 1,
    shipment_id: 4,
    category: 'Port Risk',
    severity: 'CRITICAL',
    message: 'Haldia Draft & Congestion Warning: Waiting queue exceeding 28 hrs with low tide window.',
    evidence: 'Current Haldia draft constrained to 8.5m. MV Chola Pride scheduled draft 12.8m requires midstream lighterage.',
    is_read: false,
    is_acknowledged: false,
    timestamp: '2026-09-28T07:15:00Z'
  },
  {
    id: 2,
    shipment_id: 1,
    category: 'Weather Risk',
    severity: 'WARNING',
    message: 'Bay of Bengal Tropical Depression: Wind speeds 28-34 knots near 13°N 86°E.',
    evidence: 'Swell height reaching 3.4m on MV Bharat Gaurav transit corridor. Minor speed reduction applied.',
    is_read: false,
    is_acknowledged: false,
    timestamp: '2026-09-28T05:30:00Z'
  },
  {
    id: 3,
    category: 'Market Risk',
    severity: 'MARKET',
    message: 'Baltic Dry Index (BDI) spiked +45 pts (+2.4%) driven by Pacific Capesize demand.',
    evidence: 'Hay Point to Vizag spot fixture rates estimated at $22.40/MT vs $21.80/MT 7-day average.',
    is_read: true,
    is_acknowledged: false,
    timestamp: '2026-09-27T18:00:00Z'
  }
];

export const FALLBACK_CARGO_DISTRIBUTION = [
  { name: 'Coking Coal', value: 48, mt: 297600, color: '#063B68' },
  { name: 'Thermal Coal', value: 24, mt: 148800, color: '#0867B2' },
  { name: 'Iron Ore', value: 18, mt: 111600, color: '#FF7A00' },
  { name: 'Limestone & Dolomite', value: 10, mt: 62000, color: '#00843D' }
];

export const FALLBACK_MARKET_TREND = {
  bdi_index: 1845,
  bdi_change_pct: 2.4,
  vlsfo_fuel_usd: 624.50,
  vlsfo_change_pct: -0.8,
  capesize_avg_usd: 24500,
  panamax_avg_usd: 16200,
  supramax_avg_usd: 13800
};

export const FALLBACK_REQUIREMENTS: CargoRequirement[] = [
  {
    id: 1,
    requirement_code: 'REQ-2026-0042',
    cargo_type: 'Coking Coal',
    quantity_mt: 80000,
    origin_country: 'Australia',
    origin_port: 'Hay Point',
    destination_port: 'Visakhapatnam',
    delivery_date: '2026-10-28',
    laycan_start: '2026-10-05',
    laycan_end: '2026-10-14',
    preferred_vessel_type: 'Panamax',
    notes: 'Prime hard coking coal for blast furnace blend at Vizag plant. Strict laycan compliance required.',
    status: 'ANALYZED',
    created_by: 'charter.manager@sail.in',
    created_at: '2026-09-26T11:30:00Z'
  },
  {
    id: 2,
    requirement_code: 'REQ-2026-0043',
    cargo_type: 'Iron Ore Pellets',
    quantity_mt: 160000,
    origin_country: 'Australia',
    origin_port: 'Port Hedland',
    destination_port: 'Dhamra',
    delivery_date: '2026-10-25',
    laycan_start: '2026-10-08',
    laycan_end: '2026-10-12',
    preferred_vessel_type: 'Capesize',
    notes: 'High grade hematite fines 64.5% Fe for Rourkela & Durgapur steel plants.',
    status: 'DRAFT',
    created_by: 'charter.manager@sail.in',
    created_at: '2026-09-27T09:15:00Z'
  }
];

export const FALLBACK_DIGITAL_TWIN: DigitalTwinData = {
  shipment: {
    id: 1,
    shipment_code: 'SHP-2026-0018',
    cargo_type: 'Premium Coking Coal',
    quantity_mt: 78500,
    origin_port: 'Hay Point',
    destination_port: 'Visakhapatnam',
    status: 'IN TRANSIT',
    progress_pct: 76.5,
    departure_time: '2026-09-18T10:00:00Z',
    scheduled_eta: '2026-10-01T14:00:00Z',
    current_eta: '2026-10-01T19:30:00Z',
    eta_variance_hours: 5.5,
    risk_level: 'MEDIUM',
    current_lat: 14.85,
    current_lng: 85.40,
    current_speed_knots: 13.2,
    current_heading: 340
  },
  vessel: {
    id: 1,
    name: 'MV Bharat Gaurav',
    imo: 'IMO 9821456',
    vessel_type: 'Panamax Bulk Carrier',
    dwt: 82500,
    capacity_mt: 80000,
    loa_m: 229.0,
    beam_m: 32.26,
    draft_m: 14.2,
    flag: 'India',
    holds_count: 5
  },
  summary: {
    total_cargo_mt: 78500,
    loaded_mt: 78500,
    onboard_mt: 78500,
    discharged_mt: 0,
    holds_loaded_count: 5,
    total_holds: 5,
    voyage_progress_pct: 76.5,
    utilization_overall_pct: 95.2,
    shipment_status: 'IN TRANSIT'
  },
  holds: [
    {
      hold_number: 1,
      hold_id: 'H01',
      hold_code: 'HOLD 01 (FWD)',
      capacity_mt: 15500,
      allocated_mt: 15000,
      loaded_mt: 14850,
      discharged_mt: 0,
      onboard_mt: 14850,
      utilization_pct: 95.8,
      fill_height_ratio: 0.95,
      status: 'LOADED',
      cargo_type: 'Coking Coal - Batch A',
      batch_id: 'BCH-2026-081',
      origin: 'Hay Point',
      destination: 'Visakhapatnam',
      temperature_c: 31.4,
      humidity_pct: 8.8,
      vibration_level: 'NORMAL',
      has_alert: false
    },
    {
      hold_number: 2,
      hold_id: 'H02',
      hold_code: 'HOLD 02',
      capacity_mt: 17000,
      allocated_mt: 16500,
      loaded_mt: 16400,
      discharged_mt: 0,
      onboard_mt: 16400,
      utilization_pct: 96.5,
      fill_height_ratio: 0.96,
      status: 'LOADED',
      cargo_type: 'Coking Coal - Batch A',
      batch_id: 'BCH-2026-081',
      origin: 'Hay Point',
      destination: 'Visakhapatnam',
      temperature_c: 32.1,
      humidity_pct: 9.1,
      vibration_level: 'NORMAL',
      has_alert: false
    },
    {
      hold_number: 3,
      hold_id: 'H03',
      hold_code: 'HOLD 03 (MID)',
      capacity_mt: 17500,
      allocated_mt: 17000,
      loaded_mt: 16900,
      discharged_mt: 0,
      onboard_mt: 16900,
      utilization_pct: 96.6,
      fill_height_ratio: 0.96,
      status: 'LOADED',
      cargo_type: 'Coking Coal - Batch B',
      batch_id: 'BCH-2026-082',
      origin: 'Hay Point',
      destination: 'Visakhapatnam',
      temperature_c: 33.2,
      humidity_pct: 9.4,
      vibration_level: 'NORMAL',
      has_alert: false
    },
    {
      hold_number: 4,
      hold_id: 'H04',
      hold_code: 'HOLD 04',
      capacity_mt: 17000,
      allocated_mt: 16500,
      loaded_mt: 16250,
      discharged_mt: 0,
      onboard_mt: 16250,
      utilization_pct: 95.6,
      fill_height_ratio: 0.95,
      status: 'LOADED',
      cargo_type: 'Coking Coal - Batch B',
      batch_id: 'BCH-2026-082',
      origin: 'Hay Point',
      destination: 'Visakhapatnam',
      temperature_c: 32.8,
      humidity_pct: 9.0,
      vibration_level: 'NORMAL',
      has_alert: false
    },
    {
      hold_number: 5,
      hold_id: 'H05',
      hold_code: 'HOLD 05 (AFT)',
      capacity_mt: 15500,
      allocated_mt: 14500,
      loaded_mt: 14100,
      discharged_mt: 0,
      onboard_mt: 14100,
      utilization_pct: 91.0,
      fill_height_ratio: 0.91,
      status: 'LOADED',
      cargo_type: 'Coking Coal - Batch C',
      batch_id: 'BCH-2026-083',
      origin: 'Hay Point',
      destination: 'Visakhapatnam',
      temperature_c: 30.9,
      humidity_pct: 8.5,
      vibration_level: 'NORMAL',
      has_alert: false
    }
  ],
  batches: [
    {
      batch_id: 'BCH-2026-081',
      cargo_type: 'Premium Mid-Vol Coking Coal',
      quantity_mt: 31250,
      holds: ['H01', 'H02'],
      supplier: 'BMA Queensland Alliance',
      origin: 'Hay Point, Australia',
      destination: 'Visakhapatnam, India',
      loading_date: '2026-09-17',
      status: 'VERIFIED_ONBOARD',
      qr_code: 'QR-BCH-081-V1',
      rfid_tag: 'RFID-9821456-01'
    },
    {
      batch_id: 'BCH-2026-082',
      cargo_type: 'Hard Coking Coal (Peak Downs Blend)',
      quantity_mt: 33150,
      holds: ['H03', 'H04'],
      supplier: 'BMA Queensland Alliance',
      origin: 'Hay Point, Australia',
      destination: 'Visakhapatnam, India',
      loading_date: '2026-09-18',
      status: 'VERIFIED_ONBOARD',
      qr_code: 'QR-BCH-082-V2',
      rfid_tag: 'RFID-9821456-02'
    },
    {
      batch_id: 'BCH-2026-083',
      cargo_type: 'Semi-Soft Coking Coal',
      quantity_mt: 14100,
      holds: ['H05'],
      supplier: 'BHP Minerals',
      origin: 'Hay Point, Australia',
      destination: 'Visakhapatnam, India',
      loading_date: '2026-09-18',
      status: 'VERIFIED_ONBOARD',
      qr_code: 'QR-BCH-083-V3',
      rfid_tag: 'RFID-9821456-03'
    }
  ],
  journey_timeline: [
    {
      stage: 'Commenced Loading',
      timestamp: '2026-09-17 08:30 AEST',
      location: 'Hay Point Berth 2',
      status: 'COMPLETED',
      details: 'Draft survey certified 78,500 MT net loaded.'
    },
    {
      stage: 'Voyage Departure',
      timestamp: '2026-09-18 10:00 AEST',
      location: 'Hay Point Outer Channel',
      status: 'COMPLETED',
      details: 'Vessel unberthed; set pilot course heading 310° via Torres Strait.'
    },
    {
      stage: 'Torres Strait Passage',
      timestamp: '2026-09-21 14:15 AEST',
      location: 'Prince of Wales Channel',
      status: 'COMPLETED',
      details: 'Pilot disembarked; entered Arafura Sea corridor smoothly.'
    },
    {
      stage: 'Bay of Bengal Transit',
      timestamp: '2026-09-28 09:00 IST',
      location: '14.85°N, 85.40°E',
      status: 'IN_PROGRESS',
      details: 'Current speed 13.2 knots; hold moisture and temperatures nominal.'
    },
    {
      stage: 'Scheduled Berth Arrival',
      timestamp: '2026-10-01 19:30 IST',
      location: 'Visakhapatnam Coal Berth 1',
      status: 'UPCOMING',
      details: 'Discharge conveyor team scheduled on arrival.'
    }
  ],
  sensors: {
    temperature_c: 32.1,
    humidity_pct: 9.0,
    vibration: 'NORMAL (0.14g)',
    hatch_status: 'SEALED & MONITORED',
    weight_mt: 78500,
    is_simulated: true,
    data_badge: 'DEMO TELEMETRY',
    active_devices_count: 15,
    history_24h: [
      { time: '00:00', temperature_c: 31.8, humidity_pct: 8.9, vibration_g: 0.12, weight_mt: 78500 },
      { time: '04:00', temperature_c: 32.0, humidity_pct: 9.0, vibration_g: 0.14, weight_mt: 78500 },
      { time: '08:00', temperature_c: 32.3, humidity_pct: 9.1, vibration_g: 0.15, weight_mt: 78500 },
      { time: '12:00', temperature_c: 32.8, humidity_pct: 9.3, vibration_g: 0.16, weight_mt: 78500 },
      { time: '16:00', temperature_c: 32.4, humidity_pct: 9.2, vibration_g: 0.14, weight_mt: 78500 },
      { time: '20:00', temperature_c: 32.1, humidity_pct: 9.0, vibration_g: 0.13, weight_mt: 78500 }
    ],
    alerts: []
  },
  events: [
    {
      event_id: 'EVT-01',
      event_type: 'LOADING_COMPLETE',
      location: 'Hay Point Berth 2',
      quantity_mt: 78500,
      timestamp: '2026-09-17 08:30 AEST',
      source: 'Terminal Conveyor Weightometer',
      description: 'Draft survey certified 78,500 MT net loaded across Holds 1-5.'
    }
  ],
  simulation_mode: 'IDLE',
  is_simulated: true
};

// Algorithmic calculators
export function calculateFallbackFreight(origin: string, destination: string, vesselType: string, cargoType: string): FreightForecast {
  let baseRate = 21.50;
  if (origin?.includes('Hay Point') || origin?.includes('Australia')) baseRate = 22.80;
  else if (origin?.includes('Richards Bay') || origin?.includes('South Africa')) baseRate = 17.60;
  else if (origin?.includes('Samarinda') || origin?.includes('Indonesia')) baseRate = 12.40;

  if (vesselType === 'Capesize') baseRate *= 0.88;
  if (vesselType === 'Supramax') baseRate *= 1.18;

  const f7d = Number((baseRate * 1.025).toFixed(2));
  const f15d = Number((baseRate * 1.052).toFixed(2));
  const f30d = Number((baseRate * 1.078).toFixed(2));

  const history = [
    { date: '2026-08-01', rate_usd_per_mt: Number((baseRate * 0.92).toFixed(2)), bunker_price: 610, market_index: 1720 },
    { date: '2026-08-15', rate_usd_per_mt: Number((baseRate * 0.95).toFixed(2)), bunker_price: 618, market_index: 1760 },
    { date: '2026-09-01', rate_usd_per_mt: Number((baseRate * 0.97).toFixed(2)), bunker_price: 622, market_index: 1810 },
    { date: '2026-09-15', rate_usd_per_mt: Number((baseRate * 0.99).toFixed(2)), bunker_price: 625, market_index: 1835 },
    { date: '2026-09-28', rate_usd_per_mt: baseRate, bunker_price: 624.50, market_index: 1845 }
  ];

  const forecastCurve = [
    { date: '2026-09-28', forecast_rate: baseRate, lower_bound: baseRate, upper_bound: baseRate, day_horizon: 0 },
    { date: '2026-10-05', forecast_rate: f7d, lower_bound: Number((f7d * 0.96).toFixed(2)), upper_bound: Number((f7d * 1.04).toFixed(2)), day_horizon: 7 },
    { date: '2026-10-13', forecast_rate: f15d, lower_bound: Number((f15d * 0.94).toFixed(2)), upper_bound: Number((f15d * 1.06).toFixed(2)), day_horizon: 15 },
    { date: '2026-10-28', forecast_rate: f30d, lower_bound: Number((f30d * 0.91).toFixed(2)), upper_bound: Number((f30d * 1.09).toFixed(2)), day_horizon: 30 }
  ];

  return {
    origin: origin || 'Hay Point',
    destination: destination || 'Visakhapatnam',
    vessel_type: vesselType || 'Panamax',
    cargo_type: cargoType || 'Coking Coal',
    current_rate: baseRate,
    forecast_7d: f7d,
    forecast_15d: f15d,
    forecast_30d: f30d,
    lower_bound_30d: Number((f30d * 0.91).toFixed(2)),
    upper_bound_30d: Number((f30d * 1.09).toFixed(2)),
    trend: 'UPWARD',
    confidence_score: 91.5,
    model_version: 'Ensemble-RF-Ridge-v2.4',
    last_updated: new Date().toISOString(),
    metrics: {
      mae: 0.62,
      rmse: 0.88,
      mape_pct: 3.4,
      train_samples: 720,
      test_samples: 144,
      split_type: 'Chronological Time Series'
    },
    historical: history,
    forecast_curve: forecastCurve
  };
}

export function calculateFallbackCost(quantityMt = 80000, rateUsdMt = 22.80, portWaitingDays = 1.5): CostBreakdown {
  const inrPerUsd = 86.5;
  const oceanFreightUsd = quantityMt * rateUsdMt;
  const oceanFreightCr = (oceanFreightUsd * inrPerUsd) / 10000000;
  const portChargesCr = 0.85;
  const handlingChargesCr = 0.55;
  const demurrageCr = Number(((portWaitingDays * 16000 * inrPerUsd) / 10000000).toFixed(2));
  const bunkerImpactCr = 0.45;
  const otherOperationalCr = 0.20;
  const totalCostCr = Number((oceanFreightCr + portChargesCr + handlingChargesCr + demurrageCr + bunkerImpactCr + otherOperationalCr).toFixed(2));
  const costPerMtInr = Number(((totalCostCr * 10000000) / quantityMt).toFixed(1));

  return {
    ocean_freight_usd: oceanFreightUsd,
    ocean_freight_cr: Number(oceanFreightCr.toFixed(2)),
    port_charges_cr: portChargesCr,
    handling_charges_cr: handlingChargesCr,
    estimated_demurrage_cr: demurrageCr,
    fuel_bunker_impact_cr: bunkerImpactCr,
    other_operational_cr: otherOperationalCr,
    total_cost_cr: totalCostCr,
    cost_per_mt_inr: costPerMtInr,
    assumptions: [
      `USD/INR Exchange Rate: ₹${inrPerUsd}`,
      `Estimated Port Waiting Time: ${portWaitingDays} days`,
      `VLSFO Bunker Benchmark: $624.50/MT`,
      `Standard SAIL Bulk Stevedoring & Wharfage Rates applied`
    ]
  };
}

export function calculateFallbackCharterAdvice(reqId: number, vesselId: number): AICharterAdvice {
  const vessel = FALLBACK_VESSELS.find(v => v.id === vesselId) || FALLBACK_VESSELS[0];
  const req = FALLBACK_REQUIREMENTS.find(r => r.id === reqId) || FALLBACK_REQUIREMENTS[0];
  const cost = calculateFallbackCost(req.quantity_mt, 22.80);

  return {
    requirement_id: reqId,
    vessel_id: vesselId,
    vessel_name: vessel.name,
    vessel_type: vessel.vessel_type,
    cargo_type: req.cargo_type,
    quantity_mt: req.quantity_mt,
    route: `${req.origin_port} → ${req.destination_port}`,
    market_signal: 'FAVORABLE - FIX PROMPTLY',
    port_compatibility_status: 'FULLY COMPATIBLE',
    port_compatible: true,
    expected_cost_cr: cost.total_cost_cr,
    cost_breakdown: cost,
    risk_level: 'LOW',
    recommendation_score: 88.5,
    planning_signal: 'STRONGLY RECOMMENDED',
    why_reasons: [
      `Vessel DWT (${vessel.dwt.toLocaleString()} MT) matches requirement volume (${req.quantity_mt.toLocaleString()} MT) with zero deadfreight penalty.`,
      `Arrival draft (${vessel.draft_m}m) complies with ${req.destination_port} max harbor draft (14.5m) with 0.3m safety under-keel clearance.`,
      `Laycan availability window (${vessel.available_date}) aligns with scheduled load dates.`,
      `Daily charter hire ($${vessel.daily_charter_rate_usd.toLocaleString()}/day) is 4.2% below current Baltic Panamax spot benchmark.`
    ],
    cautions: [
      `Monitor Bay of Bengal seasonal weather alerts 48 hours prior to unberthing.`,
      `Ensure fuel sulfur certificate complies with Indian Directorate General of Shipping VLSFO 0.50% requirement.`
    ],
    disclaimer: 'AI Decision Support Recommendation — Requires official approval from Authorized Chartering Officer.'
  };
}

export function calculateFallbackSimulation(payload: any) {
  const baseCost = payload.base_cost_cr || 16.43;
  const freightPct = payload.freight_rate_pct_change || 0;
  const fuelPct = payload.fuel_cost_pct_change || 0;
  const delayDays = payload.port_delay_days || 0;
  const speedPct = payload.vessel_speed_pct_change || 0;

  // Ocean freight is ~75% of base cost, fuel ~15%, port/demurrage ~10%
  const freightDiff = baseCost * 0.75 * (freightPct / 100);
  const fuelDiff = baseCost * 0.15 * (fuelPct / 100);
  const delayCostCr = delayDays * 0.22; // ~₹22 Lakhs per demurrage day
  const speedImpactCr = speedPct > 0 ? (speedPct * 0.03) : (speedPct * 0.02);

  const scenarioCost = Number((baseCost + freightDiff + fuelDiff + delayCostCr + speedImpactCr).toFixed(2));
  const varianceCr = Number((scenarioCost - baseCost).toFixed(2));
  const variancePct = Number(((varianceCr / baseCost) * 100).toFixed(1));

  let sensitivity = 'LOW';
  if (Math.abs(variancePct) > 10) sensitivity = 'HIGH';
  else if (Math.abs(variancePct) > 4) sensitivity = 'MEDIUM';

  return {
    base_scenario: {
      cost_cr: baseCost,
      cost_per_mt_inr: 2054,
      transit_days: 14.5
    },
    simulated_scenario: {
      cost_cr: scenarioCost,
      cost_per_mt_inr: Number(((scenarioCost * 10000000) / 80000).toFixed(0)),
      transit_days: Number((14.5 + delayDays - (speedPct * 0.05)).toFixed(1)),
      variance_cr: varianceCr,
      variance_pct: variancePct,
      sensitivity_risk: sensitivity
    },
    drivers: [
      { name: 'Freight Rate Movement', impact_cr: Number(freightDiff.toFixed(2)) },
      { name: 'Bunker Fuel Price Fluctuation', impact_cr: Number(fuelDiff.toFixed(2)) },
      { name: 'Port Demurrage & Queue Days', impact_cr: Number(delayCostCr.toFixed(2)) },
      { name: 'Vessel Speed Adjustment', impact_cr: Number(speedImpactCr.toFixed(2)) }
    ],
    recommendation: varianceCr > 0.8 
      ? 'Execute bunker hedge or explore backhaul consolidation to neutralize cost expansion.'
      : 'Market conditions favorable for locking forward contract fixtures.'
  };
}
