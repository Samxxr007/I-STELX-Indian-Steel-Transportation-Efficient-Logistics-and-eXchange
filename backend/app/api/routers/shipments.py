import datetime
import json
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database import get_db
from app.models.models import Shipment, ShipmentEvent, Vessel, CargoRequirement, Alert, AuditLog
from app.services.ais_simulator_service import AISSimulatorService

router = APIRouter(prefix="/shipments", tags=["Shipment Management"])

@router.get("")
def list_shipments(
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search query"),
    db: Session = Depends(get_db)
):
    query = db.query(Shipment)
    
    if status and status != "ALL":
        if status == "DELAYED":
            query = query.filter(Shipment.eta_variance_hours > 6.0)
        else:
            query = query.filter(Shipment.status.ilike(f"%{status}%"))

    shipments = query.order_by(Shipment.id.desc()).all()
    results = []

    for s in shipments:
        if search:
            q = search.lower()
            v_name = s.vessel.name.lower() if s.vessel else ""
            if not (q in s.shipment_code.lower() or q in s.cargo_type.lower() or q in v_name or q in s.origin_port.lower() or q in s.destination_port.lower()):
                continue

        results.append({
            "id": s.id,
            "shipment_code": s.shipment_code,
            "vessel_id": s.vessel_id,
            "vessel_name": s.vessel.name if s.vessel else "Cargo Vessel",
            "vessel_imo": s.vessel.imo if s.vessel else "N/A",
            "vessel_type": s.vessel.vessel_type if s.vessel else "Panamax",
            "cargo_type": s.cargo_type,
            "quantity_mt": s.quantity_mt,
            "origin_port": s.origin_port,
            "destination_port": s.destination_port,
            "departure_time": s.departure_time,
            "scheduled_eta": s.scheduled_eta,
            "current_eta": s.current_eta,
            "eta_variance_hours": s.eta_variance_hours,
            "status": s.status,
            "progress_pct": s.progress_pct,
            "current_lat": s.current_lat,
            "current_lng": s.current_lng,
            "current_speed_knots": s.current_speed_knots,
            "current_heading": s.current_heading,
            "remaining_distance_nm": s.remaining_distance_nm,
            "total_distance_nm": s.total_distance_nm,
            "planned_cost_cr": s.planned_cost_cr,
            "actual_cost_cr": s.actual_cost_cr,
            "risk_level": s.risk_level
        })

    return results

@router.get("/{shipment_id}")
def get_shipment_detail(shipment_id: int, db: Session = Depends(get_db)):
    s = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shipment not found.")

    vessel = s.vessel
    events = db.query(ShipmentEvent).filter(ShipmentEvent.shipment_id == s.id).order_by(ShipmentEvent.id.asc()).all()
    alerts = db.query(Alert).filter(Alert.shipment_id == s.id).all()

    try:
        waypoints = json.loads(s.route_waypoints_json) if s.route_waypoints_json else []
    except Exception:
        waypoints = []

    if not waypoints:
        waypoints = AISSimulatorService.get_route_waypoints(s.origin_port, s.destination_port)

    # Documents mock
    documents = [
        {"name": "Charter Party Agreement (GENCON)", "type": "PDF", "size": "2.4 MB", "date": s.departure_time, "status": "VERIFIED"},
        {"name": "Clean On-Board Ocean Bill of Lading", "type": "PDF", "size": "1.8 MB", "date": s.departure_time, "status": "SIGNED"},
        {"name": "Certificate of Sampling & Analysis (Coking Coal)", "type": "PDF", "size": "850 KB", "date": s.departure_time, "status": "APPROVED"},
        {"name": "Certificate of Origin (Australian Chamber)", "type": "PDF", "size": "620 KB", "date": s.departure_time, "status": "ISSUED"}
    ]

    return {
        "id": s.id,
        "shipment_code": s.shipment_code,
        "cargo_type": s.cargo_type,
        "quantity_mt": s.quantity_mt,
        "origin_port": s.origin_port,
        "destination_port": s.destination_port,
        "departure_time": s.departure_time,
        "scheduled_eta": s.scheduled_eta,
        "current_eta": s.current_eta,
        "eta_variance_hours": s.eta_variance_hours,
        "status": s.status,
        "progress_pct": s.progress_pct,
        "current_lat": s.current_lat,
        "current_lng": s.current_lng,
        "current_speed_knots": s.current_speed_knots,
        "current_heading": s.current_heading,
        "total_distance_nm": s.total_distance_nm,
        "remaining_distance_nm": s.remaining_distance_nm,
        "planned_cost_cr": s.planned_cost_cr,
        "actual_cost_cr": s.actual_cost_cr,
        "planned_duration_days": s.planned_duration_days,
        "actual_duration_days": s.actual_duration_days,
        "port_waiting_hours": s.port_waiting_hours,
        "risk_level": s.risk_level,
        "route_waypoints": waypoints,
        "vessel": {
            "id": vessel.id if vessel else None,
            "name": vessel.name if vessel else "MV STEEL VOYAGER",
            "imo": vessel.imo if vessel else "9876543",
            "vessel_type": vessel.vessel_type if vessel else "Panamax",
            "dwt": vessel.dwt if vessel else 82000,
            "draft_m": vessel.draft_m if vessel else 13.2,
            "beam_m": vessel.beam_m if vessel else 32.2,
            "loa_m": vessel.loa_m if vessel else 225.0,
            "flag": vessel.flag if vessel else "India",
            "year_built": vessel.year_built if vessel else 2021
        },
        "events": [
            {
                "id": e.id,
                "event_type": e.event_type,
                "description": e.description,
                "location_name": e.location_name,
                "timestamp": e.timestamp,
                "severity": e.severity
            }
            for e in events
        ],
        "alerts": [
            {
                "id": a.id,
                "category": a.category,
                "severity": a.severity,
                "message": a.message,
                "evidence": a.evidence,
                "timestamp": a.timestamp.strftime("%d %b %Y, %H:%M UTC") if a.timestamp else "Recently"
            }
            for a in alerts
        ],
        "documents": documents
    }

@router.post("/create")
def create_shipment(payload: dict, db: Session = Depends(get_db)):
    req_id = payload.get("requirement_id")
    vessel_id = payload.get("vessel_id")

    req = db.query(CargoRequirement).filter(CargoRequirement.id == req_id).first() if req_id else None
    vessel = db.query(Vessel).filter(Vessel.id == vessel_id).first() if vessel_id else db.query(Vessel).first()

    count = db.query(Shipment).count() + 1
    year = datetime.datetime.now().year
    shipment_code = f"SHP-{year}-{count:04d}"

    origin = req.origin_port if req else payload.get("origin_port", "Hay Point")
    dest = req.destination_port if req else payload.get("destination_port", "Visakhapatnam")
    cargo = req.cargo_type if req else payload.get("cargo_type", "Coking Coal")
    qty = req.quantity_mt if req else payload.get("quantity_mt", 80000.0)

    waypoints = AISSimulatorService.get_route_waypoints(origin, dest)

    new_shipment = Shipment(
        shipment_code=shipment_code,
        requirement_id=req.id if req else None,
        vessel_id=vessel.id if vessel else 1,
        cargo_type=cargo,
        quantity_mt=qty,
        origin_port=origin,
        destination_port=dest,
        departure_time=datetime.datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
        scheduled_eta=payload.get("scheduled_eta", "28 Oct 08:00"),
        current_eta=payload.get("current_eta", "28 Oct 21:30"),
        eta_variance_hours=13.5,
        status="IN TRANSIT",
        progress_pct=15.0,
        current_lat=waypoints[1][0] if len(waypoints) > 1 else -18.5,
        current_lng=waypoints[1][1] if len(waypoints) > 1 else 147.8,
        current_speed_knots=12.8,
        current_heading=312.0,
        total_distance_nm=4650.0,
        remaining_distance_nm=3950.0,
        planned_cost_cr=payload.get("planned_cost_cr", 16.43),
        actual_cost_cr=payload.get("planned_cost_cr", 16.43),
        risk_level="MEDIUM",
        route_waypoints_json=json.dumps(waypoints)
    )
    db.add(new_shipment)
    
    if vessel:
        vessel.availability_status = "IN_TRANSIT"

    if req:
        req.status = "CHARTERED"

    # Initial event
    evt = ShipmentEvent(
        shipment_id=new_shipment.id,
        event_type="VOYAGE_COMMENCED",
        description=f"Shipment {shipment_code} initiated. Vessel loaded {qty:,.0f} MT {cargo} at {origin}.",
        location_name=origin,
        timestamp=datetime.datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
        severity="INFO"
    )
    db.add(evt)
    db.commit()
    db.refresh(new_shipment)

    return {
        "success": True,
        "shipment_id": new_shipment.id,
        "shipment_code": shipment_code,
        "status": "IN TRANSIT",
        "message": f"Shipment {shipment_code} successfully created and entered into Live Vessel Tracking Control Tower."
    }

@router.post("/{shipment_id}/complete")
def complete_shipment(shipment_id: int, db: Session = Depends(get_db)):
    s = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shipment not found.")

    s.status = "COMPLETED"
    s.progress_pct = 100.0
    s.remaining_distance_nm = 0.0
    if s.vessel:
        s.vessel.availability_status = "AVAILABLE"

    evt = ShipmentEvent(
        shipment_id=s.id,
        event_type="DISCHARGE_COMPLETED",
        description=f"Cargo discharge fully completed at {s.destination_port}. Final outturn survey signed.",
        location_name=s.destination_port,
        timestamp=datetime.datetime.utcnow().strftime("%d %b %Y, %H:%M UTC"),
        severity="SUCCESS"
    )
    db.add(evt)

    alert = Alert(
        shipment_id=s.id,
        vessel_id=s.vessel_id,
        category="Operational Risk",
        severity="SUCCESS",
        message=f"Shipment {s.shipment_code} completed successfully. Ready for Planned vs Actual Analytics review.",
        evidence=f"Delivered {s.quantity_mt:,.0f} MT {s.cargo_type} at {s.destination_port}.",
        is_read=False
    )
    db.add(alert)
    db.commit()

    return {
        "success": True,
        "shipment_id": s.id,
        "shipment_code": s.shipment_code,
        "status": "COMPLETED",
        "message": f"Shipment {s.shipment_code} marked as COMPLETED. Planned vs Actual variance analytics updated."
    }
