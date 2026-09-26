from pydantic import BaseModel, Field
from typing import Optional, List, Any
import datetime

# Auth Schemas
class UserRegister(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    organization: str
    department: str
    designation: str
    role: str # "Charter Manager", "Logistics Manager", "Operations Manager", "Management Viewer"
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    id: int
    full_name: str
    email: str
    phone: Optional[str] = None
    organization: str
    department: str
    designation: str
    role: str
    status: str
    is_active: bool

    class Config:
        from_attributes = True

# Cargo Requirement Schemas
class CargoRequirementCreate(BaseModel):
    cargo_type: str
    quantity_mt: float
    origin_country: str
    origin_port: str
    destination_port: str
    delivery_date: str
    laycan_start: str
    laycan_end: str
    preferred_vessel_type: Optional[str] = None
    notes: Optional[str] = None

class CargoRequirementResponse(BaseModel):
    id: int
    requirement_code: str
    cargo_type: str
    quantity_mt: float
    origin_country: str
    origin_port: str
    destination_port: str
    delivery_date: str
    laycan_start: str
    laycan_end: str
    preferred_vessel_type: Optional[str] = None
    notes: Optional[str] = None
    status: str
    created_by: Optional[str] = None
    created_at: Any

    class Config:
        from_attributes = True

# Freight Forecast Schemas
class FreightHistoryItem(BaseModel):
    date: str
    rate_usd_per_mt: float
    bunker_price: float
    market_index: float

class FreightForecastResponse(BaseModel):
    origin: str
    destination: str
    vessel_type: str
    cargo_type: str
    current_rate: float
    forecast_7d: float
    forecast_15d: float
    forecast_30d: float
    lower_bound_30d: float
    upper_bound_30d: float
    trend: str
    confidence_score: float
    model_version: str
    last_updated: str
    metrics: dict # MAE, RMSE, MAPE
    historical: List[FreightHistoryItem]
    forecast_curve: List[dict]

# Vessel Schemas
class VesselResponse(BaseModel):
    id: int
    name: str
    imo: str
    vessel_type: str
    dwt: float
    capacity_mt: float
    draft_m: float
    beam_m: float
    loa_m: float
    speed_knots: float
    current_location: str
    latitude: float
    longitude: float
    heading: float
    availability_status: str
    available_date: Optional[str] = None
    daily_charter_rate_usd: float
    fuel_consumption_tpd: float
    year_built: int
    flag: str

    class Config:
        from_attributes = True

class VesselOptimizeRequest(BaseModel):
    requirement_id: Optional[int] = None
    cargo_type: str
    quantity_mt: float
    origin_port: str
    destination_port: str
    laycan_start: str
    laycan_end: str

# Port Schemas
class PortResponse(BaseModel):
    id: int
    name: str
    code: str
    country: str
    is_indian_port: bool
    latitude: float
    longitude: float
    max_draft_m: float
    max_loa_m: float
    max_beam_m: float
    max_dwt: float
    berths_count: int
    current_congestion_level: str
    waiting_time_hours: float
    port_status: str
    operational_notes: Optional[str] = None

    class Config:
        from_attributes = True

class PortCompatibilityCheckRequest(BaseModel):
    port_id: int
    vessel_id: int

class PortCompatibilityResponse(BaseModel):
    port_name: str
    vessel_name: str
    vessel_type: str
    is_compatible: bool
    status: str # COMPATIBLE, RESTRICTED, DATA INCOMPLETE
    draft_check: dict
    loa_check: dict
    beam_check: dict
    dwt_check: dict
    overall_summary: str
    reasons: List[str]

# Cost Estimation Schemas
class CostCalculateRequest(BaseModel):
    quantity_mt: float
    freight_rate_usd_mt: float
    origin_port: str
    destination_port: str
    vessel_type: str
    distance_nm: Optional[float] = 4500.0
    exchange_rate_inr: Optional[float] = 86.50
    port_waiting_days: Optional[float] = 1.5

class CostBreakdownResponse(BaseModel):
    ocean_freight_usd: float
    ocean_freight_cr: float
    port_charges_cr: float
    handling_charges_cr: float
    estimated_demurrage_cr: float
    fuel_bunker_impact_cr: float
    other_operational_cr: float
    total_cost_cr: float
    cost_per_mt_inr: float
    assumptions: List[str]

# AI Charter Advisor Schemas
class CharterAdviceRequest(BaseModel):
    requirement_id: int
    vessel_id: int

class CharterAdviceResponse(BaseModel):
    requirement_id: int
    vessel_id: int
    vessel_name: str
    vessel_type: str
    cargo_type: str
    quantity_mt: float
    route: str
    market_signal: str
    port_compatibility_status: str
    port_compatible: bool
    expected_cost_cr: float
    risk_level: str
    recommendation_score: float
    planning_signal: str
    why_reasons: List[str]
    cautions: List[str]
    disclaimer: str

# Charter Approval Request
class CharterApprovalRequest(BaseModel):
    scenario_id: int
    comments: Optional[str] = None

# Shipment & Tracking Schemas
class ShipmentResponse(BaseModel):
    id: int
    shipment_code: str
    vessel_id: int
    vessel_name: Optional[str] = None
    vessel_imo: Optional[str] = None
    vessel_type: Optional[str] = None
    cargo_type: str
    quantity_mt: float
    origin_port: str
    destination_port: str
    departure_time: str
    scheduled_eta: str
    current_eta: str
    eta_variance_hours: float
    status: str
    progress_pct: float
    current_lat: float
    current_lng: float
    current_speed_knots: float
    current_heading: float
    total_distance_nm: float
    remaining_distance_nm: float
    planned_cost_cr: float
    actual_cost_cr: float
    is_delayed: bool
    delay_hours: float
    risk_level: str
    route_waypoints: List[List[float]] = []

    class Config:
        from_attributes = True

# What-If Simulator Schema
class WhatIfRequest(BaseModel):
    shipment_id: Optional[int] = None
    base_cost_cr: float = 16.43
    freight_rate_pct_change: float = 0.0 # -20 to +20
    fuel_cost_pct_change: float = 0.0    # -20 to +30
    port_delay_days: float = 0.0         # 0 to 7
    vessel_speed_pct_change: float = 0.0 # -20 to +10
    port_congestion: str = "MEDIUM"      # LOW, MEDIUM, HIGH
    vessel_availability: str = "AVAILABLE" # AVAILABLE, DELAYED

class WhatIfResponse(BaseModel):
    base: dict
    scenario: dict
    delta: dict
    insights: List[str]
