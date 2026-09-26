import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, Enum as SQLEnum
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    organization = Column(String(150), nullable=False, default="Steel Authority of India Limited")
    department = Column(String(100), nullable=False, default="Raw Materials Logistics")
    designation = Column(String(100), nullable=False, default="Charter Specialist")
    role = Column(String(50), nullable=False, default="Charter Manager") 
    # Roles: "ADMIN", "Charter Manager", "Logistics Manager", "Operations Manager", "Management Viewer"
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    status = Column(String(30), default="APPROVED") # "APPROVED", "PENDING_APPROVAL", "SUSPENDED"
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class CargoRequirement(Base):
    __tablename__ = "cargo_requirements"
    id = Column(Integer, primary_key=True, index=True)
    requirement_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. REQ-2026-0012
    cargo_type = Column(String(80), nullable=False) # Coking Coal, Thermal Coal, Iron Ore, Limestone, Dolomite, Manganese Ore
    quantity_mt = Column(Float, nullable=False)
    origin_country = Column(String(80), nullable=False)
    origin_port = Column(String(100), nullable=False)
    destination_port = Column(String(100), nullable=False)
    delivery_date = Column(String(30), nullable=False)
    laycan_start = Column(String(30), nullable=False)
    laycan_end = Column(String(30), nullable=False)
    preferred_vessel_type = Column(String(50), nullable=True) # Panamax, Capesize, Supramax, Handysize
    notes = Column(Text, nullable=True)
    status = Column(String(40), default="DRAFT") # DRAFT, ANALYZED, PENDING_APPROVAL, CHARTERED, COMPLETED
    created_by = Column(String(150), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class Vessel(Base):
    __tablename__ = "vessels"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    imo = Column(String(20), unique=True, index=True, nullable=False)
    vessel_type = Column(String(50), nullable=False) # Handysize, Supramax, Panamax, Capesize
    dwt = Column(Float, nullable=False)
    capacity_mt = Column(Float, nullable=False)
    draft_m = Column(Float, nullable=False)
    beam_m = Column(Float, nullable=False)
    loa_m = Column(Float, nullable=False) # Length Overall
    speed_knots = Column(Float, default=12.5)
    current_location = Column(String(150), default="At Sea")
    latitude = Column(Float, nullable=False, default=12.0)
    longitude = Column(Float, nullable=False, default=85.0)
    heading = Column(Float, default=0.0)
    availability_status = Column(String(50), default="AVAILABLE") # AVAILABLE, IN_TRANSIT, MAINTENANCE, COMMITTED
    available_date = Column(String(30), nullable=True)
    daily_charter_rate_usd = Column(Float, default=22000.0)
    fuel_consumption_tpd = Column(Float, default=28.5) # Tons per day
    year_built = Column(Integer, default=2018)
    flag = Column(String(50), default="India")

class Port(Base):
    __tablename__ = "ports"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    code = Column(String(20), nullable=False)
    country = Column(String(50), default="India")
    is_indian_port = Column(Boolean, default=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    max_draft_m = Column(Float, nullable=False)
    max_loa_m = Column(Float, nullable=False)
    max_beam_m = Column(Float, nullable=False)
    max_dwt = Column(Float, default=150000.0)
    berths_count = Column(Integer, default=12)
    current_congestion_level = Column(String(30), default="MEDIUM") # LOW, MEDIUM, HIGH, SEVERE
    waiting_time_hours = Column(Float, default=12.0)
    port_status = Column(String(50), default="OPERATIONAL")
    operational_notes = Column(Text, nullable=True)

class FreightRate(Base):
    __tablename__ = "freight_rates"
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    vessel_type = Column(String(50), nullable=False)
    cargo_type = Column(String(80), nullable=False)
    rate_date = Column(String(30), nullable=False)
    rate_usd_per_mt = Column(Float, nullable=False)
    bunker_price_usd_ton = Column(Float, default=620.0)
    market_index = Column(Float, default=1840.0) # e.g. BDI / Baltic Capesize/Panamax index
    source = Column(String(100), default="Historical Maritime Exchange (Synthetic Ground Truth)")

class FreightForecast(Base):
    __tablename__ = "freight_forecasts"
    id = Column(Integer, primary_key=True, index=True)
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    vessel_type = Column(String(50), nullable=False)
    cargo_type = Column(String(80), nullable=False)
    current_rate = Column(Float, nullable=False)
    forecast_7d = Column(Float, nullable=False)
    forecast_15d = Column(Float, nullable=False)
    forecast_30d = Column(Float, nullable=False)
    lower_bound_30d = Column(Float, nullable=False)
    upper_bound_30d = Column(Float, nullable=False)
    trend = Column(String(20), default="UPWARD") # UPWARD, DOWNWARD, STABLE
    confidence_score = Column(Float, default=0.88)
    model_version = Column(String(50), default="XGB-Ridge-Ensemble-v2.4")
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)

class CharterScenario(Base):
    __tablename__ = "charter_scenarios"
    id = Column(Integer, primary_key=True, index=True)
    requirement_id = Column(Integer, ForeignKey("cargo_requirements.id"))
    vessel_id = Column(Integer, ForeignKey("vessels.id"))
    freight_rate_usd_mt = Column(Float, nullable=False)
    ocean_freight_cr = Column(Float, nullable=False)
    port_charges_cr = Column(Float, nullable=False)
    handling_cr = Column(Float, nullable=False)
    demurrage_cr = Column(Float, nullable=False)
    fuel_other_cr = Column(Float, nullable=False)
    total_cost_cr = Column(Float, nullable=False)
    risk_level = Column(String(30), default="MEDIUM") # LOW, MEDIUM, HIGH
    recommendation_score = Column(Float, default=88.5) # 0 to 100
    advisor_signal = Column(String(100), default="Current charter window warrants attention")
    advisor_justifications = Column(Text, default="[]") # JSON list of strings
    is_port_compatible = Column(Boolean, default=True)
    status = Column(String(30), default="SAVED") # SAVED, PENDING_APPROVAL, APPROVED, REJECTED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    requirement = relationship("CargoRequirement")
    vessel = relationship("Vessel")

class CharterApproval(Base):
    __tablename__ = "charter_approvals"
    id = Column(Integer, primary_key=True, index=True)
    charter_code = Column(String(50), unique=True, index=True, nullable=False) # e.g. CHT-2026-0045
    scenario_id = Column(Integer, ForeignKey("charter_scenarios.id"))
    approved_by = Column(String(150), nullable=False)
    approval_timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String(30), default="APPROVED")
    comments = Column(Text, nullable=True)

    scenario = relationship("CharterScenario")

class Shipment(Base):
    __tablename__ = "shipments"
    id = Column(Integer, primary_key=True, index=True)
    shipment_code = Column(String(50), unique=True, index=True, nullable=False) # SHP-2026-0089
    requirement_id = Column(Integer, ForeignKey("cargo_requirements.id"), nullable=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False)
    cargo_type = Column(String(80), nullable=False)
    quantity_mt = Column(Float, nullable=False)
    origin_port = Column(String(100), nullable=False)
    destination_port = Column(String(100), nullable=False)
    departure_time = Column(String(50), nullable=False)
    scheduled_eta = Column(String(50), nullable=False)
    current_eta = Column(String(50), nullable=False)
    eta_variance_hours = Column(Float, default=0.0)
    status = Column(String(50), default="IN TRANSIT") 
    # PLANNED, LOADING, DEPARTED, IN TRANSIT, APPROACHING PORT, ARRIVED, DISCHARGING, COMPLETED
    progress_pct = Column(Float, default=0.0)
    current_lat = Column(Float, default=0.0)
    current_lng = Column(Float, default=0.0)
    current_speed_knots = Column(Float, default=12.5)
    current_heading = Column(Float, default=0.0)
    total_distance_nm = Column(Float, default=4500.0)
    remaining_distance_nm = Column(Float, default=1500.0)
    planned_cost_cr = Column(Float, default=16.43)
    actual_cost_cr = Column(Float, default=16.71)
    planned_duration_days = Column(Float, default=16.5)
    actual_duration_days = Column(Float, default=17.8)
    port_waiting_hours = Column(Float, default=11.4)
    risk_level = Column(String(30), default="LOW") # LOW, MEDIUM, HIGH, CRITICAL
    route_waypoints_json = Column(Text, default="[]") # JSON list of [lat, lng]
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    vessel = relationship("Vessel")

class ShipmentEvent(Base):
    __tablename__ = "shipment_events"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"))
    event_type = Column(String(80), nullable=False)
    description = Column(Text, nullable=False)
    location_name = Column(String(120), nullable=True)
    timestamp = Column(String(50), nullable=False)
    severity = Column(String(30), default="INFO") # INFO, WARNING, CRITICAL, SUCCESS

class VesselPosition(Base):
    __tablename__ = "vessel_positions"
    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"))
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    speed_knots = Column(Float, default=12.5)
    heading = Column(Float, default=0.0)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_simulated = Column(Boolean, default=True)

class GeofenceZone(Base):
    __tablename__ = "geofence_zones"
    id = Column(Integer, primary_key=True, index=True)
    port_id = Column(Integer, ForeignKey("ports.id"), nullable=True)
    name = Column(String(100), nullable=False)
    zone_type = Column(String(50), default="APPROACHING") # APPROACHING, ANCHORAGE, PORT_ENTRY, BERTHED
    center_lat = Column(Float, nullable=False)
    center_lng = Column(Float, nullable=False)
    radius_nm = Column(Float, default=50.0)
    active = Column(Boolean, default=True)

class GeofenceEvent(Base):
    __tablename__ = "geofence_events"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=True)
    zone_id = Column(Integer, ForeignKey("geofence_zones.id"), nullable=True)
    event_type = Column(String(50), nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    message = Column(Text, nullable=False)

class Alert(Base):
    __tablename__ = "alerts"
    id = Column(Integer, primary_key=True, index=True)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=True)
    category = Column(String(50), nullable=False) # Market Risk, Port Risk, Weather Risk, Schedule Risk, Operational Risk, Data Confidence
    severity = Column(String(30), nullable=False) # CRITICAL, WARNING, MARKET, INFO, SUCCESS
    message = Column(Text, nullable=False)
    evidence = Column(Text, nullable=True)
    is_read = Column(Boolean, default=False)
    is_acknowledged = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    category = Column(String(50), default="Shipment")
    is_read = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String(150), nullable=False)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=True)
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

# ============================================================
# 3D CARGO DIGITAL TWIN & IOT TRACKING MODELS
# ============================================================

class CargoBatch(Base):
    __tablename__ = "cargo_batches"
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(String(50), unique=True, index=True, nullable=False) # e.g. BAT-2026-0041
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    cargo_type = Column(String(80), nullable=False) # Coking Coal, Thermal Coal, Iron Ore, etc.
    quantity_mt = Column(Float, nullable=False)
    supplier = Column(String(150), default="BHP Mitsubishi Alliance")
    origin = Column(String(100), nullable=False)
    destination = Column(String(100), nullable=False)
    status = Column(String(50), default="LOADED") # ALLOCATED, LOADING, LOADED, IN_TRANSIT, DISCHARGING, RECEIVED
    loading_date = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    shipment = relationship("Shipment")

class CargoHold(Base):
    __tablename__ = "cargo_holds"
    id = Column(Integer, primary_key=True, index=True)
    vessel_id = Column(Integer, ForeignKey("vessels.id"), nullable=False)
    hold_number = Column(Integer, nullable=False) # 1, 2, 3, 4, 5
    hold_code = Column(String(30), nullable=False) # e.g. "HOLD 01"
    capacity_mt = Column(Float, default=17000.0)
    status = Column(String(50), default="LOADED") # EMPTY, LOADING, LOADED, DISCHARGING, ALERT

    vessel = relationship("Vessel")

class CargoAllocation(Base):
    __tablename__ = "cargo_allocations"
    id = Column(Integer, primary_key=True, index=True)
    batch_id = Column(Integer, ForeignKey("cargo_batches.id"), nullable=False)
    hold_id = Column(Integer, ForeignKey("cargo_holds.id"), nullable=False)
    allocated_quantity_mt = Column(Float, nullable=False)
    loaded_quantity_mt = Column(Float, default=0.0)
    discharged_quantity_mt = Column(Float, default=0.0)
    status = Column(String(50), default="LOADED") # EMPTY, LOADING, LOADED, DISCHARGED

    batch = relationship("CargoBatch")
    hold = relationship("CargoHold")

class CargoEvent(Base):
    __tablename__ = "cargo_events"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(String(50), unique=True, index=True, nullable=False)
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    batch_id = Column(String(50), nullable=True)
    hold_id = Column(String(50), nullable=True)
    event_type = Column(String(80), nullable=False)
    # CARGO_CREATED, CARGO_AT_PORT, INSPECTION_COMPLETED, LOADING_STARTED,
    # HOLD_LOADING_STARTED, HOLD_LOADING_COMPLETED, LOADING_COMPLETED,
    # VESSEL_DEPARTED, IN_TRANSIT, GEOFENCE_ENTERED, VESSEL_ARRIVED,
    # DISCHARGE_STARTED, HOLD_DISCHARGED, DISCHARGE_COMPLETED, CARGO_RECEIVED
    location = Column(String(120), nullable=False)
    quantity_mt = Column(Float, default=0.0)
    timestamp = Column(String(50), nullable=False)
    source = Column(String(100), default="TOS / AIS Marine Telemetry")
    description = Column(Text, nullable=False)

    shipment = relationship("Shipment")

class IoTDevice(Base):
    __tablename__ = "iot_devices"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(String(60), unique=True, index=True, nullable=False) # e.g. IOT-H03-ENV-09
    shipment_id = Column(Integer, ForeignKey("shipments.id"), nullable=False)
    hold_number = Column(Integer, default=1)
    device_type = Column(String(80), default="ENVIRONMENTAL_MULTI_SENSOR")
    status = Column(String(40), default="ACTIVE") # ACTIVE, OFFLINE, WARNING

    shipment = relationship("Shipment")

class IoTReading(Base):
    __tablename__ = "iot_readings"
    id = Column(Integer, primary_key=True, index=True)
    device_id = Column(Integer, ForeignKey("iot_devices.id"), nullable=False)
    sensor_type = Column(String(50), nullable=False) # TEMPERATURE, HUMIDITY, VIBRATION, WEIGHT, HATCH_STATUS
    value = Column(Float, nullable=False)
    unit = Column(String(20), default="") # °C, %, g, MT, etc.
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_simulated = Column(Boolean, default=True)

    device = relationship("IoTDevice")

