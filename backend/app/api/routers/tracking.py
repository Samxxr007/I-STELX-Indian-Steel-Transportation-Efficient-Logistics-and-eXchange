import json
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Shipment, Vessel, Port
from app.services.ais_simulator_service import AISSimulatorService

router = APIRouter(prefix="/tracking", tags=["Live Vessel Tracking"])

@router.get("/fleet")
def get_fleet_tracking(db: Session = Depends(get_db)):
    shipments = db.query(Shipment).filter(Shipment.status != "COMPLETED").all()
    fleet = []

    for s in shipments:
        try:
            waypoints = json.loads(s.route_waypoints_json) if s.route_waypoints_json else []
        except Exception:
            waypoints = []

        if not waypoints:
            waypoints = AISSimulatorService.get_route_waypoints(s.origin_port, s.destination_port)

        fleet.append({
            "shipment_id": s.id,
            "shipment_code": s.shipment_code,
            "vessel_id": s.vessel_id,
            "vessel_name": s.vessel.name if s.vessel else "Cargo Vessel",
            "vessel_imo": s.vessel.imo if s.vessel else "9876543",
            "vessel_type": s.vessel.vessel_type if s.vessel else "Panamax",
            "cargo_type": s.cargo_type,
            "quantity_mt": s.quantity_mt,
            "origin_port": s.origin_port,
            "destination_port": s.destination_port,
            "current_lat": s.current_lat,
            "current_lng": s.current_lng,
            "current_speed_knots": s.current_speed_knots,
            "current_heading": s.current_heading,
            "progress_pct": s.progress_pct,
            "scheduled_eta": s.scheduled_eta,
            "current_eta": s.current_eta,
            "eta_variance_hours": s.eta_variance_hours,
            "status": s.status,
            "risk_level": s.risk_level,
            "remaining_distance_nm": s.remaining_distance_nm,
            "total_distance_nm": s.total_distance_nm,
            "route_waypoints": waypoints,
            "is_simulated": True,
            "data_source": "DEMO / SIMULATED AIS MARITIME FEED"
        })

    # Also list major ports for map pins
    ports = db.query(Port).all()
    ports_payload = [
        {
            "id": p.id,
            "name": p.name,
            "code": p.code,
            "country": p.country,
            "is_indian_port": p.is_indian_port,
            "latitude": p.latitude,
            "longitude": p.longitude,
            "max_draft_m": p.max_draft_m,
            "max_loa_m": p.max_loa_m,
            "congestion": p.current_congestion_level,
            "waiting_hours": p.waiting_time_hours
        }
        for p in ports
    ]

    return {
        "fleet": fleet,
        "ports": ports_payload,
        "disclaimer": "DEMO / SIMULATED AIS - Structure ready for production Satellite AIS (Spire / MarineTraffic) integration."
    }

@router.get("/{shipment_id}")
def get_single_vessel_track(shipment_id: int, db: Session = Depends(get_db)):
    s = db.query(Shipment).filter(Shipment.id == shipment_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Shipment not found.")

    try:
        waypoints = json.loads(s.route_waypoints_json) if s.route_waypoints_json else []
    except Exception:
        waypoints = []

    if not waypoints:
        waypoints = AISSimulatorService.get_route_waypoints(s.origin_port, s.destination_port)

    return {
        "shipment_id": s.id,
        "shipment_code": s.shipment_code,
        "vessel_name": s.vessel.name if s.vessel else "Cargo Vessel",
        "imo": s.vessel.imo if s.vessel else "9876543",
        "vessel_type": s.vessel.vessel_type if s.vessel else "Panamax",
        "cargo_type": s.cargo_type,
        "quantity_mt": s.quantity_mt,
        "position": {
            "latitude": s.current_lat,
            "longitude": s.current_lng,
            "speed_knots": s.current_speed_knots,
            "heading": s.current_heading,
            "progress_pct": s.progress_pct
        },
        "departure": {
            "port": s.origin_port,
            "time": s.departure_time
        },
        "destination": {
            "port": s.destination_port,
            "scheduled_eta": s.scheduled_eta,
            "current_eta": s.current_eta,
            "variance": f"+{s.eta_variance_hours:.1f}h" if s.eta_variance_hours > 0 else "On Time"
        },
        "distance": {
            "total_nm": s.total_distance_nm,
            "remaining_nm": s.remaining_distance_nm
        },
        "route_waypoints": waypoints,
        "status": s.status,
        "is_simulated": True,
        "last_update": "Just now (Simulated AIS Stream)"
    }
