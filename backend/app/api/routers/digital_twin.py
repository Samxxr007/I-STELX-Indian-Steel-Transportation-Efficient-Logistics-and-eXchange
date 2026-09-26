import datetime
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import (
    Shipment, Vessel, CargoHold, CargoBatch, CargoAllocation,
    CargoEvent, IoTDevice, IoTReading, Alert
)

router = APIRouter(tags=["3D Cargo Digital Twin & Tracking"])

# In-memory dynamic state for demo simulations (persisted across live calls)
SIMULATION_STATE: Dict[str, Dict[str, Any]] = {
    "SHP-2026-0018": {
        "status": "IN TRANSIT",
        "loading_mode": "IDLE", # "IDLE", "LOADING", "DISCHARGING"
        "loading_step": 5, # 0 = Empty, 1 = Hold 3, 2 = Hold 1, 3 = Hold 5, 4 = Hold 2, 5 = Complete
        "discharge_step": 0,
        "holds": {
            1: {"code": "HOLD 01", "capacity_mt": 17000.0, "loaded_mt": 15800.0, "status": "LOADED", "cargo": "Coking Coal", "batch_id": "BAT-2026-0041"},
            2: {"code": "HOLD 02", "capacity_mt": 17000.0, "loaded_mt": 16100.0, "status": "LOADED", "cargo": "Coking Coal", "batch_id": "BAT-2026-0041"},
            3: {"code": "HOLD 03", "capacity_mt": 17000.0, "loaded_mt": 16000.0, "status": "LOADED", "cargo": "Coking Coal", "batch_id": "BAT-2026-0042"},
            4: {"code": "HOLD 04", "capacity_mt": 17000.0, "loaded_mt": 16200.0, "status": "LOADED", "cargo": "Coking Coal", "batch_id": "BAT-2026-0042"},
            5: {"code": "HOLD 05", "capacity_mt": 17000.0, "loaded_mt": 15900.0, "status": "LOADED", "cargo": "Coking Coal", "batch_id": "BAT-2026-0043"}
        },
        "sensor_humidity_h3": 61.4,
        "hatch_status": "Closed"
    }
}

@router.get("/shipments/{shipment_identifier}/digital-twin")
def get_shipment_digital_twin(shipment_identifier: str, db: Session = Depends(get_db)):
    """
    Returns full digital twin model state for the given shipment code or ID.
    Includes vessel geometry parameters, hold levels, batches, timeline, and sensors.
    """
    shipment = None
    if shipment_identifier.isdigit():
        shipment = db.query(Shipment).filter(Shipment.id == int(shipment_identifier)).first()
    if not shipment:
        shipment = db.query(Shipment).filter(Shipment.shipment_code == shipment_identifier).first()
    
    if not shipment:
        shipment = db.query(Shipment).first()
    
    if not shipment:
        # Create a transient demo shipment if db empty
        vessel = db.query(Vessel).first()
        shipment = Shipment(
            id=1,
            shipment_code=shipment_identifier if shipment_identifier.startswith("SHP-") else "SHP-2026-0018",
            vessel_id=vessel.id if vessel else 1,
            cargo_type="Coking Coal",
            quantity_mt=80000.0,
            origin_port="Hay Point",
            destination_port="Visakhapatnam",
            departure_time="08 Oct 2026",
            scheduled_eta="28 Oct 2026",
            current_eta="28 Oct 2026",
            status="IN TRANSIT",
            progress_pct=68.0,
            current_lat=14.2,
            current_lng=84.5,
            current_speed_knots=12.8,
            current_heading=295.0,
            risk_level="LOW"
        )
        if vessel:
            shipment.vessel = vessel


    vessel = shipment.vessel
    
    # Get or initialize simulation state for this shipment
    code = shipment.shipment_code
    if code not in SIMULATION_STATE:
        total_target = shipment.quantity_mt
        hold_target = total_target / 5.0
        SIMULATION_STATE[code] = {
            "status": shipment.status,
            "loading_mode": "IDLE",
            "loading_step": 5,
            "discharge_step": 0,
            "holds": {
                1: {"code": "HOLD 01", "capacity_mt": hold_target * 1.05, "loaded_mt": hold_target * 0.98, "status": "LOADED", "cargo": shipment.cargo_type, "batch_id": f"BAT-{code[-4:]}-01"},
                2: {"code": "HOLD 02", "capacity_mt": hold_target * 1.05, "loaded_mt": hold_target * 1.01, "status": "LOADED", "cargo": shipment.cargo_type, "batch_id": f"BAT-{code[-4:]}-01"},
                3: {"code": "HOLD 03", "capacity_mt": hold_target * 1.05, "loaded_mt": hold_target * 1.00, "status": "LOADED", "cargo": shipment.cargo_type, "batch_id": f"BAT-{code[-4:]}-02"},
                4: {"code": "HOLD 04", "capacity_mt": hold_target * 1.05, "loaded_mt": hold_target * 1.01, "status": "LOADED", "cargo": shipment.cargo_type, "batch_id": f"BAT-{code[-4:]}-02"},
                5: {"code": "HOLD 05", "capacity_mt": hold_target * 1.05, "loaded_mt": hold_target * 1.00, "status": "LOADED", "cargo": shipment.cargo_type, "batch_id": f"BAT-{code[-4:]}-03"}
            },
            "sensor_humidity_h3": 61.4,
            "hatch_status": "Closed"
        }

    sim = SIMULATION_STATE[code]

    # Calculate metrics
    holds_data = []
    total_capacity = 0.0
    total_loaded = 0.0

    for h_num in sorted(sim["holds"].keys()):
        h = sim["holds"][h_num]
        cap = h["capacity_mt"]
        loaded = h["loaded_mt"]
        total_capacity += cap
        total_loaded += loaded
        util = round((loaded / cap) * 100, 1) if cap > 0 else 0.0
        
        holds_data.append({
            "hold_number": h_num,
            "hold_id": f"H0{h_num}",
            "hold_code": h["code"],
            "capacity_mt": cap,
            "allocated_mt": loaded,
            "loaded_mt": loaded,
            "discharged_mt": 0.0 if sim["loading_mode"] != "DISCHARGING" else cap - loaded,
            "onboard_mt": loaded,
            "utilization_pct": util,
            "fill_height_ratio": round(loaded / cap, 3) if cap > 0 else 0.0,
            "status": h["status"],
            "cargo_type": h["cargo"],
            "batch_id": h["batch_id"],
            "origin": shipment.origin_port,
            "destination": shipment.destination_port,
            "temperature_c": round(28.2 + (h_num * 0.3), 1),
            "humidity_pct": sim["sensor_humidity_h3"] if h_num == 3 else round(58.0 + (h_num * 0.8), 1),
            "vibration_level": "NORMAL",
            "has_alert": h_num == 3 and sim["sensor_humidity_h3"] > 70.0
        })

    # Summary KPI card values
    summary = {
        "total_cargo_mt": round(total_loaded if total_loaded > 0 else shipment.quantity_mt, 0),
        "loaded_mt": round(total_loaded, 0),
        "onboard_mt": round(total_loaded, 0),
        "discharged_mt": round(shipment.quantity_mt - total_loaded, 0) if total_loaded < shipment.quantity_mt and sim["loading_mode"] == "DISCHARGING" else 0.0,
        "holds_loaded_count": sum(1 for h in holds_data if h["loaded_mt"] > 0),
        "total_holds": 5,
        "voyage_progress_pct": shipment.progress_pct,
        "utilization_overall_pct": round((total_loaded / total_capacity) * 100, 1) if total_capacity > 0 else 0.0,
        "shipment_status": sim["status"]
    }

    # Cargo Batches Manifest
    batches = [
        {
            "batch_id": "BAT-2026-0041",
            "cargo_type": shipment.cargo_type,
            "quantity_mt": 31900.0,
            "holds": ["H01", "H02"],
            "supplier": "BHP Mitsubishi Alliance (BMA)",
            "origin": shipment.origin_port,
            "destination": shipment.destination_port,
            "loading_date": "06 Oct 2026",
            "status": sim["status"],
            "qr_code": "I-STELX-BAT41-99812",
            "rfid_tag": "RF-9844-H1H2"
        },
        {
            "batch_id": "BAT-2026-0042",
            "cargo_type": shipment.cargo_type,
            "quantity_mt": 32200.0,
            "holds": ["H03", "H04"],
            "supplier": "Anglo American Metallurgical Coal",
            "origin": shipment.origin_port,
            "destination": shipment.destination_port,
            "loading_date": "07 Oct 2026",
            "status": sim["status"],
            "qr_code": "I-STELX-BAT42-99813",
            "rfid_tag": "RF-9845-H3H4"
        },
        {
            "batch_id": "BAT-2026-0043",
            "cargo_type": shipment.cargo_type,
            "quantity_mt": 15900.0,
            "holds": ["H05"],
            "supplier": "Glencore Coal Operations",
            "origin": shipment.origin_port,
            "destination": shipment.destination_port,
            "loading_date": "07 Oct 2026",
            "status": sim["status"],
            "qr_code": "I-STELX-BAT43-99814",
            "rfid_tag": "RF-9846-H5"
        }
    ]

    # Journey Tracker Milestones
    journey_timeline = [
        {"stage": "PROCUREMENT CONFIRMED", "timestamp": "04 Oct 09:30", "location": "SAIL HQ, New Delhi", "status": "COMPLETED", "details": "Commercial contract confirmed & allocated"},
        {"stage": "CARGO AT ORIGIN PORT", "timestamp": "05 Oct 14:00", "location": shipment.origin_port, "status": "COMPLETED", "details": "80,000 MT stockpiled at berth stockpile 4"},
        {"stage": "QUALITY INSPECTION", "timestamp": "05 Oct 18:20", "location": f"{shipment.origin_port} Lab", "status": "COMPLETED", "details": "Ash 9.2%, Moisture 8.1%, VM 24.5% - Approved"},
        {"stage": "LOADING STARTED", "timestamp": "06 Oct 08:15", "location": f"{shipment.origin_port} Berth 2", "status": "COMPLETED", "details": "Continuous conveyor ship-loader engaged"},
        {"stage": "LOADING COMPLETED", "timestamp": "07 Oct 18:40", "location": f"{shipment.origin_port} Berth 2", "status": "COMPLETED", "details": "Draught survey verified: 80,000 MT laden"},
        {"stage": "VESSEL DEPARTED", "timestamp": "08 Oct 06:20", "location": shipment.origin_port, "status": "COMPLETED", "details": "Pilot disembarked, sea voyage commenced"},
        {"stage": "IN TRANSIT", "timestamp": "Current Stage", "location": f"Bay of Bengal ({round(shipment.current_lat, 2)}°N, {round(shipment.current_lng, 2)}°E)", "status": "IN_PROGRESS", "details": f"Speed {shipment.current_speed_knots} kts, Heading {shipment.current_heading}°"},
        {"stage": "DESTINATION GEOFENCE", "timestamp": "27 Oct 16:00 (Est)", "location": f"{shipment.destination_port} 50NM Outer Zone", "status": "UPCOMING", "details": "Automatic arrival advisory trigger"},
        {"stage": "ARRIVED", "timestamp": shipment.current_eta, "location": f"{shipment.destination_port} Anchorage", "status": "UPCOMING", "details": "Port health & customs clearance"},
        {"stage": "DISCHARGING", "timestamp": "29 Oct 06:00 (Est)", "location": f"{shipment.destination_port} Ore Berth", "status": "UPCOMING", "details": "Unloading to plant stacker conveyor"},
        {"stage": "CARGO RECEIVED", "timestamp": "31 Oct 12:00 (Est)", "location": "SAIL Steel Plant Stockyard", "status": "UPCOMING", "details": "Final weighbridge reconciliation"}
    ]

    # Live Sensor Data & 24h Time Series
    now = datetime.datetime.utcnow()
    sensor_history = []
    for h in range(24, -1, -2):
        t = (now - datetime.timedelta(hours=h)).strftime("%H:%M")
        sensor_history.append({
            "time": t,
            "temperature_c": round(27.5 + (0.05 * (24 - h)) + ((h % 3) * 0.2), 1),
            "humidity_pct": round(59.0 + (0.1 * (24 - h)) + ((h % 2) * 0.5), 1),
            "vibration_g": round(0.04 + ((h % 4) * 0.01), 3),
            "weight_mt": round(total_loaded, 0)
        })

    sensors_current = {
        "temperature_c": 28.4,
        "humidity_pct": sim["sensor_humidity_h3"],
        "vibration": "Normal (0.045g)",
        "hatch_status": sim["hatch_status"],
        "weight_mt": round(total_loaded, 0),
        "is_simulated": True,
        "data_badge": "SIMULATED SENSOR DATA (DEMO)",
        "active_devices_count": 5,
        "history_24h": sensor_history,
        "alerts": [
            {
                "hold": "HOLD 03",
                "severity": "WARNING",
                "parameter": "Humidity",
                "value": f"{sim['sensor_humidity_h3']}%",
                "threshold": "70%",
                "timestamp": "14:32 UTC",
                "message": "Hold 03 humidity reading above configured threshold (70%)"
            }
        ] if sim["sensor_humidity_h3"] > 70.0 else []
    }

    # Cargo Events
    events = [
        {"event_id": "EVT-9001", "event_type": "VESSEL_DEPARTED", "location": shipment.origin_port, "quantity_mt": 80000.0, "timestamp": "08 Oct 06:20", "source": "AIS Marine Telemetry", "description": "MV Steel Voyager departed Hay Point laden with 80,000 MT Coking Coal"},
        {"event_id": "EVT-9002", "event_type": "LOADING_COMPLETED", "location": f"{shipment.origin_port} Berth 2", "quantity_mt": 80000.0, "timestamp": "07 Oct 18:40", "source": "Terminal Operating System (TOS)", "description": "All 5 holds laden and hatch covers sealed. Draught verified 14.2m."},
        {"event_id": "EVT-9003", "event_type": "HOLD_LOADING_COMPLETED", "location": "Hold 04", "quantity_mt": 16200.0, "timestamp": "07 Oct 16:15", "source": "Ship-loader Weigh Scale", "description": "Hold 04 loading completed (16,200 MT)"},
        {"event_id": "EVT-9004", "event_type": "HOLD_LOADING_COMPLETED", "location": "Hold 02", "quantity_mt": 16100.0, "timestamp": "07 Oct 12:30", "source": "Ship-loader Weigh Scale", "description": "Hold 02 loading completed (16,100 MT)"},
        {"event_id": "EVT-9005", "event_type": "HOLD_LOADING_COMPLETED", "location": "Hold 05", "quantity_mt": 15900.0, "timestamp": "07 Oct 08:00", "source": "Ship-loader Weigh Scale", "description": "Hold 05 loading completed (15,900 MT)"},
        {"event_id": "EVT-9006", "event_type": "HOLD_LOADING_COMPLETED", "location": "Hold 01", "quantity_mt": 15800.0, "timestamp": "06 Oct 22:45", "source": "Ship-loader Weigh Scale", "description": "Hold 01 loading completed (15,800 MT)"},
        {"event_id": "EVT-9007", "event_type": "HOLD_LOADING_COMPLETED", "location": "Hold 03", "quantity_mt": 16000.0, "timestamp": "06 Oct 15:20", "source": "Ship-loader Weigh Scale", "description": "Hold 03 initial ballast load completed (16,000 MT)"},
        {"event_id": "EVT-9008", "event_type": "LOADING_STARTED", "location": shipment.origin_port, "quantity_mt": 0.0, "timestamp": "06 Oct 08:15", "source": "Port TOS", "description": "Commenced sequential balanced loading plan for Panamax bulk carrier"}
    ]

    return {
        "shipment": {
            "id": shipment.id,
            "shipment_code": shipment.shipment_code,
            "cargo_type": shipment.cargo_type,
            "quantity_mt": shipment.quantity_mt,
            "origin_port": shipment.origin_port,
            "destination_port": shipment.destination_port,
            "status": sim["status"],
            "progress_pct": shipment.progress_pct,
            "departure_time": shipment.departure_time,
            "scheduled_eta": shipment.scheduled_eta,
            "current_eta": shipment.current_eta,
            "eta_variance_hours": shipment.eta_variance_hours,
            "risk_level": shipment.risk_level,
            "current_lat": shipment.current_lat,
            "current_lng": shipment.current_lng,
            "current_speed_knots": shipment.current_speed_knots,
            "current_heading": shipment.current_heading
        },
        "vessel": {
            "id": vessel.id if vessel else 1,
            "name": vessel.name if vessel else "MV Steel Voyager",
            "imo": vessel.imo if vessel else "9812450",
            "vessel_type": vessel.vessel_type if vessel else "Panamax",
            "dwt": vessel.dwt if vessel else 82000.0,
            "capacity_mt": vessel.capacity_mt if vessel else 85000.0,
            "loa_m": vessel.loa_m if vessel else 229.0,
            "beam_m": vessel.beam_m if vessel else 32.2,
            "draft_m": vessel.draft_m if vessel else 14.5,
            "flag": vessel.flag if vessel else "India",
            "holds_count": 5
        },
        "summary": summary,
        "holds": holds_data,
        "batches": batches,
        "journey_timeline": journey_timeline,
        "sensors": sensors_current,
        "events": events,
        "simulation_mode": sim["loading_mode"],
        "is_simulated": True
    }

@router.get("/shipments/{shipment_identifier}/cargo")
def get_shipment_cargo(shipment_identifier: str, db: Session = Depends(get_db)):
    data = get_shipment_digital_twin(shipment_identifier, db)
    return {
        "summary": data["summary"],
        "batches": data["batches"],
        "holds": data["holds"]
    }

@router.get("/shipments/{shipment_identifier}/cargo/holds")
def get_shipment_cargo_holds(shipment_identifier: str, db: Session = Depends(get_db)):
    data = get_shipment_digital_twin(shipment_identifier, db)
    return data["holds"]

@router.get("/shipments/{shipment_identifier}/cargo/batches")
def get_shipment_cargo_batches(shipment_identifier: str, db: Session = Depends(get_db)):
    data = get_shipment_digital_twin(shipment_identifier, db)
    return data["batches"]

@router.get("/shipments/{shipment_identifier}/cargo/events")
def get_shipment_cargo_events(shipment_identifier: str, db: Session = Depends(get_db)):
    data = get_shipment_digital_twin(shipment_identifier, db)
    return data["events"]

@router.get("/shipments/{shipment_identifier}/sensors")
def get_shipment_sensors(shipment_identifier: str, db: Session = Depends(get_db)):
    data = get_shipment_digital_twin(shipment_identifier, db)
    return data["sensors"]

@router.post("/demo/loading/start")
def start_loading_simulation(
    shipment_code: str = Query("SHP-2026-0018"),
    step: Optional[int] = Query(None)
):
    """
    Simulates sequential balanced loading across holds:
    Hold 03 -> Hold 01 -> Hold 05 -> Hold 02 -> Hold 04.
    """
    if shipment_code not in SIMULATION_STATE:
        SIMULATION_STATE[shipment_code] = {
            "status": "LOADING",
            "loading_mode": "LOADING",
            "loading_step": 0,
            "discharge_step": 0,
            "holds": {
                1: {"code": "HOLD 01", "capacity_mt": 17000.0, "loaded_mt": 0.0, "status": "EMPTY", "cargo": "Coking Coal", "batch_id": "BAT-2026-0041"},
                2: {"code": "HOLD 02", "capacity_mt": 17000.0, "loaded_mt": 0.0, "status": "EMPTY", "cargo": "Coking Coal", "batch_id": "BAT-2026-0041"},
                3: {"code": "HOLD 03", "capacity_mt": 17000.0, "loaded_mt": 0.0, "status": "EMPTY", "cargo": "Coking Coal", "batch_id": "BAT-2026-0042"},
                4: {"code": "HOLD 04", "capacity_mt": 17000.0, "loaded_mt": 0.0, "status": "EMPTY", "cargo": "Coking Coal", "batch_id": "BAT-2026-0042"},
                5: {"code": "HOLD 05", "capacity_mt": 17000.0, "loaded_mt": 0.0, "status": "EMPTY", "cargo": "Coking Coal", "batch_id": "BAT-2026-0043"}
            },
            "sensor_humidity_h3": 61.4,
            "hatch_status": "Open (Loading)"
        }

    sim = SIMULATION_STATE[shipment_code]
    sim["loading_mode"] = "LOADING"
    sim["status"] = "LOADING"
    sim["hatch_status"] = "Open (Loading)"

    current_step = step if step is not None else ((sim.get("loading_step", 0) + 1) % 6)
    sim["loading_step"] = current_step

    # Sequential loading plan:
    # 0: Empty
    # 1: Hold 3 full (16,000 MT)
    # 2: Hold 1 full (15,800 MT) + Hold 3
    # 3: Hold 5 full (15,900 MT) + 3 + 1
    # 4: Hold 2 full (16,100 MT) + 3 + 1 + 5
    # 5: Hold 4 full (16,200 MT) -> 80,000 MT COMPLETE
    
    target_caps = {1: 15800.0, 2: 16100.0, 3: 16000.0, 4: 16200.0, 5: 15900.0}

    if current_step == 0:
        for k in sim["holds"]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
    elif current_step == 1:
        sim["holds"][3]["loaded_mt"] = 16000.0
        sim["holds"][3]["status"] = "LOADED"
        for k in [1, 2, 4, 5]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
    elif current_step == 2:
        sim["holds"][3]["loaded_mt"] = 16000.0
        sim["holds"][3]["status"] = "LOADED"
        sim["holds"][1]["loaded_mt"] = 15800.0
        sim["holds"][1]["status"] = "LOADED"
        for k in [2, 4, 5]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
    elif current_step == 3:
        sim["holds"][3]["loaded_mt"] = 16000.0
        sim["holds"][1]["loaded_mt"] = 15800.0
        sim["holds"][5]["loaded_mt"] = 15900.0
        for k in [1, 3, 5]:
            sim["holds"][k]["status"] = "LOADED"
        for k in [2, 4]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
    elif current_step == 4:
        sim["holds"][3]["loaded_mt"] = 16000.0
        sim["holds"][1]["loaded_mt"] = 15800.0
        sim["holds"][5]["loaded_mt"] = 15900.0
        sim["holds"][2]["loaded_mt"] = 16100.0
        for k in [1, 2, 3, 5]:
            sim["holds"][k]["status"] = "LOADED"
        sim["holds"][4]["loaded_mt"] = 0.0
        sim["holds"][4]["status"] = "EMPTY"
    elif current_step >= 5:
        for k in sim["holds"]:
            sim["holds"][k]["loaded_mt"] = target_caps[k]
            sim["holds"][k]["status"] = "LOADED"
        sim["status"] = "LOADED"
        sim["hatch_status"] = "Closed"

    total_loaded = sum(sim["holds"][k]["loaded_mt"] for k in sim["holds"])

    return {
        "message": f"Loading simulation step {current_step} executed",
        "step": current_step,
        "total_loaded_mt": total_loaded,
        "is_complete": current_step >= 5,
        "holds": sim["holds"]
    }

@router.post("/demo/discharge/start")
def start_discharge_simulation(
    shipment_code: str = Query("SHP-2026-0018"),
    step: Optional[int] = Query(None)
):
    """
    Simulates unloading/discharge sequence:
    80,000 MT -> decreasing holds -> 0 MT (CARGO RECEIVED).
    """
    if shipment_code not in SIMULATION_STATE:
        start_loading_simulation(shipment_code, step=5)

    sim = SIMULATION_STATE[shipment_code]
    sim["loading_mode"] = "DISCHARGING"
    sim["status"] = "DISCHARGING"
    sim["hatch_status"] = "Open (Discharging)"

    current_step = step if step is not None else ((sim.get("discharge_step", 0) + 1) % 6)
    sim["discharge_step"] = current_step

    target_caps = {1: 15800.0, 2: 16100.0, 3: 16000.0, 4: 16200.0, 5: 15900.0}

    # Unloading sequence:
    # 0: Full (80,000 MT)
    # 1: Hold 3 discharged
    # 2: Hold 1 discharged
    # 3: Hold 5 discharged
    # 4: Hold 2 discharged
    # 5: Hold 4 discharged -> 0 MT (CARGO RECEIVED)

    if current_step == 0:
        for k in sim["holds"]:
            sim["holds"][k]["loaded_mt"] = target_caps[k]
            sim["holds"][k]["status"] = "LOADED"
    elif current_step == 1:
        sim["holds"][3]["loaded_mt"] = 0.0
        sim["holds"][3]["status"] = "EMPTY"
    elif current_step == 2:
        sim["holds"][3]["loaded_mt"] = 0.0
        sim["holds"][1]["loaded_mt"] = 0.0
        sim["holds"][3]["status"] = "EMPTY"
        sim["holds"][1]["status"] = "EMPTY"
    elif current_step == 3:
        for k in [3, 1, 5]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
    elif current_step == 4:
        for k in [3, 1, 5, 2]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
    elif current_step >= 5:
        for k in sim["holds"]:
            sim["holds"][k]["loaded_mt"] = 0.0
            sim["holds"][k]["status"] = "EMPTY"
        sim["status"] = "CARGO RECEIVED"
        sim["hatch_status"] = "Closed"

    total_loaded = sum(sim["holds"][k]["loaded_mt"] for k in sim["holds"])

    return {
        "message": f"Discharge simulation step {current_step} executed",
        "step": current_step,
        "total_onboard_mt": total_loaded,
        "discharged_mt": 80000.0 - total_loaded,
        "is_complete": current_step >= 5,
        "status": sim["status"],
        "holds": sim["holds"]
    }

@router.post("/demo/trigger-alert")
def trigger_sensor_alert(
    shipment_code: str = Query("SHP-2026-0018"),
    trigger: bool = Query(True)
):
    """
    Toggles simulated sensor alert (e.g. Hold 03 humidity > 70%).
    """
    if shipment_code not in SIMULATION_STATE:
        start_loading_simulation(shipment_code, step=5)
    
    sim = SIMULATION_STATE[shipment_code]
    sim["sensor_humidity_h3"] = 78.4 if trigger else 61.4
    if trigger:
        sim["holds"][3]["status"] = "ALERT"
    else:
        sim["holds"][3]["status"] = "LOADED"

    return {
        "message": f"Sensor condition alert {'ACTIVATED' if trigger else 'RESOLVED'}",
        "hold": "HOLD 03",
        "humidity_pct": sim["sensor_humidity_h3"],
        "has_alert": trigger
    }
